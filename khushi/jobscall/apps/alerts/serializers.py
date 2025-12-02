from rest_framework import serializers
from .models import SavedSearch as AlertSavedSearch, AlertSchedule, AlertDelivery


class SavedSearchSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    # Set user automatically from the authenticated request
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = AlertSavedSearch
        fields = ["id", "user", "username", "name", "query", "filters", "created_at"]
        read_only_fields = ["created_at", "username"]
        ref_name = 'AlertsSavedSearch'  # Add unique ref_name to avoid conflict


class AlertScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertSchedule
        fields = ["id", "saved_search", "frequency", "next_run_at"]

    def validate_saved_search(self, value: 'AlertSavedSearch'):
        request = self.context.get("request")
        if request and request.user and value.user_id != request.user.id:
            raise serializers.ValidationError("You can only schedule alerts for your own saved searches.")
        return value


class AlertDeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertDelivery
        fields = ["id", "saved_search", "status", "delivered_at", "error", "created_at"]
        read_only_fields = ["created_at"]

    def validate_saved_search(self, value: 'AlertSavedSearch'):
        request = self.context.get("request")
        if request and request.user and value.user_id != request.user.id:
            raise serializers.ValidationError("You can only create deliveries for your own saved searches.")
        return value
