from django.db import models
from django.conf import settings

class Plan(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Price(models.Model):
    INTERVAL_CHOICES = (
        ("one_time", "One-time"),
        ("month", "Monthly"),
        ("year", "Yearly"),
    )
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE, related_name='prices')
    amount = models.IntegerField(help_text='Amount in smallest currency unit (e.g., cents)')
    currency = models.CharField(max_length=10, default='INR')
    interval = models.CharField(max_length=10, choices=INTERVAL_CHOICES, default='month')
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.plan.name} {self.amount} {self.currency}/{self.interval}"


class Invoice(models.Model):
    STATUS_CHOICES = (
        ("draft", "Draft"),
        ("open", "Open"),
        ("paid", "Paid"),
        ("void", "Void"),
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='invoices')
    amount = models.IntegerField()
    currency = models.CharField(max_length=10, default='INR')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Invoice({self.id}) {self.user_id} {self.amount}{self.currency} {self.status}"


class PaymentIntent(models.Model):
    PROVIDER_CHOICES = (
        ("stripe", "Stripe"),
        ("razorpay", "Razorpay"),
    )
    STATUS_CHOICES = (
        ("requires_payment_method", "Requires Payment Method"),
        ("requires_confirmation", "Requires Confirmation"),
        ("processing", "Processing"),
        ("succeeded", "Succeeded"),
        ("failed", "Failed"),
    )
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='payment_intents')
    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES)
    provider_ref = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='requires_payment_method')
    client_secret = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"PaymentIntent({self.provider}:{self.status})"
