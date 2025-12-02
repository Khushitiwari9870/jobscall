from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'resume_enhancer'

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'enhancements', views.ResumeEnhancementViewSet, basename='enhancement')

# The API URLs are now determined automatically by the router
urlpatterns = [
    path('', include(router.urls)),
    
    # Additional custom endpoints
    path('enhancement-types/', 
         views.ResumeEnhancementViewSet.as_view({'get': 'enhancement_types'}), 
         name='enhancement-types'),
]
