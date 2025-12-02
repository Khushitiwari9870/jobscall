from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

# Using string references to avoid circular imports
# Import the User model using get_user_model to avoid circular imports
User = settings.AUTH_USER_MODEL

class Application(models.Model):
    STATUS_CHOICES = (
        ("applied", "Applied"),
        ("review", "In Review"),
        ("interview", "Interview"),
        ("offer", "Offer"),
        ("rejected", "Rejected"),
        ("withdrawn", "Withdrawn"),
    )

    candidate = models.ForeignKey('profile.UserProfile', on_delete=models.CASCADE, related_name='applications', limit_choices_to={'user__user_type': 'candidate'})
    job = models.ForeignKey('jobs.Job', on_delete=models.CASCADE, related_name='applications_received')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="applied")
    resume_url = models.URLField(blank=True)
    cover_letter = models.TextField(blank=True)
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("candidate", "job")

    def __str__(self):
        return f"{self.candidate.user.get_full_name() or self.candidate.user.email} -> {self.job.title}"
