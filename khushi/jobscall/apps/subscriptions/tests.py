from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.utils import timezone

from .models import (
    SubscriptionPlan, UserSubscription, UsageRecord,
    BillingHistory, CreditPackage, UserCredits, CreditTransaction
)

User = get_user_model()


class SubscriptionPlanTests(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_superuser(
            email='admin@example.com',
            password='testpass123',
            first_name='Admin',
            last_name='User'
        )
        self.regular_user = User.objects.create_user(
            email='user@example.com',
            password='testpass123',
            first_name='Regular',
            last_name='User'
        )
        
        # Create a test subscription plan
        self.plan = SubscriptionPlan.objects.create(
            name="Premium Plan",
            slug="premium-plan",
            description="Premium subscription plan",
            price=99.99,
            billing_cycle='monthly',
            is_active=True,
            max_job_postings=10,
            max_candidate_views=1000,
            max_resume_downloads=100,
            max_team_members=5
        )
        
        # Create a user subscription
        self.subscription = UserSubscription.objects.create(
            user=self.regular_user,
            plan=self.plan,
            status='active',
            start_date=timezone.now().date(),
            end_date=timezone.now().date() + timezone.timedelta(days=30),
            is_auto_renew=True
        )
        
        # Create a credit package
        self.credit_package = CreditPackage.objects.create(
            name="Starter Pack",
            description="100 credits",
            price=19.99,
            credits=100,
            is_active=True
        )
        
        # Create user credits
        self.user_credits = UserCredits.objects.create(
            user=self.regular_user,
            balance=50
        )
        
        # Set up API client
        self.client = APIClient()
    
    def test_list_subscription_plans_authenticated(self):
        ""Test that authenticated users can list subscription plans"""
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get(reverse('subscription-plan-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['name'], 'Premium Plan')
    
    def test_create_subscription_plan_admin_only(self):
        ""Test that only admin users can create subscription plans"""
        self.client.force_authenticate(user=self.regular_user)
        data = {
            'name': 'New Plan',
            'description': 'New subscription plan',
            'price': '49.99',
            'billing_cycle': 'monthly',
            'is_active': True
        }
        response = self.client.post(reverse('subscription-plan-list'), data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Now try as admin
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post(reverse('subscription-plan-list'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SubscriptionPlan.objects.count(), 2)
    
    def test_user_subscription_flow(self):
        ""Test the complete user subscription flow"""
        self.client.force_authenticate(user=self.regular_user)
        
        # Get current subscription
        response = self.client.get(reverse('subscription-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        
        # Try to cancel subscription
        subscription_id = response.data['results'][0]['id']
        response = self.client.post(
            reverse('subscription-cancel', args=[subscription_id])
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify subscription is canceled
        response = self.client.get(reverse('subscription-detail', args=[subscription_id]))
        self.assertEqual(response.data['status'], 'canceled')
    
    def test_credit_purchase(self):
        ""Test purchasing credits"""
        self.client.force_authenticate(user=self.regular_user)
        
        # Get current credits
        response = self.client.get(reverse('user-credits-detail', args=['me']))
        initial_balance = response.data['balance']
        
        # Purchase credits
        data = {
            'package_id': self.credit_package.id,
            'payment_method_id': 'pm_test_123',
            'save_payment_method': False
        }
        response = self.client.post(
            reverse('credit-package-purchase', args=[self.credit_package.id]),
            data
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify credits were added
        response = self.client.get(reverse('user-credits-detail', args=['me']))
        self.assertEqual(
            response.data['balance'],
            initial_balance + self.credit_package.credits
        )
    
    def test_usage_stats(self):
        ""Test retrieving usage statistics"""
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get(reverse('usage-stats'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('job_postings_used', response.data)
        self.assertIn('job_postings_limit', response.data)
        self.assertIn('candidate_views_used', response.data)
        self.assertIn('candidate_views_limit', response.data)
        self.assertIn('resume_downloads_used', response.data)
        self.assertIn('resume_downloads_limit', response.data)
        self.assertIn('team_members_used', response.data)
        self.assertIn('team_members_limit', response.data)
    
    def test_credit_transactions(self):
        ""Test retrieving credit transactions"""
        self.client.force_authenticate(user=self.regular_user)
        
        # Create some test transactions
        CreditTransaction.objects.create(
            user=self.regular_user,
            amount=50,
            transaction_type='purchase',
            source='credit_package',
            balance_after=100
        )
        
        response = self.client.get(reverse('user-credits-transactions'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['amount'], 50)


class ModelTests(TestCase):
    def test_subscription_plan_str(self):
        ""Test the string representation of SubscriptionPlan"""
        plan = SubscriptionPlan.objects.create(
            name="Test Plan",
            price=9.99,
            billing_cycle='monthly'
        )
        self.assertEqual(str(plan), "Test Plan")
    
    def test_user_subscription_str(self):
        ""Test the string representation of UserSubscription"""
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        plan = SubscriptionPlan.objects.create(
            name="Test Plan",
            price=9.99,
            billing_cycle='monthly'
        )
        subscription = UserSubscription.objects.create(
            user=user,
            plan=plan,
            status='active'
        )
        self.assertIn("test@example.com", str(subscription))
        self.assertIn("Test Plan", str(subscription))
