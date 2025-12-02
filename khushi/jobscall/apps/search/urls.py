from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from .views import (
    ping, 
    SearchLogViewSet, 
    JobSearchView,
    SavedSearchViewSet
)

# Main router
router = DefaultRouter()
router.register(r"logs", SearchLogViewSet, basename="search-log")
router.register(r"saved-searches", SavedSearchViewSet, basename="saved-search")

# Nested router for saved search actions
saved_search_router = routers.NestedSimpleRouter(router, r'saved-searches', lookup='savedsearch')
saved_search_router.register(r'execute', SavedSearchViewSet, basename='saved-search-execute')

urlpatterns = [
    # Health check
    path("ping/", ping, name="search-ping"),
    
    # Job search endpoint
    path("jobs/", JobSearchView.as_view(), name="job-search"),
    
    # Include router URLs
    path("", include(router.urls)),
    path("", include(saved_search_router.urls)),
    
    # API documentation
    path("docs/", include(
        [
            path("search/", include("rest_framework.urls", namespace="rest_framework")),
        ]
    )),
]
