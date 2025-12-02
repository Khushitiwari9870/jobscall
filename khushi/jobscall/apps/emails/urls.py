from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'emails'

router = DefaultRouter()
router.register(r'templates', views.EmailTemplateViewSet, basename='email-template')
router.register(r'campaigns', views.EmailCampaignViewSet, basename='email-campaign')
router.register(r'recipients', views.EmailRecipientViewSet, basename='email-recipient')
router.register(r'logs', views.EmailLogViewSet, basename='email-log')

urlpatterns = [
    path('', include(router.urls)),
    path('send/', views.EmailSendViewSet.as_view({'post': 'create'}), name='send-email'),
]
