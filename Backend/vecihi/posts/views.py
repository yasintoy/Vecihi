from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import detail_route
from actstream import action

from .models import Post, PostUpvote, ViewedPostTracking
from vecihi.users.models import User
from .permissions import IsAuthor, IsOwner
from .serializers import PostSerializer, PostUpvoteSerializer, WhoViewedPostSerializer


class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer

    def get_queryset(self):
        sorting = self.request.query_params.get('sorting', None)
        if sorting == 'newest':
            return Post.sorted_objects.newest()
        if sorting == 'stories':
            return Post.sorted_objects.upvotes_last_week()
        return Post.sorted_objects.upvotes()

    def get_permissions(self):
        return (permissions.IsAuthenticated(),)

    @method_decorator(cache_page(60))
    def dispatch(self, *args, **kwargs):
        return super(PostViewSet, self).dispatch(*args, **kwargs)

    @detail_route(methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def upvote(self, request, pk=None):
        if request.data.get("point") is None:
            return Response({
                'status': 'Not Found',
                'message': 'point field does not exist in request body!'
            }, status=status.HTTP_400_BAD_REQUEST)
        serializer = PostUpvoteSerializer(data={'post': pk, 'point': request.data["point"]},
                                          context={'request': request})
        if serializer.is_valid():
            serializer.save()
            post = Post.objects.get(pk=pk)
            return Response(PostSerializer(post, context={'request': request}).data)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

    @detail_route(methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def cancel_upvote(self, request, pk=None):
        try:
            post = Post.objects.get(pk=pk)
            instance = PostUpvote.objects.get(post=post, voter=self.request.user)
            self.perform_destroy(instance)
            return Response(PostSerializer(post, context={'request': request}).data)
        except ObjectDoesNotExist:
            return Response({
                'status': 'Not Found',
                'message': 'This upvote is not exist.'
            }, status=status.HTTP_404_NOT_FOUND)


class BestPostViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PostSerializer

    @method_decorator(cache_page(60))
    def dispatch(self, *args, **kwargs):
        return super(BestPostViewSet, self).dispatch(*args, **kwargs)

    def list(self, request):
        # TODO: avarage field is a propery so i found a solution like this but it's really slow
        best_of_marmara = PostSerializer(sorted(Post.objects.all()[:5], key=lambda r: (r.avarage), reverse=True), context={'request': request}, many=True).data

        most_upvoted_all_times = PostSerializer(sorted(Post.sorted_objects.upvotes()[:5], key=lambda r: (r.avarage), reverse=True), context={'request': request}, many=True).data
       
        most_upvoted_last_week = PostSerializer(sorted(Post.sorted_objects.upvotes_last_week()[:5], key=lambda r: (r.avarage), reverse=True), context={'request': request}, many=True).data

        response = {
            "results": {
                "best_of_marmara": best_of_marmara,
                "most_upvoted_all_times": most_upvoted_all_times,
                "most_upvoted_last_week": most_upvoted_last_week
            }
  
        }
        return Response(response, status=status.HTTP_200_OK)


class UserPostViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PostSerializer

    def get_queryset(self):
        user_id = self.kwargs.get("userid")
        if user_id and self.request.user.id != user_id and self.kwargs.get('pk'):
            target = Post.objects.get(id=self.kwargs['pk'])
            viewed_post = ViewedPostTracking(actor=self.request.user, visited_post=target)
            viewed_post.save()
        sorting = self.request.query_params.get('sorting', None)
        if sorting == 'upvotes':
            return Post.sorted_objects.upvotes().filter(author=user_id)
        elif sorting == 'newest':
            return Post.sorted_objects.newest().filter(author=user_id)
        else:
            return Post.sorted_objects.upvotes().filter(author=user_id)
    
    @method_decorator(cache_page(60))
    def dispatch(self, *args, **kwargs):
        return super(UserPostViewSet, self).dispatch(*args, **kwargs)


class WhoViewedPostViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = WhoViewedPostSerializer

    def get_queryset(self):
        post_id = self.kwargs["postid"]
        response =  ViewedPostTracking.objects.filter(visited_post=post_id)
        if not len(response):
            return []
        serializer = WhoViewedPostSerializer(response, many=True)
        return Response(serializer.data)


class PostUpvoteViewSet(viewsets.ModelViewSet):
    queryset = PostUpvote.objects.all()
    serializer_class = PostUpvoteSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)
        return (permissions.IsAuthenticated(), IsOwner(),)

    def perform_create(self, serializer):
        instance = serializer.save(voter=self.request.user)
        return super(PostUpvoteViewSet, self).perform_create(serializer)
