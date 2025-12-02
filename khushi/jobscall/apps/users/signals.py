from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User
from apps.profile.models import UserProfile, EmployerProfile

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Create the appropriate profile when a new user is created.
    """
    if created:
        if instance.is_candidate:
            # Temporarily disabled - using authx UserProfile instead
            # UserProfile.objects.get_or_create(user=instance)
            pass
        elif instance.is_employer:
            # Temporarily disabled - using authx signals instead
            # EmployerProfile.objects.get_or_create(user=instance)
            pass

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """
    Save the profile when the user is saved.
    """
    # Disabled - profiles are handled by authx and profile apps
    pass
