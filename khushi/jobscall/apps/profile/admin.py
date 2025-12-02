from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import UserProfile, EmployerProfile

class BaseProfileAdmin(admin.ModelAdmin):
    list_per_page = 20
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at', 'updated_at', 'profile_completion')
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')

@admin.register(UserProfile)
class UserProfileAdmin(BaseProfileAdmin):
    list_display = (
        'user',
        'get_full_name',
        'phone_number',
        'current_company',
        'designation',
        'experience_years',
        'profile_completion',
        'is_profile_public',
        'created_at'
    )
    
    list_filter = (
        'is_profile_public',
        'gender',
        'city',
        'country',
    )
    
    search_fields = (
        'user__email',
        'user__first_name',
        'user__last_name',
        'phone_number',
        'current_company',
        'designation',
        'highest_qualification',
        'institute',
    )
    
    fieldsets = (
        (_('User Information'), {
            'fields': ('user', 'headline', 'date_of_birth', 'gender')
        }),
        (_('Contact Information'), {
            'fields': ('phone_number', 'address', 'city', 'state', 'country', 'pincode')
        }),
        (_('Professional Information'), {
            'fields': ('current_company', 'designation', 'experience_years', 'experience_months')
        }),
        (_('Education'), {
            'fields': ('highest_qualification', 'institute', 'year_of_passing')
        }),
        (_('Preferences'), {
            'fields': ('skills', 'preferred_locations', 'job_roles')
        }),
        (_('Profile Status'), {
            'fields': ('profile_completion', 'is_profile_public')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_full_name(self, obj):
        return obj.user.get_full_name()
    get_full_name.short_description = _('Full Name')
    get_full_name.admin_order_field = 'user__first_name'

@admin.register(EmployerProfile)
class EmployerProfileAdmin(BaseProfileAdmin):
    list_display = (
        'company_name',
        'contact_person_name',
        'user',
        'phone_number',
        'city',
        'country',
        'company_size',
        'is_profile_public',
        'created_at'
    )
    
    list_filter = (
        'is_profile_public',
        'company_size',
        'industry',
        'city',
        'country',
    )
    
    search_fields = (
        'company_name',
        'user__email',
        'contact_person_name',
        'phone_number',
        'company_website',
    )
    
    fieldsets = (
        (_('Company Information'), {
            'fields': ('user', 'company_name', 'company_website', 'company_logo', 'company_description')
        }),
        (_('Contact Information'), {
            'fields': ('contact_person_name', 'contact_person_designation', 'phone_number')
        }),
        (_('Address'), {
            'fields': ('address', 'city', 'state', 'country', 'pincode')
        }),
        (_('Company Details'), {
            'fields': ('company_size', 'industry')
        }),
        (_('Social Media'), {
            'fields': ('linkedin_url', 'twitter_url'),
            'classes': ('collapse',)
        }),
        (_('Profile Status'), {
            'fields': ('profile_completion', 'is_profile_public')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_full_name(self, obj):
        return obj.contact_person_name or obj.user.get_full_name()
    get_full_name.short_description = _('Contact Person')
