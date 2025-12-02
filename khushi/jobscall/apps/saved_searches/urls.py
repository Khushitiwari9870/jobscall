from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'saved_searches'

# Create a router for our viewsets
router = DefaultRouter()
router.register(r'my-searches', views.SavedSearchViewSet, basename='my-searches')
router.register(r'admin/searches', views.SavedSearchAdminViewSet, basename='admin-searches')

urlpatterns = [
    # API endpoints
    path('api/', include(router.urls)),
    
    # Advanced candidate search endpoint
    path('api/candidates/advanced-search/', 
         views.CandidateAdvancedSearchView.as_view(), 
         name='candidate-advanced-search'),
    
    # Saved searches for candidates
    path('api/candidates/saved-searches/', 
         views.SavedSearchViewSet.as_view({
             'get': 'list',
             'post': 'create'
         }), 
         name='candidate-saved-searches'),
    
    # Individual saved search for candidates
    path('api/candidates/saved-searches/<int:pk>/', 
         views.SavedSearchViewSet.as_view({
             'get': 'retrieve',
             'put': 'update',
             'patch': 'partial_update',
             'delete': 'destroy',
             'post': 'run'
         }), 
         name='candidate-saved-search-detail'),
]
