from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import ResumeEnhancement, ResumeEnhancementFeedback


class ResumeEnhancementFeedbackInline(admin.StackedInline):
    """Inline admin for resume enhancement feedback"""
    model = ResumeEnhancementFeedback
    extra = 0
    fields = ('rating', 'comments', 'would_recommend')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(ResumeEnhancement)
class ResumeEnhancementAdmin(admin.ModelAdmin):
    """Admin for ResumeEnhancement model"""
    list_display = ('id', 'user_email', 'enhancement_type', 'status', 'score_before', 'score_after', 'created_at')
    list_filter = ('status', 'enhancement_type', 'created_at')
    search_fields = ('user__email', 'job_title')
    readonly_fields = ('created_at', 'updated_at', 'completed_at')
    inlines = [ResumeEnhancementFeedbackInline]
    
    fieldsets = (
        (None, {
            'fields': ('user', 'enhancement_type', 'status')
        }),
        (_('Resume Files'), {
            'fields': ('original_resume', 'enhanced_resume')
        }),
        (_('Scores & Improvements'), {
            'fields': ('score_before', 'score_after', 'improvements')
        }),
        (_('Job Details'), {
            'fields': ('job_title', 'job_description'),
            'classes': ('collapse',)
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at', 'completed_at'),
            'classes': ('collapse',)
        }),
    )
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = _('User Email')
    user_email.admin_order_field = 'user__email'
    
    def get_queryset(self, request):
        """Optimize queryset"""
        return super().get_queryset(request).select_related('user')


@admin.register(ResumeEnhancementFeedback)
class ResumeEnhancementFeedbackAdmin(admin.ModelAdmin):
    """Admin for ResumeEnhancementFeedback model"""
    list_display = ('id', 'enhancement', 'rating', 'would_recommend', 'created_at')
    list_filter = ('rating', 'would_recommend', 'created_at')
    search_fields = ('enhancement__user__email', 'comments')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        (None, {
            'fields': ('enhancement', 'rating', 'would_recommend')
        }),
        (_('Comments'), {
            'fields': ('comments',)
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        """Optimize queryset"""
        return super().get_queryset(request).select_related('enhancement', 'enhancement__user')
