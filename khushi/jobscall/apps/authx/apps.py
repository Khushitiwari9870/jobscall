from django.apps import AppConfig


class AuthXConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.authx'
    verbose_name = "Authentication"
    
    def ready(self):
        # Import signals to connect them
        try:
            import apps.authx.signals  # noqa: F401
        except ImportError:
            pass
