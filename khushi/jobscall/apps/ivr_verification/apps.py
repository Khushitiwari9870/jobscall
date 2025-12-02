from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class IvrVerificationConfig(AppConfig):
    """Configuration for the IVR Verification app"""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.ivr_verification'
    verbose_name = _('IVR Verification')
    
    def ready(self):
        # Import signals to register them
        from . import signals  # noqa
