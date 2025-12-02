from rest_framework import viewsets, status, permissions, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.conf import settings
import requests
import logging

from .models import IvrCall, IvrMenu, IvrMenuOption, IvrCallLog
from .serializers import (
    IvrCallSerializer, IvrMenuSerializer, IvrMenuOptionSerializer,
    IvrCallInitiateSerializer, IvrCallResponseSerializer, IvrCallLogCreateSerializer
)

logger = logging.getLogger(__name__)

class IvrMenuViewSet(viewsets.ModelViewSet):
    """ViewSet for managing IVR menus"""
    queryset = IvrMenu.objects.all()
    serializer_class = IvrMenuSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        menu_type = self.request.query_params.get('menu_type')
        if menu_type:
            queryset = queryset.filter(menu_type=menu_type)
        return queryset.filter(is_active=True)


class IvrMenuOptionViewSet(viewsets.ModelViewSet):
    """ViewSet for managing IVR menu options"""
    serializer_class = IvrMenuOptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return IvrMenuOption.objects.filter(menu_id=self.kwargs['menu_pk'])
    
    def perform_create(self, serializer):
        menu = get_object_or_404(IvrMenu, pk=self.kwargs['menu_pk'])
        serializer.save(menu=menu)


class IvrCallViewSet(viewsets.ModelViewSet):
    """ViewSet for managing IVR calls"""
    serializer_class = IvrCallSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = IvrCall.objects.all()
        
        # Filter by user if not admin
        if not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)
            
        # Apply filters
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
            
        from_number = self.request.query_params.get('from_number')
        if from_number:
            queryset = queryset.filter(from_number=from_number)
            
        return queryset.order_by('-start_time')
    
    @action(detail=False, methods=['post'])
    def initiate_call(self, request):
        """Initiate an outbound IVR call"""
        serializer = IvrCallInitiateSerializer(data=request.data)
        if serializer.is_valid():
            # In a real implementation, this would trigger a call via Twilio or similar
            # For now, we'll just create a call record
            call = IvrCall.objects.create(
                from_number=serializer.validated_data.get('from_number') or settings.DEFAULT_CALLER_ID,
                to_number=serializer.validated_data['to_number'],
                direction='outbound',
                user=serializer.validated_data.get('user')
            )
            
            # Log the call initiation
            IvrCallLog.objects.create(
                call=call,
                event_type='call_initiated',
                details={
                    'menu_id': str(serializer.validated_data.get('menu_id')),
                    'custom_parameters': serializer.validated_data.get('custom_parameters', {})
                }
            )
            
            return Response(
                IvrCallSerializer(call, context={'request': request}).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def handle_response(self, request, pk=None):
        """Handle IVR response (digits pressed, call status updates, etc.)"""
        call = self.get_object()
        serializer = IvrCallResponseSerializer(data=request.data)
        
        if serializer.is_valid():
            data = serializer.validated_data
            
            # Update call status if provided
            if 'call_status' in data:
                call.status = data['call_status']
            
            # Handle call end
            if call.status in ['completed', 'failed', 'busy', 'no-answer']:
                call.end_time = timezone.now()
                if 'call_duration' in data:
                    call.duration = data['call_duration']
                
                # Log call end
                IvrCallLog.objects.create(
                    call=call,
                    event_type=f'call_{call.status}',
                    details={'duration': call.duration}
                )
            
            # Handle DTMF input
            if 'digits' in data and data['digits']:
                call.digits_pressed = data['digits']
                
                # Log the input
                IvrCallLog.objects.create(
                    call=call,
                    event_type='dtmf_received',
                    details={'digits': data['digits']}
                )
                
                # Here you would typically process the input and determine the next action
                # For example, navigate to a submenu or execute an action
                
            # Handle recording URL if provided
            if 'recording_url' in data and data['recording_url']:
                call.recording_url = data['recording_url']
                IvrCallLog.objects.create(
                    call=call,
                    event_type='recording_available',
                    details={'url': data['recording_url']}
                )
            
            call.save()
            return Response({'status': 'success'})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class IvrCallLogViewSet(viewsets.ModelViewSet):
    """ViewSet for IVR call logs"""
    serializer_class = IvrCallLogCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = IvrCallLog.objects.all()
        
        # Filter by call if specified
        call_id = self.request.query_params.get('call_id')
        if call_id:
            queryset = queryset.filter(call_id=call_id)
            
        # Apply time-based filtering
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date:
            queryset = queryset.filter(timestamp__gte=start_date)
        if end_date:
            queryset = queryset.filter(timestamp__lte=end_date)
            
        return queryset.order_by('-timestamp')


class IvrTwilioWebhookView(APIView):
    """Webhook endpoint for Twilio callbacks"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        # Verify the request is from Twilio (implement this in production)
        # if not self._is_valid_twilio_request(request):
        #     return Response({'error': 'Invalid request'}, status=403)
        
        call_sid = request.data.get('CallSid')
        call_status = request.data.get('CallStatus')
        
        try:
            call = IvrCall.objects.get(call_sid=call_sid)
        except IvrCall.DoesNotExist:
            # For new calls, create a record
            call = IvrCall.objects.create(
                call_sid=call_sid,
                from_number=request.data.get('From'),
                to_number=request.data.get('To'),
                direction=request.data.get('Direction', 'inbound').lower(),
                status=call_status
            )
        
        # Update call status
        call.status = call_status
        call.save()
        
        # Log the webhook
        IvrCallLog.objects.create(
            call=call,
            event_type=f'twilio_{request.data.get("CallStatus")}',
            details=request.data
        )
        
        # Generate TwiML response based on call status and digits pressed
        if call_status == 'in-progress':
            menu = IvrMenu.objects.filter(menu_type='main', is_active=True).first()
            if menu:
                return self._generate_menu_response(menu)
        
        # Default empty response
        return Response('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', 
                       content_type='text/xml')
    
    def _generate_menu_response(self, menu):
        """Generate TwiML for an IVR menu"""
        response = ['<?xml version="1.0" encoding="UTF-8"?><Response>']
        
        # Add greeting
        if menu.greeting_voice:
            response.append(f'<Play>{menu.greeting_voice.url}</Play>')
        else:
            response.append(f'<Say>{menu.greeting_text}</Say>')
        
        # Add gather for DTMF input
        gather = [
            '<Gather',
            f'action="/api/ivr/handle-input/{menu.id}/"',
            f'timeout="{menu.timeout}"',
            f'numDigits="1"',
            f'finishOnKey="{menu.finish_on_key}"',
            '>'
        ]
        
        # Add menu options
        for option in menu.options.all().order_by('order'):
            if option.confirmation_voice:
                gather.append(f'<Play>{option.confirmation_voice.url}</Play>')
            elif option.confirmation_text:
                gather.append(f'<Say>{option.confirmation_text}</Say>')
        
        gather.append('</Gather>')
        
        # Add invalid choice handling
        if menu.invalid_choice_text:
            gather.append(f'<Say>{menu.invalid_choice_text}</Say>')
        
        response.append(''.join(gather))
        response.append('</Response>')
        
        return Response('\n'.join(response), content_type='text/xml')
    
    def _is_valid_twilio_request(self, request):
        """Validate that the request is from Twilio"""
        # Implementation depends on your Twilio auth token
        # This is a placeholder for the actual implementation
        return True
