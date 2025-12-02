from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from django.urls import reverse

from .models import IvrVerification, IvrCallLog


@admin.register(IvrVerification)
class IvrVerificationAdmin(admin.ModelAdmin):
    """Admin interface for IvrVerification model"""
    list_display = (
        'id', 'user_email', 'phone_number', 'method_display', 
        'status_display', 'is_successful', 'attempts', 'created_at', 'expires_at'
    )
    list_filter = ('status', 'method', 'is_successful', 'created_at')
    search_fields = ('user__email', 'phone_number', 'verification_code')
    readonly_fields = (
        'user', 'phone_number', 'method', 'status', 'attempts', 'is_successful',
        'created_at', 'updated_at', 'verified_at', 'expires_at', 'ip_address',
        'user_agent', 'failure_reason', 'verification_code'
    )
    date_hierarchy = 'created_at'
    
    fieldsets = (
        (_('User Information'), {
            'fields': ('user', 'phone_number', 'verification_code')
        }),
        (_('Verification Details'), {
            'fields': ('method', 'status', 'attempts', 'is_successful', 'failure_reason')
        }),
        (_('Metadata'), {
            'fields': ('ip_address', 'user_agent'),
            'classes': ('collapse',)
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at', 'verified_at', 'expires_at'),
            'classes': ('collapse',)
        }),
    )
    
    def user_email(self, obj):
        """Display user email with link to admin"""
        if obj.user:
            url = reverse('admin:users_user_change', args=[obj.user.id])
            return format_html('<a href="{}">{}</a>', url, obj.user.email)
        return "-"
    user_email.short_description = _('User')
    user_email.admin_order_field = 'user__email'
    
    def method_display(self, obj):
        """Display method with icon"""
        method_icons = {
            'call': '📞',
            'sms': '💬',
            'whatsapp': '💬',
        }
        icon = method_icons.get(obj.method, '🔹')
        return f"{icon} {obj.get_method_display()}"
    method_display.short_description = _('Method')
    
    def status_display(self, obj):
        """Display status with color"""
        status_colors = {
            'pending': 'orange',
            'in_progress': 'blue',
            'completed': 'green',
            'failed': 'red',
        }
        color = status_colors.get(obj.status, 'gray')
        return format_html(
            '<span style="color: {};">●</span> {}',
            color,
            obj.get_status_display()
        )
    status_display.short_description = _('Status')
    status_display.admin_order_field = 'status'
    
    def has_add_permission(self, request):
        """Disable adding verifications from admin"""
        return False


@admin.register(IvrCallLog)
class IvrCallLogAdmin(admin.ModelAdmin):
    """Admin interface for IvrCallLog model"""
    list_display = (
        'call_sid_short', 'from_number', 'to_number', 'status_display',
        'duration_seconds', 'created_at', 'started_at', 'ended_at'
    )
    list_filter = ('status', 'created_at', 'started_at')
    search_fields = ('call_sid', 'from_number', 'to_number')
    readonly_fields = ('call_sid', 'from_number', 'to_number', 'status', 'duration',
                     'recording_url', 'created_at', 'updated_at', 'started_at',
                     'ended_at', 'price', 'price_unit', 'error_message', 'verification_link')
    date_hierarchy = 'created_at'
    
    fieldsets = (
        (_('Call Information'), {
            'fields': ('call_sid', 'verification_link', 'from_number', 'to_number', 'status')
        }),
        (_('Call Details'), {
            'fields': ('duration', 'recording_url', 'price', 'price_unit')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at', 'started_at', 'ended_at'),
            'classes': ('collapse',)
        }),
        (_('Error Information'), {
            'fields': ('error_message',),
            'classes': ('collapse',)
        }),
    )
    
    def call_sid_short(self, obj):
        """Display shortened call SID"""
        return obj.call_sid[:8] + '...' if obj.call_sid else "-"
    call_sid_short.short_description = _('Call SID')
    call_sid_short.admin_order_field = 'call_sid'
    
    def status_display(self, obj):
        """Display status with color"""
        status_colors = {
            'queued': 'orange',
            'initiated': 'blue',
            'in_progress': 'blue',
            'completed': 'green',
            'failed': 'red',
            'busy': 'red',
            'no_answer': 'red',
        }
        color = status_colors.get(obj.status, 'gray')
        return format_html(
            '<span style="color: {};">●</span> {}',
            color,
            obj.get_status_display()
        )
    status_display.short_description = _('Status')
    status_display.admin_order_field = 'status'
    
    def duration_seconds(self, obj):
        """Display duration in seconds"""
        return f"{obj.duration}s" if obj.duration else "-"
    duration_seconds.short_description = _('Duration')
    duration_seconds.admin_order_field = 'duration'
    
    def verification_link(self, obj):
        """Display link to verification if available"""
        if obj.verification:
            url = reverse('admin:ivr_verification_ivrverification_change', args=[obj.verification.id])
            return format_html('<a href="{}">Verification #{}</a>', url, obj.verification.id)
        return "-"
    verification_link.short_description = _('Verification')
    verification_link.allow_tags = True
    
    def has_add_permission(self, request):
        """Disable adding call logs from admin"""
        return False
