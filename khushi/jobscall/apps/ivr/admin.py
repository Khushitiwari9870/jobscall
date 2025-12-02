from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django.utils.html import format_html
from .models import IvrCall, IvrMenu, IvrMenuOption, IvrCallLog


class IvrMenuOptionInline(admin.TabularInline):
    """Inline admin for IVR menu options"""
    model = IvrMenuOption
    extra = 1
    fk_name = 'menu'  # Specify the foreign key to use
    fields = ('digit', 'description', 'action', 'target_menu', 'phone_number', 'order')
    ordering = ('order', 'digit')


@admin.register(IvrMenu)
class IvrMenuAdmin(admin.ModelAdmin):
    """Admin for IVR menus"""
    list_display = ('name', 'menu_type', 'is_active', 'option_count', 'created_at')
    list_filter = ('menu_type', 'is_active')
    search_fields = ('name', 'greeting_text')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [IvrMenuOptionInline]
    fieldsets = (
        (None, {
            'fields': ('name', 'menu_type', 'is_active')
        }),
        (_('Greeting'), {
            'fields': ('greeting_text', 'greeting_voice')
        }),
        (_('Behavior'), {
            'fields': (
                'invalid_choice_text',
                'max_retries',
                'timeout',
                'finish_on_key',
            )
        }),
        (_('Metadata'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def option_count(self, obj):
        return obj.options.count()
    option_count.short_description = _('Options')


@admin.register(IvrCall)
class IvrCallAdmin(admin.ModelAdmin):
    """Admin for IVR calls"""
    list_display = ('call_sid_short', 'from_number', 'to_number', 'direction', 
                   'status', 'duration_display', 'start_time')
    list_filter = ('direction', 'status', 'start_time')
    search_fields = ('call_sid', 'from_number', 'to_number')
    # Remove created_at and updated_at from readonly_fields as they are handled in fieldsets
    readonly_fields = ('call_sid', 'parent_call_sid', 'direction', 'status', 
                     'start_time', 'end_time', 'duration', 'recording_url',
                     'current_menu', 'digits_pressed', 'error_message', 'user')
    fieldsets = (
        (None, {
            'fields': ('call_sid', 'parent_call_sid', 'user')
        }),
        (_('Call Details'), {
            'fields': (
                'from_number',
                'to_number',
                'direction',
                'status',
                ('start_time', 'end_time', 'duration'),
            )
        }),
        (_('IVR Data'), {
            'fields': (
                'current_menu',
                'digits_pressed',
                'recording_url',
                'error_message',
            )
        }),
        (_('Metadata'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def call_sid_short(self, obj):
        return obj.call_sid[:15] + '...' if obj.call_sid else '-'
    call_sid_short.short_description = _('Call SID')
    
    def duration_display(self, obj):
        if obj.duration is None:
            return '-'
        minutes = obj.duration // 60
        seconds = obj.duration % 60
        return f"{minutes}:{seconds:02d}"
    duration_display.short_description = _('Duration')
    
    def has_add_permission(self, request):
        return False


class IvrCallLogInline(admin.TabularInline):
    """Inline admin for IVR call logs"""
    model = IvrCallLog
    extra = 0
    readonly_fields = ('timestamp', 'event_type', 'details_display')
    fields = ('timestamp', 'event_type', 'details_display')
    ordering = ('-timestamp',)
    
    def details_display(self, obj):
        return format_html('<pre>{}</pre>', str(obj.details))
    details_display.short_description = _('Details')
    
    def has_add_permission(self, request, obj=None):
        return False


@admin.register(IvrCallLog)
class IvrCallLogAdmin(admin.ModelAdmin):
    """Admin for IVR call logs"""
    list_display = ('call', 'event_type', 'timestamp', 'details_short')
    list_filter = ('event_type', 'timestamp')
    search_fields = ('call__call_sid', 'details')
    readonly_fields = ('call', 'timestamp', 'event_type', 'details_display')
    fields = ('call', 'timestamp', 'event_type', 'details_display')
    ordering = ('-timestamp',)
    
    def details_short(self, obj):
        return str(obj.details)[:100] + '...' if len(str(obj.details)) > 100 else str(obj.details)
    details_short.short_description = _('Details')
    
    def details_display(self, obj):
        return format_html('<pre>{}</pre>', str(obj.details))
    details_display.short_description = _('Details')
    
    def has_add_permission(self, request):
        return False


@admin.register(IvrMenuOption)
class IvrMenuOptionAdmin(admin.ModelAdmin):
    """Admin for IVR menu options"""
    list_display = ('menu', 'digit', 'description', 'action', 'target_menu', 'order')
    list_filter = ('menu', 'action')
    search_fields = ('description', 'confirmation_text')
    list_editable = ('order',)
    ordering = ('menu', 'order', 'digit')
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('menu', 'target_menu')
