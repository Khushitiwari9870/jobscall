from rest_framework import serializers
from django.utils.translation import gettext_lazy as _

from .models import RecentSearch


class RecentSearchSerializer(serializers.ModelSerializer):
    """Serializer for the RecentSearch model"""
    search_type_display = serializers.CharField(
        source='get_search_type_display',
        read_only=True
    )
    
    class Meta:
        model = RecentSearch
        fields = [
            'id', 'search_type', 'search_type_display',
            'query', 'filters', 'created_at'
        ]
        read_only_fields = ('id', 'created_at')
    
    def validate(self, data):
        """
        Validate that either query or filters are provided.
        """
        if not data.get('query') and not data.get('filters'):
            raise serializers.ValidationError(
                _("Either query or filters must be provided.")
            )
        return data


class RecentSearchListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing recent searches"""
    search_type_display = serializers.CharField(
        source='get_search_type_display',
        read_only=True
    )
    
    class Meta:
        model = RecentSearch
        fields = [
            'id', 'search_type', 'search_type_display',
            'query', 'created_at'
        ]
        read_only_fields = fields


class RecentSearchCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating recent searches"""
    class Meta:
        model = RecentSearch
        fields = ['search_type', 'query', 'filters']
    
    def create(self, validated_data):
        """Set the user from the request"""
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
