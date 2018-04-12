from rest_framework import serializers
from rest_framework.serializers import HyperlinkedRelatedField

from vecihi.users.serializers import UserSerializer
from vecihi.users.models import User
from .models import Question, Answer


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ('id', 'whom', 'question', 'created_at')

    def to_representation(self, obj):
        return_obj = super(QuestionSerializer, self).to_representation(obj)
        new_obj = {}
        try:
        	new_obj["answer"] = {
        		"content": obj.answer.answer,
        		"created_at": obj.answer.created_at
        	}
        except: # RelatedObjectDoesNotExist
        	new_obj["answer"] = None

        return_obj.update(new_obj)
        return return_obj

class AnswerSerializer(serializers.ModelSerializer):
    question = QuestionSerializer(read_only=True)

    class Meta:
        model = Answer
        fields = ('id', 'question', 'answer', 'created_at')