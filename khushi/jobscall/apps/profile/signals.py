from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import UserProfile, EmployerProfile

User = get_user_model()

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
            EmployerProfile.objects.get_or_create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """
    Save the profile when the user is saved.
    """
    # Only save employer profiles for now since candidate profiles are handled by authx
    if hasattr(instance, 'employer_profile'):
        instance.employer_profile.save()
