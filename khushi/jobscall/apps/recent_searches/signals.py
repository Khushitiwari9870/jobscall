from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings

from .models import RecentSearch

# Example signal handler - modify as needed
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Example signal handler that could be used to create related objects
    when a new user is created.
    """
    if created:
        # Perform actions when a new user is created
        pass
