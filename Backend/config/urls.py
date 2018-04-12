# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin
from django.views.generic import TemplateView
from django.views import defaults as default_views

from rest_framework.documentation import include_docs_urls
from rest_framework_swagger.views import get_swagger_view
from rest_framework.authtoken import views

schema_view = get_swagger_view(title='Pastebin API')

urlpatterns = [
    # url(r'^api/v1/', api_root),
    # url(r'^api/v1/', include(router.urls)),
    url(r'^docs/', include_docs_urls(title='API Documentation')),
    url(r'^api-docs/', schema_view),
    url(r'^api/v1/', include('vecihi.users.urls_api')),


    # url(r'^api/v1/', include(router.urls)),
    # url(r'^api/v1/', include(accounts_router.urls)),
    # url(r'^api/v1/auth/login/$', LoginView.as_view(), name='login'),
    # url(r'^api/v1/auth/logout/$', LogoutView.as_view(), name='logout'),

    # url(r'^', include('myapp.urls')),

    url(r'^admin/', include(admin.site.urls)),
    # url(r'^.*$', IndexView.as_view(), name='index'),

    url(r'^$', TemplateView.as_view(template_name='pages/home.html'), name='home'),
    url(r'^about/$', TemplateView.as_view(template_name='pages/about.html'), name='about'),

    # Django Admin, use {% url 'admin:index' %}
    url(settings.ADMIN_URL, admin.site.urls),

    # User management
    url(r'^users/', include('vecihi.users.urls', namespace='users')),
    url(r'^api/v1/', include('vecihi.posts.urls', namespace='posts')),
    url(r'^api/v1/', include('vecihi.ask.urls', namespace='asks')),
    url('^activity/', include('actstream.urls')),
    url(r'^accounts/', include('allauth.urls')),

    # Your stuff: custom urls includes go here

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [
    url(r'^api-auth/', include('rest_framework.urls',
                               namespace='rest_framework')),
    url(r'^get-token/', views.obtain_auth_token)
]


if settings.DEBUG:
    # This allows the error pages to be debugged during development, just visit
    # these url in browser to see how these error pages look like.
    urlpatterns += [
        url(r'^400/$', default_views.bad_request, kwargs={'exception': Exception('Bad Request!')}),
        url(r'^403/$', default_views.permission_denied, kwargs={'exception': Exception('Permission Denied')}),
        url(r'^404/$', default_views.page_not_found, kwargs={'exception': Exception('Page not Found')}),
        url(r'^500/$', default_views.server_error),
    ]
    if 'debug_toolbar' in settings.INSTALLED_APPS:
        import debug_toolbar

        urlpatterns += [
            url(r'^__debug__/', include(debug_toolbar.urls)),
        ]
