from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django.utils.html import format_html
from .models import SharedIvrResource, SharedIvrTemplate, SharedIvrUsageLog


class SharedIvrResourceInline(admin.TabularInline):
    """Inline admin for shared IVR resources in templates"""
    model = SharedIvrTemplate.resources.through
    extra = 1
    verbose_name = _('Resource')
    verbose_name_plural = _('Resources')
    raw_id_fields = ('sharedivrresource',)
    autocomplete_fields = ('sharedivrresource',)


@admin.register(SharedIvrResource)
class SharedIvrResourceAdmin(admin.ModelAdmin):
    """Admin for SharedIvrResource model"""
    list_display = ('name', 'resource_type', 'language', 'is_active', 'created_by', 'created_at')
    list_filter = ('resource_type', 'language', 'is_active', 'created_at')
    search_fields = ('name', 'description', 'content')
    readonly_fields = ('created_at', 'updated_at', 'file_preview')
    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'resource_type', 'is_active')
        }),
        (_('Content'), {
            'fields': ('file', 'file_preview', 'content', 'language')
        }),
        (_('Metadata'), {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def file_preview(self, obj):
        if obj.file:
            return format_html(
                '<a href="{0}" target="_blank">View file</a>',
                obj.file.url
            )
        return _("No file uploaded")
    file_preview.short_description = _('File Preview')
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(SharedIvrTemplate)
class SharedIvrTemplateAdmin(admin.ModelAdmin):
    """Admin for SharedIvrTemplate model"""
    list_display = ('name', 'template_type', 'version', 'is_active', 'is_public', 'created_by', 'created_at')
    list_filter = ('template_type', 'is_active', 'is_public', 'created_at')
    search_fields = ('name', 'description', 'content')
    readonly_fields = ('created_at', 'updated_at', 'preview_content')
    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'template_type', 'version', 'is_active', 'is_public')
        }),
        (_('Content'), {
            'fields': ('content', 'preview_content')
        }),
        (_('Metadata'), {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    inlines = [SharedIvrResourceInline]
    
    def preview_content(self, obj):
        """Display a preview of the template content"""
        preview = str(obj.content)[:500]  # Show first 500 chars
        if len(str(obj.content)) > 500:
            preview += '...'
        return format_html('<pre style="max-height: 300px; overflow: auto;">{}</pre>', preview)
    preview_content.short_description = _('Content Preview')
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(SharedIvrUsageLog)
class SharedIvrUsageLogAdmin(admin.ModelAdmin):
    """Admin for SharedIvrUsageLog model"""
    list_display = ('resource_type', 'resource_id', 'action', 'user', 'timestamp')
    list_filter = ('resource_type', 'action', 'timestamp')
    search_fields = ('resource_id', 'user__email', 'user__first_name', 'user__last_name')
    readonly_fields = ('resource_type', 'resource_id', 'action', 'user', 'ip_address', 
                      'user_agent', 'metadata', 'timestamp', 'resource_link')
    fieldsets = (
        (None, {
            'fields': ('resource_type', 'resource_id', 'resource_link', 'action', 'user')
        }),
        (_('Request Details'), {
            'fields': ('ip_address', 'user_agent')
        }),
        (_('Metadata'), {
            'fields': ('metadata', 'timestamp'),
            'classes': ('collapse',)
        }),
    )
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
    
    def resource_link(self, obj):
        """Create a link to the resource if possible"""
        if obj.resource_type == 'resource':
            url = f'/admin/ivr_shared/sharedivrresource/{obj.resource_id}/change/'
            return format_html('<a href="{}">View Resource</a>', url)
        elif obj.resource_type == 'template':
            url = f'/admin/ivr_shared/sharedivrtemplate/{obj.resource_id}/change/'
            return format_html('<a href="{}">View Template</a>', url)
        return 'N/A'
    resource_link.short_description = _('Resource')
    resource_link.allow_tags = True
