from django.contrib import admin
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe

from .models import JobPosting, JobApplication, ApplicationNote


@admin.register(JobPosting)
class JobPostingAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'company', 'job_type', 'experience_level',
        'location', 'is_remote', 'status', 'is_featured',
        'created_at', 'applications_count', 'views_count',
        'admin_actions'
    ]
    list_filter = [
        'status', 'job_type', 'experience_level',
        'is_remote', 'is_featured', 'company', 'created_at'
    ]
    search_fields = ['title', 'description', 'company__name']
    list_select_related = ['company', 'posted_by']
    date_hierarchy = 'created_at'
    
    def get_readonly_fields(self, request, obj=None):
        # Always include these fields as read-only
        base_fields = ['created_at', 'updated_at', 'views_count', 'applications_count']
        
        # If the object exists, include these additional read-only fields
        if obj:
            base_fields.extend(['published_at', 'closed_at', 'expires_at'])
        
        # For non-superusers, make company and posted_by read-only
        if not request.user.is_superuser:
            base_fields.extend(['company', 'posted_by'])
            
        return base_fields
    fieldsets = [
        (_('Basic Information'), {
            'fields': [
                'title', 'company', 'description', 'requirements',
                'responsibilities', 'benefits'
            ]
        }),
        (_('Job Details'), {
            'fields': [
                'job_type', 'experience_level', 'location', 'is_remote',
                'min_salary', 'max_salary', 'salary_currency', 'salary_display'
            ]
        }),
        (_('Application Details'), {
            'fields': [
                'application_url', 'application_email',
                'application_instructions'
            ]
        }),
        (_('Status and Metadata'), {
            'fields': [
                'status', 'is_featured',
                'views_count', 'applications_count',
                'created_at', 'updated_at',
                'published_at', 'closed_at', 'expires_at',
                'posted_by'
            ]
        })
    ]
    
    def admin_actions(self, obj):
        return format_html(
            '<a class="button" href="{}">View Applications</a>',
            reverse('admin:job_posting_jobapplication_changelist') + f'?job_posting__id__exact={obj.id}'
        )
    admin_actions.short_description = _('Actions')
    admin_actions.allow_tags = True
    
    def get_queryset(self, request):
        qs = super().get_queryset(request).select_related('company', 'posted_by')
        # For non-superusers, only show their company's job postings
        if not request.user.is_superuser and hasattr(request.user, 'company_admin'):
            qs = qs.filter(company=request.user.company_admin.company)
        return qs
    
    def save_model(self, request, obj, form, change):
        # Set the posted_by user if not set
        if not obj.pk:
            obj.posted_by = request.user
        
        # Update timestamps based on status changes
        if 'status' in form.changed_data:
            if obj.status == 'published' and not obj.published_at:
                obj.published_at = timezone.now()
            elif obj.status == 'closed' and not obj.closed_at:
                obj.closed_at = timezone.now()
        
        # Set expires_at if not set and status is published
        if obj.status == 'published' and not obj.expires_at:
            obj.expires_at = timezone.now() + timezone.timedelta(days=30)  # Default 30 days
            
        super().save_model(request, obj, form, change)
    
    def get_queryset(self, request):
        qs = super().get_queryset(request).select_related('company', 'posted_by')
        # For non-superusers, only show their company's job postings
        if not request.user.is_superuser and hasattr(request.user, 'company_admin'):
            qs = qs.filter(company=request.user.company_admin.company)
        return qs
    
    def has_change_permission(self, request, obj=None):
        # Only allow superusers or the user who created the posting to edit it
        if obj and not request.user.is_superuser:
            return obj.posted_by == request.user
        return super().has_change_permission(request, obj)
    
    def has_delete_permission(self, request, obj=None):
        # Only allow superusers or the user who created the posting to delete it
        if obj and not request.user.is_superuser:
            return obj.posted_by == request.user
        return super().has_delete_permission(request, obj)
    
    def get_readonly_fields(self, request, obj=None):
        # Make certain fields read-only for non-superusers
        if not request.user.is_superuser:
            return self.readonly_fields + ('company', 'posted_by')
        return self.readonly_fields


