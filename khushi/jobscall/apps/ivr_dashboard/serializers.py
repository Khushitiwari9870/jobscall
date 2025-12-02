from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    IvrDashboardPanel, IvrDashboardFilter, IvrDashboardLayout,
    IvrDashboardUserSettings, IvrDashboardSharedView
)

User = get_user_model()

class UserBasicSerializer(serializers.ModelSerializer):
    """Basic user serializer for related fields"""
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']
        read_only_fields = fields


class IvrDashboardPanelSerializer(serializers.ModelSerializer):
    """Serializer for IvrDashboardPanel model"""
    user_details = UserBasicSerializer(source='user', read_only=True)
    
    class Meta:
        model = IvrDashboardPanel
        fields = [
            'id', 'user', 'user_details', 'panel_type', 'title', 'description',
            'row', 'col', 'size_x', 'size_y', 'config', 'refresh_interval',
            'is_visible', 'order', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def validate(self, data):
        # Ensure panel type is valid
        if 'panel_type' in data and data['panel_type'] not in dict(IvrDashboardPanel.PANEL_TYPES):
            raise serializers.ValidationError({"panel_type": "Invalid panel type"})
        
        # Ensure position and size are non-negative
        for field in ['row', 'col', 'size_x', 'size_y']:
            if field in data and data[field] < 0:
                raise serializers.ValidationError({field: "Must be a non-negative number"})
        
        # Ensure refresh_interval is reasonable
        if 'refresh_interval' in data and data['refresh_interval'] > 86400:  # 24 hours
            raise serializers.ValidationError({"refresh_interval": "Refresh interval too long"})
        
        return data


class IvrDashboardFilterSerializer(serializers.ModelSerializer):
    """Serializer for IvrDashboardFilter model"""
    user_details = UserBasicSerializer(source='user', read_only=True)
    
    class Meta:
        model = IvrDashboardFilter
        fields = [
            'id', 'user', 'user_details', 'name', 'filter_type',
            'is_global', 'is_default', 'filter_values', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def validate(self, data):
        # Ensure filter type is valid
        if 'filter_type' in data and data['filter_type'] not in dict(IvrDashboardFilter.FILTER_TYPES):
            raise serializers.ValidationError({"filter_type": "Invalid filter type"})
        
        # If this is being set as default, unset any existing default for this user
        if self.instance and 'is_default' in data and data['is_default']:
            IvrDashboardFilter.objects.filter(
                user=self.instance.user,
                is_default=True
            ).exclude(pk=self.instance.pk).update(is_default=False)
        
        return data


class IvrDashboardLayoutSerializer(serializers.ModelSerializer):
    """Serializer for IvrDashboardLayout model"""
    user_details = UserBasicSerializer(source='user', read_only=True)
    
    class Meta:
        model = IvrDashboardLayout
        fields = [
            'id', 'user', 'user_details', 'name', 'layout_type',
            'is_default', 'layout_data', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def validate(self, data):
        # Ensure layout type is valid
        if 'layout_type' in data and data['layout_type'] not in dict(IvrDashboardLayout.LAYOUT_TYPES):
            raise serializers.ValidationError({"layout_type": "Invalid layout type"})
        
        # If this is being set as default, unset any existing default for this user
        if self.instance and 'is_default' in data and data['is_default']:
            IvrDashboardLayout.objects.filter(
                user=self.instance.user,
                is_default=True
            ).exclude(pk=self.instance.pk).update(is_default=False)
        
        return data


class IvrDashboardUserSettingsSerializer(serializers.ModelSerializer):
    """Serializer for IvrDashboardUserSettings model"""
    user_details = UserBasicSerializer(source='user', read_only=True)
    
    class Meta:
        model = IvrDashboardUserSettings
        fields = [
            'id', 'user', 'user_details', 'theme', 'default_layout',
            'email_notifications', 'auto_refresh', 'refresh_interval',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def validate_refresh_interval(self, value):
        if value < 30:
            raise serializers.ValidationError("Refresh interval must be at least 30 seconds")
        if value > 3600:
            raise serializers.ValidationError("Refresh interval cannot exceed 1 hour")
        return value


class IvrDashboardSharedViewSerializer(serializers.ModelSerializer):
    """Serializer for IvrDashboardSharedView model"""
    created_by_details = UserBasicSerializer(source='created_by', read_only=True)
    shared_with_details = UserBasicSerializer(
        source='shared_with',
        many=True,
        read_only=True
    )
    
    class Meta:
        model = IvrDashboardSharedView
        fields = [
            'id', 'created_by', 'created_by_details', 'name', 'description',
            'is_public', 'view_data', 'shared_with', 'shared_with_details',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']
    
    def validate(self, data):
        # Ensure view name is unique for the creator
        if 'name' in data and IvrDashboardSharedView.objects.filter(
            created_by=self.context['request'].user,
            name=data['name']
        ).exists():
            if not self.instance or self.instance.name != data['name']:
                raise serializers.ValidationError({"name": "You already have a view with this name"})
        
        return data


class IvrDashboardDataRequestSerializer(serializers.Serializer):
    """Serializer for requesting dashboard data"""
    start_date = serializers.DateTimeField(required=False)
    end_date = serializers.DateTimeField(required=False)
    filters = serializers.DictField(
        child=serializers.CharField(),
        required=False,
        default=dict
    )
    
    def validate(self, data):
        # Ensure end date is after start date if both are provided
        if data.get('start_date') and data.get('end_date') and data['start_date'] >= data['end_date']:
            raise serializers.ValidationError({
                "end_date": "End date must be after start date"
            })
        
        # Limit date range to 1 year
        if data.get('start_date') and data.get('end_date'):
            if (data['end_date'] - data['start_date']).days > 365:
                raise serializers.ValidationError({
                    "date_range": "Date range cannot exceed 1 year"
                })
        
        return data


class IvrDashboardExportSerializer(serializers.Serializer):
    """Serializer for exporting dashboard configuration"""
    include_panels = serializers.BooleanField(default=True)
    include_filters = serializers.BooleanField(default=True)
    include_layouts = serializers.BooleanField(default=True)
    include_settings = serializers.BooleanField(default=True)
    format = serializers.ChoiceField(choices=['json', 'yaml'], default='json')


class IvrDashboardImportSerializer(serializers.Serializer):
    """Serializer for importing dashboard configuration"""
    file = serializers.FileField()
    conflict_resolution = serializers.ChoiceField(
        choices=['skip', 'overwrite', 'rename'],
        default='skip'
    )
    
    def validate_file(self, value):
        # Add file validation logic here
        return value
