from django.test import TestCase, RequestFactory
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient, force_authenticate

from .models import (
    RecruiterProfile,
    RecruiterMembership,
    JobPosting,
    CandidateSearch,
    RecruiterActivity
)
from companies.models import Company
from jobs.models import Job

User = get_user_model()


class RecruiterProfileModelTest(TestCase):
    ""Test the RecruiterProfile model"""
    
    def setUp(self):
        self.company = Company.objects.create(
            name='Test Company',
            description='A test company',
            website='https://testcompany.com',
            is_active=True
        )
        self.user = User.objects.create_user(
            email='recruiter@example.com',
            password='testpass123',
            first_name='Test',
            last_name='Recruiter'
        )
        
    def test_create_recruiter_profile(self):
        ""Test creating a new recruiter profile"""
        profile = RecruiterProfile.objects.create(
            user=self.user,
            company=self.company,
            job_title='Senior Recruiter',
            phone='+1234567890',
            is_verified=True
        )
        
        self.assertEqual(str(profile), f"{self.user.get_full_name()} - {self.company.name}")
        self.assertEqual(profile.user.email, 'recruiter@example.com')
        self.assertEqual(profile.company.name, 'Test Company')
        self.assertTrue(profile.is_verified)


class RecruiterAPITest(APITestCase):
    ""Test the recruiter API endpoints"""
    
    def setUp(self):
        self.company = Company.objects.create(
            name='Test Company',
            description='A test company',
            website='https://testcompany.com',
            is_active=True
        )
        
        # Create a regular user
        self.user = User.objects.create_user(
            email='user@example.com',
            password='testpass123',
            first_name='Regular',
            last_name='User'
        )
        
        # Create a recruiter user
        self.recruiter_user = User.objects.create_user(
            email='recruiter@example.com',
            password='testpass123',
            first_name='Test',
            last_name='Recruiter'
        )
        
        # Create recruiter profile
        self.recruiter_profile = RecruiterProfile.objects.create(
            user=self.recruiter_user,
            company=self.company,
            job_title='Senior Recruiter',
            is_verified=True
        )
        
        # Create recruiter membership
        self.membership = RecruiterMembership.objects.create(
            recruiter=self.recruiter_profile,
            tier='professional',
            job_postings_remaining=10,
            candidate_views_remaining=100,
            can_contact_candidates=True
        )
        
        # Create a job for testing
        self.job = Job.objects.create(
            title='Software Engineer',
            description='We are looking for a software engineer',
            requirements='Python, Django, React',
            location='Remote',
            job_type='full_time',
            is_active=True,
            created_by=self.recruiter_user
        )
        
        # Create a job posting
        self.job_posting = JobPosting.objects.create(
            job=self.job,
            recruiter=self.recruiter_profile,
            status='published'
        )
        
        # Create a candidate search
        self.candidate_search = CandidateSearch.objects.create(
            recruiter=self.recruiter_profile,
            name='Python Developers',
            search_parameters={'skills': ['Python', 'Django'], 'experience': '3-5'}
        )
        
        # Create some activities
        self.activity1 = RecruiterActivity.objects.create(
            recruiter=self.recruiter_profile,
            activity_type='login',
            details={'ip': '127.0.0.1'}
        )
        
        # Set up the API client
        self.client = APIClient()
        
    def test_get_recruiter_profile(self):
        ""Test retrieving the recruiter's own profile"""
        self.client.force_authenticate(user=self.recruiter_user)
        
        url = reverse('recruiter:recruiter-profile-detail', args=[self.recruiter_profile.id])
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['job_title'], 'Senior Recruiter')
        self.assertEqual(response.data['company_name'], 'Test Company')
    
    def test_update_recruiter_profile(self):
        ""Test updating the recruiter's profile"""
        self.client.force_authenticate(user=self.recruiter_user)
        
        url = reverse('recruiter:recruiter-profile-detail', args=[self.recruiter_profile.id])
        data = {
            'job_title': 'Lead Recruiter',
            'phone': '+1234567890'
        }
        
        response = self.client.patch(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['job_title'], 'Lead Recruiter')
        self.assertEqual(response.data['phone'], '+1234567890')
    
    def test_get_job_postings(self):
        ""Test retrieving job postings"""
        self.client.force_authenticate(user=self.recruiter_user)
        
        url = reverse('recruiter:job-posting-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['job_title'], 'Software Engineer')
    
    def test_publish_job_posting(self):
        ""Test publishing a job posting"""
        self.client.force_authenticate(user=self.recruiter_user)
        
        # Create a draft job posting
        job = Job.objects.create(
            title='Draft Job',
            description='This is a draft job',
            requirements='Python',
            location='Remote',
            job_type='full_time',
            is_active=True,
            created_by=self.recruiter_user
        )
        
        posting = JobPosting.objects.create(
            job=job,
            recruiter=self.recruiter_profile,
            status='draft'
        )
        
        url = reverse('recruiter:job-posting-publish', args=[posting.id])
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Refresh from database
        posting.refresh_from_db()
        self.assertEqual(posting.status, 'published')
        self.assertIsNotNone(posting.published_at)
    
    def test_get_dashboard(self):
        ""Test retrieving the recruiter dashboard"""
        self.client.force_authenticate(user=self.recruiter_user)
        
        url = reverse('recruiter:recruiter-dashboard')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['active_jobs'], 1)
        self.assertEqual(response.data['membership_status']['tier'], 'Professional')
        self.assertTrue(len(response.data['recent_activities']) > 0)
    
    def test_unauthorized_access(self):
        ""Test that regular users can't access recruiter endpoints"""
        self.client.force_authenticate(user=self.user)
        
        url = reverse('recruiter:recruiter-profile-detail', args=[self.recruiter_profile.id])
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
