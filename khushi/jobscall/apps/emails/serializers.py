from rest_framework import serializers
from .models import (
    EmailTemplate, EmailCampaign, 
    EmailRecipient, EmailLog
)


class EmailRecipientSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailRecipient
        fields = [
            'id', 'email', 'first_name', 'last_name',
            'is_active', 'created_at'
        ]
        read_only_fields = ('id', 'created_at')


class EmailTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailTemplate
        fields = [
            'id', 'name', 'subject', 'body',
            'template_type', 'is_active', 'created_at'
        ]
        read_only_fields = ('id', 'created_at', 'created_by')

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class EmailCampaignSerializer(serializers.ModelSerializer):
    template_details = EmailTemplateSerializer(
        source='template',
        read_only=True
    )
    
    class Meta:
        model = EmailCampaign
        fields = [
            'id', 'name', 'template', 'template_details',
            'status', 'scheduled_time', 'created_at', 'updated_at'
        ]
        read_only_fields = ('id', 'created_at', 'updated_at', 'created_by')
        extra_kwargs = {
            'template': {'write_only': True}
        }
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class EmailLogSerializer(serializers.ModelSerializer):
    recipient_email = serializers.EmailField(
        source='recipient.email',
        read_only=True
    )
    
    class Meta:
        model = EmailLog
        fields = [
            'id', 'campaign', 'recipient', 'recipient_email',
            'subject', 'status', 'sent_at', 'delivered_at',
            'opened_at', 'error_message', 'message_id'
        ]
        read_only_fields = fields


class SendEmailSerializer(serializers.Serializer):
    """Serializer for sending individual emails"""
    to = serializers.EmailField(required=True)
    subject = serializers.CharField(required=True, max_length=200)
    message = serializers.CharField(required=True)
    template_id = serializers.PrimaryKeyRelatedField(
        queryset=EmailTemplate.objects.all(),
        required=False,
        allow_null=True
    )
    context = serializers.DictField(
        required=False,
        default=dict
    )


class SendCampaignEmailSerializer(serializers.Serializer):
    """Serializer for sending campaign emails"""
    campaign_id = serializers.PrimaryKeyRelatedField(
        queryset=EmailCampaign.objects.all()
    )
    recipient_ids = serializers.ListField(
        child=serializers.PrimaryKeyRelatedField(
            queryset=EmailRecipient.objects.all()
        ),
        required=True
    )
    schedule_time = serializers.DateTimeField(required=False, allow_null=True)
