from django.db import models
from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

class ProfileBooster(models.Model):
    """Stores information about profile boosting"""
    
    class BoosterType(models.TextChoices):
        PROFILE_COMPLETION = 'profile_completion', _('Profile Completion')
        SKILL_IMPROVEMENT = 'skill_improvement', _('Skill Improvement')
        EXPERIENCE_ENHANCEMENT = 'experience_enhancement', _('Experience Enhancement')
        EDUCATION_BOOST = 'education_boost', _('Education Boost')
        CERTIFICATION_ADDITION = 'certification_addition', _('Certification Addition')
    
    class Status(models.TextChoices):
        PENDING = 'pending', _('Pending')
        IN_PROGRESS = 'in_progress', _('In Progress')
        COMPLETED = 'completed', _('Completed')
        FAILED = 'failed', _('Failed')
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile_boosters',
        verbose_name=_('User')
    )
    
    booster_type = models.CharField(
        _('Booster Type'),
        max_length=50,
        choices=BoosterType.choices,
        default=BoosterType.PROFILE_COMPLETION
    )
    
    status = models.CharField(
        _('Status'),
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    
    # Scores and metrics
    score_before = models.PositiveSmallIntegerField(
        _('Score Before'),
        null=True,
        blank=True
    )
    
    score_after = models.PositiveSmallIntegerField(
        _('Score After'),
        null=True,
        blank=True
    )
    
    improvement_percentage = models.PositiveSmallIntegerField(
        _('Improvement Percentage'),
        null=True,
        blank=True
    )
    
    # Details and recommendations
    recommendations = models.JSONField(
        _('Recommendations'),
        default=list,
        help_text=_('List of recommendations for improvement')
    )
    
    applied_changes = models.JSONField(
        _('Applied Changes'),
        default=list,
        help_text=_('List of changes applied to the profile')
    )
    
    # Timestamps
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    completed_at = models.DateTimeField(_('Completed At'), null=True, blank=True)
    
    class Meta:
        verbose_name = _('Profile Booster')
        verbose_name_plural = _('Profile Boosters')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.get_booster_type_display()} - {self.user.email}"
    
    def save(self, *args, **kwargs):
        """Handle status updates and calculations"""
        if self.status == self.Status.COMPLETED and not self.completed_at:
            self.completed_at = timezone.now()
            
            # Calculate improvement percentage if both scores are available
            if self.score_before is not None and self.score_after is not None and self.score_before > 0:
                self.improvement_percentage = int(
                    ((self.score_after - self.score_before) / self.score_before) * 100
                )
        
        super().save(*args, **kwargs)


class BoosterRecommendation(models.Model):
    """Stores specific recommendations for profile improvement"""
    
    class Category(models.TextChoices):
        SKILLS = 'skills', _('Skills')
        EXPERIENCE = 'experience', _('Experience')
        EDUCATION = 'education', _('Education')
        CERTIFICATION = 'certification', _('Certification')
        PERSONAL_INFO = 'personal_info', _('Personal Information')
        SUMMARY = 'summary', _('Professional Summary')
        
    class Priority(models.TextChoices):
        LOW = 'low', _('Low')
        MEDIUM = 'medium', _('Medium')
        HIGH = 'high', _('High')
    
    booster = models.ForeignKey(
        ProfileBooster,
        on_delete=models.CASCADE,
        related_name='booster_recommendations',
        verbose_name=_('Profile Booster')
    )
    
    category = models.CharField(
        _('Category'),
        max_length=20,
        choices=Category.choices,
        default=Category.SKILLS
    )
    
    priority = models.CharField(
        _('Priority'),
        max_length=10,
        choices=Priority.choices,
        default=Priority.MEDIUM
    )
    
    title = models.CharField(
        _('Title'),
        max_length=255
    )
    
    description = models.TextField(
        _('Description'),
        help_text=_('Detailed description of the recommendation')
    )
    
    action_text = models.CharField(
        _('Action Text'),
        max_length=255,
        help_text=_('Text for the action button')
    )
    
    action_url = models.URLField(
        _('Action URL'),
        max_length=500,
        blank=True,
        null=True
    )
    
    is_completed = models.BooleanField(
        _('Is Completed'),
        default=False
    )
    
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    
    class Meta:
        verbose_name = _('Booster Recommendation')
        verbose_name_plural = _('Booster Recommendations')
        ordering = ['priority', '-created_at']
    
    def __str__(self):
        return f"{self.get_priority_display()} - {self.title}"


class BoosterProgress(models.Model):
    """Tracks user progress on profile boosting"""
    
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='booster_progress',
        verbose_name=_('User')
    )
    
    overall_score = models.PositiveSmallIntegerField(
        _('Overall Profile Score'),
        default=0,
        help_text=_('Overall profile score (0-100)')
    )
    
    completion_percentage = models.PositiveSmallIntegerField(
        _('Profile Completion Percentage'),
        default=0,
        help_text=_('Profile completion percentage (0-100)')
    )
    
    last_boosted_at = models.DateTimeField(
        _('Last Boosted At'),
        null=True,
        blank=True
    )
    
    boost_count = models.PositiveIntegerField(
        _('Boost Count'),
        default=0,
        help_text=_('Number of times profile has been boosted')
    )
    
    # Category scores
    personal_info_score = models.PositiveSmallIntegerField(
        _('Personal Info Score'),
        default=0
    )
    
    experience_score = models.PositiveSmallIntegerField(
        _('Experience Score'),
        default=0
    )
    
    education_score = models.PositiveSmallIntegerField(
        _('Education Score'),
        default=0
    )
    
    skills_score = models.PositiveSmallIntegerField(
        _('Skills Score'),
        default=0
    )
    
    certifications_score = models.PositiveSmallIntegerField(
        _('Certifications Score'),
        default=0
    )
    
    # Timestamps
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    
    class Meta:
        verbose_name = _('Booster Progress')
        verbose_name_plural = _('Booster Progress')
    
    def __str__(self):
        return f"{self.user.email} - {self.overall_score}/100"
    
    def update_scores(self):
        """Update all scores based on current profile data"""
        # This would be implemented to calculate scores based on user's profile data
        # For now, we'll just update the timestamps
        self.updated_at = timezone.now()
        self.save()
    
    def calculate_overall_score(self):
        """Calculate the overall profile score"""
        # Simple average of all category scores
        scores = [
            self.personal_info_score,
            self.experience_score,
            self.education_score,
            self.skills_score,
            self.certifications_score
        ]
        self.overall_score = sum(scores) // len(scores)
        self.save()
        return self.overall_score
