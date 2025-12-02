from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from .models import ResumeHighlight, ResumeAnalysis


class ResumeHighlightSerializer(serializers.ModelSerializer):
    """Serializer for resume highlights"""
    
    class Meta:
        model = ResumeHighlight
        fields = [
            'id', 'text', 'highlight_type', 'comment', 'suggested_improvement',
            'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']
    
    def validate_highlight_type(self, value):
        """Validate the highlight type"""
        valid_types = [choice[0] for choice in ResumeHighlight.HighlightType.choices]
        if value not in valid_types:
            raise serializers.ValidationError(_("Invalid highlight type"))
        return value


class ResumeAnalysisSerializer(serializers.ModelSerializer):
    """Serializer for resume analysis"""
    highlights = ResumeHighlightSerializer(many=True, read_only=True)
    
    class Meta:
        model = ResumeAnalysis
        fields = [
            'id', 'overall_score', 'strengths_summary', 'weaknesses_summary',
            'is_auto_generated', 'analyzed_by', 'created_at', 'updated_at',
            'highlights'
        ]
        read_only_fields = ['analyzed_by', 'created_at', 'updated_at', 'highlights']
    
    def validate_overall_score(self, value):
        """Ensure score is between 0 and 100"""
        if not 0 <= value <= 100:
            raise serializers.ValidationError(_("Score must be between 0 and 100"))
        return value


class ResumeAnalysisCreateSerializer(serializers.Serializer):
    """Serializer for creating a new resume analysis"""
    application_id = serializers.IntegerField(required=True)
    analyze_again = serializers.BooleanField(default=False)
    
    def validate_application_id(self, value):
        """Validate that the application exists"""
        from applications.models import Application
        try:
            return Application.objects.get(id=value)
        except Application.DoesNotExist:
            raise serializers.ValidationError(_("Application not found"))


class ResumeHighlightUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating resume highlights"""
    
    class Meta:
        model = ResumeHighlight
        fields = ['highlight_type', 'comment', 'suggested_improvement']
    
    def update(self, instance, validated_data):
        """Update the highlight instance"""
        user = self.context['request'].user
        instance.highlight_type = validated_data.get('highlight_type', instance.highlight_type)
        instance.comment = validated_data.get('comment', instance.comment)
        instance.suggested_improvement = validated_data.get(
            'suggested_improvement', instance.suggested_improvement
        )
        if not instance.created_by_id:  # If auto-generated, assign to current user on first edit
            instance.created_by = user
        instance.save()
        return instance
