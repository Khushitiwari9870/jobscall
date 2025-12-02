from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from .models import ResumeEnhancement, ResumeEnhancementFeedback


class ResumeEnhancementFeedbackSerializer(serializers.ModelSerializer):
    """Serializer for resume enhancement feedback"""
    
    class Meta:
        model = ResumeEnhancementFeedback
        fields = [
            'id', 'rating', 'comments', 'would_recommend',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_rating(self, value):
        """Validate that rating is between 1 and 5"""
        if value is not None and (value < 1 or value > 5):
            raise serializers.ValidationError(_("Rating must be between 1 and 5"))
        return value


class ResumeEnhancementSerializer(serializers.ModelSerializer):
    """Serializer for resume enhancements"""
    feedback = ResumeEnhancementFeedbackSerializer(
        read_only=True,
        source='feedback',
        required=False
    )
    
    class Meta:
        model = ResumeEnhancement
        fields = [
            'id', 'enhancement_type', 'status',
            'original_resume', 'enhanced_resume',
            'score_before', 'score_after', 'improvements',
            'job_title', 'job_description',
            'created_at', 'updated_at', 'completed_at',
            'feedback'
        ]
        read_only_fields = [
            'id', 'status', 'score_before', 'score_after',
            'improvements', 'created_at', 'updated_at',
            'completed_at', 'feedback'
        ]
    
    def create(self, validated_data):
        """Set the user from the request"""
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ResumeEnhancementCreateSerializer(serializers.Serializer):
    """Serializer for creating a new resume enhancement"""
    
    enhancement_type = serializers.ChoiceField(
        choices=ResumeEnhancement.EnhancementType.choices,
        required=True
    )
    
    job_title = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=255
    )
    
    job_description = serializers.CharField(
        required=False,
        allow_blank=True
    )
    
    def validate_enhancement_type(self, value):
        """Validate enhancement type"""
        valid_types = [choice[0] for choice in ResumeEnhancement.EnhancementType.choices]
        if value not in valid_types:
            raise serializers.ValidationError(_("Invalid enhancement type"))
        return value


class ResumeUploadSerializer(serializers.Serializer):
    """Serializer for resume file upload"""
    
    resume = serializers.FileField(
        required=True,
        help_text=_("Resume file to be enhanced")
    )
    
    job_title = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=255,
        help_text=_("Target job title (optional)")
    )
    
    job_description = serializers.CharField(
        required=False,
        allow_blank=True,
        help_text=_("Job description (optional)")
    )
    
    def validate_resume(self, value):
        """Validate the uploaded file"""
        valid_extensions = ['.pdf', '.doc', '.docx', '.txt']
        if not any(value.name.lower().endswith(ext) for ext in valid_extensions):
            raise serializers.ValidationError(
                _("Unsupported file format. Please upload a PDF, DOC, DOCX, or TXT file.")
            )
        
        # Limit file size to 10MB
        max_size = 10 * 1024 * 1024  # 10MB
        if value.size > max_size:
            raise serializers.ValidationError(
                _("File size too large. Maximum size is 10MB.")
            )
        
        return value
