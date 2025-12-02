from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ping, PageViewSet, FAQViewSet

router = DefaultRouter()
router.register(r"pages", PageViewSet, basename="page")
router.register(r"faqs", FAQViewSet, basename="faq")

urlpatterns = [
    path("ping/", ping, name="cms-ping"),
    path("", include(router.urls)),
]
