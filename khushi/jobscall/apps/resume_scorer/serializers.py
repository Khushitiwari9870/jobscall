from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from .models import ResumeScore, ScoreImprovement, ResumeScoreSettings

class ScoreImprovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScoreImprovement
        fields = [
            'id', 'category', 'priority', 'title', 'description',
            'example_before', 'example_after', 'is_applied', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

class ResumeScoreSerializer(serializers.ModelSerializer):
    improvements = ScoreImprovementSerializer(many=True, read_only=True)
    
    class Meta:
        model = ResumeScore
        fields = [
            'id', 'resume_file', 'original_filename', 'file_size',
            'overall_score', 'status', 'analysis', 'improvements',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'file_size', 'overall_score', 'status',
            'analysis', 'improvements', 'created_at', 'updated_at'
        ]
    
    def validate_resume_file(self, value):
        # Validate file type
        valid_extensions = ['.pdf', '.doc', '.docx']
        if not any(value.name.lower().endswith(ext) for ext in valid_extensions):
            raise serializers.ValidationError(_('Unsupported file format. Please upload a PDF or Word document.'))
        
        # Validate file size (10MB limit)
        max_size = 10 * 1024 * 1024  # 10MB
        if value.size > max_size:
            raise serializers.ValidationError(_('File size exceeds the 10MB limit.'))
        
        return value

class ResumeScoreCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeScore
        fields = ['resume_file', 'job_description']

class ResumeScoreSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeScoreSettings
        fields = ['id', 'name', 'value', 'description', 'is_active']
        read_only_fields = ['id']
