from django.urls import path
from django.urls import include
from rest_framework.routers import DefaultRouter
from .views import ping, CandidateProfileViewSet

router = DefaultRouter()
router.register(r"candidates", CandidateProfileViewSet, basename="candidate")

urlpatterns = [
    path("ping/", ping, name="users-ping"),
    path("", include(router.urls)),
]
