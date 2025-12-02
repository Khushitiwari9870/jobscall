from django.db.models.signals import post_save, pre_save, post_delete
from django.dispatch import receiver
from django.utils import timezone
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.translation import gettext_lazy as _

from .models import JobPosting, JobApplication, ApplicationNote


@receiver(post_save, sender=JobPosting)
def handle_job_posting_save(sender, instance, created, **kwargs):
    """
    Handle post-save signals for JobPosting model.
    """
    # If this is a new job posting or status has changed to published
    if created or 'status' in instance.get_dirty_fields():
        if instance.status == 'published':
            # Send notifications to subscribers or perform other actions
            send_job_published_notification(instance)
        
        # Update search index or cache
        update_job_posting_index(instance)


def send_job_published_notification(job_posting):
    """
    Send notifications when a job is published.
    """
    # TODO: Implement actual notification logic
    # This could include:
    # - Email notifications to subscribers
    # - Push notifications
    # - Activity feed updates
    pass


def update_job_posting_index(job_posting):
    """
    Update search index for a job posting.
    """
    # TODO: Implement search index update
    pass


@receiver(post_save, sender=JobApplication)
def handle_job_application_save(sender, instance, created, **kwargs):
    """
    Handle post-save signals for JobApplication model.
    """
    if created:
        # Send confirmation email to applicant
        send_application_confirmation(instance)
        
        # Send notification to company/recruiter
        send_new_application_notification(instance)
    else:
        # Check if status has changed
        if 'status' in instance.get_dirty_fields():
            handle_application_status_change(instance)


def send_application_confirmation(application):
    """
    Send confirmation email to job applicant.
    """
    subject = _('Application Submitted: {}').format(application.job_posting.title)
    message = render_to_string('emails/application_confirmation.html', {
        'application': application,
    })
    
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[application.applicant.email],
        html_message=message,
        fail_silently=True
    )


def send_new_application_notification(application):
    """
    Send notification to company/recruiter about new application.
    """
    # Get recipients (could be multiple people in the company)
    recipients = [application.job_posting.posted_by.email]
    
    subject = _('New Application: {} - {}').format(
        application.job_posting.title,
        application.applicant.get_full_name() or application.applicant.email
    )
    
    message = render_to_string('emails/new_application_notification.html', {
        'application': application,
    })
    
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=recipients,
        html_message=message,
        fail_silently=True
    )


def handle_application_status_change(application):
    """
    Handle status changes for job applications.
    """
    if application.status == 'shortlisted':
        send_shortlist_notification(application)
    elif application.status == 'interview':
        send_interview_invitation(application)
    elif application.status == 'offer':
        send_job_offer(application)
    elif application.status == 'rejected':
        send_rejection_notification(application)
    elif application.status == 'hired':
        send_hiring_notification(application)


def send_shortlist_notification(application):
    """
    Send notification to applicant that they've been shortlisted.
    """
    subject = _('Application Update: You\'ve been shortlisted!')
    message = render_to_string('emails/shortlist_notification.html', {
        'application': application,
    })
    
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[application.applicant.email],
        html_message=message,
        fail_silently=True
    )


def send_interview_invitation(application):
    """
    Send interview invitation to applicant.
    """
    subject = _('Interview Invitation: {}').format(application.job_posting.title)
    message = render_to_string('emails/interview_invitation.html', {
        'application': application,
    })
    
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[application.applicant.email],
        html_message=message,
        fail_silently=True
    )


def send_job_offer(application):
    """
    Send job offer to applicant.
    """
    subject = _('Job Offer: {}').format(application.job_posting.title)
    message = render_to_string('emails/job_offer.html', {
        'application': application,
    })
    
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[application.applicant.email],
        html_message=message,
        fail_silently=True
    )


def send_rejection_notification(application):
    """
    Send rejection notification to applicant.
    """
    subject = _('Application Update: {}').format(application.job_posting.title)
    message = render_to_string('emails/rejection_notification.html', {
        'application': application,
    })
    
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[application.applicant.email],
        html_message=message,
        fail_silently=True
    )


def send_hiring_notification(application):
    """
    Send hiring notification to applicant.
    """
    subject = _('Congratulations! You\'ve been hired as {}').format(
        application.job_posting.title
    )
    message = render_to_string('emails/hiring_notification.html', {
        'application': application,
    })
    
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[application.applicant.email],
        html_message=message,
        fail_silently=True
    )


@receiver(post_save, sender=ApplicationNote)
def handle_application_note_save(sender, instance, created, **kwargs):
    """
    Handle post-save signals for ApplicationNote model.
    """
    if created:
        # Send notification to relevant parties about the new note
        send_note_notification(instance)


def send_note_notification(note):
    """
    Send notification about a new note on an application.
    """
    application = note.application
    recipients = []
    
    # Add the applicant if the note is from a company user
    if note.created_by != application.applicant:
        recipients.append(application.applicant.email)
    
    # Add company users who are involved with this application
    # This could be the job poster, recruiters, etc.
    if application.job_posting.posted_by and application.job_posting.posted_by != note.created_by:
        recipients.append(application.job_posting.posted_by.email)
    
    if not recipients:
        return
    
    subject = _('New Note on Your Application: {}').format(application.job_posting.title)
    message = render_to_string('emails/new_note_notification.html', {
        'note': note,
        'application': application,
    })
    
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=recipients,
        html_message=message,
        fail_silently=True
    )
