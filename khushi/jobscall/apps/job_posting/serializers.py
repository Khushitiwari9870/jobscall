from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from .models import JobPosting, JobApplication, ApplicationNote
from apps.companies.serializers import CompanySerializer
from apps.users.serializers import UserSerializer


class JobPostingListSerializer(serializers.ModelSerializer):
    """Serializer for listing job postings with basic information."""
    company = CompanySerializer(read_only=True)
    application_count = serializers.IntegerField(
        source='applications.count',
        read_only=True
    )
    
    class Meta:
        model = JobPosting
        fields = [
            'id', 'title', 'company', 'location', 'job_type',
            'experience_level', 'min_salary', 'max_salary',
            'salary_currency', 'is_remote', 'status', 'created_at',
            'application_count', 'views_count'
        ]
        read_only_fields = ('id', 'created_at', 'application_count', 'views_count')


class JobPostingDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for job postings."""
    company = CompanySerializer(read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    posted_by = UserSerializer(read_only=True)
    
    class Meta:
        model = JobPosting
        fields = [
            'id', 'title', 'description', 'requirements', 'responsibilities',
            'benefits', 'company', 'location', 'is_remote', 'job_type',
            'experience_level', 'min_salary', 'max_salary', 'salary_currency',
            'salary_display', 'application_url', 'application_email',
            'application_instructions', 'status', 'is_featured', 'views_count',
            'applications_count', 'created_at', 'updated_at', 'published_at',
            'closed_at', 'expires_at', 'posted_by', 'is_active'
        ]
        read_only_fields = (
            'id', 'created_at', 'updated_at', 'published_at', 'closed_at',
            'views_count', 'applications_count', 'is_active'
        )
    
    def validate(self, data):
        """Validate that max_salary is greater than min_salary if both are provided."""
        min_salary = data.get('min_salary')
        max_salary = data.get('max_salary')
        
        if min_salary is not None and max_salary is not None and min_salary > max_salary:
            raise serializers.ValidationError({
                'max_salary': _('Maximum salary must be greater than minimum salary.')
            })
        
        return data


class JobPostingCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating job postings."""
    class Meta:
        model = JobPosting
        fields = [
            'title', 'description', 'requirements', 'responsibilities',
            'benefits', 'company', 'location', 'is_remote', 'job_type',
            'experience_level', 'min_salary', 'max_salary', 'salary_currency',
            'salary_display', 'application_url', 'application_email',
            'application_instructions', 'status', 'is_featured', 'expires_at'
        ]
    
    def create(self, validated_data):
        """Set the posted_by user to the current user."""
        validated_data['posted_by'] = self.context['request'].user
        return super().create(validated_data)


class ApplicationNoteSerializer(serializers.ModelSerializer):
    """Serializer for application notes."""
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = ApplicationNote
        fields = ['id', 'note', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ('id', 'created_by', 'created_at', 'updated_at')


class JobApplicationSerializer(serializers.ModelSerializer):
    """Serializer for job applications."""
    applicant = UserSerializer(read_only=True)
    notes = ApplicationNoteSerializer(many=True, read_only=True)
    job_posting = JobPostingListSerializer(read_only=True)
    
    class Meta:
        model = JobApplication
        fields = [
            'id', 'job_posting', 'applicant', 'cover_letter', 'resume',
            'linkedin_profile', 'portfolio_url', 'status', 'source',
            'is_reviewed', 'is_rejected', 'rejection_reason', 'rating',
            'notes', 'applied_at', 'updated_at', 'reviewed_at'
        ]
        read_only_fields = (
            'id', 'applicant', 'applied_at', 'updated_at', 'reviewed_at',
            'is_reviewed', 'is_rejected', 'notes'
        )
    
    def validate(self, data):
        """Validate that the user hasn't already applied to this job."""
        request = self.context.get('request')
        job_posting = self.context.get('job_posting')
        
        if request and job_posting:
            if JobApplication.objects.filter(
                job_posting=job_posting,
                applicant=request.user
            ).exists():
                raise serializers.ValidationError({
                    'non_field_errors': [_('You have already applied to this job.')]
                })
        
        return data


class JobApplicationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating job applications."""
    class Meta:
        model = JobApplication
        fields = [
            'cover_letter', 'resume', 'linkedin_profile', 'portfolio_url'
        ]
    
    def create(self, validated_data):
        """Set the applicant and job_posting for the application."""
        request = self.context.get('request')
        job_posting = self.context.get('job_posting')
        
        validated_data['applicant'] = request.user
        validated_data['job_posting'] = job_posting
        
        return super().create(validated_data)


class JobApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating job application status."""
    class Meta:
        model = JobApplication
        fields = ['status', 'rejection_reason']
    
    def update(self, instance, validated_data):
        """Handle status updates and related actions."""
        status = validated_data.get('status', instance.status)
        
        # If status is being updated to 'rejected', ensure rejection_reason is provided
        if status == 'rejected' and not validated_data.get('rejection_reason'):
            raise serializers.ValidationError({
                'rejection_reason': _('Rejection reason is required when rejecting an application.')
            })
        
        return super().update(instance, validated_data)


class JobApplicationNoteCreateSerializer(serializers.ModelSerializer):
    """Serializer for adding notes to a job application."""
    class Meta:
        model = ApplicationNote
        fields = ['note']
    
    def create(self, validated_data):
        """Set the application and created_by user for the note."""
        application = self.context.get('application')
        created_by = self.context.get('request').user
        
        return ApplicationNote.objects.create(
            application=application,
            created_by=created_by,
            **validated_data
        )
