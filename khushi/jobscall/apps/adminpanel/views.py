from django.http import JsonResponse
from rest_framework import viewsets, permissions
from .models import AdminActivity
from .serializers import AdminActivitySerializer


def ping(_request):
    return JsonResponse({"status": "ok", "app": "adminpanel"})


class AdminActivityViewSet(viewsets.ModelViewSet):
    queryset = AdminActivity.objects.select_related("user").all()
    serializer_class = AdminActivitySerializer
    permission_classes = [permissions.AllowAny]
