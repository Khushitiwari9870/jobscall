from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import SearchLog, SavedSearch


class SearchResultFilter(admin.SimpleListFilter):
    title = 'results count'
    parameter_name = 'results_count'
    
    def lookups(self, request, model_admin):
        return [
            ('0', 'No results'),
            ('1-10', '1-10 results'),
            ('11-50', '11-50 results'),
            ('51-100', '51-100 results'),
            ('100+', '100+ results'),
        ]
    
    def queryset(self, request, queryset):
        value = self.value()
        if value == '0':
            return queryset.filter(results_count=0)
        elif value == '1-10':
            return queryset.filter(results_count__range=(1, 10))
        elif value == '11-50':
            return queryset.filter(results_count__range=(11, 50))
        elif value == '51-100':
            return queryset.filter(results_count__range=(51, 100))
        elif value == '100+':
            return queryset.filter(results_count__gt=100)
        return queryset


@admin.register(SearchLog)
class SearchLogAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'search_type_display',
        'query_display',
        'location_display',
        'experience_display',
        'results_count',
        'user_display',
        'created_at',
    )
    
    list_filter = (
        'search_type',
        SearchResultFilter,
        'created_at',
    )
    
    search_fields = (
        'query',
        'location',
        'experience',
        'user__username',
        'user__email',
        'ip_address',
    )
    
    readonly_fields = (
        'created_at',
        'updated_at',
        'ip_address',
        'user_agent',
        'referrer',
        'results_count',
    )
    
    date_hierarchy = 'created_at'
    list_per_page = 20
    
    fieldsets = (
        ('Search Details', {
            'fields': (
                'search_type',
                'query',
                'location',
                'experience',
                'salary',
                'job_type',
                'skills',
                'company',
                'posted_within',
                'walk_in',
                'work_from_home',
            )
        }),
        ('User Information', {
            'fields': (
                'user_display',
                'ip_address',
                'user_agent',
                'referrer',
            )
        }),
        ('Metadata', {
            'fields': (
                'results_count',
                'created_at',
                'updated_at',
            )
        }),
    )
    
    def search_type_display(self, obj):
        return obj.get_search_type_display()
    search_type_display.short_description = 'Type'
    
    def query_display(self, obj):
        return obj.query[:50] + ('...' if len(obj.query or '') > 50 else '')
    query_display.short_description = 'Query'
    
    def location_display(self, obj):
        return obj.location or '—'
    location_display.short_description = 'Location'
    
    def experience_display(self, obj):
        return obj.experience or '—'
    experience_display.short_description = 'Experience'
    
    def user_display(self, obj):
        if not obj.user:
            return 'Anonymous'
        url = reverse('admin:users_user_change', args=[obj.user.id])
        return mark_safe(f'<a href="{url}">{obj.user.email}</a>')
    user_display.short_description = 'User'
    user_display.admin_order_field = 'user__email'
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return True
    
    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


@admin.register(SavedSearch)
class SavedSearchAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'user_display',
        'is_active',
        'updated_at',
    )
    
    list_filter = (
        'is_active',
        'created_at',
        'updated_at',
    )
    
    search_fields = (
        'name',
        'user__username',
        'user__email',
        'search_params',
    )
    
    readonly_fields = (
        'created_at',
        'updated_at',
        'user_display',
        'search_params_prettified',
    )
    
    fieldsets = (
        ('Search Details', {
            'fields': (
                'name',
                'user_display',
                'is_active',
                'search_params_prettified',
            )
        }),
        ('Metadata', {
            'fields': (
                'created_at',
                'updated_at',
            )
        }),
    )
    
    def user_display(self, obj):
        url = reverse('admin:users_user_change', args=[obj.user.id])
        return mark_safe(f'<a href="{url}">{obj.user.email}</a>')
    user_display.short_description = 'User'
    user_display.admin_order_field = 'user__email'
    
    def search_params_prettified(self, obj):
        import json
        from pygments import highlight
        from pygments.lexers import JsonLexer
        from pygments.formatters import HtmlFormatter
        
        # Convert the search params to a pretty-printed JSON string
        response = json.dumps(obj.search_params, sort_keys=True, indent=2)
        
        # Truncate the data if it's too long
        if len(response) > 1000:
            response = response[:1000] + '... (truncated)'
            
        # Get the Pygments formatter
        formatter = HtmlFormatter(style='colorful')
        
        # Highlight the data
        response = highlight(
            response,
            JsonLexer(),
            formatter
        )
        
        # Add CSS styles
        style = "<style>" + formatter.get_style_defs() + "</style><br>"
        
        return mark_safe(style + response)
    
    search_params_prettified.short_description = 'Search Parameters'
    
    def has_add_permission(self, request):
        return False
