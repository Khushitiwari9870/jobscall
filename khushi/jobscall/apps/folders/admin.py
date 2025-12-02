from django.contrib import admin
from django.db import models
from django.utils.translation import gettext_lazy as _
from .models import Folder, FolderProfile

class FolderProfileInline(admin.TabularInline):
    model = FolderProfile
    extra = 1
    raw_id_fields = ('profile', 'added_by')
    readonly_fields = ('added_at',)

@admin.register(Folder)
class FolderAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_by', 'profile_count', 'is_default', 'created_at')
    list_filter = ('is_default', 'created_at')
    search_fields = ('name', 'created_by__email', 'created_by__first_name', 'created_by__last_name')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'is_default')
        }),
        (_('Metadata'), {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    inlines = [FolderProfileInline]
    
    def get_queryset(self, request):
        return super().get_queryset(request).annotate(
            profile_count=models.Count('folder_profiles')
        )
    
    def profile_count(self, obj):
        return obj.profile_count
    profile_count.short_description = _('Profile Count')
    profile_count.admin_order_field = 'profile_count'

@admin.register(FolderProfile)
class FolderProfileAdmin(admin.ModelAdmin):
    list_display = ('folder', 'profile_name', 'added_by', 'added_at')
    list_filter = ('folder', 'added_at')
    search_fields = (
        'folder__name',
        'profile__user__first_name',
        'profile__user__last_name',
        'profile__user__email',
        'added_by__email'
    )
    readonly_fields = ('added_at',)
    raw_id_fields = ('profile', 'added_by')
    
    def profile_name(self, obj):
        return f"{obj.profile.user.get_full_name() or obj.profile.user.email}"
    profile_name.short_description = _('Profile')
    profile_name.admin_order_field = 'profile__user__first_name'
