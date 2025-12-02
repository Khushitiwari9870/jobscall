from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'panels', views.IvrDashboardPanelViewSet, basename='dashboard-panel')
router.register(r'filters', views.IvrDashboardFilterViewSet, basename='dashboard-filter')
router.register(r'layouts', views.IvrDashboardLayoutViewSet, basename='dashboard-layout')
router.register(r'shared-views', views.IvrDashboardSharedViewViewSet, basename='dashboard-shared-view')

urlpatterns = [
    path('', include(router.urls)),
    path('user/settings/', views.IvrDashboardUserSettingsViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update'
    }), name='dashboard-user-settings'),
    path('data/', views.IvrDashboardDataView.as_view(), name='dashboard-data'),
    path('export/', views.IvrDashboardExportView.as_view(), name='dashboard-export'),
    path('import/', views.IvrDashboardImportView.as_view(), name='dashboard-import'),
    path('shared/<str:share_token>/', views.SharedDashboardView.as_view(), name='shared-dashboard'),
]