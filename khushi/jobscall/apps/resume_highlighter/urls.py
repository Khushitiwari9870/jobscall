from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'resume_highlighter'

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'analyses', views.ResumeAnalysisViewSet, basename='analysis')
router.register(r'highlights', views.ResumeHighlightViewSet, basename='highlight')

# The API URLs are now determined automatically by the router
urlpatterns = [
    path('', include(router.urls)),
    
    # Additional custom endpoints
    path('analyses/analyze/', 
         views.ResumeAnalysisViewSet.as_view({'post': 'analyze'}), 
         name='analyze-resume'),
]
