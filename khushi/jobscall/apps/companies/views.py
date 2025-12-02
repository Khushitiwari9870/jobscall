from django.http import JsonResponse
from rest_framework import viewsets, permissions, filters
from .models import Company
from .serializers import CompanySerializer


def ping(_request):
    return JsonResponse({"status": "ok", "app": "companies"})


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "website", "location", "description"]
    ordering_fields = ["created_at", "updated_at", "name"]
    filterset_fields = {
        "name": ["exact", "icontains"],
        "location": ["exact", "icontains"],
        "created_at": ["date", "gte", "lte"],
    }
