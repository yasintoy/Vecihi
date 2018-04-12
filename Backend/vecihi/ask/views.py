from django.utils.decorators import method_decorator
from django.shortcuts import render
from django.views.decorators.cache import cache_page
from rest_framework.decorators import list_route
from rest_framework import permissions, viewsets, status
from rest_framework.response import Response

from .serializers import QuestionSerializer, AnswerSerializer
from .models import Question, Answer


class QuestionViewSet(viewsets.ModelViewSet):
	serializer_class = QuestionSerializer
	queryset = Question.objects.all()

	def get_queryset(self):
		return Question.objects.filter(whom=self.kwargs["userid"])

	def get_permissions(self):
		return (permissions.IsAuthenticated(),)

	@method_decorator(cache_page(60))
	def dispatch(self, *args, **kwargs):
		return super(QuestionViewSet, self).dispatch(*args, **kwargs)

	@list_route(methods=['post'])
	def answer(self, request, *args, **kwargs):
		serializer = AnswerSerializer(data=request.data)
		if serializer.is_valid():
			question = Question.objects.get(id=request.data["question"])
			answer = Answer(question=question, answer=request.data["answer"])
			answer.save()
			return Response({
				"status": "Answered",
			}, status=status.HTTP_201_CREATED)
		else:
			return Response({
				'status': 'Bad request',
				'message': 'User could not be created with received data.',
				'errors': serializer.errors
			}, status=status.HTTP_400_BAD_REQUEST)	