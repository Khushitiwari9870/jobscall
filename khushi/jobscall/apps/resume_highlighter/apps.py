from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _

class ResumeHighlighterConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.resume_highlighter'
    verbose_name = _('Resume Highlighter')
