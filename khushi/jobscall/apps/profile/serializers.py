from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserProfile

User = get_user_model()

class UserBasicSerializer(serializers.ModelSerializer):
    """Basic user information serializer"""
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email']
        read_only_fields = fields
        ref_name = 'ProfileUserBasic'  # Add unique ref_name

class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile"""
    user = UserBasicSerializer(read_only=True)
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'full_name', 'date_of_birth', 'gender',
            'phone_number', 'alternate_phone', 'address', 'city',
            'state', 'country', 'pincode', 'current_company',
            'designation', 'experience_years', 'experience_months',
            'highest_qualification', 'institute', 'year_of_passing',
            'skills', 'preferred_locations', 'job_roles',
            'profile_completion', 'is_profile_public', 'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'profile_completion']
    
    def get_full_name(self, obj):
        return obj.user.get_full_name()

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile"""
    class Meta:
        model = UserProfile
        fields = [
            'date_of_birth', 'gender', 'phone_number', 'alternate_phone',
            'address', 'city', 'state', 'country', 'pincode',
            'current_company', 'designation', 'experience_years',
            'experience_months', 'highest_qualification', 'institute',
            'year_of_passing', 'skills', 'preferred_locations',
            'job_roles', 'is_profile_public'
        ]
    
    def update(self, instance, validated_data):
        # Update the instance with validated data
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class ProfileSearchSerializer(serializers.Serializer):
    """Serializer for profile search"""
    skills = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        help_text="List of skills to search for"
    )
    location = serializers.CharField(
        required=False,
        help_text="Location to search in"
    )
    experience_min = serializers.IntegerField(
        required=False,
        min_value=0,
        help_text="Minimum years of experience"
    )
    experience_max = serializers.IntegerField(
        required=False,
        min_value=0,
        help_text="Maximum years of experience"
    )
    current_company = serializers.CharField(
        required=False,
        help_text="Current company name"
    )
    designation = serializers.CharField(
        required=False,
        help_text="Current designation"
    )
    
    def validate(self, data):
        """Validate the search parameters"""
        if 'experience_min' in data and 'experience_max' in data:
            if data['experience_min'] > data['experience_max']:
                raise serializers.ValidationError({
                    'experience_min': 'Minimum experience cannot be greater than maximum experience'
                })
        return data
