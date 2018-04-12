import logging
from functools import wraps

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import serializers
from rest_framework.serializers import HyperlinkedRelatedField
from actstream.models import followers, following

from vecihi.users.serializers import UserSerializer
from vecihi.users.models import User
from .models import Post, PostUpvote, ViewedPostTracking


class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(default=serializers.CurrentUserDefault(), read_only=True)
    image = serializers.ImageField(max_length=None, use_url=True)

    class Meta:
        model = Post
        fields = ('id', 'author', 'image', 'description', 'created_at', 'updated_at', 'upvote_count', 'avarage')
        read_only_fields = ('id', 'created_at', 'updated_at')
    
    def to_representation(self, obj):
        return_obj = super(PostSerializer, self).to_representation(obj)
        is_upvoted_me = False
        is_author_me = False
        if isinstance(self.context['request'].user, User):
            is_upvoted_me = obj.postupvote_set.filter(
                                voter=self.context['request'].user).exists()
            is_author_me = obj.author == self.context['request'].user
        new_obj = {
            'is_author_me': is_author_me,
            'is_upvoted_me': is_upvoted_me,
        }
        return_obj.update(new_obj)
        return return_obj


class PostUpvoteSerializer(serializers.ModelSerializer):
    voter = UserSerializer(default=serializers.CurrentUserDefault(), read_only=True)

    class Meta:
        model = PostUpvote
        fields = ('id', 'post', 'voter', 'point', 'created_at')
        read_only_fields = ('id', 'created_at')


class WhoViewedPostSerializer(serializers.ModelSerializer):
    actor = UserSerializer(default=serializers.CurrentUserDefault(), read_only=True)
    
    class Meta:
        model = ViewedPostTracking
        fields = ("actor", "visited_post", "time")
