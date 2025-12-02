from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'folders'

router = DefaultRouter()
router.register(r'folders', views.FolderViewSet, basename='folders')
router.register(r'folder-profiles', views.FolderProfileViewSet, basename='folder-profiles')

urlpatterns = [
    path('', include(router.urls)),
    # Custom endpoints
    path('folders/<int:pk>/add-profiles/', 
         views.FolderViewSet.as_view({'post': 'add_profiles'}), 
         name='folder-add-profiles'),
    path('folders/move-profiles/', 
         views.FolderViewSet.as_view({'post': 'move_profiles'}), 
         name='move-between-folders'),
]
