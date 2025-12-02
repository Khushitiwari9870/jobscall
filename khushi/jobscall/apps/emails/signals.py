from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.utils import timezone
from .models import EmailCampaign, EmailLog


@receiver(pre_save, sender=EmailCampaign)
def update_campaign_status(sender, instance, **kwargs):
    """Update campaign status based on scheduled time"""
    if instance.pk:
        try:
            old_instance = EmailCampaign.objects.get(pk=instance.pk)
            # If status changed to 'scheduled' and scheduled_time is in the past
            if (instance.status == 'scheduled' and 
                    instance.scheduled_time and 
                    instance.scheduled_time <= timezone.now()):
                instance.status = 'sending'
        except EmailCampaign.DoesNotExist:
            pass


@receiver(post_save, sender=EmailLog)
def log_email_status_change(sender, instance, created, **kwargs):
    """Log email status changes"""
    if created:
        # In a real implementation, you would integrate with an email service here
        # and update the status based on the service's response
        pass
