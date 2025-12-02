from django.apps import AppConfig


class ProfileConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.profile'
    verbose_name = 'User Profile'
    
    def ready(self):
        # Import and register signals
        import apps.profile.signals  # noqa
