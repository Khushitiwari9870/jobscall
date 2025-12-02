from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _

from .models import ResumeHighlight, ResumeAnalysis
from .serializers import (
    ResumeHighlightSerializer, ResumeAnalysisSerializer,
    ResumeAnalysisCreateSerializer, ResumeHighlightUpdateSerializer
)
from applications.models import Application
from permissions import IsRecruiterOrAdmin, IsOwnerOrRecruiterOrAdmin


class ResumeAnalysisViewSet(viewsets.ModelViewSet):
    """ViewSet for managing resume analyses"""
    permission_classes = [permissions.IsAuthenticated, IsRecruiterOrAdmin]
    serializer_class = ResumeAnalysisSerializer
    
    def get_queryset(self):
        """Return analyses for applications the user has access to"""
        user = self.request.user
        queryset = ResumeAnalysis.objects.all()
        
        # Filter by application if provided
        application_id = self.request.query_params.get('application_id')
        if application_id:
            queryset = queryset.filter(application_id=application_id)
        
        # Non-admin users can only see analyses for their own applications
        if not user.is_staff and not user.is_superuser:
            queryset = queryset.filter(
                application__job_posting__company__in=user.companies.all()
            )
        
        return queryset.select_related(
            'application', 'application__job_posting', 'analyzed_by'
        ).prefetch_related('highlights')
    
    @action(detail=False, methods=['post'])
    def analyze(self, request):
        ""
        Analyze a resume for a job application
        This would typically call an AI service to analyze the resume
        """
        serializer = ResumeAnalysisCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        application = serializer.validated_data['application_id']
        analyze_again = serializer.validated_data['analyze_again']
        
        # Check if analysis already exists
        analysis, created = ResumeAnalysis.objects.get_or_create(
            application=application,
            defaults={
                'analyzed_by': request.user,
                'overall_score': 0,  # This would be set by the AI analysis
                'is_auto_generated': True
            }
        )
        
        if not created and not analyze_again:
            serializer = self.get_serializer(analysis)
            return Response(serializer.data)
        
        # TODO: Call AI service to analyze the resume
        # This is a placeholder for the actual AI analysis logic
        analysis.overall_score = 75  # Example score
        analysis.strengths_summary = "Strong experience in Python and Django."
        analysis.weaknesses_summary = "Could improve experience with cloud technologies."
        analysis.analyzed_by = request.user
        analysis.is_auto_generated = True
        analysis.save()
        
        # Create example highlights (in a real app, these would come from the AI)
        if analyze_again or not analysis.highlights.exists():
            analysis.highlights.all().delete()
            
            example_highlights = [
                {
                    'text': '5+ years of Python and Django experience',
                    'highlight_type': 'strength',
                    'comment': 'Strong relevant experience',
                    'suggested_improvement': None
                },
                {
                    'text': 'Limited experience with cloud platforms',
                    'highlight_type': 'weakness',
                    'comment': 'Cloud experience is important for this role',
                    'suggested_improvement': 'Consider getting certified in AWS or GCP'
                },
                # Add more example highlights as needed
            ]
            
            for highlight_data in example_highlights:
                ResumeHighlight.objects.create(
                    application=application,
                    created_by=request.user,
                    **highlight_data
                )
        
        serializer = self.get_serializer(analysis)
        return Response(serializer.data, 
                      status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class ResumeHighlightViewSet(viewsets.ModelViewSet):
    """ViewSet for managing resume highlights"""
    permission_classes = [permissions.IsAuthenticated, IsRecruiterOrAdmin]
    
    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return ResumeHighlightUpdateSerializer
        return ResumeHighlightSerializer
    
    def get_queryset(self):
        """Return highlights for analyses the user has access to"""
        user = self.request.user
        queryset = ResumeHighlight.objects.all()
        
        # Filter by analysis if provided
        analysis_id = self.request.query_params.get('analysis_id')
        if analysis_id:
            queryset = queryset.filter(analysis_id=analysis_id)
        
        # Non-admin users can only see highlights for their company's applications
        if not user.is_staff and not user.is_superuser:
            queryset = queryset.filter(
                application__job_posting__company__in=user.companies.all()
            )
        
        return queryset.select_related('application', 'created_by')
    
    def perform_create(self, serializer):
        """Set the created_by user when creating a highlight"""
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def update_highlight(self, request, pk=None):
        """Update a specific highlight"""
        highlight = self.get_object()
        serializer = ResumeHighlightUpdateSerializer(
            highlight, 
            data=request.data, 
            partial=True,
            context={'request': request}
        )
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save()
        return Response(ResumeHighlightSerializer(highlight).data)
