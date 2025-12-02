from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _

class ResumeEnhancerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.resume_enhancer'
    verbose_name = _('Resume Enhancer')
