from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class IvrDashboardPanel(models.Model):
    """Model for storing user-specific IVR dashboard panel configurations"""
    PANEL_TYPES = [
        ('call_metrics', 'Call Metrics'),
        ('call_volume', 'Call Volume'),
        ('call_duration', 'Call Duration'),
        ('call_status', 'Call Status Distribution'),
        ('top_callers', 'Top Callers'),
        ('recent_calls', 'Recent Calls'),
        ('ivr_performance', 'IVR Performance'),
        ('custom', 'Custom'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='ivr_dashboard_panels',
        verbose_name=_('User')
    )
    name = models.CharField(
        _('Panel Name'),
        max_length=100,
        help_text=_('Name of the dashboard panel')
    )
    
    panel_type = models.CharField(
        _('Panel Type'),
        max_length=50,
        choices=PANEL_TYPES
    )
    title = models.CharField(_('Title'), max_length=100)
    description = models.TextField(_('Description'), blank=True)
    
    # Position and size
    row = models.PositiveSmallIntegerField(_('Row'), default=0)
    col = models.PositiveSmallIntegerField(_('Column'), default=0)
    size_x = models.PositiveSmallIntegerField(_('Width'), default=4)
    size_y = models.PositiveSmallIntegerField(_('Height'), default=4)
    
    # Configuration
    config = models.JSONField(_('Configuration'), default=dict, blank=True)
    refresh_interval = models.PositiveIntegerField(
        _('Refresh Interval (seconds)'),
        default=60,
        help_text=_('How often to refresh the panel data (in seconds). 0 = no refresh')
    )
    
    # Display options
    is_visible = models.BooleanField(_('Is Visible'), default=True)
    order = models.PositiveSmallIntegerField(_('Order'), default=0)
    
    # Timestamps
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    
    class Meta:
        verbose_name = _('IVR Dashboard Panel')
        verbose_name_plural = _('IVR Dashboard Panels')
        ordering = ['user', 'order', 'title']
        unique_together = ['user', 'panel_type', 'title']
    
    def __str__(self):
        return f"{self.user.email}'s {self.get_panel_type_display()}: {self.title}"


class IvrDashboardFilter(models.Model):
    """Model for storing user-specific IVR dashboard filters"""
    FILTER_TYPES = [
        ('date_range', 'Date Range'),
        ('call_status', 'Call Status'),
        ('call_direction', 'Call Direction'),
        ('phone_number', 'Phone Number'),
        ('ivr_menu', 'IVR Menu'),
        ('custom', 'Custom'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='ivr_dashboard_filters',
        verbose_name=_('User')
    )
    name = models.CharField(_('Filter Name'), max_length=100)
    filter_type = models.CharField(
        _('Filter Type'),
        max_length=50,
        choices=FILTER_TYPES
    )
    
    # Filter configuration
    is_global = models.BooleanField(
        _('Apply Globally'),
        default=False,
        help_text=_('Apply this filter to all dashboard panels')
    )
    is_default = models.BooleanField(
        _('Default Filter'),
        default=False,
        help_text=_('Use this as the default filter for the dashboard')
    )
    
    # Filter values
    filter_values = models.JSONField(_('Filter Values'), default=dict, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    
    class Meta:
        verbose_name = _('IVR Dashboard Filter')
        verbose_name_plural = _('IVR Dashboard Filters')
        ordering = ['user', 'name']
        unique_together = ['user', 'name']
    
    def __str__(self):
        return f"{self.user.email}'s {self.get_filter_type_display()}: {self.name}"


class IvrDashboardLayout(models.Model):
    """Model for storing user-specific IVR dashboard layouts"""
    LAYOUT_TYPES = [
        ('default', 'Default'),
        ('analyst', 'Analyst'),
        ('manager', 'Manager'),
        ('executive', 'Executive'),
        ('custom', 'Custom'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='ivr_dashboard_layouts',
        verbose_name=_('User')
    )
    name = models.CharField(_('Layout Name'), max_length=100)
    layout_type = models.CharField(
        _('Layout Type'),
        max_length=20,
        choices=LAYOUT_TYPES,
        default='custom'
    )
    
    # Layout configuration
    is_default = models.BooleanField(
        _('Default Layout'),
        default=False,
        help_text=_('Use this as the default layout for the dashboard')
    )
    
    # Layout data (grid configuration, panel positions, etc.)
    layout_data = models.JSONField(_('Layout Data'), default=dict, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    
    class Meta:
        verbose_name = _('IVR Dashboard Layout')
        verbose_name_plural = _('IVR Dashboard Layouts')
        ordering = ['user', 'name']
        unique_together = ['user', 'name']
    
    def __str__(self):
        return f"{self.user.email}'s {self.get_layout_type_display()} Layout: {self.name}"


class IvrDashboardUserSettings(models.Model):
    """Model for storing user-specific IVR dashboard settings"""
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='ivr_dashboard_settings',
        verbose_name=_('User')
    )
    
    # Display settings
    theme = models.CharField(
        _('Theme'),
        max_length=20,
        default='light',
        choices=[
            ('light', 'Light'),
            ('dark', 'Dark'),
            ('system', 'System Default')
        ]
    )
    
    # Default view settings
    default_layout = models.ForeignKey(
        IvrDashboardLayout,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='default_for_users',
        verbose_name=_('Default Layout')
    )
    
    # Notification settings
    email_notifications = models.BooleanField(
        _('Email Notifications'),
        default=True,
        help_text=_('Receive email notifications for important dashboard events')
    )
    
    # Data refresh settings
    auto_refresh = models.BooleanField(
        _('Auto Refresh'),
        default=True,
        help_text=_('Automatically refresh dashboard data')
    )
    refresh_interval = models.PositiveIntegerField(
        _('Refresh Interval (seconds)'),
        default=300,
        help_text=_('How often to refresh dashboard data (in seconds)')
    )
    
    # Timestamps
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    
    class Meta:
        verbose_name = _('IVR Dashboard User Settings')
        verbose_name_plural = _('IVR Dashboard User Settings')
    
    def __str__(self):
        return f"{self.user.email}'s IVR Dashboard Settings"


class IvrDashboardSharedView(models.Model):
    """Model for storing shared dashboard views"""
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='shared_ivr_dashboard_views',
        verbose_name=_('Created By')
    )
    
    name = models.CharField(_('View Name'), max_length=100)
    description = models.TextField(_('Description'), blank=True)
    
    # View configuration
    is_public = models.BooleanField(
        _('Is Public'),
        default=False,
        help_text=_('Make this view available to all users')
    )
    
    # View data (layout, filters, etc.)
    view_data = models.JSONField(_('View Data'), default=dict, blank=True)
    
    # Access control
    shared_with = models.ManyToManyField(
        User,
        related_name='accessible_ivr_dashboard_views',
        verbose_name=_('Shared With'),
        blank=True
    )
    
    # Share token for public access
    share_token = models.UUIDField(
        _('Share Token'),
        unique=True,
        blank=True,
        null=True,
        help_text=_('Unique token for public sharing of this view')
    )
    
    # Timestamps
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    
    class Meta:
        verbose_name = _('IVR Dashboard Shared View')
        verbose_name_plural = _('IVR Dashboard Shared Views')
        ordering = ['-created_at']
        unique_together = ['created_by', 'name']
    
    def __str__(self):
        return f"{self.name} (Shared by {self.created_by.email})"
