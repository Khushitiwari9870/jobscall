from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.utils import timezone
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from .models import Job, JobApplication

@receiver(pre_save, sender=Job)
def update_job_status(sender, instance, **kwargs):
    """
    Automatically deactivate jobs that have passed their application deadline
    """
    if instance.application_deadline and instance.application_deadline < timezone.now().date():
        instance.is_active = False

@receiver(post_save, sender=JobApplication)
def send_application_confirmation(sender, instance, created, **kwargs):
    """
    Send confirmation email when a new job application is submitted
    """
    if created:
        subject = f"Application Received: {instance.job.title}"
        message = render_to_string('emails/application_confirmation.html', {
            'job': instance.job,
            'applicant': instance.applicant,
            'application': instance,
        })
        
        send_mail(
            subject=subject,
            message='',  # Empty message as we're using html_message
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[instance.applicant.email],
            html_message=message,
            fail_silently=True,
        )