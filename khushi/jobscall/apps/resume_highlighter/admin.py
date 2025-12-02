from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import ResumeHighlight, ResumeAnalysis


class ResumeHighlightInline(admin.TabularInline):
    """Inline admin for resume highlights"""
    model = ResumeHighlight
    extra = 1
    fields = ('text', 'highlight_type', 'comment', 'suggested_improvement', 'created_by')
    readonly_fields = ('created_by',)
    
    def get_queryset(self, request):
        """Optimize queryset"""
        return super().get_queryset(request).select_related('created_by')


@admin.register(ResumeAnalysis)
class ResumeAnalysisAdmin(admin.ModelAdmin):
    """Admin for ResumeAnalysis model"""
    list_display = ('id', 'application', 'overall_score', 'is_auto_generated', 'created_at')
    list_filter = ('is_auto_generated', 'created_at')
    search_fields = ('application__id', 'application__candidate__email')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [ResumeHighlightInline]
    
    fieldsets = (
        (None, {
            'fields': ('application', 'overall_score', 'is_auto_generated', 'analyzed_by')
        }),
        (_('Analysis Details'), {
            'fields': ('strengths_summary', 'weaknesses_summary')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        """Optimize queryset"""
        return super().get_queryset(request).select_related(
            'application', 'application__candidate', 'analyzed_by'
        )


@admin.register(ResumeHighlight)
class ResumeHighlightAdmin(admin.ModelAdmin):
    """Admin for ResumeHighlight model"""
    list_display = ('id', 'get_application_id', 'highlight_type', 'text_preview', 'created_by')
    list_filter = ('highlight_type', 'created_at')
    search_fields = ('text', 'comment', 'suggested_improvement')
    readonly_fields = ('created_at', 'updated_at', 'created_by')
    
    fieldsets = (
        (None, {
            'fields': ('analysis', 'highlight_type', 'text')
        }),
        (_('Feedback'), {
            'fields': ('comment', 'suggested_improvement')
        }),
        (_('Metadata'), {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_application_id(self, obj):
        """Get the application ID for display in the list"""
        return obj.analysis.application.id if hasattr(obj, 'analysis') and hasattr(obj.analysis, 'application') else None
    get_application_id.short_description = _('Application ID')
    get_application_id.admin_order_field = 'analysis__application__id'
    
    def text_preview(self, obj):
        """Display a preview of the highlighted text"""
        return obj.text[:100] + '...' if len(obj.text) > 100 else obj.text
    text_preview.short_description = _('Text Preview')
    
    def get_queryset(self, request):
        """Optimize queryset"""
        return super().get_queryset(request).select_related('analysis', 'analysis__application', 'created_by')
    
    def save_model(self, request, obj, form, change):
        """Set the created_by user when creating a new highlight"""
        if not change:  # Only set created_by when creating a new object
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
