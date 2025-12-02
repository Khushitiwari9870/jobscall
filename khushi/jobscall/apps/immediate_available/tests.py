from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model

from .models import ImmediateAvailableProfile

User = get_user_model()


class ImmediateAvailableProfileTests(APITestCase):
    def setUp(self):
        # Create test users
        self.user1 = User.objects.create_user(
            email='candidate1@example.com',
            password='testpass123',
            first_name='John',
            last_name='Doe'
        )
        self.user2 = User.objects.create_user(
            email='candidate2@example.com',
            password='testpass123',
            first_name='Jane',
            last_name='Smith'
        )
        
        # Create test profiles
        self.profile1 = ImmediateAvailableProfile.objects.create(
            user=self.user1,
            is_immediately_available=True,
            current_company='Tech Corp',
            current_designation='Senior Developer',
            experience_years=5,
            skills=['Python', 'Django', 'React'],
            preferred_locations=['Bangalore', 'Remote']
        )
        
        self.profile2 = ImmediateAvailableProfile.objects.create(
            user=self.user2,
            is_immediately_available=True,
            current_company='Data Systems',
            current_designation='Data Scientist',
            experience_years=3,
            skills=['Python', 'Machine Learning', 'SQL'],
            preferred_locations=['Mumbai', 'Pune']
        )
        
        # Set up the API client
        self.client = APIClient()
        self.client.force_authenticate(user=self.user1)
    
    def test_create_profile(self):
        """Test creating a new immediate available profile"""
        url = reverse('immediate_available:profile-list')
        data = {
            'is_immediately_available': True,
            'current_company': 'New Company',
            'current_designation': 'Developer',
            'experience_years': 2,
            'skills': ['JavaScript', 'React'],
            'preferred_locations': ['Remote']
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def test_get_my_profile(self):
        """Test retrieving the current user's profile"""
        url = reverse('immediate_available:my-profile')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user']['email'], 'candidate1@example.com')
    
    def test_update_profile(self):
        """Test updating the current user's profile"""
        url = reverse('immediate_available:profile-detail', args=[self.profile1.id])
        data = {
            'is_immediately_available': True,
            'current_company': 'Updated Company',
            'current_designation': 'Senior Developer',
            'experience_years': 6,
            'skills': ['Python', 'Django', 'React', 'AWS'],
            'preferred_locations': ['Bangalore', 'Remote', 'Hyderabad']
        }
        
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['current_company'], 'Updated Company')
        self.assertIn('AWS', response.data['skills'])
    
    def test_search_profiles(self):
        """Test searching for immediate available profiles"""
        url = reverse('immediate_available:profile-search')
        data = {
            'skills': ['Python'],
            'experience_min': 3,
            'location': 'Bangalore'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['user']['first_name'], 'John')
    
    def test_unauthorized_access(self):
        """Test that unauthenticated users cannot access protected endpoints"""
        self.client.logout()
        
        # Test list endpoint
        url = reverse('immediate_available:profile-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Test my profile endpoint
        url = reverse('immediate_available:my-profile')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
