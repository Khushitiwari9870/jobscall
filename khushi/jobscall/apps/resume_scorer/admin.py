from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import ResumeScore, ScoreImprovement, ResumeScoreSettings

class ScoreImprovementInline(admin.TabularInline):
    model = ScoreImprovement
    extra = 0
    readonly_fields = ('created_at', 'updated_at')
    fields = ('category', 'priority', 'title', 'is_applied', 'created_at')
    ordering = ('-priority', 'category')

@admin.register(ResumeScore)
class ResumeScoreAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'original_filename', 'overall_score', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__email', 'original_filename', 'analysis')
    readonly_fields = ('created_at', 'updated_at', 'file_size')
    inlines = [ScoreImprovementInline]
    
    fieldsets = (
        (None, {
            'fields': ('user', 'resume_file', 'original_filename', 'file_size')
        }),
        (_('Scoring'), {
            'fields': ('overall_score', 'status', 'analysis')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(ScoreImprovement)
class ScoreImprovementAdmin(admin.ModelAdmin):
    list_display = ('title', 'resume_score', 'category', 'priority', 'is_applied', 'created_at')
    list_filter = ('category', 'priority', 'is_applied', 'created_at')
    search_fields = ('title', 'description', 'resume_score__original_filename')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        (None, {
            'fields': ('resume_score', 'category', 'priority', 'is_applied')
        }),
        (_('Improvement Details'), {
            'fields': ('title', 'description', 'example_before', 'example_after')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(ResumeScoreSettings)
class ResumeScoreSettingsAdmin(admin.ModelAdmin):
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
