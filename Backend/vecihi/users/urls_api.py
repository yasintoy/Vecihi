from django.conf.urls import include, url
from rest_framework_nested import routers

from .views_api import AccountViewSet, LoginView, LogoutView, \
                            ActivityViewSet, FollowShipView, \
                             UserFollowersViewSet, UserFollowingViewSet


router = routers.SimpleRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'accounts/(?P<userid>[0-9]+)/followers', UserFollowersViewSet, base_name='accounts')
router.register(r'accounts/(?P<userid>[0-9]+)/following', UserFollowingViewSet, base_name='accounts')
router.register(r'get-activity', ActivityViewSet, base_name='get-activity')


urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'follow/(?P<pk>[0-9]+)', FollowShipView.as_view(), name='follow'),
    url(r'auth/login/', LoginView.as_view(), name='login'),
    url(r'auth/logout/', LogoutView.as_view(), name='logout')
]
