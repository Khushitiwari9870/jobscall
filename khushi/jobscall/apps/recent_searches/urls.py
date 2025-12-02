from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'recent-searches', views.RecentSearchViewSet, basename='recent-search')
router.register(r'admin/recent-searches', views.RecentSearchAdminViewSet, basename='admin-recent-search')

urlpatterns = [
    path('', include(router.urls)),
]
