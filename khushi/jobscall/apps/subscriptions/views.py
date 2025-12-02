from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Sum, Q
from rest_framework import viewsets, status, permissions, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.utils.translation import gettext_lazy as _

from .models import (
    SubscriptionPlan, UserSubscription, UsageRecord,
    BillingHistory, CreditPackage, UserCredits, CreditTransaction
)
from .serializers import (
    SubscriptionPlanSerializer, UserSubscriptionSerializer,
    UsageRecordSerializer, BillingHistorySerializer,
    CreditPackageSerializer, UserCreditsSerializer,
    CreditTransactionSerializer, CreditPurchaseSerializer,
    UsageStatsSerializer
)
from apps.users.permissions import IsAdminOrReadOnly, IsOwnerOrAdmin


class SubscriptionPlanViewSet(viewsets.ModelViewSet):
    """ViewSet for managing subscription plans (admin only)"""
    queryset = SubscriptionPlan.objects.all()
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'
    
    def get_queryset(self):
        queryset = super().get_queryset()
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_active=True)
        return queryset


class UserSubscriptionViewSet(viewsets.ModelViewSet):
    """ViewSet for managing user subscriptions"""
    serializer_class = UserSubscriptionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return UserSubscription.objects.all()
        return UserSubscription.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # Only one active subscription per user
        UserSubscription.objects.filter(
            user=self.request.user,
            status__in=['active', 'trialing']
        ).update(status='canceled')
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        subscription = self.get_object()
        if subscription.user != request.user and not request.user.is_staff:
            return Response(
                {"detail": _("You don't have permission to cancel this subscription.")},
                status=status.HTTP_403_FORBIDDEN
            )
        
        subscription.cancel()
        return Response({"status": _("Subscription cancelled successfully.")})
    
    @action(detail=True, methods=['post'])
    def reactivate(self, request, pk=None):
        subscription = self.get_object()
        if subscription.user != request.user and not request.user.is_staff:
            return Response(
                {"detail": _("You don't have permission to reactivate this subscription.")},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if subscription.reactivate():
            return Response({"status": _("Subscription reactivated successfully.")})
        return Response(
            {"error": _("Could not reactivate the subscription.")},
            status=status.HTTP_400_BAD_REQUEST
        )


class UsageRecordViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing usage records"""
    serializer_class = UsageRecordSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return UsageRecord.objects.all()
        return UsageRecord.objects.filter(user=self.request.user)


class BillingHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing billing history"""
    serializer_class = BillingHistorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return BillingHistory.objects.all()
        return BillingHistory.objects.filter(user=self.request.user)


class CreditPackageViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing and purchasing credit packages"""
    queryset = CreditPackage.objects.filter(is_active=True)
    serializer_class = CreditPackageSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=True, methods=['post'])
    def purchase(self, request, pk=None):
        ""
        Purchase credits using the selected package
        This is a simplified version. In a real app, you'd integrate with a payment processor here.
        """
        package = self.get_object()
        serializer = CreditPurchaseSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            # In a real app, process payment here using the payment_method_id
            # For now, we'll just create the credit transaction
            
            # Get or create user credits
            user_credits, created = UserCredits.objects.get_or_create(user=request.user)
            
            # Update credit balance
            user_credits.balance += package.credits
            user_credits.save()
            
            # Create transaction record
            transaction = CreditTransaction.objects.create(
                user=request.user,
                amount=package.credits,
                transaction_type='purchase',
                source='credit_package',
                reference_id=f"PKG-{package.id}",
                balance_after=user_credits.balance,
                notes=f"Purchased {package.credits} credits"
            )
            
            # Create billing history record
            BillingHistory.objects.create(
                user=request.user,
                amount=package.price,
                currency='USD',  # In a real app, get this from the payment method
                payment_status='succeeded',
                payment_date=timezone.now(),
                description=f"Purchase of {package.credits} credits"
            )
            
            return Response({
                "status": _("Credits purchased successfully"),
                "new_balance": user_credits.balance,
                "transaction_id": transaction.id
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserCreditsViewSet(viewsets.GenericViewSet, mixins.RetrieveModelMixin):
    """ViewSet for managing user credits"""
    serializer_class = UserCreditsSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        if self.request.user.is_staff and 'user_id' in self.request.query_params:
            user_id = self.request.query_params['user_id']
            return get_object_or_404(UserCredits, user_id=user_id)
        return get_object_or_404(UserCredits, user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def transactions(self, request):
        """Get credit transactions for the current user"""
        transactions = CreditTransaction.objects.filter(user=request.user)
        page = self.paginate_queryset(transactions)
        if page is not None:
            serializer = CreditTransactionSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = CreditTransactionSerializer(transactions, many=True)
        return Response(serializer.data)


class UsageStatsView(APIView):
    """API endpoint for getting usage statistics"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
        # Get user's active subscription or None
        subscription = UserSubscription.objects.filter(
            user=request.user,
            status__in=['active', 'trialing']
        ).first()
        
        if subscription:
            plan = subscription.plan
            limits = {
                'job_postings_limit': plan.max_job_postings,
                'candidate_views_limit': plan.max_candidate_views,
                'resume_downloads_limit': plan.max_resume_downloads,
                'team_members_limit': plan.max_team_members,
            }
        else:
            # Default to free plan limits if no active subscription
            limits = {
                'job_postings_limit': 1,  # Example free plan limits
                'candidate_views_limit': 50,
                'resume_downloads_limit': 10,
                'team_members_limit': 1,
            }
        
        # Get current usage (this is simplified - you'd query your actual usage)
        usage = {
            'job_postings_used': 0,  # Replace with actual queries
            'candidate_views_used': 0,
            'resume_downloads_used': 0,
            'team_members_used': 0,
        }
        
        # Update with actual usage data if available
        usage.update(limits)  # This is just a placeholder
        
        serializer = UsageStatsSerializer(usage)
        return Response(serializer.data)
