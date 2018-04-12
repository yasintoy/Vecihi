from django.conf.urls import include, url

from rest_framework_nested import routers

from .views import QuestionViewSet

router = routers.SimpleRouter()
router.register(r'user/(?P<userid>[0-9]+)/questions', QuestionViewSet, base_name='questions')
# router.register(r'questions/(?P<question_id>[0-9]+)/answer', AnswerViewSet, base_name='answer')

urlpatterns = [
    url(r'^', include(router.urls)),
]
