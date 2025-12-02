from rest_framework import viewsets, status, permissions, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from django.shortcuts import get_object_or_404

from .models import Folder, FolderProfile
from .serializers import (
    FolderSerializer, FolderProfileSerializer,
    FolderCreateSerializer, AddToFolderSerializer,
    MoveBetweenFoldersSerializer
)
from apps.profile.models import UserProfile


class FolderViewSet(viewsets.ModelViewSet):
    """ViewSet for managing folders"""
    serializer_class = FolderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Folder.objects.filter(created_by=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return FolderCreateSerializer
        return super().get_serializer_class()
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def add_profiles(self, request, pk=None):
        """Add profiles to a folder"""
        folder = self.get_object()
        serializer = AddToFolderSerializer(data=request.data)
        
        if serializer.is_valid():
            profile_ids = serializer.validated_data['profile_ids']
            
            # Get existing profile IDs in the folder to avoid duplicates
            existing_profiles = set(
                FolderProfile.objects.filter(
                    folder=folder,
                    profile_id__in=profile_ids
                ).values_list('profile_id', flat=True)
            )
            
            # Create new folder profiles
            folder_profiles = []
            for profile_id in profile_ids:
                if profile_id not in existing_profiles:
                    folder_profiles.append(
                        FolderProfile(
                            folder=folder,
                            profile_id=profile_id,
                            added_by=request.user
                        )
                    )
            
            if folder_profiles:
                FolderProfile.objects.bulk_create(folder_profiles)
            
            return Response(
                {"message": f"Added {len(folder_profiles)} profiles to the folder"},
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def move_profiles(self, request):
        """Move profiles between folders"""
        serializer = MoveBetweenFoldersSerializer(data=request.data)
        
        if serializer.is_valid():
            source_folder = serializer.validated_data['source_folder']
            target_folder = serializer.validated_data['target_folder']
            profile_ids = serializer.validated_data['profile_ids']
            
            # Verify user has permission to both folders
            if (source_folder.created_by != request.user or 
                target_folder.created_by != request.user):
                return Response(
                    {"error": "You don't have permission to access these folders"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            with transaction.atomic():
                # Delete from source folder
                deleted_count, _ = FolderProfile.objects.filter(
                    folder=source_folder,
                    profile_id__in=profile_ids
                ).delete()
                
                # Add to target folder if not already present
                existing_profiles = set(
                    FolderProfile.objects.filter(
                        folder=target_folder,
                        profile_id__in=profile_ids
                    ).values_list('profile_id', flat=True)
                )
                
                new_folder_profiles = []
                for profile_id in profile_ids:
                    if profile_id not in existing_profiles:
                        new_folder_profiles.append(
                            FolderProfile(
                                folder=target_folder,
                                profile_id=profile_id,
                                added_by=request.user
                            )
                        )
                
                if new_folder_profiles:
                    FolderProfile.objects.bulk_create(new_folder_profiles)
                
                return Response({
                    "message": f"Moved {deleted_count} profiles to the target folder"
                })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FolderProfileViewSet(viewsets.GenericViewSet,
                         mixins.ListModelMixin,
                         mixins.RetrieveModelMixin,
                         mixins.DestroyModelMixin):
    """ViewSet for managing folder profiles"""
    serializer_class = FolderProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return FolderProfile.objects.filter(
            folder__created_by=self.request.user
        ).select_related('profile', 'added_by')
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
