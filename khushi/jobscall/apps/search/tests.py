import json
from datetime import timedelta
from django.test import TestCase, RequestFactory
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase, APIClient, APIRequestFactory
from rest_framework.authtoken.models import Token

from apps.users.models import User
from apps.companies.models import Company
from apps.jobs.models import Job
from apps.search.models import SearchLog, SavedSearch
from apps.search.serializers import JobSearchSerializer


class SearchPingTest(TestCase):
    def test_ping(self):
        resp = self.client.get('/api/v1/search/ping/')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json().get('app'), 'search')


class JobSearchAPITest(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.client = APIClient()
        
        # Create test user
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        
        # Create test company
        self.company = Company.objects.create(
            name='Test Company',
            description='A test company',
            website='https://example.com',
            is_active=True
        )
        
        # Create test jobs
        self.job1 = Job.objects.create(
            title='Senior Python Developer',
            company=self.company,
            description='Senior Python developer with Django experience',
            location='Remote',
            min_salary=100000,
            max_salary=150000,
            employment_type='full_time',
            experience='3-5',
            is_active=True,
            posted_by=self.user
        )
        
        self.job2 = Job.objects.create(
            title='Frontend Developer',
            company=self.company,
            description='Frontend developer with React experience',
            location='New York, NY',
            min_salary=90000,
            max_salary=130000,
            employment_type='full_time',
            experience='1-3',
            is_active=True,
            posted_by=self.user
        )
        
        self.job3 = Job.objects.create(
            title='DevOps Engineer',
            company=self.company,
            description='DevOps with AWS and Docker experience',
            location='Remote',
            min_salary=110000,
            max_salary=160000,
            employment_type='contract',
            experience='5-10',
            is_active=True,
            posted_by=self.user,
            created_at=timezone.now() - timedelta(days=10)
        )
    
    def test_search_by_keyword(self):
        """Test searching jobs by keyword"""
        url = reverse('job-search')
        response = self.client.get(f"{url}?query=python")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], 'Senior Python Developer')
    
    def test_search_by_location(self):
        """Test filtering jobs by location"""
        url = reverse('job-search')
        response = self.client.get(f"{url}?location=Remote")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
        self.assertEqual({job['title'] for job in response.data['results']}, 
                        {'Senior Python Developer', 'DevOps Engineer'})
    
    def test_search_by_experience(self):
        """Test filtering jobs by experience level"""
        url = reverse('job-search')
        response = self.client.get(f"{url}?experience=3-5")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], 'Senior Python Developer')
    
    def test_search_by_salary_range(self):
        """Test filtering jobs by salary range"""
        url = reverse('job-search')
        response = self.client.get(f"{url}?salary=100000")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)  # Should match jobs with max_salary >= 100000
    
    def test_search_log_created(self):
        """Test that searches are logged for authenticated users"""
        initial_count = SearchLog.objects.count()
        url = reverse('job-search')
        response = self.client.get(f"{url}?query=python")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(SearchLog.objects.count(), initial_count + 1)
        
        log_entry = SearchLog.objects.latest('created_at')
        self.assertEqual(log_entry.query, 'python')
        self.assertEqual(log_entry.user, self.user)
        self.assertEqual(log_entry.results_count, 1)


class SavedSearchAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        
        # Create a saved search
        self.saved_search = SavedSearch.objects.create(
            user=self.user,
            name='Python Jobs',
            search_params={
                'query': 'python',
                'location': 'Remote',
                'experience': '3-5'
            }
        )
    
    def test_create_saved_search(self):
        """Test creating a new saved search"""
        url = reverse('saved-search-list')
        data = {
            'name': 'Remote Python Jobs',
            'search_params': {
                'query': 'python',
                'location': 'Remote',
                'experience': '3-5'
            }
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SavedSearch.objects.count(), 2)
        self.assertEqual(SavedSearch.objects.latest('created_at').name, 'Remote Python Jobs')
    
    def test_execute_saved_search(self):
        """Test executing a saved search"""
        url = reverse('saved-search-execute', kwargs={'savedsearch_pk': self.saved_search.pk})
        response = self.client.post(f"{url}")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Add more assertions based on expected search results
    
    def test_list_saved_searches(self):
        """Test listing saved searches for the current user"""
        url = reverse('saved-search-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Python Jobs')


class SearchLogAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        
        # Create some search logs
        SearchLog.objects.create(
            user=self.user,
            search_type='job',
            query='python',
            results_count=5
        )
        SearchLog.objects.create(
            user=self.user,
            search_type='job',
            query='django',
            results_count=3
        )
    
    def test_list_search_logs(self):
        """Test listing search history for the current user"""
        url = reverse('search-log-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual({log['query'] for log in response.data}, {'python', 'django'})
    
    def test_filter_search_logs_by_type(self):
        """Test filtering search logs by search type"""
        url = f"{reverse('search-log-list')}?search_type=job"
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
    
    def test_anonymous_user_access(self):
        """Test that anonymous users can't access search logs"""
        self.client.credentials()  # Clear authentication
        url = reverse('search-log-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
