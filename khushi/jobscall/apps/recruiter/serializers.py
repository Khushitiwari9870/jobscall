from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from .models import (
    RecruiterProfile,
    RecruiterMembership,
    JobPosting,
    CandidateSearch,
    RecruiterActivity
)


class RecruiterProfileSerializer(serializers.ModelSerializer):
    """Serializer for RecruiterProfile model"""
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    company_name = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = RecruiterProfile
        fields = [
            'id', 'email', 'first_name', 'last_name', 'company', 'company_name',
            'job_title', 'phone', 'is_verified', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ('id', 'is_verified', 'created_at', 'updated_at')
    
    def update(self, instance, validated_data):
        # Handle nested user data
        user_data = validated_data.pop('user', {})
        user = instance.user
        
        # Update user fields if provided
        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()
        
        # Update profile fields
        return super().update(instance, validated_data)


class RecruiterMembershipSerializer(serializers.ModelSerializer):
    """Serializer for RecruiterMembership model"""
    tier_display = serializers.CharField(source='get_tier_display', read_only=True)
    
    class Meta:
        model = RecruiterMembership
        fields = [
            'id', 'tier', 'tier_display', 'job_postings_remaining', 
            'candidate_views_remaining', 'can_contact_candidates', 'can_use_ats',
            'expires_at', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ('id', 'created_at', 'updated_at')


class JobPostingSerializer(serializers.ModelSerializer):
    """Serializer for JobPosting model"""
    job_title = serializers.CharField(source='job.title', read_only=True)
    company_name = serializers.CharField(source='recruiter.company.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = JobPosting
        fields = [
            'id', 'job', 'job_title', 'recruiter', 'company_name', 'status', 
            'status_display', 'is_featured', 'is_urgent', 'views', 'applications',
            'created_at', 'updated_at', 'published_at', 'closed_at'
        ]
        read_only_fields = (
            'id', 'job_title', 'company_name', 'status_display', 'views', 
            'applications', 'created_at', 'updated_at', 'published_at', 'closed_at'
        )


class CandidateSearchSerializer(serializers.ModelSerializer):
    """Serializer for CandidateSearch model"""
    class Meta:
        model = CandidateSearch
        fields = [
            'id', 'name', 'recruiter', 'search_parameters', 
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ('id', 'recruiter', 'created_at', 'updated_at')
    
    def create(self, validated_data):
        # Automatically set the recruiter to the current user's recruiter profile
        recruiter = self.context['request'].user.recruiter_profile
        return CandidateSearch.objects.create(recruiter=recruiter, **validated_data)


class RecruiterActivitySerializer(serializers.ModelSerializer):
    """Serializer for RecruiterActivity model"""
    activity_type_display = serializers.CharField(
        source='get_activity_type_display', 
        read_only=True
    )
    
    class Meta:
        model = RecruiterActivity
        fields = [
            'id', 'recruiter', 'activity_type', 'activity_type_display',
            'details', 'ip_address', 'user_agent', 'created_at'
        ]
        read_only_fields = ('id', 'created_at')


class CandidateAdvancedSearchSerializer(serializers.Serializer):
    """Serializer for advanced candidate search parameters"""
    keyword = serializers.CharField(required=False, allow_blank=True)
    location = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list
    )
    experience = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list
    )
    salary = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list
    )
    job_type = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list
    )
    company = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list
    )
    skills = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list
    )
    industry = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list
    )
    department = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list
    )
    role = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list
    )
    education = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list
    )
    gender = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list
    )
    age = serializers.DictField(
        child=serializers.IntegerField(),
        required=False,
        default=dict
    )
    last_active = serializers.CharField(required=False, allow_blank=True)
    notice_period = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list
    )
    expected_ctc = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list
    )
    work_mode = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list
    )
    job_change = serializers.BooleanField(required=False, default=None, allow_null=True)
    willing_to_relocate = serializers.BooleanField(required=False, default=None, allow_null=True)

    def validate(self, data):
        # Add any custom validation logic here
        return data


class RecruiterDashboardSerializer(serializers.Serializer):
    """Serializer for recruiter dashboard data"""
    active_jobs = serializers.IntegerField()
    total_applications = serializers.IntegerField()
    profile_completeness = serializers.IntegerField()
    membership_status = serializers.DictField()
    recent_activities = RecruiterActivitySerializer(many=True)
    recent_applications = serializers.ListField()
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Add any additional data processing here
        return data
