from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

from .models import SavedSearch

User = get_user_model()


class SavedSearchModelTest(TestCase):
    """Test the SavedSearch model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        
    def test_create_saved_search(self):
        ""Test creating a new saved search""
        search = SavedSearch.objects.create(
            user=self.user,
            name='Python Developer Jobs',
            search_type='job',
            query='Python Developer',
            location='New York'
        )
        
        self.assertEqual(str(search), "test@example.com's Python Developer Jobs (Job Search)")
        self.assertEqual(search.get_search_parameters(), {
            'query': 'Python Developer',
            'location': 'New York'
        })


class SavedSearchAPITest(APITestCase):
    """Test the SavedSearch API"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        
        self.search_data = {
            'name': 'Python Jobs',
            'search_type': 'job',
            'query': 'Python',
            'location': 'Remote',
            'is_active': True,
            'email_alerts': False
        }
    
    def test_create_saved_search(self):
        ""Test creating a saved search via API"""
        url = reverse('saved_searches:my-searches-list')
        response = self.client.post(url, self.search_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SavedSearch.objects.count(), 1)
        self.assertEqual(SavedSearch.objects.get().name, 'Python Jobs')
    
    def test_list_saved_searches(self):
        ""Test listing saved searches"""
        # Create a test search
        SavedSearch.objects.create(
            user=self.user,
            name='Python Jobs',
            search_type='job',
            query='Python'
        )
        
        url = reverse('saved_searches:my-searches-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Python Jobs')
    
    def test_toggle_active(self):
        ""Test toggling the active status of a saved search"""
        search = SavedSearch.objects.create(
            user=self.user,
            name='Python Jobs',
            search_type='job',
            query='Python',
            is_active=True
        )
        
        url = reverse('saved_searches:my-searches-toggle-active', args=[search.id])
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(SavedSearch.objects.get(id=search.id).is_active)
    
    def test_toggle_alerts(self):
        ""Test toggling email alerts for a saved search"""
        search = SavedSearch.objects.create(
            user=self.user,
            name='Python Jobs',
            search_type='job',
            query='Python',
            is_active=True,
            email_alerts=False
        )
        
        url = reverse('saved_searches:my-searches-toggle-alerts', args=[search.id])
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(SavedSearch.objects.get(id=search.id).email_alerts)


class AdminSavedSearchAPITest(APITestCase):
    ""Test the admin SavedSearch API"""
    
    def setUp(self):
        self.admin_user = User.objects.create_superuser(
            email='admin@example.com',
            password='adminpass123',
            first_name='Admin',
            last_name='User'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.admin_user)
        
        # Create a regular user and a search
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.search = SavedSearch.objects.create(
            user=self.user,
            name='Python Jobs',
            search_type='job',
            query='Python'
        )
    
    def test_admin_list_searches(self):
        ""Test admin can list all saved searches"""
        url = reverse('saved_searches:admin-searches-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Python Jobs')
    
    def test_admin_update_search(self):
        ""Test admin can update any saved search"""
        url = reverse('saved_searches:admin-searches-detail', args=[self.search.id])
        data = {'name': 'Updated Search Name'}
        response = self.client.patch(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(SavedSearch.objects.get(id=self.search.id).name, 'Updated Search Name')
