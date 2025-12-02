from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'ivr_shared'

router = DefaultRouter()
router.register(r'resources', views.SharedIvrResourceViewSet, basename='ivr-resource')
router.register(r'templates', views.SharedIvrTemplateViewSet, basename='ivr-template')
router.register(r'usage-logs', views.SharedIvrUsageLogViewSet, basename='ivr-usage-log')

urlpatterns = [
    # API endpoints
    path('', include(router.urls)),
    
    # Template export/import
    path('templates/<int:pk>/export/', 
         views.SharedIvrTemplateViewSet.as_view({'post': 'export'}), 
         name='ivr-template-export'),
    path('templates/import/', 
         views.SharedIvrTemplateViewSet.as_view({'post': 'import_template'}), 
         name='ivr-template-import'),
]
