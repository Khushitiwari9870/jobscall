from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from .models import Resume

@receiver(post_save, sender=Resume)
def handle_resume_status_change(sender, instance, created, **kwargs):
    """
    Handle actions when a resume's status changes
    """
    if not created:
        try:
            old_instance = Resume.objects.get(pk=instance.pk)
            if old_instance.status != instance.status:
                # Status changed, perform actions based on new status
                if instance.status == 'published':
                    # When a resume is published, we might want to update timestamps
                    instance.published_at = timezone.now()
                    instance.save(update_fields=['published_at'])
                
                # Additional status-based logic can be added here
                
        except Resume.DoesNotExist:
            pass
    
    # Ensure only one default resume per user
    if instance.is_default:
        Resume.objects.filter(
            user=instance.user, 
            is_default=True
        ).exclude(pk=instance.pk).update(is_default=False)
