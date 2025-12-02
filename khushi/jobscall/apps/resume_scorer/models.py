from django.db import models
from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

class ResumeScore(models.Model):
    """Stores resume scores and analysis results"""
    
    class ScoreStatus(models.TextChoices):
        PENDING = 'pending', _('Pending')
        PROCESSING = 'processing', _('Processing')
        COMPLETED = 'completed', _('Completed')
        FAILED = 'failed', _('Failed')
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='resume_scores',
        verbose_name=_('User'),
        null=True,
        blank=True
    )
    
    # File information
    resume_file = models.FileField(
        _('Resume File'),
        upload_to='resume_scores/%Y/%m/%d/',
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
    
    # Score information
    overall_score = models.PositiveSmallIntegerField(
        _('Overall Score'),
        help_text=_('Overall resume score (0-100)'),
        null=True,
        blank=True
    )
    
    status = models.CharField(
        _('Status'),
        max_length=20,
        choices=ScoreStatus.choices,
        default=ScoreStatus.PENDING
    )
    
    # Category scores
    ats_score = models.PositiveSmallIntegerField(
        _('ATS Score'),
        help_text=_('Score based on ATS compatibility (0-100)'),
        null=True,
        blank=True
    )
    
    content_score = models.PositiveSmallIntegerField(
        _('Content Score'),
        help_text=_('Score based on content quality (0-100)'),
        null=True,
        blank=True
    )
    
    design_score = models.PositiveSmallIntegerField(
        _('Design Score'),
        help_text=_('Score based on design and formatting (0-100)'),
        null=True,
        blank=True
    )
    
    # Analysis results
    strengths = models.JSONField(
        _('Strengths'),
        default=list,
        help_text=_('List of strengths found in the resume')
    )
    
    weaknesses = models.JSONField(
        _('Areas for Improvement'),
        default=list,
        help_text=_('List of areas that need improvement')
    )
    
    keyword_matches = models.JSONField(
        _('Keyword Matches'),
        default=dict,
        help_text=_('Keywords found and their relevance')
    )
    
    # Additional metadata
    job_title = models.CharField(
        _('Target Job Title'),
        max_length=255,
        blank=True,
        null=True
    )
    
    industry = models.CharField(
        _('Industry'),
        max_length=100,
        blank=True,
        null=True
    )
    
    # Timestamps
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    completed_at = models.DateTimeField(_('Completed At'), null=True, blank=True)
    
    class Meta:
        verbose_name = _('Resume Score')
        verbose_name_plural = _('Resume Scores')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Resume Score - {self.original_filename} ({self.overall_score or 'N/A'})"
    
    def save(self, *args, **kwargs):
        """Handle status updates and calculations"""
        if self.status == self.ScoreStatus.COMPLETED and not self.completed_at:
            self.completed_at = timezone.now()
            
            # Calculate overall score if category scores are available
            if all([self.ats_score, self.content_score, self.design_score]):
                self.overall_score = (
                    self.ats_score + self.content_score + self.design_score
                ) // 3
        
        super().save(*args, **kwargs)
    
    def get_score_rating(self):
        """Get a text rating based on the overall score"""
        if not self.overall_score:
            return None
            
        if self.overall_score >= 80:
            return 'Excellent'
        elif self.overall_score >= 60:
            return 'Good'
        elif self.overall_score >= 40:
            return 'Average'
        else:
            return 'Needs Improvement'


class ScoreImprovement(models.Model):
    """Stores specific improvement suggestions for resume scores"""
    
    class ImprovementCategory(models.TextChoices):
        CONTENT = 'content', _('Content')
        FORMATTING = 'formatting', _('Formatting')
        KEYWORDS = 'keywords', _('Keywords')
        LENGTH = 'length', _('Length')
        DESIGN = 'design', _('Design')
        
    class PriorityLevel(models.TextChoices):
        LOW = 'low', _('Low')
        MEDIUM = 'medium', _('Medium')
        HIGH = 'high', _('High')
    
    resume_score = models.ForeignKey(
        ResumeScore,
        on_delete=models.CASCADE,
        related_name='improvements',
        verbose_name=_('Resume Score')
    )
    
    category = models.CharField(
        _('Category'),
        max_length=20,
        choices=ImprovementCategory.choices,
        default=ImprovementCategory.CONTENT
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
        help_text=_('Detailed description of the improvement')
    )
    
    example_before = models.TextField(
        _('Example Before'),
        blank=True,
        null=True,
        help_text=_('Example of current content (before improvement)')
    )
    
    example_after = models.TextField(
        _('Example After'),
        blank=True,
        null=True,
        help_text=_('Example of improved content')
    )
    
    is_applied = models.BooleanField(
        _('Is Applied'),
        default=False,
        help_text=_('Whether the improvement has been applied')
    )
    
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    
    class Meta:
        verbose_name = _('Score Improvement')
        verbose_name_plural = _('Score Improvements')
        ordering = ['priority', 'category']
    
    def __str__(self):
        return f"{self.get_priority_display()} - {self.title}"


class ResumeScoreSettings(models.Model):
    """Stores settings for resume scoring"""
    
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
        verbose_name = _('Resume Score Setting')
        verbose_name_plural = _('Resume Score Settings')
    
    def __str__(self):
        return self.name
