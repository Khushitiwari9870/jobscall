from django.test import TestCase, RequestFactory
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

from applications.models import Application
from jobs.models import JobPosting, Company
from .models import ResumeHighlight, ResumeAnalysis
from .serializers import ResumeHighlightSerializer, ResumeAnalysisSerializer

User = get_user_model()


class ResumeHighlightModelTest(TestCase):
    """Test the ResumeHighlight model"""
    
    def setUp(self):
        self.company = Company.objects.create(
            name="Test Company",
            website="https://testcompany.com"
        )
        self.recruiter = User.objects.create_user(
            email="recruiter@test.com",
            password="testpass123",
            user_type="recruiter"
        )
        self.job_posting = JobPosting.objects.create(
            title="Software Engineer",
            company=self.company,
            created_by=self.recruiter
        )
        self.candidate = User.objects.create_user(
            email="candidate@test.com",
            password="testpass123",
            user_type="candidate"
        )
        self.application = Application.objects.create(
            job_posting=self.job_posting,
            candidate=self.candidate,
            status="applied"
        )
    
    def test_create_highlight(self):
        ""Test creating a resume highlight"""
        highlight = ResumeHighlight.objects.create(
            application=self.application,
            text="5+ years of Python experience",
            highlight_type="strength",
            comment="Strong relevant experience",
            created_by=self.recruiter
        )
        self.assertEqual(highlight.application, self.application)
        self.assertEqual(highlight.highlight_type, "strength")
        self.assertEqual(highlight.created_by, self.recruiter)
        self.assertIsNotNone(highlight.created_at)
        self.assertIsNotNone(highlight.updated_at)


class ResumeAnalysisModelTest(TestCase):
    ""Test the ResumeAnalysis model"""
    
    def setUp(self):
        self.company = Company.objects.create(
            name="Test Company",
            website="https://testcompany.com"
        )
        self.recruiter = User.objects.create_user(
            email="recruiter@test.com",
            password="testpass123",
            user_type="recruiter"
        )
        self.job_posting = JobPosting.objects.create(
            title="Software Engineer",
            company=self.company,
            created_by=self.recruiter
        )
        self.candidate = User.objects.create_user(
            email="candidate@test.com",
            password="testpass123",
            user_type="candidate"
        )
        self.application = Application.objects.create(
            job_posting=self.job_posting,
            candidate=self.candidate,
            status="applied"
        )
    
    def test_create_analysis(self):
        ""Test creating a resume analysis"""
        analysis = ResumeAnalysis.objects.create(
            application=self.application,
            overall_score=85,
            strengths_summary="Strong technical skills",
            weaknesses_summary="Limited management experience",
            is_auto_generated=True,
            analyzed_by=self.recruiter
        )
        self.assertEqual(analysis.application, self.application)
        self.assertEqual(analysis.overall_score, 85)
        self.assertTrue(analysis.is_auto_generated)
        self.assertEqual(analysis.analyzed_by, self.recruiter)


class ResumeHighlightAPITest(APITestCase):
    ""Test the resume highlights API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.company = Company.objects.create(
            name="Test Company",
            website="https://testcompany.com"
        )
        self.recruiter = User.objects.create_user(
            email="recruiter@test.com",
            password="testpass123",
            user_type="recruiter"
        )
        self.recruiter.companies.add(self.company)
        self.job_posting = JobPosting.objects.create(
            title="Software Engineer",
            company=self.company,
            created_by=self.recruiter
        )
        self.candidate = User.objects.create_user(
            email="candidate@test.com",
            password="testpass123",
            user_type="candidate"
        )
        self.application = Application.objects.create(
            job_posting=self.job_posting,
            candidate=self.candidate,
            status="applied"
        )
        self.highlight = ResumeHighlight.objects.create(
            application=self.application,
            text="5+ years of Python experience",
            highlight_type="strength",
            created_by=self.recruiter
        )
        self.client.force_authenticate(user=self.recruiter)
    
    def test_get_highlights(self):
        ""Test retrieving highlights"""
        response = self.client.get('/api/resume-highlighter/highlights/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_update_highlight(self):
        ""Test updating a highlight"""
        url = f'/api/resume-highlighter/highlights/{self.highlight.id}/'
        data = {
            'comment': 'Updated comment',
            'suggested_improvement': 'Consider adding more details'
        }
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.highlight.refresh_from_db()
        self.assertEqual(self.highlight.comment, 'Updated comment')


class ResumeAnalysisAPITest(APITestCase):
    ""Test the resume analysis API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.company = Company.objects.create(
            name="Test Company",
            website="https://testcompany.com"
        )
        self.recruiter = User.objects.create_user(
            email="recruiter@test.com",
            password="testpass123",
            user_type="recruiter"
        )
        self.recruiter.companies.add(self.company)
        self.job_posting = JobPosting.objects.create(
            title="Software Engineer",
            company=self.company,
            created_by=self.recruiter
        )
        self.candidate = User.objects.create_user(
            email="candidate@test.com",
            password="testpass123",
            user_type="candidate"
        )
        self.application = Application.objects.create(
            job_posting=self.job_posting,
            candidate=self.candidate,
            status="applied"
        )
        self.analysis = ResumeAnalysis.objects.create(
            application=self.application,
            overall_score=75,
            is_auto_generated=True,
            analyzed_by=self.recruiter
        )
        self.client.force_authenticate(user=self.recruiter)
    
    def test_analyze_resume(self):
        ""Test analyzing a resume"""
        url = '/api/resume-highlighter/analyses/analyze/'
        data = {
            'application_id': self.application.id,
            'analyze_again': True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('overall_score', response.data)
        self.assertIn('highlights', response.data)
