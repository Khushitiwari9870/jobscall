from django.db import models
from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class RecruiterProfile(models.Model):
    """Extended profile for recruiters with additional information"""
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='recruiter_profile'
    )
    company = models.ForeignKey(
        'companies.Company',
        on_delete=models.CASCADE,
        related_name='recruiters',
        null=True,
        blank=True
    )
    job_title = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.company.name if self.company else 'No Company'}"


class RecruiterMembership(models.Model):
    """Tracks recruiter's membership and permissions"""
    MEMBERSHIP_TIERS = [
        ('basic', 'Basic'),
        ('professional', 'Professional'),
        ('enterprise', 'Enterprise'),
    ]
    
    recruiter = models.OneToOneField(
        RecruiterProfile,
        on_delete=models.CASCADE,
        related_name='membership'
    )
    tier = models.CharField(
        max_length=20,
        choices=MEMBERSHIP_TIERS,
        default='basic'
    )
    job_postings_remaining = models.PositiveIntegerField(default=0)
    candidate_views_remaining = models.PositiveIntegerField(default=0)
    can_contact_candidates = models.BooleanField(default=False)
    can_use_ats = models.BooleanField(default=False)
    expires_at = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.recruiter} - {self.get_tier_display()}"


class JobPosting(models.Model):
    """Job postings created by recruiters"""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('closed', 'Closed'),
        ('archived', 'Archived'),
    ]
    
    recruiter = models.ForeignKey(
        RecruiterProfile,
        on_delete=models.CASCADE,
        related_name='job_postings'
    )
    job = models.OneToOneField(
        'jobs.Job',
        on_delete=models.CASCADE,
        related_name='recruiter_posting'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft'
    )
    is_featured = models.BooleanField(default=False)
    is_urgent = models.BooleanField(default=False)
    views = models.PositiveIntegerField(default=0)
    applications = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)
    closed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.job.title} - {self.get_status_display()}"

    def save(self, *args, **kwargs):
        if self.status == 'published' and not self.published_at:
            self.published_at = timezone.now()
        if self.status == 'closed' and not self.closed_at:
            self.closed_at = timezone.now()
        super().save(*args, **kwargs)


class CandidateSearch(models.Model):
    """Saved candidate searches by recruiters"""
    recruiter = models.ForeignKey(
        RecruiterProfile,
        on_delete=models.CASCADE,
        related_name='saved_searches'
    )
    name = models.CharField(max_length=255)
    search_parameters = models.JSONField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Candidate Searches'
        unique_together = ('recruiter', 'name')

    def __str__(self):
        return f"{self.name} - {self.recruiter}"


class RecruiterActivity(models.Model):
    """Tracks recruiter activities for analytics"""
    ACTIVITY_TYPES = [
        ('login', 'User Login'),
        ('job_post', 'Job Posted'),
        ('job_edit', 'Job Edited'),
        ('candidate_view', 'Candidate Viewed'),
        ('candidate_contact', 'Candidate Contacted'),
        ('application_review', 'Application Reviewed'),
        ('search', 'Candidate Search'),
    ]
    
    recruiter = models.ForeignKey(
        RecruiterProfile,
        on_delete=models.CASCADE,
        related_name='activities'
    )
    activity_type = models.CharField(
        max_length=50,
        choices=ACTIVITY_TYPES
    )
    details = models.JSONField(null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Recruiter Activities'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.recruiter} - {self.get_activity_type_display()} - {self.created_at}"
