from django.http import JsonResponse
from rest_framework import viewsets, permissions
from .models import CandidateEmbedding, JobEmbedding, MatchScore
from .serializers import CandidateEmbeddingSerializer, JobEmbeddingSerializer, MatchScoreSerializer


def ping(_request):
    return JsonResponse({"status": "ok", "app": "matching"})


class CandidateEmbeddingViewSet(viewsets.ModelViewSet):
    queryset = CandidateEmbedding.objects.select_related("candidate__user").all()
    serializer_class = CandidateEmbeddingSerializer
    permission_classes = [permissions.AllowAny]


class JobEmbeddingViewSet(viewsets.ModelViewSet):
    queryset = JobEmbedding.objects.select_related("job__company").all()
    serializer_class = JobEmbeddingSerializer
    permission_classes = [permissions.AllowAny]


class MatchScoreViewSet(viewsets.ModelViewSet):
    queryset = MatchScore.objects.select_related("candidate__user", "job__company").all()
    serializer_class = MatchScoreSerializer
    permission_classes = [permissions.AllowAny]
