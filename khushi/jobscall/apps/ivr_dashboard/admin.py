from django.contrib import admin
from django.utils.html import format_html
from .models import (
    IvrDashboardPanel, IvrDashboardFilter, IvrDashboardLayout,
    IvrDashboardUserSettings, IvrDashboardSharedView
)

@admin.register(IvrDashboardPanel)
class IvrDashboardPanelAdmin(admin.ModelAdmin):
    list_display = ('name', 'title', 'panel_type', 'user', 'is_visible', 'created_at')
    list_filter = ('panel_type', 'is_visible', 'created_at')
    search_fields = ('name', 'title', 'user__username')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('user', 'name', 'title', 'panel_type', 'is_visible', 'order')
        }),
        ('Layout', {
            'fields': ('row', 'col', 'size_x', 'size_y'),
            'classes': ('collapse',)
        }),
        ('Configuration', {
            'fields': ('config', 'refresh_interval'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(IvrDashboardFilter)
class IvrDashboardFilterAdmin(admin.ModelAdmin):
    list_display = ('name', 'filter_type', 'user', 'is_global', 'created_at')
    list_filter = ('filter_type', 'is_global', 'created_at')
    search_fields = ('name', 'user__username')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('user', 'name', 'filter_type', 'is_global')
        }),
        ('Filter Values', {
            'fields': ('filter_values',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(IvrDashboardLayout)
class IvrDashboardLayoutAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'is_default', 'created_at')
    list_filter = ('is_default', 'created_at')
    search_fields = ('name', 'user__username')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'layout_data', 'user', 'is_default')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(IvrDashboardUserSettings)
class IvrDashboardUserSettingsAdmin(admin.ModelAdmin):
    list_display = ('user', 'default_layout', 'updated_at')
    search_fields = ('user__username', 'default_layout__name')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('user', 'default_layout', 'settings')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
@admin.register(IvrDashboardSharedView)
class IvrDashboardSharedViewAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_by', 'is_public', 'created_at')
    list_filter = ('is_public', 'created_at')
    search_fields = ('name', 'created_by__username', 'shared_with__username')
    readonly_fields = ('created_at', 'updated_at', 'share_token')
    filter_horizontal = ('shared_with',)
    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'view_data', 'created_by', 'is_public', 'shared_with', 'share_token')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editing an existing object
            return self.readonly_fields + ('share_token',)
        return self.readonly_fields
    
    def save_model(self, request, obj, form, change):
        if not obj.share_token:
            import uuid
            obj.share_token = str(uuid.uuid4())
        super().save_model(request, obj, form, change)