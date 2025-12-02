from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import ImmediateAvailableProfile

User = get_user_model()


class UserBasicSerializer(serializers.ModelSerializer):
    """Basic user information serializer"""
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email']
        read_only_fields = fields
        ref_name = 'ImmediateAvailableUserBasic'  # Add unique ref_name


class ImmediateAvailableProfileSerializer(serializers.ModelSerializer):
    """Serializer for Immediate Available Profile"""
    user = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = ImmediateAvailableProfile
        fields = [
            'id', 'user', 'is_immediately_available', 'available_from',
            'notice_period', 'current_ctc', 'expected_ctc', 'preferred_locations',
            'skills', 'experience_years', 'experience_months', 'current_company',
            'current_designation', 'last_working_day', 'is_serving_notice',
            'notice_period_negotiable', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'user']


class ImmediateAvailableProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating Immediate Available Profile"""
    class Meta:
        model = ImmediateAvailableProfile
        fields = [
            'is_immediately_available', 'available_from', 'notice_period',
            'current_ctc', 'expected_ctc', 'preferred_locations', 'skills',
            'experience_years', 'experience_months', 'current_company',
            'current_designation', 'last_working_day', 'is_serving_notice',
            'notice_period_negotiable'
        ]

    def update(self, instance, validated_data):
        # Handle the update of the profile
        return super().update(instance, validated_data)


class ImmediateAvailableSearchSerializer(serializers.Serializer):
    """Serializer for searching immediate available candidates"""
    skills = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        help_text="List of skills to filter by"
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
    location = serializers.CharField(
        required=False,
        help_text="Preferred work location"
    )
    current_ctc_min = serializers.DecimalField(
        required=False,
        max_digits=10,
        decimal_places=2,
        min_value=0,
        help_text="Minimum current CTC"
    )
    current_ctc_max = serializers.DecimalField(
        required=False,
        max_digits=10,
        decimal_places=2,
        min_value=0,
        help_text="Maximum current CTC"
    )
    notice_period_max = serializers.IntegerField(
        required=False,
        min_value=0,
        help_text="Maximum notice period in days"
    )
    is_serving_notice = serializers.BooleanField(
        required=False,
        help_text="Filter candidates currently serving notice period"
    )
    notice_period_negotiable = serializers.BooleanField(
        required=False,
        help_text="Filter candidates with negotiable notice period"
    )
