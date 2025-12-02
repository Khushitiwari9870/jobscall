from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'verifications', views.IvrVerificationViewSet, basename='verification')
router.register(r'call-logs', views.IvrCallLogViewSet, basename='call-log')

urlpatterns = [
    # API endpoints
    path('', include(router.urls)),
    
    # Webhook endpoints (no authentication)
    path('webhook/', views.IvrWebhookView.as_view(), name='ivr-webhook'),
    path('webhook/<str:call_sid>/', views.IvrWebhookView.as_view(), name='ivr-webhook-detail'),
]
