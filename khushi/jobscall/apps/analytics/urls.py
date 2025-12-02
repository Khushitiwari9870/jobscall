from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ping, EventViewSet

router = DefaultRouter()
router.register(r"events", EventViewSet, basename="event")

urlpatterns = [
    path("ping/", ping, name="analytics-ping"),
    path("", include(router.urls)),
]
