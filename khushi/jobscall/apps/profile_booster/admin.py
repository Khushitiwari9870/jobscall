from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import (
    ProfileBooster,
    BoosterRecommendation,
    BoosterProgress
)


class BoosterRecommendationInline(admin.TabularInline):
    """Inline admin for booster recommendations"""
    model = BoosterRecommendation
    extra = 1
    fields = ('category', 'priority', 'title', 'is_completed')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(ProfileBooster)
class ProfileBoosterAdmin(admin.ModelAdmin):
    """Admin for ProfileBooster model"""
    list_display = ('id', 'user_email', 'booster_type', 'status', 'score_before', 'score_after', 'created_at')
    list_filter = ('status', 'booster_type', 'created_at')
    search_fields = ('user__email',)
    readonly_fields = ('created_at', 'updated_at', 'completed_at')
    inlines = [BoosterRecommendationInline]
    
    fieldsets = (
        (None, {
            'fields': ('user', 'booster_type', 'status')
        }),
        (_('Scores'), {
            'fields': ('score_before', 'score_after', 'improvement_percentage')
        }),
        (_('Details'), {
            'fields': ('recommendations', 'applied_changes'),
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


@admin.register(BoosterRecommendation)
class BoosterRecommendationAdmin(admin.ModelAdmin):
    """Admin for BoosterRecommendation model"""
    list_display = ('id', 'booster_info', 'category', 'priority', 'title', 'is_completed')
    list_filter = ('category', 'priority', 'is_completed', 'created_at')
    search_fields = ('title', 'description', 'booster__user__email')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        (None, {
            'fields': ('booster', 'category', 'priority')
        }),
        (_('Content'), {
            'fields': ('title', 'description')
        }),
        (_('Actions'), {
            'fields': ('action_text', 'action_url', 'is_completed')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def booster_info(self, obj):
        return f"{obj.booster.user.email} - {obj.booster.get_booster_type_display()}"
    booster_info.short_description = _('Booster')
    
    def get_queryset(self, request):
        """Optimize queryset"""
        return super().get_queryset(request).select_related('booster', 'booster__user')


@admin.register(BoosterProgress)
class BoosterProgressAdmin(admin.ModelAdmin):
    """Admin for BoosterProgress model"""
    list_display = ('user_email', 'overall_score', 'completion_percentage', 'boost_count', 'last_boosted_at')
    search_fields = ('user__email',)
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        (None, {
            'fields': ('user', 'overall_score', 'completion_percentage')
        }),
        (_('Category Scores'), {
            'fields': (
                'personal_info_score',
                'experience_score',
                'education_score',
                'skills_score',
                'certifications_score'
            )
        }),
        (_('Statistics'), {
            'fields': ('boost_count', 'last_boosted_at')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
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
