from rest_framework import serializers
from .models import AdminActivity


class AdminActivitySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = AdminActivity
        fields = ["id", "user", "username", "action", "target", "extra", "created_at"]
        read_only_fields = ["created_at", "username"]
