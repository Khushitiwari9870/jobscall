import json
from datetime import timedelta

from django.test import TestCase, RequestFactory
from django.urls import reverse
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

from .models import IvrVerification, IvrCallLog

User = get_user_model()


class IvrVerificationModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
    
    def test_create_verification(self):
        ""Test creating a verification record"""
        verification = IvrVerification.objects.create(
            user=self.user,
            phone_number='+1234567890',
            verification_code='1234',
            method=IvrVerification.METHOD_CALL,
            expires_at=timezone.now() + timedelta(minutes=10)
        )
        
        self.assertEqual(verification.user, self.user)
        self.assertEqual(verification.phone_number, '+1234567890')
        self.assertEqual(verification.verification_code, '1234')
        self.assertEqual(verification.method, IvrVerification.METHOD_CALL)
        self.assertEqual(verification.status, IvrVerification.STATUS_PENDING)
        self.assertFalse(verification.is_expired)
    
    def test_mark_as_verified(self):
        ""Test marking a verification as verified"""
        verification = IvrVerification.objects.create(
            user=self.user,
            phone_number='+1234567890',
            verification_code='1234',
            method=IvrVerification.METHOD_CALL,
            expires_at=timezone.now() + timedelta(minutes=10)
        )
        
        verification.mark_as_verified()
        
        self.assertEqual(verification.status, IvrVerification.STATUS_COMPLETED)
        self.assertTrue(verification.is_successful)
        self.assertIsNotNone(verification.verified_at)
    
    def test_increment_attempts(self):
        ""Test incrementing verification attempts"""
        verification = IvrVerification.objects.create(
            user=self.user,
            phone_number='+1234567890',
            verification_code='1234',
            method=IvrVerification.METHOD_CALL,
            expires_at=timezone.now() + timedelta(minutes=10)
        )
        
        for i in range(1, 6):
            verification.increment_attempts()
            self.assertEqual(verification.attempts, i)
            
            if i < 5:
                self.assertEqual(verification.status, IvrVerification.STATUS_PENDING)
            else:
                self.assertEqual(verification.status, IvrVerification.STATUS_FAILED)
                self.assertEqual(verification.failure_reason, 'Maximum number of attempts reached')


class IvrVerificationApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
    
    def test_request_verification(self):
        ""Test requesting a new verification"""
        url = reverse('verification-list')
        data = {
            'phone_number': '+1234567890',
            'method': 'call'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(IvrVerification.objects.count(), 1)
        
        verification = IvrVerification.objects.first()
        self.assertEqual(verification.user, self.user)
        self.assertEqual(verification.phone_number, '+1234567890')
        self.assertEqual(verification.method, 'call')
        self.assertEqual(verification.status, 'in_progress')
    
    def test_verify_code(self):
        ""Test verifying a code"""
        verification = IvrVerification.objects.create(
            user=self.user,
            phone_number='+1234567890',
            verification_code='1234',
            method=IvrVerification.METHOD_CALL,
            expires_at=timezone.now() + timedelta(minutes=10)
        )
        
        url = reverse('verification-verify')
        data = {
            'verification_id': str(verification.id),
            'verification_code': '1234'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        
        verification.refresh_from_db()
        self.assertEqual(verification.status, IvrVerification.STATUS_COMPLETED)
        self.assertTrue(verification.is_successful)
    
    def test_verify_invalid_code(self):
        ""Test verifying with an invalid code"""
        verification = IvrVerification.objects.create(
            user=self.user,
            phone_number='+1234567890',
            verification_code='1234',
            method=IvrVerification.METHOD_CALL,
            expires_at=timezone.now() + timedelta(minutes=10)
        )
        
        url = reverse('verification-verify')
        data = {
            'verification_id': str(verification.id),
            'verification_code': '9999'  # Wrong code
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('verification_code', response.data)
        
        verification.refresh_from_db()
        self.assertEqual(verification.attempts, 1)
    
    def test_resend_verification(self):
        ""Test resending a verification code"""
        verification = IvrVerification.objects.create(
            user=self.user,
            phone_number='+1234567890',
            verification_code='1234',
            method=IvrVerification.METHOD_CALL,
            expires_at=timezone.now() + timedelta(minutes=10)
        )
        
        url = reverse('verification-resend', kwargs={'pk': verification.id})
        response = self.client.post(url, {})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        
        verification.refresh_from_db()
        self.assertNotEqual(verification.verification_code, '1234')  # Code should change
        self.assertEqual(verification.attempts, 0)  # Attempts should reset


class IvrWebhookTests(APITestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.verification = IvrVerification.objects.create(
            user=self.user,
            phone_number='+1234567890',
            verification_code='1234',
            method=IvrVerification.METHOD_CALL,
            expires_at=timezone.now() + timedelta(minutes=10)
        )
        self.call_log = IvrCallLog.objects.create(
            call_sid='CA1234567890',
            from_number='+1987654321',
            to_number='+1234567890',
            status='in_progress',
            verification=self.verification
        )
    
    def test_webhook_status_update(self):
        ""Test updating call status via webhook"""
        url = reverse('ivr-webhook')
        data = {
            'CallSid': 'CA1234567890',
            'CallStatus': 'completed',
            'From': '+1987654321',
            'To': '+1234567890',
            'CallDuration': '45',
            'RecordingUrl': 'http://example.com/recording.mp3'
        }
        
        response = self.client.post(url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.call_log.refresh_from_db()
        self.assertEqual(self.call_log.status, 'completed')
        self.assertEqual(self.call_log.duration, 45)
        self.assertEqual(self.call_log.recording_url, 'http://example.com/recording.mp3')
    
    def test_webhook_digit_entry(self):
        ""Test handling digit entry during a call"""
        url = reverse('ivr-webhook-detail', kwargs={'call_sid': 'CA1234567890'})
        data = {
            'CallSid': 'CA1234567890',
            'Digits': '1234',  # Correct code
            'From': '+1987654321',
            'To': '+1234567890'
        }
        
        response = self.client.post(url, data)
        
        self.assertEqual(response.status_code, 200)  # Should return TwiML
        self.assertIn(b'Verification successful', response.content)
        
        self.verification.refresh_from_db()
        self.assertEqual(self.verification.status, 'completed')
        self.assertTrue(self.verification.is_successful)
    
    def test_webhook_invalid_digit_entry(self):
        ""Test handling invalid digit entry"""
        url = reverse('ivr-webhook-detail', kwargs={'call_sid': 'CA1234567890'})
        data = {
            'CallSid': 'CA1234567890',
            'Digits': '9999',  # Wrong code
            'From': '+1987654321',
            'To': '+1234567890'
        }
        
        response = self.client.post(url, data)
        
        self.assertEqual(response.status_code, 200)  # Should return TwiML
        self.assertIn(b'Invalid code', response.content)
        
        self.verification.refresh_from_db()
        self.assertEqual(self.verification.attempts, 1)
