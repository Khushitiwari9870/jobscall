from django.http import JsonResponse
from rest_framework import viewsets, permissions, filters
from .models import Application
from .serializers import ApplicationSerializer


def ping(_request):
    return JsonResponse({"status": "ok", "app": "applications"})


class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.select_related("candidate__user", "job__company").all()
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        "candidate__user__username",
        "job__title",
        "job__company__name",
        "status",
    ]
    ordering_fields = ["applied_at", "updated_at"]
    filterset_fields = {
        "candidate": ["exact"],
        "job": ["exact"],
        "status": ["exact"],
        "applied_at": ["date", "gte", "lte"],
    }
