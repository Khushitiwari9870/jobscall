from rest_framework import viewsets, status, permissions, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.utils.translation import gettext_lazy as _
from django.db.models import Q

from .models import RecentSearch
from .serializers import (
    RecentSearchSerializer,
    RecentSearchListSerializer,
    RecentSearchCreateSerializer
)


class RecentSearchPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50


class RecentSearchViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing recent searches.
    """
    serializer_class = RecentSearchSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = RecentSearchPagination
    
    def get_queryset(self):
        """Return only the current user's recent searches"""
        return RecentSearch.objects.filter(
            user=self.request.user
        ).order_by('-created_at')
    
    def get_serializer_class(self):
        """Return appropriate serializer class based on action"""
        if self.action == 'list':
            return RecentSearchListSerializer
        elif self.action == 'create':
            return RecentSearchCreateSerializer
        return RecentSearchSerializer
    
    def perform_create(self, serializer):
        """Set the user when creating a new recent search"""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """
        Get recent searches filtered by search type.
        Expected query params: ?search_type=job|candidate|company
        """
        search_type = request.query_params.get('search_type', '').lower()
        
        if not search_type:
            return Response(
                {"error": _("search_type parameter is required")},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if search_type not in dict(RecentSearch.SEARCH_TYPES).keys():
            return Response(
                {"error": _("Invalid search type")},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        queryset = self.get_queryset().filter(search_type=search_type)
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['delete'])
    def clear_all(self, request):
        """Clear all recent searches for the current user"""
        count, _ = self.get_queryset().delete()
        return Response({
            "status": _("Successfully deleted {count} recent searches").format(count=count)
        })


class RecentSearchAdminViewSet(viewsets.ModelViewSet):
    """
    Admin API endpoint for managing all recent searches.
    Requires admin or staff permissions.
    """
    serializer_class = RecentSearchSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = RecentSearch.objects.all().order_by('-created_at')
    pagination_class = RecentSearchPagination
    
    def get_serializer_class(self):
        """Return appropriate serializer class based on action"""
        if self.action == 'list':
            return RecentSearchListSerializer
        return RecentSearchSerializer
