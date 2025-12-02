from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.conf import settings

from .models import IvrVerification, IvrCallLog


class IvrVerificationSerializer(serializers.ModelSerializer):
    """Serializer for the IvrVerification model"""
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )
    method_display = serializers.CharField(
        source='get_method_display',
        read_only=True
    )
    is_expired = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = IvrVerification
        fields = [
            'id', 'phone_number', 'verification_code', 'method', 'method_display',
            'status', 'status_display', 'attempts', 'is_successful', 'is_expired',
            'created_at', 'updated_at', 'verified_at', 'expires_at'
        ]
        read_only_fields = [
            'id', 'status', 'attempts', 'is_successful', 'is_expired',
            'created_at', 'updated_at', 'verified_at', 'expires_at'
        ]
    
    def validate_phone_number(self, value):
        """Validate phone number format"""
        # Add your phone number validation logic here
        # Example: Ensure the number is at least 10 digits
        if len(''.join(filter(str.isdigit, value))) < 10:
            raise serializers.ValidationError(_("Please enter a valid phone number."))
        return value
    
    def validate(self, data):
        """Additional validation"""
        # Check if there's an active verification for this user/phone
        active_verification = IvrVerification.objects.filter(
            user=self.context['request'].user,
            phone_number=data['phone_number'],
            status__in=[IvrVerification.STATUS_PENDING, IvrVerification.STATUS_IN_PROGRESS],
            expires_at__gt=timezone.now()
        ).exists()
        
        if active_verification:
            raise serializers.ValidationError({
                'phone_number': _("A verification is already in progress for this number.")
            })
            
        return data


class IvrVerificationVerifySerializer(serializers.Serializer):
    """Serializer for verifying an IVR code"""
    verification_id = serializers.UUIDField(required=False)
    phone_number = serializers.CharField(required=False)
    verification_code = serializers.CharField(
        max_length=10,
        min_length=4,
        required=True,
        help_text=_("The verification code sent to your phone")
    )
    
    def validate(self, data):
        """Validate the verification code"""
        verification_id = data.get('verification_id')
        phone_number = data.get('phone_number')
        
        if not (verification_id or phone_number):
            raise serializers.ValidationError({
                'non_field_errors': [_("Either verification_id or phone_number must be provided.")]
            })
        
        # Get the verification
        try:
            if verification_id:
                verification = IvrVerification.objects.get(
                    id=verification_id,
                    user=self.context['request'].user,
                    status__in=[IvrVerification.STATUS_PENDING, IvrVerification.STATUS_IN_PROGRESS]
                )
            else:
                verification = IvrVerification.objects.filter(
                    phone_number=phone_number,
                    user=self.context['request'].user,
                    status__in=[IvrVerification.STATUS_PENDING, IvrVerification.STATUS_IN_PROGRESS],
                    expires_at__gt=timezone.now()
                ).latest('created_at')
                
            data['verification'] = verification
            
            # Check if verification code matches
            if verification.verification_code != data['verification_code']:
                verification.increment_attempts()
                raise serializers.ValidationError({
                    'verification_code': _("Invalid verification code.")
                })
                
            # Check if verification is expired
            if verification.is_expired:
                verification.status = IvrVerification.STATUS_FAILED
                verification.failure_reason = _("Verification code expired")
                verification.save(update_fields=['status', 'failure_reason'])
                raise serializers.ValidationError({
                    'verification_code': _("This verification code has expired. Please request a new one.")
                })
                
        except IvrVerification.DoesNotExist:
            raise serializers.ValidationError({
                'non_field_errors': [_("Invalid verification request. Please try again.")]
            })
            
        return data


class IvrCallLogSerializer(serializers.ModelSerializer):
    """Serializer for the IvrCallLog model"""
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )
    
    class Meta:
        model = IvrCallLog
        fields = [
            'id', 'call_sid', 'from_number', 'to_number', 'status', 'status_display',
            'duration', 'recording_url', 'created_at', 'updated_at', 'started_at',
            'ended_at', 'price', 'price_unit', 'error_message'
        ]
        read_only_fields = fields


class IvrVerificationRequestSerializer(serializers.Serializer):
    """Serializer for requesting an IVR verification"""
    phone_number = serializers.CharField(
        required=True,
        help_text=_("The phone number to verify in E.164 format (e.g., +14155552671)")
    )
    method = serializers.ChoiceField(
        choices=IvrVerification.METHOD_CHOICES,
        default=IvrVerification.METHOD_CALL,
        help_text=_("Verification method: 'call', 'sms', or 'whatsapp'")
    )
    
    def validate_phone_number(self, value):
        """Validate phone number format"""
        # Add your phone number validation logic here
        # Example: Ensure the number is at least 10 digits
        if len(''.join(filter(str.isdigit, value))) < 10:
            raise serializers.ValidationError(_("Please enter a valid phone number."))
        return value
    
    def validate(self, data):
        """Additional validation"""
        user = self.context['request'].user
        phone_number = data['phone_number']
        
        # Check rate limiting (e.g., max 5 attempts per hour)
        one_hour_ago = timezone.now() - timezone.timedelta(hours=1)
        recent_attempts = IvrVerification.objects.filter(
            user=user,
            phone_number=phone_number,
            created_at__gte=one_hour_ago
        ).count()
        
        if recent_attempts >= 5:
            raise serializers.ValidationError({
                'non_field_errors': [_("Too many verification attempts. Please try again later.")]
            })
            
        return data
