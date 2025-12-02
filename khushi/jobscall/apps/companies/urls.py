from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ping, CompanyViewSet

router = DefaultRouter()
router.register(r"companies", CompanyViewSet, basename="company")

urlpatterns = [
    path("ping/", ping, name="companies-ping"),
    path("", include(router.urls)),
]
