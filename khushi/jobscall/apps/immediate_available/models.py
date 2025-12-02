from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model

User = get_user_model()


class ImmediateAvailableProfile(models.Model):
    """Stores information about candidates who are immediately available"""
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='immediate_available_profile',
        verbose_name=_('User')
    )
    is_immediately_available = models.BooleanField(
        _('Is Immediately Available'),
        default=False,
        help_text=_('Whether the candidate is immediately available for work')
    )
    available_from = models.DateField(
        _('Available From'),
        null=True,
        blank=True,
        help_text=_('Date from which the candidate is available')
    )
    notice_period = models.PositiveIntegerField(
        _('Notice Period (Days)'),
        default=0,
        help_text=_('Notice period in days')
    )
    current_ctc = models.DecimalField(
        _('Current CTC (LPA)'),
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text=_('Current CTC in Lakhs Per Annum')
    )
    expected_ctc = models.DecimalField(
        _('Expected CTC (LPA)'),
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text=_('Expected CTC in Lakhs Per Annum')
    )
    preferred_locations = models.JSONField(
        _('Preferred Locations'),
        default=list,
        blank=True,
        help_text=_('List of preferred work locations')
    )
    skills = models.JSONField(
        _('Skills'),
        default=list,
        blank=True,
        help_text=_('List of skills the candidate possesses')
    )
    experience_years = models.PositiveIntegerField(
        _('Years of Experience'),
        default=0
    )
    experience_months = models.PositiveIntegerField(
        _('Months of Experience'),
        default=0
    )
    current_company = models.CharField(
        _('Current Company'),
        max_length=255,
        blank=True,
        null=True
    )
    current_designation = models.CharField(
        _('Current Designation'),
        max_length=255,
        blank=True,
        null=True
    )
    last_working_day = models.DateField(
        _('Last Working Day'),
        null=True,
        blank=True
    )
    is_serving_notice = models.BooleanField(
        _('Is Serving Notice Period'),
        default=False
    )
    notice_period_negotiable = models.BooleanField(
        _('Notice Period Negotiable'),
        default=False
    )
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)

    class Meta:
        verbose_name = _('Immediate Available Profile')
        verbose_name_plural = _('Immediate Available Profiles')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.get_full_name()} - {'Available' if self.is_immediately_available else 'Not Available'}"
