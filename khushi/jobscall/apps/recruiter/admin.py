from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from .models import (
    RecruiterProfile, 
    RecruiterMembership,
    JobPosting,
    CandidateSearch,
    RecruiterActivity
)


class RecruiterProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'company', 'job_title', 'is_verified', 'is_active')
    list_filter = ('is_verified', 'is_active', 'company')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'job_title')
    list_select_related = ('user', 'company')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (_('Personal Information'), {
            'fields': ('user', 'company', 'job_title', 'phone')
        }),
        (_('Status'), {
            'fields': ('is_verified', 'is_active')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


class RecruiterMembershipAdmin(admin.ModelAdmin):
    list_display = ('recruiter', 'tier', 'job_postings_remaining', 'expires_at', 'is_active')
    list_filter = ('tier', 'is_active')
    search_fields = ('recruiter__user__email', 'recruiter__user__first_name', 'recruiter__user__last_name')
    list_select_related = ('recruiter__user', 'recruiter__company')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (_('Membership Details'), {
            'fields': ('recruiter', 'tier', 'expires_at', 'is_active')
        }),
        (_('Usage Limits'), {
            'fields': ('job_postings_remaining', 'candidate_views_remaining')
        }),
        (_('Permissions'), {
            'fields': ('can_contact_candidates', 'can_use_ats')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


class JobPostingAdmin(admin.ModelAdmin):
    list_display = ('job', 'recruiter', 'status', 'is_featured', 'views', 'applications', 'published_at')
    list_filter = ('status', 'is_featured', 'is_urgent')
    search_fields = ('job__title', 'recruiter__user__email')
    list_select_related = ('job', 'recruiter__user', 'recruiter__company')
    readonly_fields = ('created_at', 'updated_at', 'published_at', 'closed_at', 'views', 'applications')
    fieldsets = (
        (_('Job Details'), {
            'fields': ('job', 'recruiter')
        }),
        (_('Status'), {
            'fields': ('status', 'is_featured', 'is_urgent')
        }),
        (_('Statistics'), {
            'fields': ('views', 'applications')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at', 'published_at', 'closed_at'),
            'classes': ('collapse',)
        }),
    )


class CandidateSearchAdmin(admin.ModelAdmin):
    list_display = ('name', 'recruiter', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'recruiter__user__email')
    list_select_related = ('recruiter__user', 'recruiter__company')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (_('Search Details'), {
            'fields': ('name', 'recruiter', 'is_active')
        }),
        (_('Search Parameters'), {
            'fields': ('search_parameters',)
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


class RecruiterActivityAdmin(admin.ModelAdmin):
    list_display = ('recruiter', 'activity_type', 'created_at')
    list_filter = ('activity_type', 'created_at')
    search_fields = ('recruiter__user__email', 'activity_type')
    list_select_related = ('recruiter__user', 'recruiter__company')
    readonly_fields = ('created_at',)
    fieldsets = (
        (_('Activity Details'), {
            'fields': ('recruiter', 'activity_type')
        }),
        (_('Additional Information'), {
            'fields': ('details', 'ip_address', 'user_agent')
        }),
        (_('Timestamp'), {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    date_hierarchy = 'created_at'


# Register models with admin site
admin.site.register(RecruiterProfile, RecruiterProfileAdmin)
admin.site.register(RecruiterMembership, RecruiterMembershipAdmin)
admin.site.register(JobPosting, JobPostingAdmin)
admin.site.register(CandidateSearch, CandidateSearchAdmin)
admin.site.register(RecruiterActivity, RecruiterActivityAdmin)
