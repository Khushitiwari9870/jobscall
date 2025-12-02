from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ping, ProviderViewSet, CourseViewSet, EnrollmentViewSet, CertificateViewSet

router = DefaultRouter()
router.register(r"providers", ProviderViewSet, basename="provider")
router.register(r"courses", CourseViewSet, basename="course")
router.register(r"enrollments", EnrollmentViewSet, basename="enrollment")
router.register(r"certificates", CertificateViewSet, basename="certificate")

urlpatterns = [
    path("ping/", ping, name="learning-ping"),
    path("", include(router.urls)),
]
