from rest_framework import viewsets, status, permissions, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _
from django.db.models import Q

from users.models import UserProfile
from .models import SavedSearch
from .serializers import (
    SavedSearchSerializer, 
    SavedSearchListSerializer,
    SavedSearchRunSerializer,
    CandidateAdvancedSearchSerializer,
    CandidateSearchResultSerializer
)


class CandidateSearchPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class SavedSearchViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing saved searches.
    """
    serializer_class = SavedSearchSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = CandidateSearchPagination
    
    def get_queryset(self):
        """Return only the current user's saved searches"""
        return SavedSearch.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        """Return appropriate serializer class based on action"""
        if self.action == 'list':
            return SavedSearchListSerializer
        return SavedSearchSerializer
    
    def perform_create(self, serializer):
        """Set the user when creating a new saved search"""
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def run(self, request, pk=None):
        """Run a saved search and return the results"""
        saved_search = self.get_object()
        
        # For advanced candidate searches, use the advanced search logic
        if saved_search.search_type == 'advanced_candidate':
            return self._run_advanced_candidate_search(saved_search, request)
            
        # Original logic for other search types
        serializer = SavedSearchRunSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        response = saved_search.run_search(
            save_results=serializer.validated_data['save_results']
        )
        
        return Response(response.data, status=response.status_code)
    
    def _run_advanced_candidate_search(self, saved_search, request):
        """Handle advanced candidate search"""
        queryset = UserProfile.objects.filter(user__is_active=True).select_related('user')
        
        # Apply filters based on saved search parameters
        if saved_search.query:
            queryset = queryset.filter(
                Q(user__first_name__icontains=saved_search.query) |
                Q(user__last_name__icontains=saved_search.query) |
                Q(headline__icontains=saved_search.query) |
                Q(summary__icontains=saved_search.query) |
                Q(skills__name__icontains=saved_search.query)
            ).distinct()
        
        if saved_search.location:
            locations = [loc.lower() for loc in saved_search.location]
            queryset = queryset.filter(
                Q(current_city__name__in=locations) |
                Q(current_country__name__in=areas)
            )
        
        if saved_search.skills:
            queryset = queryset.filter(
                skills__name__in=saved_search.skills
            ).distinct()
        
        # Apply additional filters
        if saved_search.experience:
            # Add experience filtering logic
            pass
            
        if saved_search.salary:
            # Add salary filtering logic
            pass
            
        # Add more filters as needed...
        
        # Paginate the results
        page = self.paginate_queryset(queryset)
        if page is not None:
            results = [{
                'id': profile.id,
                'name': f"{profile.user.first_name} {profile.user.last_name}",
                'headline': profile.headline or '',
                'location': profile.current_city.name if profile.current_city else '',
                'experience': profile.total_experience_years,
                'skills': list(profile.skills.values_list('name', flat=True)[:5]),
                'last_active': profile.updated_at.strftime('%b %Y') if profile.updated_at else ''
            } for profile in page]
            
            return self.get_paginated_response(results)
            
        return Response({"error": "No results found"}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        """Toggle the active status of a saved search"""
        saved_search = self.get_object()
        saved_search.is_active = not saved_search.is_active
        saved_search.save(update_fields=['is_active', 'updated_at'])
        
        return Response({
            'status': 'success',
            'is_active': saved_search.is_active,
            'message': _('Saved search has been {}').format(
                _('activated') if saved_search.is_active else _('deactivated')
            )
        })
    
    @action(detail=True, methods=['post'])
    def toggle_alerts(self, request, pk=None):
        """Toggle email alerts for a saved search"""
        saved_search = self.get_object()
        
        # Can't enable alerts for inactive searches
        if not saved_search.is_active and not saved_search.email_alerts:
            return Response({
                'status': 'error',
                'message': _('Cannot enable alerts for an inactive search')
            }, status=status.HTTP_400_BAD_REQUEST)
        
        saved_search.email_alerts = not saved_search.email_alerts
        saved_search.save(update_fields=['email_alerts', 'updated_at'])
        
        return Response({
            'status': 'success',
            'email_alerts': saved_search.email_alerts,
            'message': _('Email alerts have been {} for this search').format(
                _('enabled') if saved_search.email_alerts else _('disabled')
            )
        })


class CandidateAdvancedSearchView(generics.GenericAPIView):
    """
    API endpoint for advanced candidate search.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CandidateAdvancedSearchSerializer
    pagination_class = CandidateSearchPagination
    
    def post(self, request, *args, **kwargs):
        """
        Perform an advanced candidate search.
        """
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        search_params = serializer.validated_data
        queryset = UserProfile.objects.filter(user__is_active=True).select_related('user')
        
        # Apply filters based on search parameters
        if search_params.get('keyword'):
            keyword = search_params['keyword']
            queryset = queryset.filter(
                Q(user__first_name__icontains=keyword) |
                Q(user__last_name__icontains=keyword) |
                Q(headline__icontains=keyword) |
                Q(summary__icontains=keyword) |
                Q(skills__name__icontains=keyword)
            ).distinct()
        
        if search_params.get('location'):
            locations = [loc.lower() for loc in search_params['location']]
            queryset = queryset.filter(
                Q(current_city__name__in=locations) |
                Q(current_country__name__in=locations)
            )
        
        if search_params.get('skills'):
            queryset = queryset.filter(
                skills__name__in=search_params['skills']
            ).distinct()
        
        # Apply additional filters
        if search_params.get('experience'):
            # Add experience filtering logic
            pass
            
        if search_params.get('salary'):
            # Add salary filtering logic
            pass
            
        # Add more filters as needed...
        
        # Paginate the results
        page = self.paginate_queryset(queryset)
        if page is not None:
            results = [{
                'id': profile.id,
                'name': f"{profile.user.first_name} {profile.user.last_name}",
                'headline': profile.headline or '',
                'location': profile.current_city.name if profile.current_city else '',
                'experience': profile.total_experience_years,
                'skills': list(profile.skills.values_list('name', flat=True)[:5]),
                'last_active': profile.updated_at.strftime('%b %Y') if profile.updated_at else ''
            } for profile in page]
            
            return self.get_paginated_response(results)
            
        return Response({"error": "No results found"}, status=status.HTTP_404_NOT_FOUND)


class SavedSearchAdminViewSet(viewsets.ModelViewSet):
    """
    Admin API endpoint for managing all saved searches.
    Requires admin or staff permissions.
    """
    serializer_class = SavedSearchSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = SavedSearch.objects.all()
    
    def get_serializer_class(self):
        """Return appropriate serializer class based on action"""
        if self.action == 'list':
            return SavedSearchListSerializer
        return SavedSearchSerializer
