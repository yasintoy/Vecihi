from django.apps import AppConfig, apps


class UsersConfig(AppConfig):
    name = 'vecihi.users'
    verbose_name = "Users"

    def ready(self):
        from actstream import registry
        registry.register(apps.get_model('users', 'User'))
