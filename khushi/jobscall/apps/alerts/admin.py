from django.contrib import admin
from .models import SavedSearch, AlertSchedule, AlertDelivery


@admin.register(SavedSearch)
class SavedSearchAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "name", "query", "created_at")
    search_fields = ("name", "query", "user__username")


@admin.register(AlertSchedule)
class AlertScheduleAdmin(admin.ModelAdmin):
    list_display = ("id", "saved_search", "frequency", "next_run_at")
    list_filter = ("frequency",)


@admin.register(AlertDelivery)
class AlertDeliveryAdmin(admin.ModelAdmin):
    list_display = ("id", "saved_search", "status", "delivered_at", "created_at")
    list_filter = ("status",)