class ApplicationNoteInline(admin.TabularInline):
    model = ApplicationNote
    extra = 0
    readonly_fields = ['created_by', 'created_at', 'updated_at']
    
    def has_add_permission(self, request, obj=None):
        return True
    
    def has_change_permission(self, request, obj=None):
        return False


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = [
        'applicant_name', 'job_title', 'company_name', 'status',
        'applied_at', 'is_reviewed', 'admin_actions'
    ]
    list_filter = [
        'status', 'is_reviewed', 'is_rejected', 'source',
        ('applied_at', admin.DateFieldListFilter)
    ]
    search_fields = [
        'applicant__first_name', 'applicant__last_name', 'applicant__email',
        'job_posting__title', 'job_posting__company__name'
    ]
    list_select_related = ['applicant', 'job_posting', 'job_posting__company']
    readonly_fields = ['applied_at', 'updated_at', 'reviewed_at']
    inlines = [ApplicationNoteInline]
    date_hierarchy = 'applied_at'
    
    fieldsets = [
        (_('Application Details'), {
            'fields': [
                'job_posting', 'applicant', 'status', 'source',
                'cover_letter', 'resume',
                'applied_at', 'updated_at', 'reviewed_at',
                'is_reviewed', 'is_rejected'
            ]
        })
    ]
    
    def applicant_name(self, obj):
        return f"{obj.applicant.get_full_name() or obj.applicant.email}"
    applicant_name.short_description = _('Applicant')
    applicant_name.admin_order_field = 'applicant__last_name'
    
    def job_title(self, obj):
        return obj.job_posting.title if obj.job_posting else ''
    job_title.short_description = _('Job Title')
    job_title.admin_order_field = 'job_posting__title'
    
    def company_name(self, obj):
        return obj.job_posting.company.name if obj.job_posting and obj.job_posting.company else ''
    company_name.short_description = _('Company')
    company_name.admin_order_field = 'job_posting__company__name'
    
    def admin_actions(self, obj):
        links = []
        if obj.resume:
            links.append(
                f'<a class="button" href="{obj.resume.url}" target="_blank">View Resume</a>'
            )
        links.append(
            f'<a class="button" href="{reverse("admin:job_posting_jobapplication_change", args=[obj.id])}">Edit</a>'
        )
        return format_html('&nbsp;'.join(links))
    admin_actions.short_description = _('Actions')
    admin_actions.allow_tags = True
    
    def get_queryset(self, request):
        qs = super().get_queryset(request).select_related(
            'job_posting', 'job_posting__company', 'applicant'
        )
        # For non-superusers, only show applications for their company's job postings
        if not request.user.is_superuser and hasattr(request.user, 'company_admin'):
            qs = qs.filter(job_posting__company=request.user.company_admin.company)
        return qs
    
    def save_model(self, request, obj, form, change):
        if 'status' in form.changed_data or 'is_reviewed' in form.changed_data:
            if obj.is_reviewed and not obj.reviewed_at:
                obj.reviewed_at = timezone.now()
        super().save_model(request, obj, form, change)
    
    def get_readonly_fields(self, request, obj=None):
        # Make certain fields read-only for non-superusers
        if not request.user.is_superuser:
            return self.readonly_fields + ('job_posting', 'applicant')
        return self.readonly_fields


@admin.register(ApplicationNote)
class ApplicationNoteAdmin(admin.ModelAdmin):
    list_display = ['application', 'created_by', 'created_at', 'truncated_note']
    list_filter = ['created_at']
    search_fields = ['note', 'application__job_posting__title', 'created_by__email']
    list_select_related = ['application', 'created_by']
    readonly_fields = ['created_at', 'updated_at']
    
    def truncated_note(self, obj):
        return obj.note[:100] + '...' if len(obj.note) > 100 else obj.note
    truncated_note.short_description = _('Note')
