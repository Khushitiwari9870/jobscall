from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.utils import timezone
from .models import SavedSearch


@receiver(pre_save, sender=SavedSearch)
def update_search_timestamps(sender, instance, **kwargs):
    """Update timestamps when a saved search is modified"""
    if instance.pk:
        # Existing instance being updated
        instance.updated_at = timezone.now()
    else:
        # New instance being created
        instance.created_at = timezone.now()


@receiver(post_save, sender=SavedSearch)
def handle_search_activation(sender, instance, created, **kwargs):
    """Handle actions when a saved search is activated or deactivated"""
    if not created and 'is_active' in instance.get_dirty_fields():
        # If the search was just deactivated, also disable email alerts
        if not instance.is_active and instance.email_alerts:
            instance.email_alerts = False
            instance.save(update_fields=['email_alerts', 'updated_at'])
