from django.contrib import admin
from .models import Plan, Price, Invoice, PaymentIntent


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "created_at")
    search_fields = ("name",)


@admin.register(Price)
class PriceAdmin(admin.ModelAdmin):
    list_display = ("id", "plan", "amount", "currency", "interval", "active")
    list_filter = ("currency", "interval", "active")
    search_fields = ("plan__name",)


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "amount", "currency", "status", "created_at")
    list_filter = ("status", "currency")
    search_fields = ("user__username",)


@admin.register(PaymentIntent)
class PaymentIntentAdmin(admin.ModelAdmin):
    list_display = ("id", "invoice", "provider", "status", "created_at")
    list_filter = ("provider", "status")
