from rest_framework import serializers
from .models import Provider, Course, Enrollment, Certificate


class ProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provider
        fields = ["id", "name", "website", "description", "created_at"]
        read_only_fields = ["created_at"]


class CourseSerializer(serializers.ModelSerializer):
    provider_name = serializers.CharField(source="provider.name", read_only=True)

    class Meta:
        model = Course
        fields = [
            "id",
            "provider",
            "provider_name",
            "title",
            "slug",
            "description",
            "duration_hours",
            "price",
            "currency",
            "created_at",
        ]
        read_only_fields = ["created_at", "provider_name"]


class EnrollmentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    course_title = serializers.CharField(source="course.title", read_only=True)

    class Meta:
        model = Enrollment
        fields = [
            "id",
            "user",
            "username",
            "course",
            "course_title",
            "enrolled_at",
            "completed_at",
        ]
        read_only_fields = ["enrolled_at", "username", "course_title"]


class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = ["id", "enrollment", "certificate_id", "issued_at", "url"]
        read_only_fields = ["issued_at"]
