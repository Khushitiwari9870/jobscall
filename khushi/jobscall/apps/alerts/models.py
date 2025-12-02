from django.db import models
from django.conf import settings

class SavedSearch(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='alert_saved_searches')
    name = models.CharField(max_length=100)
    query = models.CharField(max_length=500)
    filters = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"SavedSearch({self.user_id}:{self.name})"


class AlertSchedule(models.Model):
    FREQ_CHOICES = (
        ("daily", "Daily"),
        ("weekly", "Weekly"),
    )
    saved_search = models.OneToOneField(SavedSearch, on_delete=models.CASCADE, related_name='schedule')
    frequency = models.CharField(max_length=10, choices=FREQ_CHOICES, default="daily")
    next_run_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"AlertSchedule({self.saved_search_id}:{self.frequency})"


class AlertDelivery(models.Model):
    STATUS_CHOICES = (
        ("queued", "Queued"),
        ("sent", "Sent"),
        ("failed", "Failed"),
    )
    saved_search = models.ForeignKey(SavedSearch, on_delete=models.CASCADE, related_name='deliveries')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="queued")
    delivered_at = models.DateTimeField(null=True, blank=True)
    error = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"AlertDelivery({self.saved_search_id}:{self.status})"
