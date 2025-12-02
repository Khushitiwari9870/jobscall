from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'subscription-plans', views.SubscriptionPlanViewSet, basename='subscription-plan')
router.register(r'subscriptions', views.UserSubscriptionViewSet, basename='subscription')
router.register(r'usage-records', views.UsageRecordViewSet, basename='usage-record')
router.register(r'billing-history', views.BillingHistoryViewSet, basename='billing-history')
router.register(r'credit-packages', views.CreditPackageViewSet, basename='credit-package')
router.register(r'credits', views.UserCreditsViewSet, basename='user-credits')

urlpatterns = [
    path('', include(router.urls)),
    path('usage-stats/', views.UsageStatsView.as_view(), name='usage-stats'),
]
