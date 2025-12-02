from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group
from django.utils.translation import gettext_lazy as _

from .models import UserProfile, PasswordResetToken

User = get_user_model()


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = _('Profile')
    fk_name = 'user'
    extra = 1
    max_num = 1  # Only allow one profile per user
    min_num = 1  # Require at least one profile
    
    def get_formset(self, request, obj=None, **kwargs):
        # Set initial data for new users
        if obj is None:
            self.extra = 1
        else:
            self.extra = 0
        return super().get_formset(request, obj, **kwargs)


class CustomUserAdmin(UserAdmin):
    inlines = (UserProfileInline,)
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )

    def save_formset(self, request, form, formset, change):
        # This method is called when saving the user and its inlines
        instances = formset.save(commit=False)
        for instance in instances:
            # If this is a UserProfile being created/updated
            if isinstance(instance, UserProfile):
                # Only set user_type if it's not already set
                if not instance.pk:  # New profile
                    if not hasattr(instance, 'user_type') or not instance.user_type:
                        instance.user_type = 'admin' if instance.user.is_superuser else 'candidate'
                instance.save()
        formset.save_m2m()
        super().save_formset(request, form, formset, change)

    def save_model(self, request, obj, form, change):
        # Save the user first
        super().save_model(request, obj, form, change)
        
        # For new users, ensure they have a profile
        # The profile might be created by the formset, so we check again
        if not hasattr(obj, 'profile'):
            UserProfile.objects.get_or_create(
                user=obj,
                defaults={'user_type': 'admin' if obj.is_superuser else 'candidate'}
            )


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'user_type', 'phone_number', 'city', 'country')
    list_filter = ('user_type', 'city', 'country')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'phone_number')
    raw_id_fields = ('user',)


@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'expires_at', 'is_used')
    list_filter = ('is_used', 'created_at', 'expires_at')
    search_fields = ('user__email', 'token')
    readonly_fields = ('created_at', 'expires_at', 'token')
    date_hierarchy = 'created_at'


# Unregister the default User admin and register our custom one
admin.site.unregister(Group)  # Optional: Unregister Group if not needed
admin.site.register(User, CustomUserAdmin)
