from django.contrib import admin
from .models import NotificationTemplate, Delivery


@admin.register(NotificationTemplate)
class NotificationTemplateAdmin(admin.ModelAdmin):
    list_display = ("id", "key", "channel", "created_at")
    search_fields = ("key",)
    list_filter = ("channel",)


@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = ("id", "template", "to", "status", "created_at", "sent_at")
    search_fields = ("to", "template__key")
    list_filter = ("status", "created_at")
