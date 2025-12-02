from django.db import models
from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator


class IvrVerification(models.Model):
    """
    Model to track IVR verification attempts for users.
    """
    # Verification status choices
    STATUS_PENDING = 'pending'
    STATUS_IN_PROGRESS = 'in_progress'
    STATUS_COMPLETED = 'completed'
    STATUS_FAILED = 'failed'
    
    STATUS_CHOICES = [
        (STATUS_PENDING, _('Pending')),
        (STATUS_IN_PROGRESS, _('In Progress')),
        (STATUS_COMPLETED, _('Completed')),
        (STATUS_FAILED, _('Failed')),
    ]
    
    # Verification method choices
    METHOD_CALL = 'call'
    METHOD_SMS = 'sms'
    METHOD_WHATSAPP = 'whatsapp'
    
    METHOD_CHOICES = [
        (METHOD_CALL, _('Phone Call')),
        (METHOD_SMS, _('SMS')),
        (METHOD_WHATSAPP, _('WhatsApp')),
    ]
    
    # User who is being verified
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='ivr_verifications',
        verbose_name=_('user')
    )
    
    # Verification details
    phone_number = models.CharField(
        max_length=20,
        verbose_name=_('phone number'),
        help_text=_('Phone number to verify')
    )
    
    verification_code = models.CharField(
        max_length=10,
        verbose_name=_('verification code'),
        help_text=_('The code sent for verification')
    )
    
    method = models.CharField(
        max_length=20,
        choices=METHOD_CHOICES,
        default=METHOD_CALL,
        verbose_name=_('verification method')
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING,
        verbose_name=_('verification status')
    )
    
    attempts = models.PositiveSmallIntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        verbose_name=_('verification attempts'),
        help_text=_('Number of verification attempts made')
    )
    
    # Timestamps
    created_at = models.DateTimeField(
        _('created at'),
        auto_now_add=True,
        db_index=True
    )
    
    updated_at = models.DateTimeField(
        _('updated at'),
        auto_now=True
    )
    
    verified_at = models.DateTimeField(
        _('verified at'),
        null=True,
        blank=True,
        help_text=_('When the verification was successfully completed')
    )
    
    expires_at = models.DateTimeField(
        _('expires at'),
        help_text=_('When this verification code expires')
    )
    
    # Metadata
    ip_address = models.GenericIPAddressField(
        _('IP address'),
        null=True,
        blank=True,
        help_text=_('IP address of the device initiating verification')
    )
    
    user_agent = models.TextField(
        _('user agent'),
        blank=True,
        help_text=_('User agent of the device/browser')
    )
    
    # Verification result
    is_successful = models.BooleanField(
        _('is successful'),
        default=False,
        help_text=_('Whether the verification was successful')
    )
    
    failure_reason = models.TextField(
        _('failure reason'),
        blank=True,
        help_text=_('Reason for verification failure, if any')
    )
    
    class Meta:
        verbose_name = _('IVR verification')
        verbose_name_plural = _('IVR verifications')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'status', 'expires_at']),
            models.Index(fields=['phone_number', 'verification_code']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.get_status_display()}"
    
    @property
    def is_expired(self):
        """Check if the verification code has expired"""
        return timezone.now() > self.expires_at
    
    def mark_as_verified(self):
        """Mark this verification as successfully completed"""
        self.status = self.STATUS_COMPLETED
        self.is_successful = True
        self.verified_at = timezone.now()
        self.save(update_fields=['status', 'is_successful', 'verified_at'])
    
    def mark_as_failed(self, reason=None):
        """Mark this verification as failed"""
        self.status = self.STATUS_FAILED
        self.is_successful = False
        self.failure_reason = reason or _('Unknown error')
        self.attempts += 1
        self.save(update_fields=['status', 'is_successful', 'failure_reason', 'attempts'])
    
    def increment_attempts(self):
        """Increment the number of verification attempts"""
        self.attempts += 1
        if self.attempts >= 5:  # Max attempts reached
            self.status = self.STATUS_FAILED
            self.failure_reason = _('Maximum number of attempts reached')
        self.save(update_fields=['attempts', 'status', 'failure_reason'])


