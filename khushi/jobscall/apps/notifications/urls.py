from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ping, NotificationTemplateViewSet, DeliveryViewSet

router = DefaultRouter()
router.register(r"templates", NotificationTemplateViewSet, basename="notification-template")
router.register(r"deliveries", DeliveryViewSet, basename="delivery")

urlpatterns = [
    path("ping/", ping, name="notifications-ping"),
    path("", include(router.urls)),
]
