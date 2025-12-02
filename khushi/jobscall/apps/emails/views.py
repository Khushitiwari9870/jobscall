from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone

from .models import (
    EmailTemplate, EmailCampaign,
    EmailRecipient, EmailLog
)
from .serializers import (
    EmailTemplateSerializer, EmailCampaignSerializer,
    EmailRecipientSerializer, EmailLogSerializer,
    SendEmailSerializer, SendCampaignEmailSerializer
)


class EmailTemplateViewSet(viewsets.ModelViewSet):
    """ViewSet for managing email templates"""
    queryset = EmailTemplate.objects.all()
    serializer_class = EmailTemplateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Filter by template type if provided
        template_type = self.request.query_params.get('type')
        if template_type:
            queryset = queryset.filter(template_type=template_type)
        return queryset


class EmailCampaignViewSet(viewsets.ModelViewSet):
    """ViewSet for managing email campaigns"""
    queryset = EmailCampaign.objects.all()
    serializer_class = EmailCampaignSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Filter by status if provided
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        return queryset
    
    @action(detail=True, methods=['post'])
    def send(self, request, pk=None):
        """Send a campaign to selected recipients"""
        campaign = self.get_object()
        serializer = SendCampaignEmailSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            # In a real implementation, this would queue the emails for sending
            recipient_ids = [r.id for r in serializer.validated_data['recipient_ids']]
            schedule_time = serializer.validated_data.get('schedule_time')
            
            # Update campaign status
            campaign.status = 'scheduled' if schedule_time else 'sending'
            campaign.scheduled_time = schedule_time or timezone.now()
            campaign.save()
            
            return Response({
                'status': 'success',
                'message': f'Campaign "{campaign.name}" is being processed.',
                'scheduled_time': campaign.scheduled_time.isoformat() if schedule_time else None
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EmailRecipientViewSet(viewsets.ModelViewSet):
    """ViewSet for managing email recipients"""
    queryset = EmailRecipient.objects.all()
    serializer_class = EmailRecipientSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['is_active']
    search_fields = ['email', 'first_name', 'last_name']


class EmailLogViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing email logs"""
    serializer_class = EmailLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['status', 'campaign']
    search_fields = ['recipient__email', 'subject', 'message_id']
    
    def get_queryset(self):
        queryset = EmailLog.objects.select_related('campaign', 'recipient')
        
        # Filter by date range if provided
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date:
            queryset = queryset.filter(sent_at__date__gte=start_date)
        if end_date:
            queryset = queryset.filter(sent_at__date__lte=end_date)
            
        return queryset


class EmailSendViewSet(viewsets.ViewSet):
    """ViewSet for sending individual emails"""
    permission_classes = [permissions.IsAuthenticated]
    
    def create(self, request):
        """Send an individual email"""
        serializer = SendEmailSerializer(data=request.data)
        if serializer.is_valid():
            # In a real implementation, this would send the email
            email_data = serializer.validated_data
            
            # Log the email
            recipient, _ = EmailRecipient.objects.get_or_create(
                email=email_data['to']
            )
            
            log = EmailLog.objects.create(
                recipient=recipient,
                subject=email_data['subject'],
                status='sent',
                sent_at=timezone.now()
            )
            
            return Response({
                'status': 'success',
                'message': 'Email has been queued for sending',
                'log_id': log.id
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
