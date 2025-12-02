from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class RecentSearchesConfig(AppConfig):
    """Configuration class for the recent_searches app"""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.recent_searches'
    verbose_name = _('Recent Searches')
    
    def ready(self):
      
        # Import signals to register them
        from . import signals  # noqa