class IvrCallLog(models.Model):
    """
    Model to track IVR call details and status.
    """
    # Call status choices
    STATUS_QUEUED = 'queued'
    STATUS_INITIATED = 'initiated'
    STATUS_IN_PROGRESS = 'in_progress'
    STATUS_COMPLETED = 'completed'
    STATUS_FAILED = 'failed'
    STATUS_BUSY = 'busy'
    STATUS_NO_ANSWER = 'no_answer'
    
    STATUS_CHOICES = [
        (STATUS_QUEUED, _('Queued')),
        (STATUS_INITIATED, _('Initiated')),
        (STATUS_IN_PROGRESS, _('In Progress')),
        (STATUS_COMPLETED, _('Completed')),
        (STATUS_FAILED, _('Failed')),
        (STATUS_BUSY, _('Busy')),
        (STATUS_NO_ANSWER, _('No Answer')),
    ]
    
    # Related verification (can be null for non-verification calls)
    verification = models.OneToOneField(
        IvrVerification,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='call_log',
        verbose_name=_('verification')
    )
    
    # Call details
    call_sid = models.CharField(
        max_length=100,
        unique=True,
        verbose_name=_('call SID'),
        help_text=_('Unique identifier from the telephony provider')
    )
    
    from_number = models.CharField(
        max_length=20,
        verbose_name=_('from number'),
        help_text=_('The phone number that made the call')
    )
    
    to_number = models.CharField(
        max_length=20,
        verbose_name=_('to number'),
        help_text=_('The phone number that received the call')
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_QUEUED,
        verbose_name=_('call status')
    )
    
    duration = models.PositiveIntegerField(
        _('call duration'),
        null=True,
        blank=True,
        help_text=_('Call duration in seconds')
    )
    
    recording_url = models.URLField(
        _('recording URL'),
        blank=True,
        help_text=_('URL to the call recording, if available')
    )
    
    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    started_at = models.DateTimeField(_('started at'), null=True, blank=True)
    ended_at = models.DateTimeField(_('ended at'), null=True, blank=True)
    
    # Call metadata
    price = models.DecimalField(
        _('call price'),
        max_digits=10,
        decimal_places=4,
        null=True,
        blank=True,
        help_text=_('Cost of the call in USD')
    )
    
    price_unit = models.CharField(
        _('price unit'),
        max_length=3,
        default='USD',
        help_text=_('Currency for the call price')
    )
    
    provider_data = models.JSONField(
        _('provider data'),
        default=dict,
        blank=True,
        help_text=_('Raw data from the telephony provider')
    )
    
    error_message = models.TextField(
        _('error message'),
        blank=True,
        help_text=_('Error details if the call failed')
    )
    
    class Meta:
        verbose_name = _('IVR call log')
        verbose_name_plural = _('IVR call logs')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['call_sid']),
            models.Index(fields=['from_number']),
            models.Index(fields=['to_number']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.from_number} → {self.to_number} ({self.get_status_display()})"
    
    def update_status(self, status, **kwargs):
        """Update call status and related fields"""
        self.status = status
        
        # Update timestamps based on status
        now = timezone.now()
        if status == self.STATUS_IN_PROGRESS and not self.started_at:
            self.started_at = now
        elif status in [self.STATUS_COMPLETED, self.STATUS_FAILED, self.STATUS_BUSY, self.STATUS_NO_ANSWER]:
            if not self.ended_at:
                self.ended_at = now
            if self.started_at and not self.duration:
                self.duration = (self.ended_at - self.started_at).seconds
        
        # Update any additional fields passed in kwargs
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        
        self.save(update_fields=['status', 'started_at', 'ended_at', 'duration'] + list(kwargs.keys()))
