from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db import transaction
from django.shortcuts import get_object_or_404

from .models import ResumeScore, ScoreImprovement, ResumeScoreSettings
from .serializers import (
    ResumeScoreSerializer, ResumeScoreCreateSerializer,
    ScoreImprovementSerializer, ResumeScoreSettingsSerializer
)

class ResumeScoreViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing resume scores.
    """
    queryset = ResumeScore.objects.all().order_by('-created_at')
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ResumeScoreCreateSerializer
        return ResumeScoreSerializer
    
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
        # to process the resume and calculate the score
        # e.g., process_resume_score.delay(serializer.instance.id)
    
    @action(detail=True, methods=['post'])
    def apply_improvement(self, request, pk=None):
        """Apply a specific improvement to the resume."""
        resume_score = self.get_object()
        improvement_id = request.data.get('improvement_id')
        
        try:
            improvement = ScoreImprovement.objects.get(
                id=improvement_id,
                resume_score=resume_score
            )
            
            # In a real implementation, you would apply the improvement to the resume
            # and update the score
            improvement.is_applied = True
            improvement.save()
            
            # Update the resume score (placeholder for actual implementation)
            resume_score.status = 'completed'
            resume_score.save()
            
            return Response({'status': 'improvement applied'})
            
        except ScoreImprovement.DoesNotExist:
            return Response(
                {'error': 'Improvement not found'},
                status=status.HTTP_404_NOT_FOUND
            )

class ResumeScoreSettingsViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing resume score settings.
    """
    queryset = ResumeScoreSettings.objects.filter(is_active=True)
    serializer_class = ResumeScoreSettingsSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def get_queryset(self):
        return self.queryset.order_by('name')

class ScoreImprovementViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for viewing and managing score improvements.
    """
    serializer_class = ScoreImprovementSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ScoreImprovement.objects.filter(
            resume_score__user=self.request.user
        ).select_related('resume_score')
