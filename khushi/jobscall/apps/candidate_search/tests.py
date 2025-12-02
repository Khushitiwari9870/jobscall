from django.test import TestCase, RequestFactory
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse

from .models import SearchFilterOption, CandidateSearchQuery, SavedSearch
from users.models import UserProfile, Skill, City, Country

User = get_user_model()


class SearchFilterOptionModelTest(TestCase):
    def setUp(self):
        self.option = SearchFilterOption.objects.create(
            filter_type='skills',
            name='Python',
            value='python',
            display_order=1
        )
    
    def test_filter_option_creation(self):
        self.assertEqual(str(self.option), 'Skills: Python')
        self.assertTrue(self.option.is_active)


class CandidateSearchQueryModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.search_query = CandidateSearchQuery.objects.create(
            recruiter=self.user,
            query={'keyword': 'python developer'},
            results_count=5
        )
    
    def test_search_query_creation(self):
        self.assertEqual(self.search_query.recruiter, self.user)
        self.assertEqual(self.search_query.results_count, 5)
        self.assertFalse(self.search_query.is_saved)


class SavedSearchModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.saved_search = SavedSearch.objects.create(
            recruiter=self.user,
            name='Python Developers',
            search_parameters={'skills': ['python', 'django']}
        )
    
    def test_saved_search_creation(self):
        self.assertEqual(self.saved_search.recruiter, self.user)
        self.assertEqual(self.saved_search.name, 'Python Developers')
        self.assertTrue(self.saved_search.is_active)


class CandidateSearchAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='recruiter@example.com',
            password='testpass123',
            first_name='Recruiter',
            last_name='User',
            user_type='recruiter'
        )
        
        # Create test data
        self.skill_python = Skill.objects.create(name='Python')
        self.skill_django = Skill.objects.create(name='Django')
        self.city = City.objects.create(name='Bangalore')
        self.country = Country.objects.create(name='India')
        
        # Create candidate profiles
        self.candidate1 = User.objects.create_user(
            email='candidate1@example.com',
            password='testpass123',
            first_name='John',
            last_name='Doe',
            user_type='candidate'
        )
        self.profile1 = UserProfile.objects.create(
            user=self.candidate1,
            headline='Python Developer',
            current_city=self.city,
            current_country=self.country,
            total_experience_years=3
        )
        self.profile1.skills.add(self.skill_python, self.skill_django)
        
        self.client.force_authenticate(user=self.user)
    
    def test_search_by_skill(self):
        url = reverse('candidate_search:candidate-search')
        data = {
            'skills': ['Python']
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['name'], 'John Doe')
    
    def test_search_by_location(self):
        url = reverse('candidate_search:candidate-search')
        data = {
            'location': ['Bangalore']
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_save_search(self):
        url = reverse('candidate_search:saved-search-list')
        data = {
            'name': 'Python Devs in Bangalore',
            'search_parameters': {
                'skills': ['Python'],
                'location': ['Bangalore']
            }
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SavedSearch.objects.count(), 1)
        self.assertEqual(SavedSearch.objects.first().name, 'Python Devs in Bangalore')
