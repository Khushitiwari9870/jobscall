from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import SavedSearch


@admin.register(SavedSearch)
class SavedSearchAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'search_type', 'is_active', 'email_alerts', 'last_run', 'total_results')
    list_filter = ('search_type', 'is_active', 'email_alerts', 'created_at')
    search_fields = ('name', 'user__email', 'query', 'location')
    list_select_related = ('user',)
    date_hierarchy = 'created_at'
    
    fieldsets = (
        (_('Search Information'), {
            'fields': ('user', 'name', 'search_type', 'is_active')
        }),
        (_('Search Parameters'), {
            'fields': ('query', 'location', 'experience', 'salary', 'job_type', 'skills', 'company')
        }),
        (_('Email Alerts'), {
            'fields': ('email_alerts', 'alert_frequency', 'last_alert_sent')
        }),
        (_('Metadata'), {
            'fields': ('created_at', 'updated_at', 'last_run', 'total_results', 'new_since_last_alert'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at', 'last_run', 'total_results', 'new_since_last_alert')
    
    def get_queryset(self, request):
        """Optimize database queries"""
        return super().get_queryset(request).select_related('user')
    
    def has_add_permission(self, request):
        """Disable adding saved searches from admin"""
        return False
    
    def has_change_permission(self, request, obj=None):
        """Only allow changing specific fields"""
        return request.user.is_superuser
    
    def has_delete_permission(self, request, obj=None):
        """Only superusers can delete saved searches"""
        return request.user.is_superuser
