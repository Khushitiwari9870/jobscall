from django.test import TestCase, RequestFactory
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.utils import timezone

from .models import RecentSearch

User = get_user_model()


class RecentSearchModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
    
    def test_create_recent_search(self):
        ""Test creating a recent search"""
        search = RecentSearch.objects.create(
            user=self.user,
            search_type='job',
            query='Python Developer',
            filters={"location": "New York"}
        )
        
        self.assertEqual(search.user, self.user)
        self.assertEqual(search.search_type, 'job')
        self.assertEqual(search.query, 'Python Developer')
        self.assertEqual(search.filters, {"location": "New York"})
        self.assertIsNotNone(search.created_at)
    
    def test_str_representation(self):
        ""Test the string representation of a recent search"""
        search = RecentSearch.objects.create(
            user=self.user,
            search_type='candidate',
            query='Python Developer'
        )
        self.assertEqual(str(search), "Candidate Search - Python Developer")


class RecentSearchViewSetTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        
        # Create some test data
        self.search1 = RecentSearch.objects.create(
            user=self.user,
            search_type='job',
            query='Python Developer',
            filters={"location": "New York"}
        )
        
        self.search2 = RecentSearch.objects.create(
            user=self.user,
            search_type='candidate',
            query='Python Developer',
            filters={"experience": "3+ years"}
        )
    
    def test_list_recent_searches(self):
        ""Test listing recent searches"""
        url = reverse('recent-search-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
    
    def test_create_recent_search(self):
        ""Test creating a new recent search"""
        url = reverse('recent-search-list')
        data = {
            'search_type': 'job',
            'query': 'Django Developer',
            'filters': {"location": "Remote"}
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(RecentSearch.objects.count(), 3)
        self.assertEqual(RecentSearch.objects.latest('created_at').query, 'Django Developer')
    
    def test_filter_by_search_type(self):
        ""Test filtering recent searches by type"""
        url = f"{reverse('recent-search-by-type')}?search_type=job"
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['search_type'], 'job')
    
    def test_clear_all_searches(self):
        ""Test clearing all recent searches"""
        url = reverse('recent-search-clear-all')
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(RecentSearch.objects.filter(user=self.user).count(), 0)


class RecentSearchAdminViewSetTests(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_superuser(
            email='admin@example.com',
            password='adminpass123',
            first_name='Admin',
            last_name='User'
        )
        
        self.regular_user = User.objects.create_user(
            email='user@example.com',
            password='testpass123',
            first_name='Regular',
            last_name='User'
        )
        
        self.client = APIClient()
        self.client.force_authenticate(user=self.admin_user)
        
        # Create test data
        self.search1 = RecentSearch.objects.create(
            user=self.regular_user,
            search_type='job',
            query='Python Developer'
        )
        
        self.search2 = RecentSearch.objects.create(
            user=self.admin_user,
            search_type='candidate',
            query='Python Developer'
        )
    
    def test_admin_list_all_searches(self):
        ""Test that admin can list all searches"""
        url = reverse('admin-recent-search-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
    
    def test_regular_user_cannot_access_admin_endpoint(self):
        ""Test that regular users cannot access admin endpoints"""
        self.client.force_authenticate(user=self.regular_user)
        url = reverse('admin-recent-search-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
