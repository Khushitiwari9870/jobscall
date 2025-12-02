from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model

from .models import UserProfile

User = get_user_model()

class UserProfileTests(APITestCase):
    def setUp(self):
        # Create test users
        self.user1 = User.objects.create_user(
            email='test1@example.com',
            password='testpass123',
            first_name='John',
            last_name='Doe'
        )
        self.user2 = User.objects.create_user(
            email='test2@example.com',
            password='testpass123',
            first_name='Jane',
            last_name='Smith'
        )
        
        # Create test profiles
        self.profile1 = UserProfile.objects.create(
            user=self.user1,
            phone_number='+1234567890',
            current_company='Tech Corp',
            designation='Senior Developer',
            experience_years=5,
            skills=['Python', 'Django', 'React'],
            preferred_locations=['Bangalore', 'Remote']
        )
        
        self.profile2 = UserProfile.objects.create(
            user=self.user2,
            phone_number='+1987654321',
            current_company='Data Systems',
            designation='Data Scientist',
            experience_years=3,
            skills=['Python', 'Machine Learning', 'SQL'],
            preferred_locations=['Mumbai', 'Pune']
        )
        
        # Set up the API client
        self.client = APIClient()
        self.client.force_authenticate(user=self.user1)
    
    def test_get_my_profile(self):
        """Test retrieving the authenticated user's profile"""
        url = reverse('profile:my-profile')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user']['email'], 'test1@example.com')
    
    def test_update_profile(self):
        """Test updating the authenticated user's profile"""
        url = reverse('profile:userprofile-detail', args=[self.profile1.id])
        data = {
            'phone_number': '+1234567899',
            'current_company': 'Updated Company',
            'designation': 'Lead Developer',
            'skills': ['Python', 'Django', 'React', 'AWS']
        }
        
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['current_company'], 'Updated Company')
        self.assertIn('AWS', response.data['skills'])
    
    def test_search_profiles_by_skill(self):
        """Test searching profiles by skill"""
        url = reverse('profile:profile-search')
        data = {
            'skills': ['Python', 'Django']
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)  # Both profiles have Python
    
    def test_search_profiles_by_location(self):
        """Test searching profiles by location"""
        url = reverse('profile:profile-search')
        data = {
            'location': 'Bangalore'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)  # Only profile1 has Bangalore
    
    def test_suggested_profiles(self):
        """Test getting suggested profiles"""
        url = reverse('profile:suggested-profiles')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should suggest profile2 since it has Python in common
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['user']['email'], 'test2@example.com')
    
    def test_unauthorized_access(self):
        """Test that unauthenticated users cannot access protected endpoints"""
        self.client.logout()
        
        # Test my profile endpoint
        url = reverse('profile:my-profile')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Test search endpoint
        url = reverse('profile:profile-search')
        response = self.client.post(url, {})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
