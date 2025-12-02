from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import SharedIvrResource, SharedIvrTemplate, SharedIvrUsageLog

User = get_user_model()

class SharedIvrResourceSerializer(serializers.ModelSerializer):
    """Serializer for SharedIvrResource model"""
    created_by_details = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = SharedIvrResource
        fields = [
            'id', 'name', 'description', 'resource_type', 'file', 'file_url',
            'content', 'language', 'is_active', 'created_by', 'created_by_details',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']
    
    def get_created_by_details(self, obj):
        if obj.created_by:
            return {
                'id': obj.created_by.id,
                'email': obj.created_by.email,
                'name': f"{obj.created_by.get_full_name()}"
            }
        return None
    
    def get_file_url(self, obj):
        if obj.file:
            return obj.file.url
        return None


class SharedIvrTemplateSerializer(serializers.ModelSerializer):
    """Serializer for SharedIvrTemplate model"""
    resources = SharedIvrResourceSerializer(many=True, read_only=True)
    resource_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    created_by_details = serializers.SerializerMethodField()
    
    class Meta:
        model = SharedIvrTemplate
        fields = [
            'id', 'name', 'description', 'template_type', 'content',
            'resources', 'resource_ids', 'version', 'is_active', 'is_public',
            'created_by', 'created_by_details', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']
    
    def get_created_by_details(self, obj):
        if obj.created_by:
            return {
                'id': obj.created_by.id,
                'email': obj.created_by.email,
                'name': f"{obj.created_by.get_full_name()}"
            }
        return None
    
    def create(self, validated_data):
        resource_ids = validated_data.pop('resource_ids', [])
        template = SharedIvrTemplate.objects.create(**validated_data)
        template.resources.set(resource_ids)
        return template
    
    def update(self, instance, validated_data):
        resource_ids = validated_data.pop('resource_ids', None)
        template = super().update(instance, validated_data)
        if resource_ids is not None:
            template.resources.set(resource_ids)
        return template


class SharedIvrUsageLogSerializer(serializers.ModelSerializer):
    """Serializer for SharedIvrUsageLog model"""
    user_details = serializers.SerializerMethodField()
    resource_name = serializers.SerializerMethodField()
    
    class Meta:
        model = SharedIvrUsageLog
        fields = [
            'id', 'resource_type', 'resource_id', 'resource_name',
            'action', 'user', 'user_details', 'ip_address', 'user_agent',
            'metadata', 'timestamp'
        ]
        read_only_fields = fields
    
    def get_user_details(self, obj):
        if obj.user:
            return {
                'id': obj.user.id,
                'email': obj.user.email,
                'name': f"{obj.user.get_full_name()}"
            }
        return None
    
    def get_resource_name(self, obj):
        model_map = {
            'resource': SharedIvrResource,
            'template': SharedIvrTemplate,
        }
        
        model = model_map.get(obj.resource_type)
        if not model:
            return None
            
        try:
            resource = model.objects.filter(id=obj.resource_id).first()
            return str(resource) if resource else None
        except:
            return None


class SharedIvrTemplateExportSerializer(serializers.Serializer):
    """Serializer for exporting IVR templates with their resources"""
    include_resources = serializers.BooleanField(default=True)
    format = serializers.ChoiceField(
        choices=['json', 'xml'],
        default='json'
    )


class SharedIvrImportSerializer(serializers.Serializer):
    """Serializer for importing IVR resources and templates"""
    file = serializers.FileField(required=True)
    import_type = serializers.ChoiceField(
        choices=['resource', 'template', 'auto'],
        default='auto'
    )
    conflict_resolution = serializers.ChoiceField(
        choices=['skip', 'overwrite', 'rename'],
        default='skip'
    )
    
    def validate_file(self, value):
        # Add file validation logic here
        return value
