from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from apps.companies.models import Company

User = get_user_model()

class Job(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('closed', 'Closed'),
    ]
    
    EMPLOYMENT_TYPES = (
        ("full_time", "Full Time"),
        ("part_time", "Part Time"),
        ("contract", "Contract"),
        ("internship", "Internship"),
        ("temporary", "Temporary"),
    )

    EXPERIENCE_LEVELS = [
        ('fresher', 'Fresher'),
        ('0-1', '0-1 years'),
        ('1-3', '1-3 years'),
        ('3-5', '3-5 years'),
        ('5-10', '5-10 years'),
        ('10+', '10+ years'),
    ]
    
    JOB_CATEGORIES = [
        ('it_software', 'IT & Software'),
        ('banking', 'Banking'),
        ('sales', 'Sales'),
        ('hr', 'HR'),
        ('marketing', 'Marketing'),
        ('engineering', 'Engineering'),
        ('design', 'Design'),
        ('customer_service', 'Customer Service'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='jobs')
    title = models.CharField(max_length=255)
    description = models.TextField()
    requirements = models.TextField(blank=True)
    skills_required = models.TextField(help_text="Comma-separated list of skills", blank=True)
    location = models.CharField(max_length=255, blank=True)
    min_salary = models.IntegerField(null=True, blank=True)
    max_salary = models.IntegerField(null=True, blank=True)
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPES, default="full_time")
    experience = models.CharField(max_length=20, choices=EXPERIENCE_LEVELS, default='1-3')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    is_featured = models.BooleanField(default=False)
    is_remote = models.BooleanField(default=False)
    posted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posted_jobs', null=True)
    application_deadline = models.DateField(null=True, blank=True)
    vacancy = models.PositiveIntegerField(default=1)
    category = models.CharField(max_length=50, choices=JOB_CATEGORIES, blank=True, null=True)
    job_code = models.CharField(max_length=50, unique=True, blank=True, null=True)
    views_count = models.PositiveIntegerField(default=0)
    applications_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)
    closed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['employment_type', 'status']),
            models.Index(fields=['experience']),
        ]
    
    @property
    def is_active(self):
        return self.status == 'published'
    
    def __str__(self):
        return f"{self.title} at {self.company.name}"
        
    def save(self, *args, **kwargs):
        # Generate job code if not exists
        if not self.job_code:
            from django.utils.text import slugify
            from random import randint
            base_code = slugify(f"{self.company.name} {self.title}").replace('-', '').upper()[:6]
            self.job_code = f"{base_code}{randint(100, 999)}"
            
        # Update timestamps based on status
        if self.status == 'published' and not self.published_at:
            self.published_at = timezone.now()
        elif self.status == 'closed' and not self.closed_at:
            self.closed_at = timezone.now()
            
        super().save(*args, **kwargs)
        
    def get_status_display_class(self):
        status_classes = {
            'draft': 'bg-gray-100 text-gray-800',
            'published': 'bg-green-100 text-green-800',
            'closed': 'bg-red-100 text-red-800',
        }
        return status_classes.get(self.status, '')
        
    def increment_views(self):
        self.views_count += 1
        self.save(update_fields=['views_count'])
        
    def increment_applications(self):
        self.applications_count += 1
        self.save(update_fields=['applications_count'])

    @property
    def salary_range(self):
        if self.min_salary and self.max_salary:
            return f"₹{self.min_salary:,} - ₹{self.max_salary:,} a year"
            return f"From ₹{self.min_salary:,} a year"
        elif self.max_salary:
            return f"Up to ₹{self.max_salary:,} a year"
        return "Salary not specified"

    def get_skills_list(self):
        if not self.skills_required:
            return []
        return [skill.strip() for skill in self.skills_required.split(',') if skill.strip()]


