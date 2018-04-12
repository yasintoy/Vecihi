import json

from django.utils.decorators import method_decorator
from django.db.models import Q
from django.views.decorators.cache import cache_page
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import update_session_auth_hash
from rest_framework import permissions, status, views, viewsets
from rest_framework.decorators import detail_route, list_route
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from actstream import action
from actstream.actions import follow
from actstream.models import user_stream, Action, followers, following

from vecihi.posts.models import Post
from .models import User, ViewedProfileTracking
from .serializers import AccountSerializer, ActionSerializer, ViewedProfileTrackingSerializer
from .permissions import IsAccountOwner


class FollowShipView(views.APIView):
    permission_classes = (permissions.IsAuthenticated, )

    def post(self, request, pk, *args, **kwargs):
        if self.request.user.id == int(pk):
            return Response({
                    'status': 'Bad Request',
                    'message': 'You cant follow yourself.'
            }, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.get(id=request.auth.user.id)
        target_user = User.objects.get(id=pk)
        follow(user, target_user)
        return Response({
            "status": "Success",
            "message": "You followed " + target_user.username
        }, status=status.HTTP_201_CREATED)


class UserFollowersViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AccountSerializer

    def get_queryset(self):
        user_id = self.kwargs['userid']
        user = User.objects.get(id=user_id)
        return followers(user)

class UserFollowingViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AccountSerializer

    def get_queryset(self):
        user_id = self.kwargs['userid']
        user = User.objects.get(id=user_id)
        return following(user)


class ActivityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Action.objects.all()
    serializer_class = ActionSerializer

    filter_fields = (
        'actor_content_type', 'actor_content_type__model',
        'target_content_type', 'target_content_type__model',
        'action_object_content_type', 'action_object_content_type__model',
    )

class AccountViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = AccountSerializer

    def get_queryset(self):
        if self.request.query_params.get("search", None):
            params = self.request.query_params.get("search", None)
            return User.objects.filter( Q(username__icontains=params)|
                                        Q(major__icontains=params)|
                                        Q(first_name__icontains=params)
                                    )
        if self.kwargs.get('pk') is None:
            return User.objects.all()
        user_id = int(self.kwargs['pk'])
        if self.request.user.id != user_id:
            target_user = User.objects.get(id=user_id)
            action = ViewedProfileTracking(actor=self.request.user, visited_profile=target_user)
            action.save()
        return User.objects.all()

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)

        if self.request.method == 'POST':
            return (permissions.AllowAny(),)

        return (permissions.IsAuthenticated(), IsAccountOwner(),)

    @method_decorator(cache_page(10))
    def dispatch(self, *args, **kwargs):
        return super(AccountViewSet, self).dispatch(*args, **kwargs)

    @list_route()
    def recent_users(self, request):
        recent_users = User.objects.all().order_by('-last_login')
        page = self.paginate_queryset(recent_users)

        if page is not None:
            serializer = self.get_serializer(page, context={'request': request}, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(recent_users, context={'request': request}, many=True)
        return Response(serializer.data)

    @list_route()
    def me(self, request, *args, **kwargs):
        if request.auth is None:
            return Response({
                    'status': 'Unauthorized',
                    'message': 'This authentication has been disabled.'
            }, status=status.HTTP_401_UNAUTHORIZED)

        user = User.objects.get(id=request.auth.user.id)

        serializer = self.get_serializer(user, context={'request': request})
        return Response(serializer.data)

    @list_route()
    def who_visited_my_profile(self, request, *args, **kwargs):
        if request.auth is None:
            return Response({
                "status": "Unauthorized",
                "message": "This authentication has been disabled."
            }, status=status.HTTP_401_UNAUTHORIZED)
        response = ViewedProfileTracking.objects.filter(visited_profile=request.auth.user).order_by("-visited_time")
        if not len(response):
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        page = self.paginate_queryset(response)
        if page is not None:
            serializer = ViewedProfileTrackingSerializer(response, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = ViewedProfileTrackingSerializer(response, many=True)
        return Response(serializer.data)


    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            if serializer.checkPassword(serializer.validated_data):
                User.objects.create_user(**serializer.validated_data)
                account = authenticate(username=serializer.validated_data['username'],
                                       password=serializer.validated_data['password'])
                login(request, account)
                token = Token.objects.get(user=account)
                serialized = self.serializer_class(account, context={'request': request})
                return Response({
                    'account': serialized.data,
                    "token": token.key
                }, status=status.HTTP_201_CREATED)
        return Response({
            'status': 'Bad request',
            'message': 'User could not be created with received data.',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    @list_route(methods=['post'])
    def register(self, request):
        return self.create(request)

    def destroy(self, request, pk=None):
        account = self.get_object()
        account.email = str(account.id)+'_nonactive'+'@gmail.com'
        account.first_name = ''
        account.last_name = ''
        account.is_active = False
        account.is_authenticated = False
        account.save()

        logout(request)

        # return self.delete(request)
        return Response({'status': 'deleted clean'})

    @detail_route(methods=['put'])
    def update_user(self, request, pk=None):
        account = self.get_object()
        serializer = self.serializer_class(account, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.update(account, serializer.validated_data)
            update_session_auth_hash(request, account)
            return Response({"status": "Updated!"})
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

    @detail_route(methods=['patch'])
    def set_password(self, request, pk=1):
        account = self.get_object()
        serializer = self.serializer_class(account, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.update(account, serializer.validated_data)
            update_session_auth_hash(request, account)
            return Response({'status': 'password set'})
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)



class LoginView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):

        username = request.data.get('username', None)
        password = request.data.get('password', None)

        account = authenticate(username=username, password=password)

        if account is not None:
            if account.is_active:
                login(request, account)
                token, _ = Token.objects.get_or_create(user=account)
                serialized = AccountSerializer(account, context={'request': request})
                return Response({
                    'account': serialized.data,
                    "token": token.key
                })
            else:
                return Response({
                    'status': 'Unauthorized',
                    'message': 'This authentication has been disabled.'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            if request.user.is_active:
                token, _ = Token.objects.get_or_create(user=account)
                serialized = AccountSerializer(request.user, context={'request': request})
                return Response({
                    'account': serialized.data,
                    'token': token.key
                })
            return Response({
                'status': 'Unauthorized',
                'message': 'Username/password combination invalid.'
            }, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        request.auth_token.delete()
        logout(request)

        return Response({}, status=status.HTTP_204_NO_CONTENT)
