from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from .models import (
    SubscriptionPlan, UserSubscription, UsageRecord,
    BillingHistory, CreditPackage, UserCredits, CreditTransaction
)
from apps.users.serializers import UserSerializer


class SubscriptionPlanSerializer(serializers.ModelSerializer):
    """Serializer for SubscriptionPlan model"""
    price_per_credit = serializers.SerializerMethodField()
    
    class Meta:
        model = SubscriptionPlan
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'billing_cycle',
            'is_active', 'features', 'max_job_postings', 'max_candidate_views',
            'max_resume_downloads', 'max_team_members', 'price_per_credit',
            'created_at', 'updated_at'
        ]
        read_only_fields = ('id', 'slug', 'created_at', 'updated_at')
    
    def get_price_per_credit(self, obj):
        if obj.credits > 0:
            return round(float(obj.price) / obj.credits, 2)
        return 0


class UserSubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for UserSubscription model"""
    plan = SubscriptionPlanSerializer(read_only=True)
    plan_id = serializers.PrimaryKeyRelatedField(
        queryset=SubscriptionPlan.objects.filter(is_active=True),
        source='plan',
        write_only=True
    )
    user = UserSerializer(read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = UserSubscription
        fields = [
            'id', 'user', 'plan', 'plan_id', 'status', 'start_date', 'end_date',
            'is_auto_renew', 'is_active', 'stripe_subscription_id',
            'created_at', 'updated_at'
        ]
        read_only_fields = ('id', 'user', 'created_at', 'updated_at', 'is_active')


class UsageRecordSerializer(serializers.ModelSerializer):
    """Serializer for UsageRecord model"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UsageRecord
        fields = [
            'id', 'user', 'feature', 'usage_count', 'reset_date',
            'created_at', 'updated_at'
        ]
        read_only_fields = ('id', 'created_at', 'updated_at')


class BillingHistorySerializer(serializers.ModelSerializer):
    """Serializer for BillingHistory model"""
    user = UserSerializer(read_only=True)
    subscription = UserSubscriptionSerializer(read_only=True)
    
    class Meta:
        model = BillingHistory
        fields = [
            'id', 'user', 'subscription', 'amount', 'currency',
            'payment_status', 'payment_date', 'invoice_url',
            'stripe_payment_intent_id', 'created_at', 'updated_at'
        ]
        read_only_fields = ('id', 'created_at', 'updated_at')


class CreditPackageSerializer(serializers.ModelSerializer):
    """Serializer for CreditPackage model"""
    price_per_credit = serializers.SerializerMethodField()
    
    class Meta:
        model = CreditPackage
        fields = [
            'id', 'name', 'description', 'price', 'credits',
            'price_per_credit', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ('id', 'created_at', 'updated_at')
    
    def get_price_per_credit(self, obj):
        if obj.credits > 0:
            return round(float(obj.price) / obj.credits, 2)
        return 0


class UserCreditsSerializer(serializers.ModelSerializer):
    """Serializer for UserCredits model"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserCredits
        fields = ['id', 'user', 'balance', 'created_at', 'updated_at']
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')


class CreditTransactionSerializer(serializers.ModelSerializer):
    """Serializer for CreditTransaction model"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = CreditTransaction
        fields = [
            'id', 'user', 'amount', 'transaction_type', 'source',
            'reference_id', 'balance_after', 'notes', 'created_at'
        ]
        read_only_fields = ('id', 'created_at', 'balance_after')


class CreditPurchaseSerializer(serializers.Serializer):
    """Serializer for credit purchase requests"""
    package_id = serializers.PrimaryKeyRelatedField(
        queryset=CreditPackage.objects.filter(is_active=True)
    )
    payment_method_id = serializers.CharField(required=False)
    save_payment_method = serializers.BooleanField(default=False)
    
    def validate(self, attrs):
        package = attrs['package_id']
        if not package.is_active:
            raise serializers.ValidationError({
                'package_id': _('Selected credit package is not available.')
            })
        return attrs


class UsageStatsSerializer(serializers.Serializer):
    """Serializer for usage statistics"""
    job_postings_used = serializers.IntegerField()
    job_postings_limit = serializers.IntegerField()
    candidate_views_used = serializers.IntegerField()
    candidate_views_limit = serializers.IntegerField()
    resume_downloads_used = serializers.IntegerField()
    resume_downloads_limit = serializers.IntegerField()
    team_members_used = serializers.IntegerField()
    team_members_limit = serializers.IntegerField()
    
    class Meta:
        fields = [
            'job_postings_used', 'job_postings_limit',
            'candidate_views_used', 'candidate_views_limit',
            'resume_downloads_used', 'resume_downloads_limit',
            'team_members_used', 'team_members_limit'
        ]
