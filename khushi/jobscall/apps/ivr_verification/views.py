import random
import logging
from datetime import timedelta

from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from rest_framework import viewsets, status, mixins, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import IvrVerification, IvrCallLog
from .serializers import (
    IvrVerificationSerializer,
    IvrVerificationVerifySerializer,
    IvrCallLogSerializer,
    IvrVerificationRequestSerializer
)

logger = logging.getLogger(__name__)


class IvrVerificationViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    """
    API endpoint for managing IVR verifications.
    """
    serializer_class = IvrVerificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Return only the current user's verifications"""
        return IvrVerification.objects.filter(
            user=self.request.user
        ).order_by('-created_at')
    
    def create(self, request, *args, **kwargs):
        """
        Request a new IVR verification.
        """
        serializer = IvrVerificationRequestSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        
        phone_number = serializer.validated_data['phone_number']
        method = serializer.validated_data['method']
        
        # Generate a random verification code (4-6 digits)
        verification_code = ''.join(random.choices('0123456789', k=4))
        
        # Set expiration time (e.g., 10 minutes from now)
        expires_at = timezone.now() + timedelta(minutes=10)
        
        # Create the verification record
        verification = IvrVerification.objects.create(
            user=request.user,
            phone_number=phone_number,
            verification_code=verification_code,
            method=method,
            expires_at=expires_at,
            ip_address=self.get_client_ip(),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        # Send the verification code via the selected method
        try:
            self._send_verification_code(verification)
            verification.status = IvrVerification.STATUS_IN_PROGRESS
            verification.save(update_fields=['status'])
        except Exception as e:
            logger.error(f"Failed to send verification code: {str(e)}")
            verification.status = IvrVerification.STATUS_FAILED
            verification.failure_reason = str(e)
            verification.save(update_fields=['status', 'failure_reason'])
            
            return Response(
                {'non_field_errors': [_("Failed to send verification code. Please try again.")]},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Return the verification ID (but not the code)
        serializer = self.get_serializer(verification)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['post'])
    def verify(self, request):
        """
        Verify an IVR verification code.
        """
        serializer = IvrVerificationVerifySerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        
        verification = serializer.validated_data['verification']
        
        # Mark the verification as completed
        verification.mark_as_verified()
        
        # Return success response
        return Response({
            'status': 'success',
            'message': _("Phone number verified successfully."),
            'verification_id': str(verification.id)
        })
    
    @action(detail=True, methods=['post'])
    def resend(self, request, pk=None):
        """
        Resend the verification code.
        """
        verification = self.get_object()
        
        # Check if verification can be resent
        if verification.status == IvrVerification.STATUS_COMPLETED:
            return Response(
                {'non_field_errors': [_("This verification has already been completed.")]},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if verification.attempts >= 5:
            return Response(
                {'non_field_errors': [_("Maximum number of attempts reached. Please request a new verification.")]},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Generate a new code and extend the expiration
        verification.verification_code = ''.join(random.choices('0123456789', k=4))
        verification.expires_at = timezone.now() + timedelta(minutes=10)
        verification.attempts = 0
        verification.status = IvrVerification.STATUS_PENDING
        verification.save(update_fields=['verification_code', 'expires_at', 'attempts', 'status'])
        
        # Resend the code
        try:
            self._send_verification_code(verification)
            verification.status = IvrVerification.STATUS_IN_PROGRESS
            verification.save(update_fields=['status'])
        except Exception as e:
            logger.error(f"Failed to resend verification code: {str(e)}")
            verification.status = IvrVerification.STATUS_FAILED
            verification.failure_reason = str(e)
            verification.save(update_fields=['status', 'failure_reason'])
            
            return Response(
                {'non_field_errors': [_("Failed to resend verification code. Please try again.")]},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response({
            'status': 'success',
            'message': _("Verification code resent successfully.")
        })
    
    def _send_verification_code(self, verification):
        """
        Send the verification code via the selected method.
        This is a placeholder - implement the actual sending logic here.
        """
        # TODO: Implement actual sending logic using your preferred service
        # (e.g., Twilio, Plivo, etc.)
        
        # This is just a placeholder that logs the code
        logger.info(
            f"Sending {verification.method} verification code {verification.verification_code} "
            f"to {verification.phone_number}"
        )
        
        # In a real implementation, you would call your SMS/call service here
        # For example, with Twilio:
        # if verification.method == IvrVerification.METHOD_SMS:
        #     from twilio.rest import Client
        #     client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        #     client.messages.create(
        #         body=f"Your verification code is: {verification.verification_code}",
        #         from_=settings.TWILIO_PHONE_NUMBER,
        #         to=verification.phone_number
        #     )
        # elif verification.method == IvrVerification.METHOD_CALL:
        #     # Initiate a call with the verification code
        #     pass
    
    def get_client_ip(self):
        """Get the client's IP address from the request"""
        x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = self.request.META.get('REMOTE_ADDR')
        return ip


class IvrCallLogViewSet(
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    """
    API endpoint for viewing IVR call logs.
    """
    serializer_class = IvrCallLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Return call logs for the current user's verifications"""
        return IvrCallLog.objects.filter(
            verification__user=self.request.user
        ).select_related('verification').order_by('-created_at')


class IvrWebhookView(APIView):
    """
    Webhook endpoint for IVR call status updates.
    """
    permission_classes = [permissions.AllowAny]  # No auth for webhooks
    
    def post(self, request, *args, **kwargs):
        """Handle webhook callbacks from the telephony provider"""
        # Get the call SID from the request
        call_sid = request.data.get('CallSid') or request.data.get('call_sid')
        if not call_sid:
            return Response(
                {'error': 'Missing CallSid in request'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get or create the call log
        call_log, created = IvrCallLog.objects.get_or_create(
            call_sid=call_sid,
            defaults={
                'from_number': request.data.get('From', ''),
                'to_number': request.data.get('To', ''),
                'status': request.data.get('CallStatus', 'queued').lower(),
                'provider_data': request.data
            }
        )
        
        # Update call status if not created
        if not created:
            call_status = request.data.get('CallStatus', '').lower()
            if call_status:
                call_log.status = call_status
                call_log.provider_data = request.data
                call_log.save(update_fields=['status', 'provider_data'])
        
        # Handle different webhook events
        if request.data.get('Digits'):
            # User entered digits
            digits = request.data['Digits']
            verification = call_log.verification
            
            if verification and verification.verification_code == digits:
                # Code matches - verification successful
                verification.mark_as_verified()
                
                # Return TwiML to play success message
                from django.http import HttpResponse
                from twilio.twiml.voice_response import VoiceResponse
                
                response = VoiceResponse()
                response.say("Verification successful. Thank you!")
                response.hangup()
                
                return HttpResponse(str(response), content_type='text/xml')
            else:
                # Code doesn't match
                verification.increment_attempts()
                
                # Return TwiML to retry
                from django.http import HttpResponse
                from twilio.twiml.voice_response import VoiceResponse, Gather
                
                response = VoiceResponse()
                gather = Gather(num_digits=len(verification.verification_code), action=f"/api/ivr/webhook/{call_sid}/")
                gather.say("Invalid code. Please enter the {}-digit verification code again.".format(
                    len(verification.verification_code)
                ))
                response.append(gather)
                
                return HttpResponse(str(response), content_type='text/xml')
        
        # Default response for other webhook events
        return Response({'status': 'received'})
