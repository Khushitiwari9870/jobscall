from django.http import JsonResponse
from rest_framework import viewsets, permissions, filters
from apps.profile.models import UserProfile
from .serializers import CandidateProfileSerializer


def ping(_request):
    return JsonResponse({"status": "ok", "app": "users"})


class CandidateProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all().select_related("user")
    serializer_class = CandidateProfileSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["user__first_name", "user__last_name", "headline", "current_company", "designation", "skills"]
    ordering_fields = ["created_at", "updated_at", "experience_years"]
    filterset_fields = {
        "experience_years": ["gte", "lte"],
        "city": ["exact", "icontains"],
        "user": ["exact"],
    }
