from rest_framework import serializers
from .models import CandidateEmbedding, JobEmbedding, MatchScore


class CandidateEmbeddingSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="candidate.user.username", read_only=True)

    class Meta:
        model = CandidateEmbedding
        fields = ["id", "candidate", "username", "vector", "updated_at"]
        read_only_fields = ["updated_at", "username"]


class JobEmbeddingSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source="job.company.name", read_only=True)

    class Meta:
        model = JobEmbedding
        fields = ["id", "job", "company_name", "vector", "updated_at"]
        read_only_fields = ["updated_at", "company_name"]


class MatchScoreSerializer(serializers.ModelSerializer):
    candidate_username = serializers.CharField(source="candidate.user.username", read_only=True)
    job_title = serializers.CharField(source="job.title", read_only=True)

    class Meta:
        model = MatchScore
        fields = [
            "id",
            "candidate",
            "candidate_username",
            "job",
            "job_title",
            "score",
            "created_at",
        ]
        read_only_fields = ["created_at", "candidate_username", "job_title"]
