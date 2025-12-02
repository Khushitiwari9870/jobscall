from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ping, SavedSearchViewSet, AlertScheduleViewSet, AlertDeliveryViewSet

router = DefaultRouter()
router.register(r"saved-searches", SavedSearchViewSet, basename="saved-search")
router.register(r"schedules", AlertScheduleViewSet, basename="alert-schedule")
router.register(r"deliveries", AlertDeliveryViewSet, basename="alert-delivery")

urlpatterns = [
    path("ping/", ping, name="alerts-ping"),
    path("", include(router.urls)),
]
