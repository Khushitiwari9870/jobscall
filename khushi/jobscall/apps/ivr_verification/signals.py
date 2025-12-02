from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.conf import settings
from django.utils import timezone

from .models import IvrVerification, IvrCallLog


@receiver(pre_save, sender=IvrVerification)
def set_verification_expiry(sender, instance, **kwargs):
    """Set the expiry time when a new verification is created"""
    if not instance.pk and not instance.expires_at:
        instance.expires_at = timezone.now() + timezone.timedelta(minutes=10)


@receiver(post_save, sender=IvrVerification)
def log_verification_creation(sender, instance, created, **kwargs):
    """Log when a new verification is created"""
    if created and settings.LOG_VERIFICATION_CREATION:
        from django.core.mail import send_mail
        
        subject = f"New IVR Verification Requested: {instance.phone_number}"
        message = (
            f"User: {instance.user.email}\n"
            f"Phone: {instance.phone_number}\n"
            f"Method: {instance.get_method_display()}\n"
            f"Code: {instance.verification_code}\n"
            f"Expires: {instance.expires_at}"
        )
        
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.ADMIN_EMAIL],
            fail_silently=True,
        )


@receiver(post_save, sender=IvrCallLog)
def update_verification_status(sender, instance, created, **kwargs):
    """Update verification status based on call status"""
    if not instance.verification:
        return
    
    verification = instance.verification
    
    # If call is completed successfully, mark verification as in progress
    if instance.status == IvrCallLog.STATUS_COMPLETED and verification.status == IvrVerification.STATUS_PENDING:
        verification.status = IvrVerification.STATUS_IN_PROGRESS
        verification.save(update_fields=['status', 'updated_at'])
    
    # If call failed, update verification status
    elif instance.status in [IvrCallLog.STATUS_FAILED, IvrCallLog.STATUS_BUSY, IvrCallLog.STATUS_NO_ANSWER]:
        verification.status = IvrVerification.STATUS_FAILED
        verification.failure_reason = f"Call {instance.get_status_display().lower()}"
        verification.save(update_fields=['status', 'failure_reason', 'updated_at'])
