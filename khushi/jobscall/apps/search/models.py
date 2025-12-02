from django.db import models
from django.conf import settings
from django.utils import timezone

class SearchLog(models.Model):
    """
    Model to track user search queries and parameters for analytics and personalization.
    """
    SEARCH_TYPES = [
        ('job', 'Job Search'),
        ('candidate', 'Candidate Search'),
        ('company', 'Company Search'),
        ('skill', 'Skill Search'),
        ('location', 'Location Search'),
    ]
    
    # User information
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='search_logs'  # Changed from 'search_queries'
    )
    
    # Search metadata
    search_type = models.CharField(
        max_length=20, 
        choices=SEARCH_TYPES, 
        default='job',
        db_index=True
    )
    
    # Search parameters
    query = models.CharField(max_length=500, blank=True, null=True, db_index=True)
    location = models.CharField(max_length=255, blank=True, null=True, db_index=True)
    experience = models.CharField(max_length=50, blank=True, null=True)
    salary = models.CharField(max_length=100, blank=True, null=True)
    job_type = models.CharField(max_length=100, blank=True, null=True)
    skills = models.TextField(blank=True, null=True)  # Comma-separated skills
    company = models.CharField(max_length=255, blank=True, null=True, db_index=True)
    industry = models.CharField(max_length=255, blank=True, null=True)
    
    # Additional filters
    posted_within = models.PositiveIntegerField(null=True, blank=True)  # Days
    work_from_home = models.BooleanField(null=True, blank=True, default=None)
    location_type = models.CharField(max_length=20, blank=True, null=True)  # on-site, remote, hybrid

    # Search results and metadata
    results_count = models.IntegerField(default=0)
    is_successful = models.BooleanField(default=True)

    # Technical fields
    ip_address = models.GenericIPAddressField(null=True, blank=True, db_index=True)
    user_agent = models.TextField(blank=True, null=True)
    referrer = models.URLField(blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['search_type', 'created_at']),
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['query', 'location']),
            models.Index(fields=['company']),
            models.Index(fields=['created_at', 'search_type']),
        ]
        verbose_name = 'Search Log'
        verbose_name_plural = 'Search Logs'

    def __str__(self):
        user_info = f"{self.user.email}" if self.user else "Anonymous"
        query_info = f" for '{self.query}'".format(self.query) if self.query else ""
        location_info = f" in {self.location}" if self.location else ""
        return f"{user_info}'s {self.get_search_type_display()}{query_info}{location_info}"
    
    def save(self, *args, **kwargs):
        # Auto-set timestamps
        if not self.id:
            self.created_at = timezone.now()
        self.updated_at = timezone.now()
        
        # Set is_successful based on results_count
        self.is_successful = self.results_count > 0
        
        super().save(*args, **kwargs)
    
    def get_search_parameters(self):
        """Return a dictionary of search parameters for this log entry."""
        params = {
            'query': self.query,
            'location': self.location,
            'experience': self.experience,
            'salary': self.salary,
            'job_type': self.job_type,
            'skills': self.skills.split(',') if self.skills else [],
            'company': self.company,
            'industry': self.industry,
            'posted_within': self.posted_within,
            'walk_in': self.walk_in,
            'work_from_home': self.work_from_home,
            'location_type': self.location_type,
        }
        return {k: v for k, v in params.items() if v not in (None, '', [], {})}
    
    @classmethod
    def get_popular_searches(cls, days=30, limit=10, search_type='job'):
        """Get the most popular search queries."""
        from django.db.models import Count
        from django.utils import timezone
        
        time_threshold = timezone.now() - timezone.timedelta(days=days)
        
        return cls.objects.filter(
            created_at__gte=time_threshold,
            search_type=search_type,
            query__isnull=False
        ).exclude(query='').values('query').annotate(
            count=Count('id')
        ).order_by('-count')[:limit]
    
    @classmethod
    def get_search_analytics(cls, days=30, search_type='job'):
        """Get analytics data for searches."""
        from django.db.models import Count, Avg, F, ExpressionWrapper, DurationField
        from django.db.models.functions import TruncDay, TruncHour
        from django.utils import timezone
        
        time_threshold = timezone.now() - timezone.timedelta(days=days)
        
        # Basic metrics
        total_searches = cls.objects.filter(
            created_at__gte=time_threshold,
            search_type=search_type
        ).count()
        
        successful_searches = cls.objects.filter(
            created_at__gte=time_threshold,
            search_type=search_type,
            is_successful=True
        ).count()
        
        avg_results = cls.objects.filter(
            created_at__gte=time_threshold,
            search_type=search_type,
            results_count__gt=0
        ).aggregate(avg_results=Avg('results_count'))['avg_results'] or 0
        
        # Time-based metrics
        searches_by_day = cls.objects.filter(
            created_at__gte=time_threshold,
            search_type=search_type
        ).annotate(
            day=TruncDay('created_at')
        ).values('day').annotate(
            count=Count('id')
        ).order_by('day')
        
        searches_by_hour = cls.objects.filter(
            created_at__gte=time_threshold,
            search_type=search_type
        ).annotate(
            hour=TruncHour('created_at')
        ).values('hour').annotate(
            count=Count('id')
        ).order_by('hour')
        
        # Popular searches and filters
        popular_searches = cls.get_popular_searches(days, 5, search_type)
        
        return {
            'total_searches': total_searches,
            'success_rate': (successful_searches / total_searches * 100) if total_searches > 0 else 0,
            'avg_results_per_search': round(avg_results, 2),
            'searches_by_day': list(searches_by_day),
            'searches_by_hour': list(searches_by_hour),
            'popular_searches': list(popular_searches),
        }


class SavedSearch(models.Model):
    """Model to save user's search criteria for future use"""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='search_saved_searches'  # Changed from 'saved_searches'
    )
    name = models.CharField(max_length=255)
    search_params = models.JSONField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
        verbose_name = 'Saved Search'
        verbose_name_plural = 'Saved Searches'
    
    def __str__(self):
        return f"{self.user.email}'s saved search: {self.name}"
