from django.conf.urls import include, url
from rest_framework_nested import routers

from .views import PostViewSet, UserPostViewSet, PostUpvoteViewSet, BestPostViewSet, WhoViewedPostViewSet

router = routers.SimpleRouter()

router.register(r'posts', PostViewSet, base_name='post')
router.register(r'best-posts', BestPostViewSet, base_name='best-posts')
router.register(r'user/(?P<userid>[0-9]+)/posts', UserPostViewSet,
                base_name='user-post-list')

router.register(r'post/(?P<postid>[0-9]+)/upvote', PostUpvoteViewSet,
                base_name='post-upvote')

router.register(r'post/(?P<postid>[0-9]+)/who_viewed', WhoViewedPostViewSet,
                base_name='who_viewed')

urlpatterns = [
    url(r'^', include(router.urls)),
]
