from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from .models import ImmediateAvailableProfile


@admin.register(ImmediateAvailableProfile)
class ImmediateAvailableProfileAdmin(admin.ModelAdmin):
    list_display = (
        'user',
        'is_immediately_available',
        'available_from',
        'current_company',
        'current_designation',
        'experience_years',
        'created_at'
    )
    list_filter = (
        'is_immediately_available',
        'is_serving_notice',
        'notice_period_negotiable',
        'created_at'
    )
    search_fields = (
        'user__first_name',
        'user__last_name',
        'user__email',
        'current_company',
        'current_designation',
        'skills'
    )
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (_('User Information'), {
            'fields': (
                'user',
                'is_immediately_available',
                'available_from',
                'last_working_day'
            )
        }),
        (_('Current Employment'), {
            'fields': (
                'current_company',
                'current_designation',
                'is_serving_notice',
                'notice_period',
                'notice_period_negotiable'
            )
        }),
        (_('Compensation'), {
            'fields': (
                'current_ctc',
                'expected_ctc',
            )
        }),
        (_('Experience & Skills'), {
            'fields': (
                'experience_years',
                'experience_months',
                'skills',
                'preferred_locations'
            )
        }),
        (_('Metadata'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')
