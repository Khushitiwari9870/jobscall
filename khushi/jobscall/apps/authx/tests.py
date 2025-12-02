import json
from datetime import timedelta
from django.urls import reverse
from django.test import TestCase
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from .models import User, UserProfile, PasswordResetToken


class AuthxPingTest(TestCase):
    def test_ping(self):
        """Test the ping endpoint."""
        resp = self.client.get('/api/v1/auth/ping/')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json().get('message'), 'pong')


class AuthenticationTests(APITestCase):
    def setUp(self):
        self.user_data = {
            'email': 'test@example.com',
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User',
            'user_type': 'candidate'
        }
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.user_profile = UserProfile.objects.create(
            user=self.user,
            user_type='candidate'
        )

    def test_register_user(self):
        """Test user registration."""
        url = reverse('register')
        data = {
            'email': 'newuser@example.com',
            'password': 'newpass123',
            'password2': 'newpass123',
            'first_name': 'New',
            'last_name': 'User',
            'user_type': 'employer'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2)
        self.assertEqual(UserProfile.objects.count(), 2)
        self.assertEqual(UserProfile.objects.get(user__email='newuser@example.com').user_type, 'employer')

    def test_login_user(self):
        """Test user login."""
        url = reverse('login')
        data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)

    def test_get_user_profile(self):
        """Test retrieving user profile."""
        self.client.force_authenticate(user=self.user)
        url = reverse('user-profile')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'test@example.com')

    def test_update_user_profile(self):
        """Test updating user profile."""
        self.client.force_authenticate(user=self.user)
        url = reverse('user-profile')
        data = {
            'first_name': 'Updated',
            'last_name': 'Name',
            'phone_number': '+1234567890',
            'city': 'Test City'
        }
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.user_profile.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Updated')
        self.assertEqual(self.user_profile.phone_number, '+1234567890')

    def test_password_reset_flow(self):
        """Test the password reset flow."""
        # Request password reset
        reset_url = reverse('password-reset-request')
        response = self.client.post(reset_url, {'email': 'test@example.com'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Get the reset token
        reset_token = PasswordResetToken.objects.get(user=self.user)
        
        # Reset password
        confirm_url = reverse('password-reset-confirm')
        data = {
            'token': reset_token.token,
            'password': 'newpassword123',
            'password2': 'newpassword123'
        }
        response = self.client.post(confirm_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify new password works
        login_url = reverse('login')
        login_data = {
            'email': 'test@example.com',
            'password': 'newpassword123'
        }
        response = self.client.post(login_url, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_password_reset_token(self):
        """Test password reset with invalid token."""
        confirm_url = reverse('password-reset-confirm')
        data = {
            'token': 'invalid-token',
            'password': 'newpassword123',
            'password2': 'newpassword123'
        }
        response = self.client.post(confirm_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('token', response.data)

    def test_expired_password_reset_token(self):
        """Test password reset with expired token."""
        # Create an expired token
        expired_token = PasswordResetToken.objects.create(
            user=self.user,
            token='expired-token',
            expires_at=timezone.now() - timedelta(hours=25)
        )
        
        confirm_url = reverse('password-reset-confirm')
        data = {
            'token': 'expired-token',
            'password': 'newpassword123',
            'password2': 'newpassword123'
        }
        response = self.client.post(confirm_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('token', response.data)
