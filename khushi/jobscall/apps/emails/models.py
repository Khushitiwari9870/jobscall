from django.db import models
from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model

User = get_user_model()


class EmailTemplate(models.Model):
    """Stores email templates for different purposes"""
    TEMPLATE_TYPES = [
        ('candidate', 'Candidate Communication'),
        ('recruiter', 'Recruiter Notification'),
        ('system', 'System Notification'),
        ('marketing', 'Marketing'),
    ]
    
    name = models.CharField(_('Template Name'), max_length=100)
    subject = models.CharField(_('Email Subject'), max_length=200)
    body = models.TextField(_('Email Body'))
    template_type = models.CharField(
        _('Template Type'),
        max_length=20,
        choices=TEMPLATE_TYPES,
        default='candidate'
    )
    is_active = models.BooleanField(_('Is Active'), default=True)
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_email_templates',
        verbose_name=_('Created By')
    )

    class Meta:
        verbose_name = _('Email Template')
        verbose_name_plural = _('Email Templates')
        ordering = ['name']

    def __str__(self):
        return self.name


class EmailCampaign(models.Model):
    """Stores email campaigns and their status"""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('scheduled', 'Scheduled'),
        ('sending', 'Sending'),
        ('sent', 'Sent'),
        ('cancelled', 'Cancelled'),
    ]
    
    name = models.CharField(_('Campaign Name'), max_length=200)
    template = models.ForeignKey(
        EmailTemplate,
        on_delete=models.CASCADE,
        related_name='campaigns',
        verbose_name=_('Email Template')
    )
    status = models.CharField(
        _('Status'),
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft'
    )
    scheduled_time = models.DateTimeField(
        _('Scheduled Time'),
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_campaigns',
        verbose_name=_('Created By')
    )

    class Meta:
        verbose_name = _('Email Campaign')
        verbose_name_plural = _('Email Campaigns')
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class EmailRecipient(models.Model):
    """Stores recipients for email campaigns"""
    email = models.EmailField(_('Email Address'))
    first_name = models.CharField(_('First Name'), max_length=100, blank=True)
    last_name = models.CharField(_('Last Name'), max_length=100, blank=True)
    is_active = models.BooleanField(_('Is Active'), default=True)
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)

    class Meta:
        verbose_name = _('Email Recipient')
        verbose_name_plural = _('Email Recipients')
        ordering = ['email']
        unique_together = ['email']

    def __str__(self):
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name} <{self.email}>"
        return self.email


class EmailLog(models.Model):
    """Logs all sent emails"""
    STATUS_CHOICES = [
        ('sent', 'Sent'),
        ('delivered', 'Delivered'),
        ('opened', 'Opened'),
        ('clicked', 'Clicked'),
        ('bounced', 'Bounced'),
        ('failed', 'Failed'),
    ]
    
    campaign = models.ForeignKey(
        EmailCampaign,
        on_delete=models.CASCADE,
        related_name='emails',
        verbose_name=_('Campaign'),
        null=True,
        blank=True
    )
    recipient = models.ForeignKey(
        EmailRecipient,
        on_delete=models.CASCADE,
        related_name='emails',
        verbose_name=_('Recipient')
    )
    subject = models.CharField(_('Subject'), max_length=200)
    status = models.CharField(
        _('Status'),
        max_length=20,
        choices=STATUS_CHOICES,
        default='sent'
    )
    sent_at = models.DateTimeField(_('Sent At'), auto_now_add=True)
    delivered_at = models.DateTimeField(_('Delivered At'), null=True, blank=True)
    opened_at = models.DateTimeField(_('Opened At'), null=True, blank=True)
    error_message = models.TextField(_('Error Message'), blank=True)
    message_id = models.CharField(
        _('Message ID'),
        max_length=255,
        blank=True,
        help_text=_('Unique identifier from the email service')
    )

    class Meta:
        verbose_name = _('Email Log')
        verbose_name_plural = _('Email Logs')
        ordering = ['-sent_at']
        indexes = [
            models.Index(fields=['message_id']),
            models.Index(fields=['status']),
            models.Index(fields=['sent_at']),
        ]

    def __str__(self):
        return f"{self.subject} to {self.recipient.email}"
