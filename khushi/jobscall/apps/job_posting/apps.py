from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class JobPostingConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.job_posting'
    verbose_name = _('Job Posting Management')
    
    def ready(self):
        # Import signals
        from . import signals  # noqa
