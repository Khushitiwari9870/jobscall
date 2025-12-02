from django.db import models
from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model

User = get_user_model()


class CandidateSearchQuery(models.Model):
    """Stores search queries made by recruiters"""
    recruiter = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='candidate_search_queries',  # Changed from 'search_queries'
        null=True,
        blank=True
    )
    query = models.JSONField(_('Search Parameters'))
    results_count = models.PositiveIntegerField(_('Results Count'), default=0)
    is_saved = models.BooleanField(_('Is Saved'), default=False)
    
    # Additional fields from the screenshot
    keyword = models.CharField(_('Keyword'), max_length=255, blank=True, null=True)
    location = models.JSONField(_('Locations'), default=list, blank=True)
    experience = models.JSONField(_('Experience Range'), default=list, blank=True)
    salary = models.JSONField(_('Salary Range'), default=list, blank=True)
    skills = models.JSONField(_('Skills'), default=list, blank=True)
    job_type = models.JSONField(_('Job Type'), default=list, blank=True)
    company = models.JSONField(_('Companies'), default=list, blank=True)
    industry = models.JSONField(_('Industries'), default=list, blank=True)
    department = models.JSONField(_('Departments'), default=list, blank=True)
    role = models.JSONField(_('Roles'), default=list, blank=True)
    education = models.JSONField(_('Education'), default=list, blank=True)
    gender = models.CharField(_('Gender'), max_length=50, blank=True, null=True)
    notice_period = models.JSONField(_('Notice Period'), default=list, blank=True)
    work_mode = models.JSONField(_('Work Mode'), default=list, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)

    class Meta:
        verbose_name = _('Candidate Search Query')
        verbose_name_plural = _('Candidate Search Queries')
        ordering = ['-created_at']

    def __str__(self):
        return f"Search by {self.recruiter.email if self.recruiter else 'Anonymous'} at {self.created_at}"


class SavedSearch(models.Model):
    """Stores saved search criteria for recruiters"""
    recruiter = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='candidate_saved_searches'  # Changed from 'saved_searches'
    )
    name = models.CharField(_('Search Name'), max_length=255)
    search_parameters = models.JSONField(_('Search Parameters'))
    is_active = models.BooleanField(_('Is Active'), default=True)
    last_run = models.DateTimeField(_('Last Run'), null=True, blank=True)
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)

    class Meta:
        verbose_name = _('Saved Search')
        verbose_name_plural = _('Saved Searches')
        ordering = ['-updated_at']
        unique_together = ('recruiter', 'name')

    def __str__(self):
        return f"{self.name} - {self.recruiter.email}"


class SearchFilterOption(models.Model):
    """Stores available filter options for candidate search"""
    FILTER_TYPES = [
        ('skills', 'Skills'),
        ('location', 'Location'),
        ('experience', 'Experience'),
        ('salary', 'Salary'),
        ('job_type', 'Job Type'),
        ('company', 'Company'),
        ('industry', 'Industry'),
        ('department', 'Department'),
        ('role', 'Role'),
        ('education', 'Education'),
        ('gender', 'Gender'),
        ('notice_period', 'Notice Period'),
        ('work_mode', 'Work Mode'),
    ]
    
    filter_type = models.CharField(_('Filter Type'), max_length=50, choices=FILTER_TYPES)
    name = models.CharField(_('Name'), max_length=255)
    value = models.CharField(_('Value'), max_length=255)
    display_order = models.PositiveIntegerField(_('Display Order'), default=0)
    is_active = models.BooleanField(_('Is Active'), default=True)
    
    class Meta:
        verbose_name = _('Search Filter Option')
        verbose_name_plural = _('Search Filter Options')
        ordering = ['filter_type', 'display_order', 'name']
        unique_together = ('filter_type', 'value')
    
    def __str__(self):
        return f"{self.get_filter_type_display()}: {self.name}"
