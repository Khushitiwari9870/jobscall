import os
import logging
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from .models import ResumeEnhancement, ResumeEnhancementFeedback
from .serializers import (
    ResumeEnhancementSerializer,
    ResumeEnhancementCreateSerializer,
    ResumeEnhancementFeedbackSerializer,
    ResumeUploadSerializer
)
from permissions import IsOwnerOrReadOnly

logger = logging.getLogger(__name__)

class ResumeEnhancementViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing resume enhancements.
    """
    queryset = ResumeEnhancement.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ResumeUploadSerializer
        return ResumeEnhancementSerializer
    
    def get_queryset(self):
        """Return only the current user's resume enhancements"""
        queryset = super().get_queryset()
        return queryset.filter(user=self.request.user).order_by('-created_at')
    
    def perform_create(self, serializer):
        """Create a new resume enhancement"""
        # This will be handled by the custom create method
        pass
    
    def create(self, request, *args, **kwargs):
        """Handle file upload and create enhancement"""
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Create the enhancement record
            enhancement = ResumeEnhancement.objects.create(
                user=request.user,
                original_resume=serializer.validated_data['resume'],
                enhancement_type='entry_level',  # Default to entry level for now
                job_title=serializer.validated_data.get('job_title', ''),
                job_description=serializer.validated_data.get('job_description', '')
            )
            
            # In a real implementation, you would queue a background task here
            # to process the resume enhancement asynchronously
            # For now, we'll simulate a successful enhancement
            self._simulate_enhancement(enhancement)
            
            # Return the created enhancement
            response_serializer = ResumeEnhancementSerializer(
                enhancement,
                context={'request': request}
            )
            return Response(
                response_serializer.data,
                status=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            logger.error(f"Error creating resume enhancement: {str(e)}")
            return Response(
                {"error": _("An error occurred while processing your request.")},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _simulate_enhancement(self, enhancement):
        """Simulate the enhancement process (for demo purposes)"""
        # In a real implementation, this would be handled by a background task
        # that processes the resume and generates an enhanced version
        
        # Simulate processing time
        import time
        time.sleep(2)
        
        # Update the enhancement with simulated results
        enhancement.status = 'completed'
        enhancement.score_before = 65  # Example score
        enhancement.score_after = 85   # Improved score
        enhancement.improvements = [
            {"type": "keyword_optimization", "description": "Added relevant keywords for ATS"},
            {"type": "formatting", "description": "Improved resume layout and readability"},
            {"type": "content", "description": "Enhanced work experience descriptions"}
        ]
        enhancement.completed_at = timezone.now()
        
        # In a real implementation, you would save the enhanced resume file here
        # For now, we'll just set a placeholder
        enhancement.enhanced_resume = enhancement.original_resume
        
        enhancement.save()
    
    @action(detail=True, methods=['post'])
    def provide_feedback(self, request, pk=None):
        """Provide feedback on a resume enhancement"""
        enhancement = self.get_object()
        
        # Check if feedback already exists
        if hasattr(enhancement, 'feedback'):
            return Response(
                {"error": _("Feedback already provided for this enhancement.")},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = ResumeEnhancementFeedbackSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        feedback = serializer.save(enhancement=enhancement)
        return Response(
            ResumeEnhancementFeedbackSerializer(feedback).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=False, methods=['get'])
    def enhancement_types(self, request):
        """Get available enhancement types"""
        return Response([
            {"id": choice[0], "name": str(choice[1])}
            for choice in ResumeEnhancement.EnhancementType.choices
        ])
