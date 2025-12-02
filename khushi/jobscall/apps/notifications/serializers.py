from rest_framework import serializers
from .models import NotificationTemplate, Delivery


class NotificationTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationTemplate
        fields = [
            "id",
            "key",
            "channel",
            "subject",
            "body",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


class DeliverySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    template_key = serializers.CharField(source="template.key", read_only=True)

    class Meta:
        model = Delivery
        fields = [
            "id",
            "template",
            "template_key",
            "user",
            "username",
            "to",
            "context",
            "status",
            "error",
            "created_at",
            "sent_at",
        ]
        read_only_fields = ["created_at", "sent_at", "username", "template_key"]
