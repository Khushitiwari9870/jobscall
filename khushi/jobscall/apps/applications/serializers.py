from rest_framework import serializers
from .models import Application
from apps.profile.serializers import UserProfileSerializer


class ApplicationSerializer(serializers.ModelSerializer):
    candidate_details = serializers.SerializerMethodField(read_only=True)
    job_title = serializers.CharField(source="job.title", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Application
        fields = [
            "id",
            "candidate",
            "candidate_details",
            "job",
            "job_title",
            "status",
            "status_display",
            "resume_url",
            "cover_letter",
            "applied_at",
            "updated_at",
        ]
        read_only_fields = [
            "applied_at",
            "updated_at",
            "candidate_details",
            "job_title",
            "status_display"
        ]
    
    def get_candidate_details(self, obj):
        from apps.profile.serializers import UserProfileSerializer
        return UserProfileSerializer(obj.candidate, context=self.context).data
