from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'resume_scorer'

router = DefaultRouter()
router.register(r'scores', views.ResumeScoreViewSet, basename='resumescore')
router.register(r'score-improvements', views.ScoreImprovementViewSet, basename='scoreimprovement')
router.register(r'settings', views.ResumeScoreSettingsViewSet, basename='resumescore-settings')

urlpatterns = [
    path('', include(router.urls)),
]
