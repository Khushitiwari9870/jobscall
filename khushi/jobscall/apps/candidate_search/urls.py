from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'candidate_search'

# Main router for all viewsets
router = DefaultRouter()
router.register(r'filter-options', views.SearchFilterOptionViewSet, basename='filter-options')
router.register(r'saved-searches', views.SavedSearchViewSet, basename='saved-searches')

# Search endpoints
search_patterns = [
    path('', views.CandidateSearchViewSet.as_view({'post': 'search'}), name='candidate-search'),
    path('suggestions/', views.CandidateSearchViewSet.as_view({'get': 'suggestions'}), name='search-suggestions'),
    path('filters/', views.CandidateSearchViewSet.as_view({'get': 'available_filters'}), name='available-filters'),
]

urlpatterns = [
    path('', include(router.urls)),
    path('search/', include(search_patterns)),
]
