from django.apps import AppConfig


class SavedSearchesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.saved_searches'
    verbose_name = 'Saved Searches'
    
    def ready(self):
        # Import signals to register them
        import apps.saved_searches.signals  # noqa
