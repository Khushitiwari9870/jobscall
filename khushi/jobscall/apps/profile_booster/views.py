import logging
from rest_framework import viewsets, status, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from .models import (
    ProfileBooster, 
    BoosterRecommendation,
    BoosterProgress
)
from .serializers import (
    ProfileBoosterSerializer,
    BoosterProgressSerializer,
    StartBoosterSerializer,
    CompleteRecommendationSerializer,
    BoosterStatsSerializer
)
from permissions import IsOwnerOrReadOnly

logger = logging.getLogger(__name__)

class ProfileBoosterViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing profile boosters.
    """
    serializer_class = ProfileBoosterSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    
    def get_queryset(self):
        """Return only the current user's boosters"""
        return ProfileBooster.objects.filter(user=self.request.user).order_by('-created_at')
    
    def perform_create(self, serializer):
        """Set the user when creating a new booster"""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def start(self, request):
        """Start a new profile booster"""
        serializer = StartBoosterSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Create a new booster
            booster = ProfileBooster.objects.create(
                user=request.user,
                booster_type=serializer.validated_data['booster_type'],
                status=ProfileBooster.Status.IN_PROGRESS
            )
            
            # Simulate analysis (in a real app, this would be a background task)
            self._analyze_profile(booster)
            
            # Return the created booster
            response_serializer = self.get_serializer(booster)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error starting profile booster: {str(e)}")
            return Response(
                {"error": _("An error occurred while starting the profile booster.")},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _analyze_profile(self, booster):
        """Analyze the user's profile and generate recommendations"""
        # This would be a complex analysis in a real app
        # For now, we'll just create some sample recommendations
        
        # Update booster status
        booster.status = ProfileBooster.Status.COMPLETED
        booster.score_before = 45  # Example score
        booster.score_after = 78   # Improved score
        booster.save()
        
        # Create sample recommendations
        recommendations = [
            {
                'category': 'skills',
                'priority': 'high',
                'title': 'Add more technical skills',
                'description': 'Include Python, Django, and other relevant technologies',
                'action_text': 'Add Skills',
                'action_url': '/profile/skills/'
            },
            {
                'category': 'experience',
                'priority': 'medium',
                'title': 'Enhance work experience descriptions',
                'description': 'Add more details about your responsibilities and achievements',
                'action_text': 'Edit Experience',
                'action_url': '/profile/experience/'
            },
            {
                'category': 'education',
                'priority': 'low',
                'title': 'Add your education details',
                'description': 'Include your academic background and certifications',
                'action_text': 'Add Education',
                'action_url': '/profile/education/'
            }
        ]
        
        for rec_data in recommendations:
            BoosterRecommendation.objects.create(booster=booster, **rec_data)
        
        # Update or create progress
        progress, _ = BoosterProgress.objects.get_or_create(user=booster.user)
        progress.boost_count += 1
        progress.last_boosted_at = timezone.now()
        progress.save()
        
        return booster
    
    @action(detail=True, methods=['post'])
    def complete_recommendation(self, request, pk=None):
        """Mark a recommendation as completed"""
        booster = self.get_object()
        
        serializer = CompleteRecommendationSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            recommendation = serializer.validated_data['recommendation_id']
            recommendation.is_completed = serializer.validated_data['is_completed']
            recommendation.save()
            
            # Update progress
            progress = BoosterProgress.objects.get(user=request.user)
            progress.update_scores()
            
            return Response({"status": "success"})
            
        except Exception as e:
            logger.error(f"Error updating recommendation: {str(e)}")
            return Response(
                {"error": _("An error occurred while updating the recommendation.")},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get booster statistics for the current user"""
        try:
            progress, _ = BoosterProgress.objects.get_or_create(user=request.user)
            serializer = BoosterStatsSerializer(progress, context={'request': request})
            return Response(serializer.data)
            
        except Exception as e:
            logger.error(f"Error getting booster stats: {str(e)}")
            return Response(
                {"error": _("An error occurred while retrieving statistics.")},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class BoosterProgressViewSet(
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    """
    API endpoint for viewing and updating booster progress.
    """
    serializer_class = BoosterProgressSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    
    def get_queryset(self):
        """Return only the current user's progress"""
        return BoosterProgress.objects.filter(user=self.request.user)
    
    def retrieve(self, request, *args, **kwargs):
        """Get or create progress for the current user"""
        progress, _ = BoosterProgress.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(progress)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def refresh(self, request):
        """Refresh the user's progress"""
        try:
            progress = BoosterProgress.objects.get(user=request.user)
            progress.update_scores()
            serializer = self.get_serializer(progress)
            return Response(serializer.data)
            
        except BoosterProgress.DoesNotExist:
            progress = BoosterProgress.objects.create(user=request.user)
            serializer = self.get_serializer(progress)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
