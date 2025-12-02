from django.db import models
from django.conf import settings

class NotificationTemplate(models.Model):
    CHANNEL_CHOICES = (
        ("email", "Email"),
        ("sms", "SMS"),
        ("push", "Push"),
    )

    key = models.CharField(max_length=100, unique=True)
    channel = models.CharField(max_length=10, choices=CHANNEL_CHOICES, default="email")
    subject = models.CharField(max_length=255, blank=True)
    body = models.TextField(help_text="Message body, may contain placeholders")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Template({self.key}:{self.channel})"


class Delivery(models.Model):
    STATUS_CHOICES = (
        ("queued", "Queued"),
        ("sent", "Sent"),
        ("failed", "Failed"),
    )

    template = models.ForeignKey(NotificationTemplate, on_delete=models.PROTECT, related_name="deliveries")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="deliveries")
    to = models.CharField(max_length=255, help_text="Email/phone/device token")
    context = models.JSONField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="queued")
    error = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Delivery({self.template.key} -> {self.to} [{self.status}])"
