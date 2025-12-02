from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from .models import (
    ProfileBooster, 
    BoosterRecommendation,
    BoosterProgress
)


class BoosterRecommendationSerializer(serializers.ModelSerializer):
    """Serializer for booster recommendations"""
    
    class Meta:
        model = BoosterRecommendation
        fields = [
            'id', 'category', 'priority', 'title', 'description',
            'action_text', 'action_url', 'is_completed',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProfileBoosterSerializer(serializers.ModelSerializer):
    """Serializer for profile boosters"""
    recommendations = BoosterRecommendationSerializer(
        many=True,
        read_only=True,
        source='booster_recommendations'
    )
    
    class Meta:
        model = ProfileBooster
        fields = [
            'id', 'booster_type', 'status',
            'score_before', 'score_after', 'improvement_percentage',
            'recommendations', 'applied_changes',
            'created_at', 'updated_at', 'completed_at'
        ]
        read_only_fields = [
            'id', 'status', 'score_before', 'score_after',
            'improvement_percentage', 'recommendations', 'applied_changes',
            'created_at', 'updated_at', 'completed_at'
        ]


class BoosterProgressSerializer(serializers.ModelSerializer):
    """Serializer for booster progress"""
    
    class Meta:
        model = BoosterProgress
        fields = [
            'overall_score', 'completion_percentage',
            'personal_info_score', 'experience_score',
            'education_score', 'skills_score', 'certifications_score',
            'last_boosted_at', 'boost_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'overall_score', 'completion_percentage',
            'personal_info_score', 'experience_score',
            'education_score', 'skills_score', 'certifications_score',
            'last_boosted_at', 'boost_count',
            'created_at', 'updated_at'
        ]


class StartBoosterSerializer(serializers.Serializer):
    """Serializer for starting a profile booster"""
    
    booster_type = serializers.ChoiceField(
        choices=ProfileBooster.BoosterType.choices,
        required=True
    )
    
    def validate_booster_type(self, value):
        """Validate booster type"""
        valid_types = [choice[0] for choice in ProfileBooster.BoosterType.choices]
        if value not in valid_types:
            raise serializers.ValidationError(_("Invalid booster type"))
        return value


class CompleteRecommendationSerializer(serializers.Serializer):
    """Serializer for completing a recommendation"""
    
    recommendation_id = serializers.IntegerField(required=True)
    is_completed = serializers.BooleanField(default=True)
    
    def validate_recommendation_id(self, value):
        """Validate that the recommendation exists and belongs to the user"""
        from .models import BoosterRecommendation
        
        try:
            recommendation = BoosterRecommendation.objects.get(id=value)
            if recommendation.booster.user != self.context['request'].user:
                raise serializers.ValidationError(
                    _("You don't have permission to modify this recommendation.")
                )
            return recommendation
        except BoosterRecommendation.DoesNotExist:
            raise serializers.ValidationError(_("Recommendation not found."))


class BoosterStatsSerializer(serializers.Serializer):
    """Serializer for booster statistics"""
    
    total_boosts = serializers.IntegerField(
        read_only=True,
        help_text=_("Total number of boosts performed by the user")
    )
    
    average_improvement = serializers.FloatField(
        read_only=True,
        help_text=_("Average improvement percentage across all boosts")
    )
    
    last_boost_date = serializers.DateTimeField(
        read_only=True,
        help_text=_("Date of the last boost")
    )
    
    completion_rate = serializers.FloatField(
        read_only=True,
        help_text=_("Percentage of completed recommendations")
    )
    
    category_scores = serializers.DictField(
        child=serializers.IntegerField(),
        read_only=True,
        help_text=_("Scores for each category (skills, experience, etc.)")
    )
    
    def to_representation(self, instance):
        """Custom representation for the stats"""
        return {
            'total_boosts': instance.boost_count,
            'average_improvement': self._calculate_average_improvement(instance.user),
            'last_boost_date': instance.last_boosted_at,
            'completion_rate': self._calculate_completion_rate(instance.user),
            'category_scores': {
                'personal_info': instance.personal_info_score,
                'experience': instance.experience_score,
                'education': instance.education_score,
                'skills': instance.skills_score,
                'certifications': instance.certifications_score
            }
        }
    
    def _calculate_average_improvement(self, user):
        """Calculate average improvement across all boosts"""
        from .models import ProfileBooster
        
        completed_boosters = ProfileBooster.objects.filter(
            user=user,
            status=ProfileBooster.Status.COMPLETED,
            improvement_percentage__isnull=False
        )
        
        if not completed_boosters.exists():
            return 0
            
        total_improvement = sum(
            b.improvement_percentage for b in completed_boosters
        )
        return round(total_improvement / completed_boosters.count(), 1)
    
    def _calculate_completion_rate(self, user):
        """Calculate completion rate of recommendations"""
        from .models import BoosterRecommendation
        
        total_recommendations = BoosterRecommendation.objects.filter(
            booster__user=user
        ).count()
        
        if total_recommendations == 0:
            return 0
            
        completed_recommendations = BoosterRecommendation.objects.filter(
            booster__user=user,
            is_completed=True
        ).count()
        
        return round((completed_recommendations / total_recommendations) * 100, 1)
