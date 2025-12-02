from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'profile'

router = DefaultRouter()
router.register(r'profiles', views.UserProfileViewSet, basename='userprofile')

urlpatterns = [
    path('', include(router.urls)),
    # Custom endpoints
    path('me/', views.UserProfileViewSet.as_view({'get': 'me'}), name='my-profile'),
    path('profiles/search/', views.UserProfileViewSet.as_view({'post': 'search_profiles'}), name='profile-search'),
    path('profiles/suggested/', views.UserProfileViewSet.as_view({'get': 'suggested_profiles'}), name='suggested-profiles'),
]
