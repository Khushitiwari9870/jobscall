from rest_framework import serializers
from .models import Event


class EventSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Event
        fields = ["id", "user", "username", "name", "properties", "context", "created_at"]
        read_only_fields = ["created_at", "username"]
