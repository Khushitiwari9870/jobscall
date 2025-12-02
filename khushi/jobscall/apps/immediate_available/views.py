from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.contrib.auth import get_user_model

from .models import ImmediateAvailableProfile
from .serializers import (
    ImmediateAvailableProfileSerializer,
    ImmediateAvailableProfileUpdateSerializer,
    ImmediateAvailableSearchSerializer
)

User = get_user_model()


class ImmediateAvailableProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing immediate available profiles.
    """
    queryset = ImmediateAvailableProfile.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        'user__first_name',
        'user__last_name',
        'user__email',
        'current_company',
        'current_designation',
        'skills'
    ]
    ordering_fields = [
        'available_from',
        'experience_years',
        'current_ctc',
        'notice_period',
        'created_at'
    ]
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return ImmediateAvailableProfileUpdateSerializer
        return ImmediateAvailableProfileSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter for search functionality
        if self.action == 'search':
            return queryset.filter(is_immediately_available=True)
            
        # For other actions, return the full queryset
        return queryset

    @action(detail=False, methods=['post'], url_path='search')
    def search(self, request):
        """
        Search for immediately available candidates based on various criteria.
        """
        serializer = ImmediateAvailableSearchSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        queryset = self.get_queryset()
        data = serializer.validated_data
        
        # Apply filters based on search criteria
        if 'skills' in data and data['skills']:
            # Filter by skills (case-insensitive partial match)
            skill_queries = [Q(skills__icontains=skill) for skill in data['skills']]
            if skill_queries:
                skill_query = skill_queries.pop()
                for query in skill_queries:
                    skill_query |= query
                queryset = queryset.filter(skill_query)
        
        if 'experience_min' in data and data['experience_min'] is not None:
            queryset = queryset.filter(experience_years__gte=data['experience_min'])
        
        if 'experience_max' in data and data['experience_max'] is not None:
            queryset = queryset.filter(experience_years__lte=data['experience_max'])
        
        if 'location' in data and data['location']:
            queryset = queryset.filter(preferred_locations__icontains=data['location'])
        
        if 'current_ctc_min' in data and data['current_ctc_min'] is not None:
            queryset = queryset.filter(current_ctc__gte=data['current_ctc_min'])
        
        if 'current_ctc_max' in data and data['current_ctc_max'] is not None:
            queryset = queryset.filter(current_ctc__lte=data['current_ctc_max'])
        
        if 'notice_period_max' in data and data['notice_period_max'] is not None:
            queryset = queryset.filter(notice_period__lte=data['notice_period_max'])
        
        if 'is_serving_notice' in data and data['is_serving_notice'] is not None:
            queryset = queryset.filter(is_serving_notice=data['is_serving_notice'])
        
        if 'notice_period_negotiable' in data and data['notice_period_negotiable'] is not None:
            queryset = queryset.filter(notice_period_negotiable=data['notice_period_negotiable'])
        
        # Apply pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='my-profile')
    def my_profile(self, request):
        """
        Get or create the immediate available profile for the current user.
        """
        profile, created = ImmediateAvailableProfile.objects.get_or_create(
            user=request.user
        )
        serializer = self.get_serializer(profile)
        return Response(serializer.data)
