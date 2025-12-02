from django.http import JsonResponse
from rest_framework import viewsets, permissions
from .models import Event
from .serializers import EventSerializer


def ping(_request):
    return JsonResponse({"status": "ok", "app": "analytics"})


class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            Event.objects.select_related("user")
            .filter(user=self.request.user)
            .order_by("-id")
        )
