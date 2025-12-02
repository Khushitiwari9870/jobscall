from django.http import JsonResponse
from rest_framework import viewsets, permissions
from .models import SavedSearch, AlertSchedule, AlertDelivery
from .serializers import SavedSearchSerializer, AlertScheduleSerializer, AlertDeliverySerializer


def ping(_request):
    return JsonResponse({"status": "ok", "app": "alerts"})


class SavedSearchViewSet(viewsets.ModelViewSet):
    serializer_class = SavedSearchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            SavedSearch.objects.select_related("user")
            .filter(user=self.request.user)
            .order_by("-id")
        )


class AlertScheduleViewSet(viewsets.ModelViewSet):
    serializer_class = AlertScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            AlertSchedule.objects.select_related("saved_search")
            .filter(saved_search__user=self.request.user)
            .order_by("-id")
        )


class AlertDeliveryViewSet(viewsets.ModelViewSet):
    serializer_class = AlertDeliverySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            AlertDelivery.objects.select_related("saved_search")
            .filter(saved_search__user=self.request.user)
            .order_by("-id")
        )
