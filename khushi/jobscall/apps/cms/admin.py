from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import Page, FAQ, Post, CoolPlace, EmployerLead, ResumeCheckRequest

User = get_user_model()


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "slug", "is_published", "updated_at")
    search_fields = ("title", "slug")
    list_filter = ("is_published",)


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ("id", "question", "order", "is_active", "updated_at")
    search_fields = ("question",)
    list_filter = ("is_active",)


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "slug", "is_published", "published_at")
    search_fields = ("title", "slug", "excerpt", "content")
    list_filter = ("is_published",)
    prepopulated_fields = {"slug": ("title",)}


@admin.register(CoolPlace)
class CoolPlaceAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "order", "is_active")
    list_editable = ("order", "is_active")
    search_fields = ("name",)


@admin.register(EmployerLead)
class EmployerLeadAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "email", "phone", "source", "created_at", "handled")
    list_filter = ("source", "handled")
    search_fields = ("name", "email", "phone")


from django.contrib.auth import get_user_model

User = get_user_model()

@admin.register(ResumeCheckRequest)
class ResumeCheckRequestAdmin(admin.ModelAdmin):
    list_display = ("id", "get_user_email", "status", "score", "created_at")
    list_filter = ("status",)
    search_fields = ("user__email", "user__first_name", "user__last_name")
    raw_id_fields = ("user",)  # Use raw_id_fields instead of autocomplete_fields
    
    def get_user_email(self, obj):
        return obj.user.email if obj.user else "-"
    get_user_email.short_description = 'User Email'
    get_user_email.admin_order_field = 'user__email'
