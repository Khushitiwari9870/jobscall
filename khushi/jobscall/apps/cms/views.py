from django.http import JsonResponse
from rest_framework import viewsets, permissions
from .models import Page, FAQ
from .serializers import PageSerializer, FAQSerializer


def ping(_request):
    return JsonResponse({"status": "ok", "app": "cms"})


class PageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    permission_classes = [permissions.AllowAny]


class FAQViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    permission_classes = [permissions.AllowAny]
