from django.db import models
from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class SavedSearch(models.Model):
    """
    Model to save and manage user search criteria for future use.
    """
    # Search type choices
    SEARCH_TYPES = [
        ('job', _('Job Search')),
        ('candidate', _('Candidate Search')),
        ('company', _('Company Search')),
        ('advanced_candidate', _('Advanced Candidate Search')),
    ]
    
    # User who saved this search
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='saved_search_instances',  # Changed from 'saved_searches'
        verbose_name=_('user')
    )
    
    # Search metadata
    name = models.CharField(
        max_length=255,
        verbose_name=_('search name'),
        help_text=_('A descriptive name for this saved search')
    )
    
    search_type = models.CharField(
        max_length=20,
        choices=SEARCH_TYPES,
        default='job',
        verbose_name=_('search type')
    )
    
    # Search parameters
    query = models.CharField(
        max_length=500,
        blank=True,
        null=True,
        verbose_name=_('search query'),
        help_text=_('Job title, keywords, or company name')
    )
    
    location = models.JSONField(
        blank=True,
        null=True,
        verbose_name=_('locations'),
        help_text=_('Selected locations')
    )
    
    # Filters
    experience = models.JSONField(
        blank=True,
        null=True,
        verbose_name=_('experience levels'),
        help_text=_('Selected experience levels')
    )
    
    salary = models.JSONField(
        blank=True,
        null=True,
        verbose_name=_('salary ranges'),
        help_text=_('Selected salary ranges')
    )
    
    job_type = models.JSONField(
        blank=True,
        null=True,
        verbose_name=_('job types'),
        help_text=_('Selected job types')
    )
    
    skills = models.JSONField(
        blank=True,
        null=True,
        verbose_name=_('skills'),
        help_text=_('List of required skills')
    )
    
    company = models.JSONField(
        blank=True,
        null=True,
        verbose_name=_('companies'),
        help_text=_('Selected companies')
    )
    
    # Advanced candidate search fields
    industry = models.JSONField(
        blank=True,
        null=True,
        verbose_name=_('industries'),
        help_text=_('Selected industries')
    )
    
    department = models.JSONField(
        blank=True,
        null=True,
        verbose_name=_('departments'),
        help_text=_('Selected departments')
    )
    
    role = models.JSONField(
        blank=True,
        null=True,
        verbose_name=_('roles'),
        help_text=_('Selected roles')
    )
    
    education = models.JSONField(
        blank=True,
        null=True,
        verbose_name=_('education levels'),
        help_text=_('Selected education levels')
    )
    
    gender = models.JSONField(
        blank=True,
        null=True,
        verbose_name=_('genders'),
        help_text=_('Selected genders')
    )
    
    age = models.JSONField(
        blank=True,
        null=True,
        verbose_name=_('age range'),
        help_text=_('Selected age range')
    )
    
    last_active = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        verbose_name=_('last active'),
        help_text=_('Last active time period')
    )
    
    notice_period = models.JSONField(
        blank=True,
        null=True,
        verbose_name=_('notice periods'),
        help_text=_('Selected notice periods')
    )
    
    work_mode = models.JSONField(
        blank=True,
        null=True,
        verbose_name=_('work modes'),
        help_text=_('Selected work modes')
    )
    
    job_change = models.BooleanField(
        null=True,
        blank=True,
        verbose_name=_('open to job change'),
        help_text=_('Is candidate open to job change')
    )
    
    willing_to_relocate = models.BooleanField(
        null=True,
        blank=True,
        verbose_name=_('willing to relocate'),
        help_text=_('Is candidate willing to relocate')
    )
    
    # Additional metadata
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('is active'),
        help_text=_('Enable/disable this saved search')
    )
    
    email_alerts = models.BooleanField(
        default=False,
        verbose_name=_('email alerts'),
        help_text=_('Receive email notifications for new matches')
    )
    
    alert_frequency = models.PositiveSmallIntegerField(
        default=1,
        choices=[(1, _('Daily')), (7, _('Weekly'))],
        verbose_name=_('alert frequency')
    )
    
    last_alert_sent = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_('last alert sent')
    )
    
    # Timestamps
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('created at')
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_('updated at')
    )
    
    last_run = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_('last run')
    )
    
    # Result tracking
    total_results = models.PositiveIntegerField(
        default=0,
        verbose_name=_('total results')
    )
    
    new_since_last_alert = models.PositiveIntegerField(
        default=0,
        verbose_name=_('new since last alert')
    )

    class Meta:
        ordering = ['-updated_at']
        verbose_name = _('saved search')
        verbose_name_plural = _('saved searches')
        unique_together = ('user', 'name')
        indexes = [
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['user', 'email_alerts']),
            models.Index(fields=['last_alert_sent']),
        ]

    def __str__(self):
        return f"{self.user.email}'s {self.name} ({self.get_search_type_display()})"
    
    def get_search_parameters(self):
        """
        Return a dictionary of search parameters that can be used directly
        with the JobSearchSerializer.
        """
        params = {
            'query': self.query,
            'location': self.location,
            'experience': self.experience or [],
            'salary': self.salary or [],
            'job_type': self.job_type or [],
            'skills': self.skills or [],
            'company': self.company,
        }
        
        # Remove None/empty values
        return {k: v for k, v in params.items() if v not in (None, '', [], {})}
    
    def run_search(self, save_results=False):
        """
        Execute this saved search and return the results.
        If save_results is True, update the saved search with result count.
        """
        from apps.search.views import JobSearchView
        from rest_framework.test import APIRequestFactory
        from django.urls import reverse
        
        # Create a mock request
        factory = APIRequestFactory()
        request = factory.get(reverse('search:job-search'), self.get_search_parameters())
        request.user = self.user
        
        # Execute the search
        view = JobSearchView.as_view()
        response = view(request)
        
        # Update last run time and result count if needed
        if save_results and response.status_code == 200:
            self.last_run = timezone.now()
            self.total_results = response.data.get('count', 0)
            self.save(update_fields=['last_run', 'total_results'])
        
        return response
    
    def send_alert(self):
        """
        Send an email alert for this saved search if there are new results.
        Returns True if an alert was sent, False otherwise.
        """
        from django.core.mail import send_mail
        from django.template.loader import render_to_string
        
        # Run the search to get fresh results
        response = self.run_search(save_results=True)
        
        if response.status_code != 200 or response.data['count'] == 0:
            return False
        
        # Prepare email context
        context = {
            'search': self,
            'results': response.data['results'][:10],  # First 10 results
            'total_results': response.data['count'],
            'search_url': self.get_absolute_url(),
        }
        
        # Send email
        subject = f'New jobs matching your search: {self.name}'
        message = f"""
        New jobs matching your saved search "{self.name}"
        
        There are {context['total_results']} new jobs matching your criteria.
        
        View all results: {context['search_url']}
        """
        
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[self.user.email],
            fail_silently=False,
        )
        
        # Update last alert time
        self.last_alert_sent = timezone.now()
        self.save(update_fields=['last_alert_sent'])
        
        return True
    
    def get_absolute_url(self):
        """Return the URL to view this saved search."""
        from django.urls import reverse
        params = '&'.join(f"{k}={v}" for k, v in self.get_search_parameters().items() if v)
        return f"{reverse('search:job-search')}?{params}"
