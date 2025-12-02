from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import ResumeCheck, ResumeIssue, ResumeCheckSettings

class ResumeIssueInline(admin.TabularInline):
    model = ResumeIssue
    extra = 0
    readonly_fields = ('created_at', 'updated_at')
    fields = ('issue_type', 'priority', 'title', 'is_resolved', 'created_at')
    ordering = ('-priority', 'created_at')

@admin.register(ResumeCheck)
class ResumeCheckAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'original_filename', 'overall_score', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__email', 'original_filename', 'analysis')
    readonly_fields = ('created_at', 'updated_at', 'file_size')
    inlines = [ResumeIssueInline]
    
    fieldsets = (
        (None, {
            'fields': ('user', 'resume_file', 'original_filename', 'file_size')
        }),
        (_('Results'), {
            'fields': ('overall_score', 'status', 'analysis')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at', 'completed_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(ResumeIssue)
class ResumeIssueAdmin(admin.ModelAdmin):
    list_display = ('title', 'resume_check', 'issue_type', 'priority', 'is_resolved', 'created_at')
    list_filter = ('issue_type', 'priority', 'is_resolved', 'created_at')
    search_fields = ('title', 'description', 'resume_check__original_filename')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        (None, {
            'fields': ('resume_check', 'issue_type', 'priority', 'is_resolved')
        }),
        (_('Issue Details'), {
            'fields': ('title', 'description', 'location', 'suggestion')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(ResumeCheckSettings)
class ResumeCheckSettingsAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'created_at')
    list_editable = ('is_active',)
    search_fields = ('name', 'description')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        (None, {
            'fields': ('name', 'is_active', 'description')
        }),
        (_('Setting Value'), {
            'fields': ('value',),
            'description': _('Enter a valid JSON value')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def has_delete_permission(self, request, obj=None):
        # Prevent deletion of active settings
        if obj and obj.is_active:
            return False
        return super().has_delete_permission(request, obj)
