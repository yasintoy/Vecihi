from __future__ import unicode_literals

from django.apps import AppConfig, apps


class PostsConfig(AppConfig):
    name = 'vecihi.posts'
    verbose_name = "Posts"

    def ready(self):
        from actstream import registry
        registry.register(apps.get_model('posts', 'Post'))
