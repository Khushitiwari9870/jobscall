from django.contrib import admin
from .models import AdminActivity


@admin.register(AdminActivity)
class AdminActivityAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "action", "target", "created_at")
    search_fields = ("action", "target", "user__username")
