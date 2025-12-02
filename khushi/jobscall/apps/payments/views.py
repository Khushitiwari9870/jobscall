from django.http import JsonResponse
from rest_framework import viewsets, permissions, filters
from .models import Plan, Price, Invoice, PaymentIntent
from .serializers import PlanSerializer, PriceSerializer, InvoiceSerializer, PaymentIntentSerializer


def ping(_request):
    return JsonResponse({"status": "ok", "app": "payments"})


class PlanViewSet(viewsets.ModelViewSet):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "description"]
    ordering_fields = ["created_at", "name"]


class PriceViewSet(viewsets.ModelViewSet):
    queryset = Price.objects.select_related("plan").all()
    serializer_class = PriceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["plan__name", "currency", "interval"]
    ordering_fields = ["amount"]
    filterset_fields = {
        "plan": ["exact"],
        "currency": ["exact"],
        "interval": ["exact"],
        "active": ["exact"],
        "amount": ["gte", "lte"],
    }


class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["user__username", "status", "currency"]
    ordering_fields = ["created_at", "amount"]
    filterset_fields = {
        "user": ["exact"],
        "status": ["exact"],
        "currency": ["exact"],
        "created_at": ["date", "gte", "lte"],
    }

    def get_queryset(self):
        return (
            Invoice.objects.select_related("user")
            .filter(user=self.request.user)
            .order_by("-id")
        )


class PaymentIntentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentIntentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["provider", "status", "invoice__user__username"]
    ordering_fields = ["created_at"]
    filterset_fields = {
        "invoice": ["exact"],
        "provider": ["exact"],
        "status": ["exact"],
    }

    def get_queryset(self):
        return (
            PaymentIntent.objects.select_related("invoice")
            .filter(invoice__user=self.request.user)
            .order_by("-id")
        )
