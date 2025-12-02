from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.db import models
from .models import CandidateSearchQuery, SavedSearch, SearchFilterOption


def view_candidates(modeladmin, request, queryset):
    """Custom admin action to view candidates from a search"""
    from django.shortcuts import redirect
    from urllib.parse import urlencode
    
    for search in queryset:
        if hasattr(search, 'query'):  # For CandidateSearchQuery
            params = {k: v for k, v in search.query.items() if v}
        elif hasattr(search, 'search_parameters'):  # For SavedSearch
            params = search.search_parameters
        else:
            continue
            
        if params:
            url = f"{reverse('admin:users_userprofile_changelist')}?{urlencode(params, doseq=True)}"
            return redirect(url)
    
    modeladmin.message_user(request, "No valid search parameters found.")
view_candidates.short_description = "View matching candidates"


@admin.register(SearchFilterOption)
class SearchFilterOptionAdmin(admin.ModelAdmin):
    fields = ('filter_type', 'name', 'value', 'display_order', 'is_active')
    list_display = ('name', 'filter_type', 'value', 'display_order', 'is_active')
    list_filter = ('filter_type', 'is_active')
    search_fields = ('name', 'value')
    list_editable = ('display_order', 'is_active')
    ordering = ('filter_type', 'display_order', 'name')
    
    def get_queryset(self, request):
        return super().get_queryset(request).only(
            'id', 'filter_type', 'name', 'value', 'display_order', 'is_active'
        )


@admin.register(CandidateSearchQuery)
class CandidateSearchQueryAdmin(admin.ModelAdmin):
    list_display = ('id', 'recruiter_email', 'search_summary', 'results_count', 'is_saved', 'created_at')
    list_filter = ('is_saved', 'created_at')
    search_fields = ('recruiter__email', 'query')
    readonly_fields = ('created_at', 'updated_at', 'results_count', 'search_preview')
    date_hierarchy = 'created_at'
    actions = [view_candidates]
    
    def recruiter_email(self, obj):
        return obj.recruiter.email if obj.recruiter else 'Anonymous'
    recruiter_email.short_description = 'Recruiter'
    recruiter_email.admin_order_field = 'recruiter__email'
    
    def search_summary(self, obj):
        """Display a summary of the search criteria"""
        parts = []
        if hasattr(obj, 'keyword') and obj.keyword:
            parts.append(f'"{obj.keyword}"')
        
        if hasattr(obj, 'location') and obj.location:
            parts.append(f'in {len(obj.location)} locations')
            
        if hasattr(obj, 'skills') and obj.skills:
            skills = obj.skills[:2]
            skill_text = ', '.join(skills)
            if len(obj.skills) > 2:
                skill_text += f' (+{len(obj.skills) - 2} more)'
            parts.append(f'skills: {skill_text}')
        
        # Fallback to query field if it exists
        if not parts and hasattr(obj, 'query') and isinstance(obj.query, dict):
            return ', '.join(f"{k}: {v}" for k, v in obj.query.items())
            
        return ' | '.join(parts) or 'No criteria'
    search_summary.short_description = 'Search Criteria'
    
    def search_preview(self, obj):
        """Display a preview of the search parameters"""
        if hasattr(obj, 'query') and obj.query:
            items = []
            for key, value in obj.query.items():
                if isinstance(value, list):
                    value = ', '.join(str(v) for v in value)
                items.append(f'<strong>{key}:</strong> {value}')
            return mark_safe('<br>'.join(items))
        return 'No search parameters'
    search_preview.short_description = 'Search Parameters'
    search_preview.allow_tags = True


@admin.register(SavedSearch)
class SavedSearchAdmin(admin.ModelAdmin):
    list_display = ('name', 'recruiter_email', 'is_active', 'last_run', 'created_at', 'search_actions')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'recruiter__email')
    readonly_fields = ('created_at', 'updated_at', 'last_run', 'search_actions')
    date_hierarchy = 'created_at'
    actions = [view_candidates]
    
    def recruiter_email(self, obj):
        return obj.recruiter.email if obj.recruiter else 'System'
    recruiter_email.short_description = 'Recruiter'
    recruiter_email.admin_order_field = 'recruiter__email'
    
    def search_actions(self, obj):
        """Add action buttons for the saved search"""
        return format_html(
            '<a class="button" href="{}" style="padding: 5px 10px; background: #417690; color: white; border-radius: 4px; text-decoration: none;">View Results</a>',
            f"{reverse('admin:users_userprofile_changelist')}?{obj.search_parameters}"
        )
    search_actions.short_description = 'Actions'
    search_actions.allow_tags = True
