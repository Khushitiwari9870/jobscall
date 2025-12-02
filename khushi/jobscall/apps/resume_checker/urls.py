from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'resume_checker'

router = DefaultRouter()
router.register(r'checks', views.ResumeCheckViewSet, basename='resumecheck')
router.register(r'issues', views.ResumeIssueViewSet, basename='resumeissue')
router.register(r'settings', views.ResumeCheckSettingsViewSet, basename='resumecheck-settings')

urlpatterns = [
    path('', include(router.urls)),
]
