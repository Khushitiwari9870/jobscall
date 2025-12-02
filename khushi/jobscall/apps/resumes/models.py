from django.db import models
from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator

class Resume(models.Model):
    class ResumeStatus(models.TextChoices):
        DRAFT = 'draft', _('Draft')
        PUBLISHED = 'published', _('Published')
        ARCHIVED = 'archived', _('Archived')
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='resumes'
    )
    title = models.CharField(_('resume title'), max_length=200)
    professional_title = models.CharField(_('professional title'), max_length=200, blank=True)
    summary = models.TextField(_('professional summary'), blank=True)
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=ResumeStatus.choices,
        default=ResumeStatus.DRAFT
    )
    is_default = models.BooleanField(_('default resume'), default=False)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        ordering = ['-is_default', '-updated_at']
        verbose_name = _('resume')
        verbose_name_plural = _('resumes')
    
    def __str__(self):
        return f"{self.title} - {self.user.email}"
    
    def save(self, *args, **kwargs):
        if self.is_default:
            Resume.objects.filter(user=self.user, is_default=True).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)

class WorkExperience(models.Model):
    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name='work_experiences'
    )
    job_title = models.CharField(_('job title'), max_length=200)
    company_name = models.CharField(_('company name'), max_length=200)
    location = models.CharField(_('location'), max_length=200, blank=True)
    currently_working = models.BooleanField(_('currently working here'), default=False)
    start_date = models.DateField(_('start date'))
    end_date = models.DateField(_('end date'), null=True, blank=True)
    description = models.TextField(_('job description'), blank=True)
    
    class Meta:
        ordering = ['-start_date']
        verbose_name = _('work experience')
        verbose_name_plural = _('work experiences')
    
    def __str__(self):
        return f"{self.job_title} at {self.company_name}"

class Education(models.Model):
    DEGREE_TYPES = [
        ('high_school', _('High School')),
        ('diploma', _('Diploma')),
        ('bachelor', _('Bachelor\'s Degree')),
        ('master', _('Master\'s Degree')),
        ('phd', _('PhD')),
        ('other', _('Other')),
    ]
    
    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name='educations'
    )
    degree = models.CharField(_('degree'), max_length=50, choices=DEGREE_TYPES)
    field_of_study = models.CharField(_('field of study'), max_length=200)
    institution = models.CharField(_('institution'), max_length=200)
    currently_studying = models.BooleanField(_('currently studying'), default=False)
    start_date = models.DateField(_('start date'))
    end_date = models.DateField(_('end date'), null=True, blank=True)
    description = models.TextField(_('description'), blank=True)
    
    class Meta:
        ordering = ['-start_date']
        verbose_name = _('education')
        verbose_name_plural = _('education')
    
    def __str__(self):
        return f"{self.get_degree_display()} in {self.field_of_study} at {self.institution}"

class Skill(models.Model):
    SKILL_LEVELS = [
        (1, _('Beginner')),
        (2, _('Intermediate')),
        (3, _('Advanced')),
        (4, _('Expert')),
    ]
    
    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name='skills'
    )
    name = models.CharField(_('skill name'), max_length=100)
    level = models.PositiveSmallIntegerField(
        _('proficiency level'),
        choices=SKILL_LEVELS,
        validators=[MinValueValidator(1), MaxValueValidator(4)]
    )
    
    class Meta:
        ordering = ['name']
        verbose_name = _('skill')
        verbose_name_plural = _('skills')
    
    def __str__(self):
        return f"{self.name} ({self.get_level_display()})"
