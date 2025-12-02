from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'job-postings', views.JobPostingViewSet, basename='job-posting')
router.register(r'applications', views.JobApplicationViewSet, basename='job-application')

# Additional URL patterns
urlpatterns = [
    # API endpoints
    path('', include(router.urls)),
    
    # My applications (for job seekers)
    path('my-applications/', 
         views.MyApplicationsViewSet.as_view({'get': 'list'}), 
         name='my-applications-list'),
    path('my-applications/<int:pk>/', 
         views.MyApplicationsViewSet.as_view({'get': 'retrieve'}), 
         name='my-application-detail'),
    path('my-applications/status-counts/', 
         views.MyApplicationsViewSet.as_view({'get': 'status_counts'}), 
         name='my-applications-status-counts'),
    
    # Public endpoints (no authentication required)
    path('public/job-postings/', 
         views.JobPostingViewSet.as_view({'get': 'list'}), 
         name='public-job-postings-list'),
    path('public/job-postings/<int:pk>/', 
         views.JobPostingViewSet.as_view({'get': 'retrieve'}), 
         name='public-job-posting-detail'),
]
