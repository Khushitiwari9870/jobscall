from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from apps.companies.models import Company

class JobPosting(models.Model):
    JOB_TYPES = (
        ('full_time', _('Full Time')),
        ('part_time', _('Part Time')),
        ('contract', _('Contract')),
        ('internship', _('Internship')),
        ('temporary', _('Temporary')),
    )

    EXPERIENCE_LEVELS = (
        ('internship', _('Internship')),
        ('entry', _('Entry Level')),
        ('associate', _('Associate')),
        ('mid_senior', _('Mid-Senior Level')),
        ('director', _('Director')),
        ('executive', _('Executive')),
    )

    STATUS_CHOICES = (
        ('draft', _('Draft')),
        ('published', _('Published')),
        ('closed', _('Closed')),
        ('archived', _('Archived')),
    )

    # Basic Information
    title = models.CharField(_('Job Title'), max_length=255)
    description = models.TextField(_('Job Description'))
    requirements = models.TextField(_('Requirements'), blank=True)
    responsibilities = models.TextField(_('Responsibilities'), blank=True)
    benefits = models.TextField(_('Benefits'), blank=True)
    
    # Company and Location
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name='job_postings',
        verbose_name=_('Company')
    )
    location = models.CharField(_('Location'), max_length=255, blank=True)
    is_remote = models.BooleanField(_('Remote Position'), default=False)
    
    # Job Details
    job_type = models.CharField(
        _('Job Type'),
        max_length=20,
        choices=JOB_TYPES,
        default='full_time'
    )
    experience_level = models.CharField(
        _('Experience Level'),
        max_length=20,
        choices=EXPERIENCE_LEVELS,
        default='mid_senior'
    )
    min_salary = models.DecimalField(
        _('Minimum Salary'),
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    max_salary = models.DecimalField(
        _('Maximum Salary'),
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    salary_currency = models.CharField(
        _('Salary Currency'),
        max_length=3,
        default='USD'
    )
    salary_display = models.CharField(
        _('Salary Display'),
        max_length=255,
        blank=True,
        help_text=_('E.g., "$100,000 - $150,000 a year"')
    )
    
    # Application Details
    application_url = models.URLField(_('Application URL'), blank=True)
    application_email = models.EmailField(_('Application Email'), blank=True)
    application_instructions = models.TextField(
        _('Application Instructions'),
        blank=True
    )
    
    # Status and Metadata
    status = models.CharField(
        _('Status'),
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft'
    )
    is_featured = models.BooleanField(_('Featured Job'), default=False)
    views_count = models.PositiveIntegerField(_('Views Count'), default=0)
    applications_count = models.PositiveIntegerField(_('Applications Count'), default=0)
    
    # Timestamps
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    published_at = models.DateTimeField(_('Published At'), null=True, blank=True)
    closed_at = models.DateTimeField(_('Closed At'), null=True, blank=True)
    expires_at = models.DateTimeField(_('Expires At'), null=True, blank=True)
    
    # Relationships
    posted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='job_postings_posted',
        verbose_name=_('Posted By')
    )
    
    class Meta:
        verbose_name = _('Job Posting')
        verbose_name_plural = _('Job Postings')
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class JobApplication(models.Model):
    STATUS_CHOICES = (
        ('applied', _('Applied')),
        ('reviewed', _('Under Review')),
        ('shortlisted', _('Shortlisted')),
        ('interview', _('Interview')),
        ('offer', _('Offer Sent')),
        ('hired', _('Hired')),
        ('rejected', _('Rejected')),
        ('withdrawn', _('Withdrawn')),
    )

    SOURCE_CHOICES = (
        ('website', _('Website')),
        ('email', _('Email')),
        ('api', _('API')),
        ('manual', _('Manual Entry')),
    )

    job_posting = models.ForeignKey(
        JobPosting,
        on_delete=models.CASCADE,
        related_name='posting_applications',
        verbose_name=_('Job Posting')
    )
    applicant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='posting_applications_submitted',
        verbose_name=_('Applicant')
    )
    status = models.CharField(
        _('Status'),
        max_length=20,
        choices=STATUS_CHOICES,
        default='applied'
    )
    source = models.CharField(
        _('Source'),
        max_length=20,
        choices=SOURCE_CHOICES,
        default='website'
    )
    cover_letter = models.TextField(_('Cover Letter'), blank=True)
    resume = models.FileField(
        _('Resume'),
        upload_to='resumes/%Y/%m/%d/',
        blank=True,
        null=True
    )
    is_reviewed = models.BooleanField(_('Is Reviewed'), default=False)
    is_rejected = models.BooleanField(_('Is Rejected'), default=False)
    applied_at = models.DateTimeField(_('Applied At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    reviewed_at = models.DateTimeField(_('Reviewed At'), null=True, blank=True)
    
    class Meta:
        verbose_name = _('Job Application')
        verbose_name_plural = _('Job Applications')
        ordering = ['-applied_at']
    
    def __str__(self):
        return f"{self.applicant.get_full_name()} - {self.job_posting.title}"
    
    @property
    def applicant_name(self):
        return self.applicant.get_full_name()
    
    @property
    def job_title(self):
        return self.job_posting.title
    
    @property
    def company_name(self):
        return self.job_posting.company.name if self.job_posting.company else ""


class ApplicationNote(models.Model):
    """Model to store notes for job applications."""
    application = models.ForeignKey(
        JobApplication,
        on_delete=models.CASCADE,
        related_name='posting_notes',
        verbose_name=_('Application')
    )
    note = models.TextField(_('Note'))
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='posting_notes_authored',
        verbose_name=_('Created By')
    )
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    
    class Meta:
        verbose_name = _('Job Posting Application Note')
        verbose_name_plural = _('Job Posting Application Notes')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Note for job application {self.application.id} by {self.created_by}"
