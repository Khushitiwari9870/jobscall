from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'recruiter'

# Create a router for our viewsets
router = DefaultRouter()
router.register(r'profiles', views.RecruiterProfileViewSet, basename='recruiter-profile')
router.register(r'memberships', views.RecruiterMembershipViewSet, basename='recruiter-membership')
router.register(r'job-postings', views.JobPostingViewSet, basename='job-posting')
router.register(r'candidate-searches', views.CandidateSearchViewSet, basename='candidate-search')
router.register(r'activities', views.RecruiterActivityViewSet, basename='recruiter-activity')
router.register(r'candidates', views.CandidateAdvancedSearchView, basename='candidate-advanced-search')

# Additional URL patterns that don't fit into ViewSets
urlpatterns = [
    # API endpoints
    path('api/', include(router.urls)),
    
    # Dashboard endpoint
    path('api/dashboard/', views.RecruiterDashboardViewSet.as_view({'get': 'list'}), name='recruiter-dashboard'),
    
    # Advanced candidate search endpoint
    path('api/candidates/advanced-search/', 
         views.CandidateAdvancedSearchView.as_view({'post': 'create'}), 
         name='candidate-advanced-search'),
]
