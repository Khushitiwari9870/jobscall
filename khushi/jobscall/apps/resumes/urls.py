from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from .views import (
    ResumeViewSet, 
    WorkExperienceViewSet, 
    EducationViewSet, 
    SkillViewSet,
    ping
)

router = DefaultRouter()
router.register(r'resumes', ResumeViewSet, basename='resume')

# Nested routers for related models
resume_router = routers.NestedSimpleRouter(router, r'resumes', lookup='resume')
resume_router.register(r'work-experiences', WorkExperienceViewSet, basename='work-experience')
resume_router.register(r'educations', EducationViewSet, basename='education')
resume_router.register(r'skills', SkillViewSet, basename='skill')

urlpatterns = [
    path('ping/', ping, name='resume-ping'),
    path('', include(router.urls)),
    path('', include(resume_router.urls)),
]
