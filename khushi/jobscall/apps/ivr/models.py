from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class IvrCall(models.Model):
    """Model to track IVR calls and their status"""
    CALL_STATUS_CHOICES = [
        ('initiated', 'Initiated'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('no_answer', 'No Answer'),
        ('busy', 'Busy'),
    ]
    
    CALL_DIRECTION_CHOICES = [
        ('inbound', 'Inbound'),
        ('outbound', 'Outbound'),
    ]
    
    # Call identification
    call_sid = models.CharField(_('Call SID'), max_length=100, unique=True, null=True, blank=True)
    parent_call_sid = models.CharField(_('Parent Call SID'), max_length=100, null=True, blank=True)
    
    # Call details
    from_number = models.CharField(_('From Number'), max_length=20)
    to_number = models.CharField(_('To Number'), max_length=20)
    direction = models.CharField(
        _('Direction'),
        max_length=10,
        choices=CALL_DIRECTION_CHOICES,
        default='inbound'
    )
    status = models.CharField(
        _('Status'),
        max_length=20,
        choices=CALL_STATUS_CHOICES,
        default='initiated'
    )
    
    # Caller information
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='ivr_calls',
        verbose_name=_('User')
    )
    
    # Call metadata
    start_time = models.DateTimeField(_('Start Time'), auto_now_add=True)
    end_time = models.DateTimeField(_('End Time'), null=True, blank=True)
    duration = models.PositiveIntegerField(_('Duration (seconds)'), default=0)
    recording_url = models.URLField(_('Recording URL'), max_length=500, blank=True, null=True)
    
    # IVR navigation
    current_menu = models.CharField(_('Current Menu'), max_length=50, blank=True, null=True)
    digits_pressed = models.CharField(_('Digits Pressed'), max_length=50, blank=True, null=True)
    
    # Error handling
    error_message = models.TextField(_('Error Message'), blank=True, null=True)
    
    class Meta:
        verbose_name = _('IVR Call')
        verbose_name_plural = _('IVR Calls')
        ordering = ['-start_time']
    
    def __str__(self):
        return f"{self.get_direction_display()} call from {self.from_number} ({self.status})"
    
    def end_call(self, status='completed'):
        """Mark the call as ended"""
        self.status = status
        self.end_time = timezone.now()
        if self.start_time:
            self.duration = (self.end_time - self.start_time).seconds
        self.save()


class IvrMenu(models.Model):
    """Model to define IVR menu structure"""
    MENU_TYPE_CHOICES = [
        ('main', 'Main Menu'),
        ('submenu', 'Submenu'),
        ('action', 'Action'),
    ]
    
    name = models.CharField(_('Menu Name'), max_length=100)
    menu_type = models.CharField(
        _('Menu Type'),
        max_length=10,
        choices=MENU_TYPE_CHOICES,
        default='main'
    )
    greeting_text = models.TextField(_('Greeting Text'))
    greeting_voice = models.FileField(
        _('Greeting Voice'),
        upload_to='ivr/greetings/',
        null=True,
        blank=True
    )
    invalid_choice_text = models.TextField(
        _('Invalid Choice Text'),
        default='Invalid selection. Please try again.'
    )
    max_retries = models.PositiveSmallIntegerField(_('Max Retries'), default=3)
    timeout = models.PositiveSmallIntegerField(
        _('Timeout (seconds)'),
        default=5,
        help_text=_('Time to wait for input before timeout')
    )
    finish_on_key = models.CharField(
        _('Finish On Key'),
        max_length=1,
        default='#',
        help_text=_('Key that ends input collection')
    )
    is_active = models.BooleanField(_('Is Active'), default=True)
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    
    class Meta:
        verbose_name = _('IVR Menu')
        verbose_name_plural = _('IVR Menus')
        ordering = ['name']
    
    def __str__(self):
        return f"{self.get_menu_type_display()}: {self.name}"


class IvrMenuOption(models.Model):
    """Model to define options within an IVR menu"""
    menu = models.ForeignKey(
        IvrMenu,
        on_delete=models.CASCADE,
        related_name='options',
        verbose_name=_('Menu')
    )
    digit = models.CharField(
        _('Digit'),
        max_length=1,
        help_text=_('Single digit (0-9, *, #) to trigger this option')
    )
    description = models.CharField(_('Description'), max_length=200)
    
    # Action when this option is selected
    ACTION_CHOICES = [
        ('menu', 'Go to Menu'),
        ('call', 'Make Call'),
        ('hangup', 'Hang Up'),
        ('voicemail', 'Leave Voicemail'),
        ('callback', 'Request Callback'),
    ]
    action = models.CharField(
        _('Action'),
        max_length=20,
        choices=ACTION_CHOICES,
        default='menu'
    )
    
    # Action parameters
    target_menu = models.ForeignKey(
        IvrMenu,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='targeted_by',
        verbose_name=_('Target Menu')
    )
    phone_number = models.CharField(
        _('Phone Number'),
        max_length=20,
        blank=True,
        null=True,
        help_text=_('Number to call for call/callback actions')
    )
    
    # Audio feedback
    confirmation_text = models.TextField(_('Confirmation Text'), blank=True)
    confirmation_voice = models.FileField(
        _('Confirmation Voice'),
        upload_to='ivr/confirmations/',
        null=True,
        blank=True
    )
    
    # Display order
    order = models.PositiveSmallIntegerField(_('Order'), default=0)
    
    class Meta:
        verbose_name = _('IVR Menu Option')
        verbose_name_plural = _('IVR Menu Options')
        ordering = ['order', 'digit']
        unique_together = ['menu', 'digit']
    
    def __str__(self):
        return f"{self.menu.name}: Press {self.digit} for {self.description}"


class IvrCallLog(models.Model):
    """Detailed log of IVR call interactions"""
    call = models.ForeignKey(
        IvrCall,
        on_delete=models.CASCADE,
        related_name='logs',
        verbose_name=_('Call')
    )
    timestamp = models.DateTimeField(_('Timestamp'), auto_now_add=True)
    event_type = models.CharField(_('Event Type'), max_length=50)
    details = models.JSONField(_('Details'), default=dict)
    
    class Meta:
        verbose_name = _('IVR Call Log')
        verbose_name_plural = _('IVR Call Logs')
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.timestamp} - {self.call} - {self.event_type}"
