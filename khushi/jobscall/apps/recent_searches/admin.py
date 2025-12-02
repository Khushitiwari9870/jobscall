from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from .models import RecentSearch


@admin.register(RecentSearch)
class RecentSearchAdmin(admin.ModelAdmin):
    """Admin interface for RecentSearch model"""
    list_display = ('user', 'search_type', 'truncated_query', 'created_at')
    list_filter = ('search_type', 'created_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'query')
    readonly_fields = ('created_at',)
    date_hierarchy = 'created_at'
    
    fieldsets = (
        (None, {
            'fields': ('user', 'search_type', 'query', 'filters')
        }),
        (_('Timestamps'), {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def truncated_query(self, obj):
        """Display a truncated version of the query"""
        return obj.query[:50] + '...' if obj.query and len(obj.query) > 50 else obj.query
    truncated_query.short_description = _('Query')
    
    def get_queryset(self, request):
        """Optimize queries by selecting related user"""
        return super().get_queryset(request).select_related('user')
