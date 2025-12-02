from rest_framework import serializers
from .models import IvrCall, IvrMenu, IvrMenuOption, IvrCallLog
from django.contrib.auth import get_user_model

User = get_user_model()

class IvrCallLogSerializer(serializers.ModelSerializer):
    """Serializer for IVR call logs"""
    class Meta:
        model = IvrCallLog
        fields = ['id', 'timestamp', 'event_type', 'details']
        read_only_fields = fields


class IvrCallSerializer(serializers.ModelSerializer):
    """Serializer for IVR calls"""
    logs = IvrCallLogSerializer(many=True, read_only=True)
    user_details = serializers.SerializerMethodField()
    
    class Meta:
        model = IvrCall
        fields = [
            'id', 'call_sid', 'parent_call_sid', 'from_number', 'to_number',
            'direction', 'status', 'user', 'user_details', 'start_time',
            'end_time', 'duration', 'recording_url', 'current_menu',
            'digits_pressed', 'error_message', 'logs'
        ]
        read_only_fields = [
            'id', 'call_sid', 'parent_call_sid', 'status', 'start_time',
            'end_time', 'duration', 'recording_url', 'error_message', 'logs'
        ]
    
    def get_user_details(self, obj):
        if obj.user:
            return {
                'id': obj.user.id,
                'email': obj.user.email,
                'name': f"{obj.user.first_name} {obj.user.last_name}"
            }
        return None


class IvrMenuOptionSerializer(serializers.ModelSerializer):
    """Serializer for IVR menu options"""
    class Meta:
        model = IvrMenuOption
        fields = [
            'id', 'digit', 'description', 'action', 'target_menu',
            'phone_number', 'confirmation_text', 'order'
        ]


class IvrMenuSerializer(serializers.ModelSerializer):
    """Serializer for IVR menus"""
    options = IvrMenuOptionSerializer(many=True, read_only=True)
    
    class Meta:
        model = IvrMenu
        fields = [
            'id', 'name', 'menu_type', 'greeting_text', 'greeting_voice',
            'invalid_choice_text', 'max_retries', 'timeout', 'finish_on_key',
            'is_active', 'created_at', 'updated_at', 'options'
        ]
        read_only_fields = ['created_at', 'updated_at']


class IvrCallInitiateSerializer(serializers.Serializer):
    """Serializer for initiating an outbound IVR call"""
    to_number = serializers.CharField(max_length=20, required=True)
    from_number = serializers.CharField(max_length=20, required=False)
    menu_id = serializers.PrimaryKeyRelatedField(
        queryset=IvrMenu.objects.filter(is_active=True),
        required=False
    )
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        required=False,
        allow_null=True
    )
    custom_parameters = serializers.DictField(
        child=serializers.CharField(),
        required=False,
        default=dict
    )


class IvrCallResponseSerializer(serializers.Serializer):
    """Serializer for handling IVR call responses"""
    call_sid = serializers.CharField(required=True)
    digits = serializers.CharField(required=False, allow_blank=True)
    recording_url = serializers.URLField(required=False, allow_blank=True)
    call_status = serializers.CharField(required=False)
    call_duration = serializers.IntegerField(required=False, min_value=0)
    
    def validate_call_sid(self, value):
        try:
            call = IvrCall.objects.get(call_sid=value)
            return call
        except IvrCall.DoesNotExist:
            raise serializers.ValidationError("Invalid call SID")


class IvrCallLogCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating IVR call logs"""
    class Meta:
        model = IvrCallLog
        fields = ['call', 'event_type', 'details']
        extra_kwargs = {
            'call': {'required': True},
            'event_type': {'required': True}
        }
