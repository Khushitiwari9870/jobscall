from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.contrib.auth import get_user_model

from .models import UserProfile
from .serializers import (
    UserProfileSerializer,
    UserProfileUpdateSerializer,
    ProfileSearchSerializer,
    UserBasicSerializer
)

User = get_user_model()

class UserProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing user profiles.
    """
    queryset = UserProfile.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        'user__first_name',
        'user__last_name',
        'user__email',
        'phone_number',
        'current_company',
        'designation',
        'skills',
    ]
    ordering_fields = [
        'user__first_name',
        'user__last_name',
        'created_at',
        'profile_completion',
    ]
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return UserProfileUpdateSerializer
        return UserProfileSerializer

    def get_queryset(self):
        """Return only the current user's profile for non-staff users"""
        queryset = super().get_queryset()
        if not self.request.user.is_staff:
            return queryset.filter(user=self.request.user)
        return queryset

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Retrieve or create the current user's profile"""
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='search')
    def search_profiles(self, request):
        """Search for user profiles based on various criteria"""
        serializer = ProfileSearchSerializer(data=request.data)
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
        
        if 'location' in data and data['location']:
            location = data['location'].lower()
            queryset = queryset.filter(
                Q(city__icontains=location) |
                Q(state__icontains=location) |
                Q(country__icontains=location) |
                Q(preferred_locations__icontains=location)
            )
        
        if 'experience_min' in data and data['experience_min'] is not None:
            queryset = queryset.filter(experience_years__gte=data['experience_min'])
        
        if 'experience_max' in data and data['experience_max'] is not None:
            queryset = queryset.filter(experience_years__lte=data['experience_max'])
        
        if 'current_company' in data and data['current_company']:
            queryset = queryset.filter(
                current_company__icontains=data['current_company']
            )
        
        if 'designation' in data and data['designation']:
            queryset = queryset.filter(
                designation__icontains=data['designation']
            )
        
        # Apply pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='suggested')
    def suggested_profiles(self, request):
        """Get suggested profiles based on the current user's profile"""
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            
            # Start with all public profiles excluding the current user
            queryset = self.get_queryset().filter(
                is_profile_public=True
            ).exclude(user=request.user)
            
            # If user has skills, filter by similar skills
            if user_profile.skills:
                skill_queries = [Q(skills__icontains=skill) for skill in user_profile.skills[:3]]
                if skill_queries:
                    skill_query = skill_queries.pop()
                    for query in skill_queries:
                        skill_query |= query
                    queryset = queryset.filter(skill_query)
            
            # If user has preferred locations, filter by location
            if user_profile.preferred_locations:
                location_queries = [
                    Q(city__icontains=loc) |
                    Q(state__icontains=loc) |
                    Q(country__icontains=loc) |
                    Q(preferred_locations__icontains=loc)
                    for loc in user_profile.preferred_locations[:2]
                ]
                if location_queries:
                    location_query = location_queries.pop()
                    for query in location_queries:
                        location_query |= query
                    queryset = queryset.filter(location_query)
            
            # Order by profile completion and limit results
            queryset = queryset.order_by('-profile_completion')[:10]
            
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
            
        except UserProfile.DoesNotExist:
            return Response(
                {"detail": "User profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )
