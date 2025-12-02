from django.db import models
from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

class ResumeCheck(models.Model):
    """Stores resume check requests and results"""
    
    class CheckStatus(models.TextChoices):
        PENDING = 'pending', _('Pending')
        PROCESSING = 'processing', _('Processing')
        COMPLETED = 'completed', _('Completed')
        FAILED = 'failed', _('Failed')
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='resume_checker_checks',
        verbose_name=_('User')
    )
    
    # File information
    resume_file = models.FileField(
        _('Resume File'),
        upload_to='resume_checks/%Y/%m/%d/',
        max_length=500
    )
    
    original_filename = models.CharField(
        _('Original Filename'),
        max_length=255
    )
    
    file_size = models.PositiveIntegerField(
        _('File Size (bytes)'),
        help_text=_('Size of the uploaded file in bytes')
    )
    
    # Check results
    overall_score = models.PositiveSmallIntegerField(
        _('Overall Score'),
        help_text=_('Overall resume score (0-100)'),
        null=True,
        blank=True
    )
    
    status = models.CharField(
        _('Status'),
        max_length=20,
        choices=CheckStatus.choices,
        default=CheckStatus.PENDING
    )
    
    # Analysis results
    analysis = models.JSONField(
        _('Analysis Results'),
        default=dict,
        help_text=_('Detailed analysis results in JSON format')
    )
    
    # Timestamps
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    completed_at = models.DateTimeField(_('Completed At'), null=True, blank=True)
    
    class Meta:
        verbose_name = _('Resume Check')
        verbose_name_plural = _('Resume Checks')
        ordering = ('-created_at',)
    
    def __str__(self):
        return f"{self.original_filename} - {self.get_status_display()}"
    
    def save(self, *args, **kwargs):
        if self.status == self.CheckStatus.COMPLETED and not self.completed_at:
            self.completed_at = timezone.now()
        super().save(*args, **kwargs)


class ResumeIssue(models.Model):
    """Stores specific issues found in a resume"""
    
    class IssueType(models.TextChoices):
        CONTENT = 'content', _('Content')
        FORMAT = 'format', _('Format')
        STYLE = 'style', _('Style')
        GRAMMAR = 'grammar', _('Grammar')
        LENGTH = 'length', _('Length')
        OTHER = 'other', _('Other')
    
    class PriorityLevel(models.TextChoices):
        LOW = 'low', _('Low')
        MEDIUM = 'medium', _('Medium')
        HIGH = 'high', _('High')
        CRITICAL = 'critical', _('Critical')
    
    resume_check = models.ForeignKey(
        ResumeCheck,
        on_delete=models.CASCADE,
        related_name='issues',
        verbose_name=_('Resume Check')
    )
    
    issue_type = models.CharField(
        _('Issue Type'),
        max_length=20,
        choices=IssueType.choices,
        default=IssueType.OTHER
    )
    
    priority = models.CharField(
        _('Priority'),
        max_length=10,
        choices=PriorityLevel.choices,
        default=PriorityLevel.MEDIUM
    )
    
    title = models.CharField(
        _('Title'),
        max_length=255
    )
    
    description = models.TextField(
        _('Description'),
        help_text=_('Detailed description of the issue')
    )
    
    location = models.CharField(
        _('Location'),
        max_length=100,
        blank=True,
        null=True,
        help_text=_('Where in the resume this issue was found')
    )
    
    suggestion = models.TextField(
        _('Suggestion'),
        help_text=_('Suggested improvement'),
        blank=True,
        null=True
    )
    
    is_resolved = models.BooleanField(
        _('Is Resolved'),
        default=False
    )
    
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    
    class Meta:
        verbose_name = _('Resume Issue')
        verbose_name_plural = _('Resume Issues')
        ordering = ('-priority', 'created_at')
    
    def __str__(self):
        return f"{self.get_issue_type_display()}: {self.title}"


class ResumeCheckSettings(models.Model):
    """Stores settings for the resume checker"""
    
    name = models.CharField(
        _('Setting Name'),
        max_length=100,
        unique=True
    )
    
    value = models.JSONField(
        _('Setting Value'),
        help_text=_('JSON-encoded setting value')
    )
    
    description = models.TextField(
        _('Description'),
        blank=True,
        null=True
    )
    
    is_active = models.BooleanField(
        _('Is Active'),
        default=True
    )
    
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    
    class Meta:
        verbose_name = _('Resume Check Setting')
        verbose_name_plural = _('Resume Check Settings')
    
    def __str__(self):
        return self.name
