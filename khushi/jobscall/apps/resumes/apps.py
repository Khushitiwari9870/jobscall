from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _

class ResumesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.resumes'
    verbose_name = _('Resumes')
    
    def ready(self):
        # Import signals to register them
        import apps.resumes.signals  # noqa
