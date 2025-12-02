from django.db import models
from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class RecentSearch(models.Model):
    """
    Model to track recent searches made by users.
    """
    # Search type choices
    SEARCH_TYPES = [
        ('job', _('Job Search')),
        ('candidate', _('Candidate Search')),
        ('company', _('Company Search')),
    ]
    
    # User who performed the search
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='recent_searches',
        verbose_name=_('user')
    )
    
    # Search metadata
    search_type = models.CharField(
        max_length=20,
        choices=SEARCH_TYPES,
        verbose_name=_('search type')
    )
    
    # Search query details
    query = models.CharField(
        max_length=500,
        blank=True,
        null=True,
        verbose_name=_('search query')
    )
    
    filters = models.JSONField(
        default=dict,
        blank=True,
        verbose_name=_('search filters')
    )
    
    # Timestamps
    created_at = models.DateTimeField(
        _('created at'),
        default=timezone.now,
        db_index=True
    )
    
    class Meta:
        verbose_name = _('recent search')
        verbose_name_plural = _('recent searches')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'search_type', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.get_search_type_display()} - {self.query or 'No query'}"
