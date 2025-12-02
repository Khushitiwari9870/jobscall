from django.apps import AppConfig


class UsersConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.users"
    label = "users"  # This should be lowercase and match the last part of the app's Python import path

    # def ready(self):
    #     # Import signals to register handlers
    #     from . import signals  # noqa: F401
