from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

class ResumeEnhancement(models.Model):
    """Stores information about resume enhancements"""
    
    class EnhancementStatus(models.TextChoices):
        PENDING = 'pending', _('Pending')
        PROCESSING = 'processing', _('Processing')
        COMPLETED = 'completed', _('Completed')
        FAILED = 'failed', _('Failed')
    
    class EnhancementType(models.TextChoices):
        ENTRY_LEVEL = 'entry_level', _('Entry Level')
        ATS_OPTIMIZATION = 'ats_optimization', _('ATS Optimization')
        DESIGN_ENHANCEMENT = 'design_enhancement', _('Design Enhancement')
        CONTENT_IMPROVEMENT = 'content_improvement', _('Content Improvement')
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='resume_enhancements',
        verbose_name=_('User')
    )
    
    original_resume = models.FileField(
        _('Original Resume'),
        upload_to='resumes/enhancements/original/%Y/%m/%d/',
        max_length=500
    )
    
    enhanced_resume = models.FileField(
        _('Enhanced Resume'),
        upload_to='resumes/enhancements/enhanced/%Y/%m/%d/',
        max_length=500,
        null=True,
        blank=True
    )
    
    enhancement_type = models.CharField(
        _('Enhancement Type'),
        max_length=50,
        choices=EnhancementType.choices,
        default=EnhancementType.ENTRY_LEVEL
    )
    
    status = models.CharField(
        _('Status'),
        max_length=20,
        choices=EnhancementStatus.choices,
        default=EnhancementStatus.PENDING
    )
    
    # Enhancement details
    score_before = models.PositiveSmallIntegerField(
        _('Score Before'),
        null=True,
        blank=True
    )
    
    score_after = models.PositiveSmallIntegerField(
        _('Score After'),
        null=True,
        blank=True
    )
    
    improvements = models.JSONField(
        _('Improvements'),
        default=list,
        help_text=_('List of improvements made to the resume')
    )
    
    # Job details (optional)
    job_title = models.CharField(
        _('Job Title'),
        max_length=255,
        blank=True,
        null=True
    )
    
    job_description = models.TextField(
        _('Job Description'),
        blank=True,
        null=True
    )
    
    # Timestamps
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    completed_at = models.DateTimeField(_('Completed At'), null=True, blank=True)
    
    class Meta:
        verbose_name = _('Resume Enhancement')
        verbose_name_plural = _('Resume Enhancements')
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        """Handle status updates"""
        if self.status == self.EnhancementStatus.COMPLETED and not self.completed_at:
            self.completed_at = timezone.now()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.get_enhancement_type_display()} - {self.user.email}"


class ResumeEnhancementFeedback(models.Model):
    """Stores user feedback on resume enhancements"""
    
    enhancement = models.OneToOneField(
        ResumeEnhancement,
        on_delete=models.CASCADE,
        related_name='feedback',
        verbose_name=_('Enhancement')
    )
    
    rating = models.PositiveSmallIntegerField(
        _('Rating'),
        help_text=_('Rating from 1 to 5'),
        null=True,
        blank=True
    )
    
    comments = models.TextField(
        _('Comments'),
        blank=True,
        null=True
    )
    
    would_recommend = models.BooleanField(
        _('Would Recommend'),
        null=True,
        blank=True
    )
    
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    
    class Meta:
        verbose_name = _('Resume Enhancement Feedback')
        verbose_name_plural = _('Resume Enhancement Feedbacks')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Feedback for {self.enhancement}"
