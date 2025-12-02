from rest_framework import serializers
from django.contrib.auth import get_user_model
from apps.profile.models import UserProfile

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "first_name", "last_name", "user_type")
        read_only_fields = ("id", "user_type")


class CandidateProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    skills = serializers.ListField(child=serializers.CharField(), required=False)
    full_name = serializers.SerializerMethodField()
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = UserProfile
        fields = (
            "id",
            "user",
            "email",
            "full_name",
            "headline",
            "current_company",
            "designation",
            "experience_years",
            "skills",
            "phone_number",
            "city",
            "country",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at", "full_name")
    
    def get_full_name(self, obj):
        return obj.user.get_full_name()
