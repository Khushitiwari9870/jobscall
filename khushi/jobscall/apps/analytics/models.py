from django.db import models
from django.conf import settings


class Event(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='events')
    name = models.CharField(max_length=100)
    properties = models.JSONField(null=True, blank=True)
    context = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Event({self.name}) by {self.user_id}"
