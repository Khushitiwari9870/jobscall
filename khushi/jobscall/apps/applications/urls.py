from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ping, ApplicationViewSet

router = DefaultRouter()
router.register(r"applications", ApplicationViewSet, basename="application")

urlpatterns = [
    path("ping/", ping, name="applications-ping"),
    path("", include(router.urls)),
]
