from rest_framework import serializers
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from .models import CandidateSearchQuery, SavedSearch as CandidateSavedSearch, SearchFilterOption
from apps.profile.models import UserProfile


class SearchFilterOptionSerializer(serializers.ModelSerializer):
    """Serializer for search filter options"""
    class Meta:
        model = SearchFilterOption
        fields = ['id', 'filter_type', 'name', 'value', 'display_order']
        read_only_fields = ['id']


class CandidateSearchQuerySerializer(serializers.ModelSerializer):
    """Serializer for candidate search queries"""
    class Meta:
        model = CandidateSearchQuery
        fields = [
            'id', 'query', 'results_count', 'is_saved', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'results_count']


class SavedSearchSerializer(serializers.ModelSerializer):
    """Serializer for saved searches"""
    class Meta:
        model = CandidateSavedSearch
        fields = [
            'id', 'name', 'search_parameters', 'is_active',
            'last_run', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'last_run']
        ref_name = 'CandidateSearchSavedSearch'  # Add unique ref_name to avoid conflict


class CandidateProfileSerializer(serializers.ModelSerializer):
    """Serializer for candidate profile search results"""
    name = serializers.SerializerMethodField()
    current_title = serializers.SerializerMethodField()
    current_company = serializers.SerializerMethodField()
    experience = serializers.SerializerMethodField()
    skills = serializers.ListField(child=serializers.CharField())
    location = serializers.SerializerMethodField()
    last_active = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'name', 'current_title', 'current_company', 'experience',
            'skills', 'location', 'last_active', 'email', 'headline',
            'designation', 'experience_years', 'phone_number', 'city', 'country',
            'created_at', 'updated_at'
        ]
    
    def get_current_company(self, obj):
        return obj.current_company or ""
    
    def get_experience(self, obj):
        return f"{obj.experience_years} years" if obj.experience_years else ""
    def get_skills(self, obj):
        # Assuming skills is a comma-separated string
        return [skill.strip() for skill in obj.skills.split(',')[:5]] if obj.skills else []
    
    def get_location(self, obj):
        return obj.location or ""
    
    def get_last_active(self, obj):
        if obj.updated_at:
            delta = timezone.now() - obj.updated_at
            days = delta.days
            if days == 0:
                return "Today"
            elif days == 1:
                return "Yesterday"
            elif days < 30:
                return f"{days} days ago"
            else:
                months = days // 30
                return f"{months} month{'s' if months > 1 else ''} ago"
        return ""
        return ""


class AdvancedSearchSerializer(serializers.Serializer):
    """Serializer for advanced search parameters"""
    keyword = serializers.CharField(required=False, allow_blank=True)
    location = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list
    )
    experience = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField(),
            allow_empty=True
        ),
        required=False,
        default=list
    )
    salary = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField(),
            allow_empty=True
        ),
        required=False,
        default=list
    )
    skills = serializers.ListField(
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
    gender = serializers.CharField(required=False, allow_blank=True)
    notice_period = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list
    )
    work_mode = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list
    )
    sort_by = serializers.CharField(required=False, default='relevance')
    page = serializers.IntegerField(required=False, default=1, min_value=1)
    per_page = serializers.IntegerField(required=False, default=10, min_value=1, max_value=100)
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
