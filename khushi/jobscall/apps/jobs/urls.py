from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from .views import (
    ping, 
    JobViewSet, 
    JobSearchViewSet,
    JobApplicationViewSet
)

# Main router for jobs
router = DefaultRouter()
router.register(r'jobs', JobViewSet, basename='job')
router.register(r'search', JobSearchViewSet, basename='job-search')

# Nested router for job applications
# Using NestedDefaultRouter instead of NestedSimpleRouter for better compatibility
job_router = routers.NestedSimpleRouter(router, r'jobs', lookup='job')
job_router.register(r'applications', ApplicationViewSet, basename='job-applications')

# Applications router
app_router = DefaultRouter()
app_router.register(r'applications', JobApplicationViewSet, basename='application')

urlpatterns = [
    path('ping/', ping, name='jobs-ping'),
    
    # Include all router URLs
    path('', include(router.urls)),
    path('', include(job_router.urls)),
    
    # User's applications endpoints (/api/jobs/my/applications/)
    path('my/', include(app_router.urls)),
    
    # Apply for a job (/api/v1/jobs/jobs/<job_id>/apply/)
    path('jobs/<int:pk>/apply/', 
         JobViewSet.as_view({'post': 'apply'}), 
         name='job-apply'),
    
    # Get job applications for a specific job (now handled by job_router)
    # This endpoint is now available at: /api/v1/jobs/jobs/<job_id>/applications/

    # Custom action for fetching user's jobs
    path('my-jobs/', JobViewSet.as_view({'get': 'my_jobs'}), name='my-jobs'),
]
