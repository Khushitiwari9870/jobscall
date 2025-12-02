from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from .models import SavedSearch


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


class SavedSearchSerializer(serializers.ModelSerializer):
    """Serializer for the SavedSearch model"""
    class Meta:
        model = SavedSearch
        fields = [
            'id', 'name', 'search_type', 'query', 'location', 
            'experience', 'salary', 'job_type', 'skills', 'company',
            'industry', 'department', 'role', 'education', 'gender',
            'age', 'last_active', 'notice_period', 'work_mode',
            'job_change', 'willing_to_relocate', 'is_active', 
            'email_alerts', 'alert_frequency', 'created_at', 
            'updated_at', 'last_run', 'total_results'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'last_run', 'total_results']
    
    def validate(self, data):
        """Validate the saved search data"""
        search_type = data.get('search_type', '')
        
        # Define required parameters based on search type
        if search_type == 'advanced_candidate':
            search_params = [
                'query', 'location', 'experience', 'salary', 'job_type', 
                'skills', 'company', 'industry', 'department', 'role', 
                'education', 'gender', 'age', 'last_active', 'notice_period',
                'work_mode', 'job_change', 'willing_to_relocate'
            ]
        else:
            search_params = ['query', 'location', 'experience', 'salary', 'job_type', 'skills', 'company']
        
        # Ensure at least one search parameter is provided
        if not any(field in data for field in search_params):
            raise serializers.ValidationError(_("At least one search parameter is required."))
        
        # Validate email alerts settings
        if data.get('email_alerts') and not data.get('is_active', True):
            raise serializers.ValidationError({
                'is_active': _("Search must be active to receive email alerts.")
            })
            
        return data
    
    def create(self, validated_data):
        """Create a new saved search"""
        # Set the current user as the owner
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class SavedSearchListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing saved searches"""
    class Meta:
        model = SavedSearch
        fields = [
            'id', 'name', 'search_type', 'query', 'location', 
            'is_active', 'email_alerts', 'last_run', 'total_results'
        ]
        read_only_fields = fields


class CandidateSearchResultSerializer(serializers.Serializer):
    """Serializer for candidate search results"""
    id = serializers.IntegerField()
    name = serializers.CharField()
    headline = serializers.CharField(required=False, allow_blank=True)
    location = serializers.CharField(required=False, allow_blank=True)
    experience = serializers.FloatField(required=False, allow_null=True)
    skills = serializers.ListField(child=serializers.CharField(), default=list)
    last_active = serializers.CharField(required=False, allow_blank=True)


class SavedSearchRunSerializer(serializers.Serializer):
    """Serializer for running a saved search"""
    save_results = serializers.BooleanField(
        default=False,
        help_text=_("Whether to update the search result counters")
    )
    
    def validate(self, data):
        """Validate the run request"""
        return data
