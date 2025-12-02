from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'immediate_available'

router = DefaultRouter()
router.register(r'profiles', views.ImmediateAvailableProfileViewSet, basename='profile')

urlpatterns = [
    path('', include(router.urls)),
    path('profiles/search/', views.ImmediateAvailableProfileViewSet.as_view({'post': 'search'}), name='profile-search'),
    path('profiles/my-profile/', views.ImmediateAvailableProfileViewSet.as_view({'get': 'my_profile'}), name='my-profile'),
]
