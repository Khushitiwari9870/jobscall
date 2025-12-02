from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'profile_booster'

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'boosters', views.ProfileBoosterViewSet, basename='booster')
router.register(r'progress', views.BoosterProgressViewSet, basename='progress')

# Additional URL patterns
urlpatterns = [
    path('', include(router.urls)),
    
    # Custom actions
    path('boosters/start/', 
         views.ProfileBoosterViewSet.as_view({'post': 'start'}), 
         name='booster-start'),
    path('boosters/<int:pk>/complete-recommendation/', 
         views.ProfileBoosterViewSet.as_view({'post': 'complete_recommendation'}), 
         name='complete-recommendation'),
    path('boosters/stats/', 
         views.ProfileBoosterViewSet.as_view({'get': 'stats'}), 
         name='booster-stats'),
    path('progress/refresh/', 
         views.BoosterProgressViewSet.as_view({'post': 'refresh'}), 
         name='progress-refresh'),
]