class JobApplication(models.Model):
    APPLICATION_SOURCES = [
        ('career_site', 'Career Site'),
        ('linkedin', 'LinkedIn'),
        ('indeed', 'Indeed'),
        ('referral', 'Employee Referral'),
        ('agency', 'Recruitment Agency'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('screening', 'Screening'),
        ('shortlisted', 'Shortlisted'),
        ('interview', 'Interview'),
        ('offer', 'Offer'),
        ('hired', 'Hired'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    ]
    
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='job_applications')
    applicant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_applications_submitted')
    cover_letter = models.TextField(blank=True)
    resume = models.FileField(upload_to='resumes/%Y/%m/%d/')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='applied')
    source = models.CharField(max_length=20, choices=APPLICATION_SOURCES, default='career_site')
    is_reviewed = models.BooleanField(default=False)
    rating = models.PositiveSmallIntegerField(null=True, blank=True, help_text='Rating from 1 to 5')
    notes = models.TextField(blank=True)
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    viewed_at = models.DateTimeField(null=True, blank=True)
    
    # Interview related fields
    interview_date = models.DateTimeField(null=True, blank=True)
    interview_location = models.CharField(max_length=255, blank=True)
    interview_notes = models.TextField(blank=True)
    
    # Offer details
    offered_salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    offer_letter = models.FileField(upload_to='offer_letters/%Y/%m/%d/', blank=True, null=True)
    offer_made_date = models.DateField(null=True, blank=True)
    offer_response_date = models.DateField(null=True, blank=True)
    offer_accepted = models.BooleanField(null=True, blank=True)

    class Meta:
        ordering = ['-applied_at']
        unique_together = ['job', 'applicant']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['applied_at']),
            models.Index(fields=['job', 'status']),
        ]

    def __str__(self):
        return f"{self.applicant.get_full_name()} - {self.job.title} ({self.get_status_display()})"
        
    def save(self, *args, **kwargs):
        # Update job's applications count if this is a new application
        if not self.pk:
            self.job.increment_applications()
        super().save(*args, **kwargs)
        
    def get_status_display_class(self):
        status_classes = {
            'applied': 'bg-blue-100 text-blue-800',
            'screening': 'bg-purple-100 text-purple-800',
            'shortlisted': 'bg-indigo-100 text-indigo-800',
            'interview': 'bg-yellow-100 text-yellow-800',
            'offer': 'bg-green-100 text-green-800',
            'hired': 'bg-green-600 text-white',
            'rejected': 'bg-red-100 text-red-800',
            'withdrawn': 'bg-gray-100 text-gray-800',
        }
        return status_classes.get(self.status, 'bg-gray-100 text-gray-800')
        
    def mark_as_viewed(self):
        if not self.viewed_at:
            self.viewed_at = timezone.now()
            self.save(update_fields=['viewed_at'])
            
    def add_note(self, note, user):
        from .models import ApplicationNote
        return ApplicationNote.objects.create(
            application=self,
            note=note,
            created_by=user
        )
        
    def get_timeline_events(self):
        from django.contrib.admin.models import LogEntry
        from django.contrib.contenttypes.models import ContentType
        
        content_type = ContentType.objects.get_for_model(self)
        log_entries = LogEntry.objects.filter(
            content_type=content_type,
            object_id=self.id
        ).order_by('action_time')
        
        return log_entries


class ApplicationNote(models.Model):
    """Model to store notes for job applications"""
    application = models.ForeignKey(
        JobApplication,
        on_delete=models.CASCADE,
        related_name='application_notes'
    )
    note = models.TextField()
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='application_notes'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"Note on {self.application} by {self.created_by}"


class JobAlert(models.Model):
    """Model for job alerts/notifications"""
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='job_alerts'
    )
    name = models.CharField(max_length=100)
    search_params = models.JSONField()
    is_active = models.BooleanField(default=True)
    frequency = models.CharField(
        max_length=20,
        choices=[
            ('daily', 'Daily'),
            ('weekly', 'Weekly'),
            ('instant', 'Instant')
        ],
        default='daily'
    )
    last_sent = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.user.email}"