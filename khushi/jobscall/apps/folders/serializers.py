from rest_framework import serializers
from .models import Folder, FolderProfile
from apps.profile.serializers import UserBasicSerializer

class FolderSerializer(serializers.ModelSerializer):
    """Serializer for Folder model"""
    profile_count = serializers.SerializerMethodField()
    created_by = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = Folder
        fields = [
            'id', 'name', 'description', 'is_default',
            'created_at', 'updated_at', 'created_by', 'profile_count'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at', 'profile_count']
    
    def get_profile_count(self, obj):
        return obj.folder_profiles.count()


class FolderProfileSerializer(serializers.ModelSerializer):
    """Serializer for FolderProfile model"""
    profile_details = serializers.SerializerMethodField()
    added_by_details = UserBasicSerializer(source='added_by', read_only=True)
    
    class Meta:
        model = FolderProfile
        fields = [
            'id', 'folder', 'profile', 'profile_details',
            'added_at', 'added_by', 'added_by_details', 'notes'
        ]
        read_only_fields = ['added_at', 'added_by']
    
    def get_profile_details(self, obj):
        from apps.profile.serializers import UserProfileSerializer
        return UserProfileSerializer(obj.profile, context=self.context).data


class FolderCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating folders"""
    class Meta:
        model = Folder
        fields = ['name', 'description', 'is_default']
        extra_kwargs = {
            'is_default': {'required': False}
        }


class AddToFolderSerializer(serializers.Serializer):
    """Serializer for adding profiles to folders"""
    profile_ids = serializers.ListField(
        child=serializers.IntegerField(),
        min_length=1,
        help_text="List of profile IDs to add to the folder"
    )
    folder_id = serializers.IntegerField(
        help_text="ID of the folder to add profiles to"
    )
    
    def validate_folder_id(self, value):
        from .models import Folder
        try:
            return Folder.objects.get(id=value)
        except Folder.DoesNotExist:
            raise serializers.ValidationError("Folder does not exist")


class MoveBetweenFoldersSerializer(serializers.Serializer):
    """Serializer for moving profiles between folders"""
    profile_ids = serializers.ListField(
        child=serializers.IntegerField(),
        min_length=1,
        help_text="List of profile IDs to move"
    )
    source_folder_id = serializers.IntegerField(
        help_text="ID of the source folder"
    )
    target_folder_id = serializers.IntegerField(
        help_text="ID of the target folder"
    )
    
    def validate(self, attrs):
        from .models import Folder
        
        try:
            attrs['source_folder'] = Folder.objects.get(id=attrs.pop('source_folder_id'))
            attrs['target_folder'] = Folder.objects.get(id=attrs.pop('target_folder_id'))
        except Folder.DoesNotExist as e:
            raise serializers.ValidationError("One or both folders do not exist")
        
        if attrs['source_folder'].id == attrs['target_folder'].id:
            raise serializers.ValidationError("Source and target folders must be different")
            
        return attrs
