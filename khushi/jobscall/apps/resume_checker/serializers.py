from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from .models import ResumeCheck, ResumeIssue, ResumeCheckSettings

class ResumeIssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeIssue
        fields = [
            'id', 'issue_type', 'priority', 'title', 'description',
            'location', 'suggestion', 'is_resolved', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

class ResumeCheckSerializer(serializers.ModelSerializer):
    issues = ResumeIssueSerializer(many=True, read_only=True)
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )
    
    class Meta:
        model = ResumeCheck
        fields = [
            'id', 'resume_file', 'original_filename', 'file_size',
            'overall_score', 'status', 'status_display', 'analysis',
            'issues', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'file_size', 'overall_score', 'status',
            'analysis', 'issues', 'created_at', 'updated_at'
        ]
    
    def validate_resume_file(self, value):
        # Validate file type
        valid_extensions = ['.pdf', '.doc', '.docx']
        if not any(value.name.lower().endswith(ext) for ext in valid_extensions):
            raise serializers.ValidationError(
                _('Unsupported file format. Please upload a PDF or Word document.')
            )
        
        # Validate file size (10MB limit)
        max_size = 10 * 1024 * 1024  # 10MB
        if value.size > max_size:
            raise serializers.ValidationError(
                _('File size exceeds the 10MB limit.')
            )
        
        return value

class ResumeCheckCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeCheck
        fields = ['resume_file', 'job_description']

class ResumeCheckSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeCheckSettings
        fields = ['id', 'name', 'value', 'description', 'is_active']
        read_only_fields = ['id']
