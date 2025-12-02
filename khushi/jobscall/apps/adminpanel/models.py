from django.db import models
from django.conf import settings

class AdminActivity(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='admin_activities')
    action = models.CharField(max_length=100)
    target = models.CharField(max_length=255, help_text='Human readable target, e.g., model instance or path')
    extra = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"AdminActivity({self.action} by {self.user_id})"
