"""
Signals for the authx app.
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import UserProfile

User = get_user_model()


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Signal to create a user profile when a new user is created.
    """
    if created:
        # Check if profile already exists to prevent duplicate creation
        if not hasattr(instance, 'profile'):
            # Get user type from the user instance (users.User model has user_type field)
            user_type = instance.user_type if hasattr(instance, 'user_type') else 'candidate'
            
            # Create the user profile
            UserProfile.objects.create(user=instance, user_type=user_type)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """
    Signal to save the user profile when the user is saved.
    """
    # Only update existing profiles, don't create new ones
    # Profile creation is handled by create_user_profile signal
    try:
        profile = instance.profile
        # Sync user_type from User model to UserProfile
        if hasattr(instance, 'user_type') and profile.user_type != instance.user_type:
            profile.user_type = instance.user_type
            profile.save()
    except UserProfile.DoesNotExist:
        # Only create profile if this is a new user (created=True)
        # This handles edge cases where create_user_profile signal might have failed
        if kwargs.get('created', False):
            user_type = instance.user_type if hasattr(instance, 'user_type') else 'candidate'
            UserProfile.objects.create(user=instance, user_type=user_type)


@receiver(post_save, sender=User)
def update_user_email_verification(sender, instance, **kwargs):
    """
    Signal to handle email verification when a user's email is updated.
    """
    if not instance._state.adding:
        try:
            old_instance = User.objects.get(pk=instance.pk)
            if old_instance.email != instance.email:
                # Email has changed, handle verification
                # In a real app, you might want to send a verification email here
                pass
        except User.DoesNotExist:
            pass
