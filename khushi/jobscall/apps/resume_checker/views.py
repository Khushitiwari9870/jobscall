from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db import transaction
from django.shortcuts import get_object_or_404

from .models import ResumeCheck, ResumeIssue, ResumeCheckSettings
from .serializers import (
    ResumeCheckSerializer, ResumeCheckCreateSerializer,
    ResumeIssueSerializer, ResumeCheckSettingsSerializer
)

class ResumeCheckViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing resume checks.
    """
    queryset = ResumeCheck.objects.all().order_by('-created_at')
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ResumeCheckCreateSerializer
        return ResumeCheckSerializer
    
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # Save the original filename and file size
        resume_file = self.request.FILES.get('resume_file')
        serializer.save(
            user=self.request.user,
            original_filename=resume_file.name,
            file_size=resume_file.size,
            status='pending'
        )
        
        # In a real implementation, you would start an async task here
        # to process the resume and analyze it
        # e.g., process_resume_check.delay(serializer.instance.id)
    
    @action(detail=True, methods=['post'])
    def resolve_issue(self, request, pk=None):
        """Mark a specific issue as resolved."""
        resume_check = self.get_object()
        issue_id = request.data.get('issue_id')
        
        try:
            issue = ResumeIssue.objects.get(
                id=issue_id,
                resume_check=resume_check
            )
            
            issue.is_resolved = True
            issue.save()
            
            return Response({'status': 'issue resolved'})
            
        except ResumeIssue.DoesNotExist:
            return Response(
                {'error': 'Issue not found'},
                status=status.HTTP_404_NOT_FOUND
            )

class ResumeCheckSettingsViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing resume check settings.
    """
    queryset = ResumeCheckSettings.objects.filter(is_active=True)
    serializer_class = ResumeCheckSettingsSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def get_queryset(self):
        return self.queryset.order_by('name')

class ResumeIssueViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for viewing and managing resume issues.
    """
    serializer_class = ResumeIssueSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ResumeIssue.objects.filter(
            resume_check__user=self.request.user
        ).select_related('resume_check')
