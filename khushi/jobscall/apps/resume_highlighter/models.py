from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class ResumeHighlight(models.Model):
    """Stores resume highlighting information for a job application"""
    
    class HighlightType(models.TextChoices):
        STRENGTH = 'strength', _('Strength')
        WEAKNESS = 'weakness', _('Weakness')
        NEUTRAL = 'neutral', _('Neutral')
    
    analysis = models.ForeignKey(
        'resume_highlighter.ResumeAnalysis',
        on_delete=models.CASCADE,
        related_name='highlights',
        verbose_name=_('Resume Analysis')
    )
    
    text = models.TextField(_('Highlighted Text'))
    highlight_type = models.CharField(
        _('Highlight Type'),
        max_length=10,
        choices=HighlightType.choices,
        default=HighlightType.NEUTRAL
    )
    
    comment = models.TextField(_('Comment'), blank=True, null=True)
    suggested_improvement = models.TextField(_('Suggested Improvement'), blank=True, null=True)
    
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_highlights',
        verbose_name=_('Created By')
    )
    
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    
    class Meta:
        verbose_name = _('Resume Highlight')
        verbose_name_plural = _('Resume Highlights')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.get_highlight_type_display()} - {self.text[:50]}..."


class ResumeAnalysis(models.Model):
    """Stores overall analysis of a resume for a specific job application"""
    
    application = models.OneToOneField(
        'applications.Application',
        on_delete=models.CASCADE,
        related_name='resume_analysis',
        verbose_name=_('Application')
    )
    
    overall_score = models.PositiveSmallIntegerField(
        _('Overall Score'),
        help_text=_('Score out of 100')
    )
    
    strengths_summary = models.TextField(_('Strengths Summary'), blank=True, null=True)
    weaknesses_summary = models.TextField(_('Areas for Improvement'), blank=True, null=True)
    
    is_auto_generated = models.BooleanField(
        _('Is Auto Generated'),
        default=True,
        help_text=_('Whether this analysis was generated automatically')
    )
    
    analyzed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='analyzed_resumes',
        verbose_name=_('Analyzed By')
    )
    
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    
    class Meta:
        verbose_name = _('Resume Analysis')
        verbose_name_plural = _('Resume Analyses')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Analysis for {self.application} - Score: {self.overall_score}"
