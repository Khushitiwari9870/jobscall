from django.apps import AppConfig


class RecruiterConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.recruiter'
    verbose_name = 'Recruiter Portal'
    
    def ready(self):
        # Import signals to register them
        import apps.recruiter.signals  # noqa
