from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ping, PlanViewSet, PriceViewSet, InvoiceViewSet, PaymentIntentViewSet

router = DefaultRouter()
router.register(r"plans", PlanViewSet, basename="plan")
router.register(r"prices", PriceViewSet, basename="price")
router.register(r"invoices", InvoiceViewSet, basename="invoice")
router.register(r"payment-intents", PaymentIntentViewSet, basename="payment-intent")

urlpatterns = [
    path("ping/", ping, name="payments-ping"),
    path("", include(router.urls)),
]
