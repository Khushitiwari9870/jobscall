from django.http import JsonResponse
from rest_framework import viewsets, permissions
from .models import Provider, Course, Enrollment, Certificate
from .serializers import ProviderSerializer, CourseSerializer, EnrollmentSerializer, CertificateSerializer


def ping(_request):
    return JsonResponse({"status": "ok", "app": "learning"})


class ProviderViewSet(viewsets.ModelViewSet):
    queryset = Provider.objects.all()
    serializer_class = ProviderSerializer
    permission_classes = [permissions.AllowAny]


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.select_related("provider").all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]


class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.select_related("user", "course").all()
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.AllowAny]


class CertificateViewSet(viewsets.ModelViewSet):
    queryset = Certificate.objects.select_related("enrollment").all()
    serializer_class = CertificateSerializer
    permission_classes = [permissions.AllowAny]
