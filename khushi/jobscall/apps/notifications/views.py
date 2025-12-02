from django.http import JsonResponse
from rest_framework import viewsets, permissions
from .models import NotificationTemplate, Delivery
from .serializers import NotificationTemplateSerializer, DeliverySerializer


def ping(request):
    """Simple health check endpoint"""
    return JsonResponse({"status": "ok"})






class NotificationTemplateViewSet(viewsets.ModelViewSet):
    queryset = NotificationTemplate.objects.all()
    serializer_class = NotificationTemplateSerializer
    permission_classes = [permissions.AllowAny]


class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.select_related("template", "user").all()
    serializer_class = DeliverySerializer
    permission_classes = [permissions.AllowAny]
