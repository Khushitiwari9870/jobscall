from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import Job, JobApplication


class JobApplicationInline(admin.TabularInline):
    model = JobApplication
    extra = 0
    fields = ('applicant', 'status', 'applied_at', 'view_application')
    readonly_fields = ('applicant', 'status', 'applied_at', 'view_application')
    
    def view_application(self, obj):
        url = reverse('admin:jobs_jobapplication_change', args=[obj.id])
        return format_html('<a href="{}">View Application</a>', url)
    view_application.short_description = 'Actions'


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = (
        'title', 
        'company', 
        'location', 
        'employment_type', 
        'experience',
        'salary_range',
        'application_count',
        'status',
        'created_at',
        'is_published'
    )
    
    list_filter = (
        'employment_type', 
        'experience',
        'status',  # Using status for filtering
        'created_at',
        'application_deadline'
    )
    
    def is_published(self, obj):
        return obj.status == 'published'
    is_published.boolean = True
    is_published.short_description = 'Published'
    
    # Add status to list_editable to allow changing status directly from list view
    list_editable = ('status',)
    
    # Add status to fieldsets to control how it's displayed in the edit form
    fieldsets = (
        ('Job Information', {
            'fields': (
                'company',
                'title',
                'description',
                'requirements',
                'skills_required',
                'location',
                'min_salary',
                'max_salary',
            )
        }),
        ('Job Details', {
            'fields': (
                'employment_type',
                'experience',
                'category',
                'status',
                'is_remote',
                'application_deadline',
            )
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    # Make status filter more user-friendly
    list_filter = (
        'status',
        'employment_type',
        'experience',
        'category',
        'is_remote',
        'created_at',
        'application_deadline',
    )
    
    search_fields = (
        'title', 
        'company__name', 
        'location',
        'description',
        'skills_required'
    )
    
    list_per_page = 20
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at', 'updated_at', 'application_count')
    filter_horizontal = ()
    inlines = [JobApplicationInline]
    
    fieldsets = (
        ('Job Information', {
            'fields': (
                'title', 
                'company', 
                'description', 
                'requirements',
                'skills_required',
                'category'
            )
        }),
        ('Job Details', {
            'fields': (
                'location',
                'employment_type',
                'experience',
                ('min_salary', 'max_salary'),
                'vacancy',
                'application_deadline'
            )
        }),
        ('Status', {
            'fields': (
                'status',
                'created_at',
                'updated_at',
                'application_count'
            )
        }),
    )
    
    def salary_range(self, obj):
        if obj.min_salary and obj.max_salary:
            return f"₹{obj.min_salary:,} - ₹{obj.max_salary:,}"
        elif obj.min_salary:
            return f"From ₹{obj.min_salary:,}"
        elif obj.max_salary:
            return f"Up to ₹{obj.max_salary:,}"
        return "Not specified"
    salary_range.short_description = 'Salary Range'
    
    def application_count(self, obj):
        return obj.job_applications.count()
    application_count.short_description = 'Applications'


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'job_title',
        'applicant_email',
        'status',
        'applied_at',
        
    )
    
    list_filter = (
        'status',
        'applied_at',
        
    )
    
    search_fields = (
        'job__title',
        'applicant__email',
    )
    
    readonly_fields = (
        'applied_at',
        'updated_at',
    )
    
    fieldsets = (
        ('Application Details', {
            'fields': (
                'job_link',
                'applicant_link',
                'status',
                'cover_letter',
                'resume',
                'view_resume',
                'applied_at',
                'updated_at'
            )
        }),
    )
    
    def job_title(self, obj):
        return obj.job.title
    job_title.short_description = 'Job Title'
    job_title.admin_order_field = 'job__title'
    
    def applicant_name(self, obj):
        return obj.applicant.get_full_name() or obj.applicant.username
    applicant_name.short_description = 'Applicant'
    
    def applicant_email(self, obj):
        return obj.applicant.email
    applicant_email.short_description = 'Email'
    
    def view_resume(self, obj):
        if obj.resume:
            return mark_safe(f'<a href="{obj.resume.url}" target="_blank">View Resume</a>')
        return "No resume uploaded"
    view_resume.short_description = 'Resume'
    
    def job_link(self, obj):
        url = reverse('admin:jobs_job_change', args=[obj.job.id])
        return mark_safe(f'<a href="{url}">{obj.job.title}</a>')
    job_link.short_description = 'Job'
    
    def applicant_link(self, obj):
        url = reverse('admin:users_user_change', args=[obj.applicant.id])
        return mark_safe(f'<a href="{url}">{obj.applicant.get_full_name() or obj.applicant.username}</a>')
    applicant_link.short_description = 'Applicant'
