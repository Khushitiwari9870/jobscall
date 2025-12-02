from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import post_save
from django.dispatch import receiver

User = get_user_model()

class BaseProfile(models.Model):
    """Abstract base profile model with common fields"""
    # Contact Information
    phone_number = models.CharField(_('Phone Number'), max_length=20, blank=True)
    
    # Address Information
    address = models.TextField(_('Address'), blank=True)
    city = models.CharField(_('City'), max_length=100, blank=True)
    state = models.CharField(_('State'), max_length=100, blank=True)
    country = models.CharField(_('Country'), max_length=100, blank=True)
    pincode = models.CharField(_('Pincode'), max_length=10, blank=True)
    
    # Profile Status
    profile_completion = models.PositiveIntegerField(_('Profile Completion %'), default=0)
    is_profile_public = models.BooleanField(_('Profile Public'), default=True)
    
    # Timestamps
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    
    class Meta:
        abstract = True


class UserProfile(BaseProfile):
    """Profile for job candidates"""
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='candidate_profile',
        verbose_name=_('User'),
        limit_choices_to={'user_type': 'candidate'}
    )
    
    # Personal Information
    date_of_birth = models.DateField(_('Date of Birth'), null=True, blank=True)
    gender = models.CharField(
        _('Gender'),
        max_length=20,  # Increased from 10 to 20 to accommodate all choice values
        choices=[
            ('male', _('Male')),
            ('female', _('Female')),
            ('other', _('Other')),
            ('prefer_not_to_say', _('Prefer not to say')),
        ],
        blank=True,
        null=True
    )
    
    # Professional Information
    headline = models.CharField(_('Headline'), max_length=255, blank=True)
    current_company = models.CharField(_('Current Company'), max_length=255, blank=True)
    designation = models.CharField(_('Designation'), max_length=255, blank=True)
    experience_years = models.PositiveIntegerField(_('Years of Experience'), default=0)
    experience_months = models.PositiveIntegerField(_('Months of Experience'), default=0)
    
    # Education
    highest_qualification = models.CharField(_('Highest Qualification'), max_length=255, blank=True)
    institute = models.CharField(_('Institute'), max_length=255, blank=True)
    year_of_passing = models.PositiveIntegerField(_('Year of Passing'), null=True, blank=True)
    
    # Skills & Preferences
    skills = models.JSONField(_('Skills'), default=list, blank=True)
    preferred_locations = models.JSONField(_('Preferred Locations'), default=list, blank=True)
    job_roles = models.JSONField(_('Preferred Job Roles'), default=list, blank=True)
    
    class Meta:
        verbose_name = _('Candidate Profile')
        verbose_name_plural = _('Candidate Profiles')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.get_full_name() or self.user.email} - {self.headline or 'Candidate'}"


class EmployerProfile(BaseProfile):
    """Profile for employers/companies"""
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='employer_profile',
        verbose_name=_('User'),
        limit_choices_to={'user_type': 'employer'}
    )
    
    # Company Information
    company_name = models.CharField(_('Company Name'), max_length=255)
    company_website = models.URLField(_('Company Website'), blank=True)
    company_logo = models.ImageField(
        _('Company Logo'),
        upload_to='company_logos/',
        null=True,
        blank=True
    )
    company_description = models.TextField(_('Company Description'), blank=True)
    
    # Contact Person
    contact_person_name = models.CharField(_('Contact Person Name'), max_length=255, blank=True)
    contact_person_designation = models.CharField(_('Designation'), max_length=255, blank=True)
    
    # Social Media
    linkedin_url = models.URLField(_('LinkedIn Profile'), blank=True)
    twitter_url = models.URLField(_('Twitter Profile'), blank=True)
    
    # Company Size
    COMPANY_SIZE_CHOICES = [
        ('1-10', '1-10 employees'),
        ('11-50', '11-50 employees'),
        ('51-200', '51-200 employees'),
        ('201-500', '201-500 employees'),
        ('501-1000', '501-1000 employees'),
        ('1001-5000', '1001-5000 employees'),
        ('5000+', '5000+ employees'),
    ]
    company_size = models.CharField(
        _('Company Size'),
        max_length=20,
        choices=COMPANY_SIZE_CHOICES,
        blank=True
    )
    
    # Industry
    industry = models.CharField(_('Industry'), max_length=255, blank=True)
    
    class Meta:
        verbose_name = _('Employer Profile')
        verbose_name_plural = _('Employer Profiles')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.company_name} - {self.contact_person_name or self.user.email}"
    
    class Meta:
        verbose_name = _('User Profile')
        verbose_name_plural = _('User Profiles')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.get_full_name()}'s Profile"
    
    def calculate_profile_completion(self):
        """Calculate profile completion percentage"""
        total_fields = 15  # Total number of fields to check
        completed_fields = 0
        
        # Check personal information
        if self.date_of_birth:
            completed_fields += 1
        if self.gender:
            completed_fields += 1
            
        # Check contact information
        if self.phone_number:
            completed_fields += 1
        if self.address and self.city and self.country and self.pincode:
            completed_fields += 1
            
        # Check professional information
        if self.current_company and self.designation:
            completed_fields += 1
        if self.experience_years > 0 or self.experience_months > 0:
            completed_fields += 1
            
        # Check education
        if self.highest_qualification and self.institute and self.year_of_passing:
            completed_fields += 1
            
        # Check skills and preferences
        if self.skills:
            completed_fields += 1
        if self.preferred_locations:
            completed_fields += 1
        if self.job_roles:
            completed_fields += 1
            
        # Calculate percentage (ensure it doesn't exceed 100%)
        completion_percentage = min(100, int((completed_fields / total_fields) * 100))
        return completion_percentage
    
    def save(self, *args, **kwargs):
        # Update profile completion percentage before saving
        self.profile_completion = self.calculate_profile_completion()
        super().save(*args, **kwargs)
