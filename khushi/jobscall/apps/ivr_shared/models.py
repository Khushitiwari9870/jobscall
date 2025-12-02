from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model

User = get_user_model()

class SharedIvrResource(models.Model):
    """Model for storing shared IVR resources like audio files, prompts, etc."""
    RESOURCE_TYPE_CHOICES = [
        ('audio', 'Audio File'),
        ('prompt', 'Voice Prompt'),
        ('script', 'IVR Script'),
        ('greeting', 'Greeting Message'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(_('Resource Name'), max_length=100)
    description = models.TextField(_('Description'), blank=True)
    resource_type = models.CharField(
        _('Resource Type'),
        max_length=20,
        choices=RESOURCE_TYPE_CHOICES,
        default='audio'
    )
    
    # File storage
    file = models.FileField(
        _('File'),
        upload_to='ivr/shared/resources/',
        null=True,
        blank=True
    )
    
    # Text content (for scripts or prompts)
    content = models.TextField(_('Content'), blank=True)
    
    # Metadata
    language = models.CharField(
        _('Language'),
        max_length=10,
        default='en',
        help_text=_('ISO 639-1 language code')
    )
    is_active = models.BooleanField(_('Is Active'), default=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_ivr_resources',
        verbose_name=_('Created By')
    )
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    
    class Meta:
        verbose_name = _('Shared IVR Resource')
        verbose_name_plural = _('Shared IVR Resources')
        ordering = ['name']
        indexes = [
            models.Index(fields=['resource_type']),
            models.Index(fields=['language']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return f"{self.get_resource_type_display()}: {self.name}"


class SharedIvrTemplate(models.Model):
    """Model for storing shared IVR templates that can be reused across different IVR systems"""
    TEMPLATE_TYPE_CHOICES = [
        ('greeting', 'Greeting'),
        ('menu', 'Menu'),
        ('verification', 'Verification'),
        ('survey', 'Survey'),
        ('appointment', 'Appointment'),
        ('custom', 'Custom'),
    ]
    
    name = models.CharField(_('Template Name'), max_length=100)
    description = models.TextField(_('Description'), blank=True)
    template_type = models.CharField(
        _('Template Type'),
        max_length=20,
        choices=TEMPLATE_TYPE_CHOICES,
        default='custom'
    )
    
    # Template content (can be JSON, XML, or other format)
    content = models.JSONField(_('Template Content'), default=dict)
    
    # Associated resources
    resources = models.ManyToManyField(
        SharedIvrResource,
        related_name='templates',
        blank=True,
        verbose_name=_('Resources')
    )
    
    # Metadata
    version = models.CharField(_('Version'), max_length=20, default='1.0')
    is_active = models.BooleanField(_('Is Active'), default=True)
    is_public = models.BooleanField(
        _('Is Public'),
        default=False,
        help_text=_('If checked, this template can be used by all users')
    )
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_ivr_templates',
        verbose_name=_('Created By')
    )
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    
    class Meta:
        verbose_name = _('Shared IVR Template')
        verbose_name_plural = _('Shared IVR Templates')
        ordering = ['name']
        indexes = [
            models.Index(fields=['template_type']),
            models.Index(fields=['is_active']),
            models.Index(fields=['is_public']),
        ]
    
    def __str__(self):
        return f"{self.get_template_type_display()}: {self.name} (v{self.version})"


class SharedIvrUsageLog(models.Model):
    """Logs usage of shared IVR resources and templates"""
    ACTION_CHOICES = [
        ('created', 'Created'),
        ('updated', 'Updated'),
        ('deleted', 'Deleted'),
        ('used', 'Used'),
        ('exported', 'Exported'),
        ('imported', 'Imported'),
    ]
    
    RESOURCE_TYPE_CHOICES = [
        ('resource', 'Resource'),
        ('template', 'Template'),
    ]
    
    resource_type = models.CharField(
        _('Resource Type'),
        max_length=10,
        choices=RESOURCE_TYPE_CHOICES
    )
    resource_id = models.PositiveIntegerField(_('Resource ID'))
    action = models.CharField(
        _('Action'),
        max_length=20,
        choices=ACTION_CHOICES
    )
    
    # User who performed the action
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='ivr_usage_logs',
        verbose_name=_('User')
    )
    
    # Additional context
    ip_address = models.GenericIPAddressField(_('IP Address'), null=True, blank=True)
    user_agent = models.TextField(_('User Agent'), blank=True)
    
    # Additional data
    metadata = models.JSONField(_('Metadata'), default=dict, blank=True)
    
    timestamp = models.DateTimeField(_('Timestamp'), auto_now_add=True)
    
    class Meta:
        verbose_name = _('IVR Usage Log')
        verbose_name_plural = _('IVR Usage Logs')
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['resource_type', 'resource_id']),
            models.Index(fields=['action']),
            models.Index(fields=['timestamp']),
        ]
    
    def __str__(self):
        return f"{self.get_action_display()} {self.get_resource_type_display().lower()} #{self.resource_id}"
