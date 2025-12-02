from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ping, AdminActivityViewSet

router = DefaultRouter()
router.register(r"activities", AdminActivityViewSet, basename="admin-activity")

urlpatterns = [
    path("ping/", ping, name="adminpanel-ping"),
    path("", include(router.urls)),
]
