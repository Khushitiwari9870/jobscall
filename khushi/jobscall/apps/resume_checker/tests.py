from django.test import TestCase
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
import json
import os

from .models import ResumeCheck, ResumeIssue, ResumeCheckSettings

User = get_user_model()

class ResumeCheckModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        
        # Create a sample resume file
        self.sample_file = SimpleUploadedFile(
            'test_resume.pdf',
            b'file_content',
            content_type='application/pdf'
        )
        
        self.resume_check = ResumeCheck.objects.create(
            user=self.user,
            resume_file=self.sample_file,
            original_filename='test_resume.pdf',
            file_size=12345,
            status='completed',
            overall_score=75,
            analysis={"sections": ["summary"]}
        )
    
    def test_resume_check_creation(self):
        self.assertEqual(self.resume_check.user.email, 'test@example.com')
        self.assertEqual(self.resume_check.overall_score, 75)
        self.assertEqual(self.resume_check.status, 'completed')
        self.assertTrue('sections' in self.resume_check.analysis)
    
    def test_issue_creation(self):
        issue = ResumeIssue.objects.create(
            resume_check=self.resume_check,
            issue_type='content',
            priority='high',
            title='Missing Skills',
            description='Add more technical skills to your resume.',
            suggestion='Include skills like Python, Django, and REST APIs.'
        )
        self.assertEqual(issue.title, 'Missing Skills')
        self.assertEqual(issue.priority, 'high')
        self.assertEqual(issue.resume_check, self.resume_check)

class ResumeCheckAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        
        # Create a sample resume check
        self.resume_check = ResumeCheck.objects.create(
            user=self.user,
            original_filename='test_resume.pdf',
            file_size=12345,
            status='completed',
            overall_score=75
        )
        
        # Create sample issues
        self.issue1 = ResumeIssue.objects.create(
            resume_check=self.resume_check,
            issue_type='content',
            priority='high',
            title='Issue 1',
            description='First issue'
        )
        
        self.issue2 = ResumeIssue.objects.create(
            resume_check=self.resume_check,
            issue_type='format',
            priority='medium',
            title='Issue 2',
            description='Second issue'
        )
    
    def test_get_resume_checks(self):
        url = reverse('resumecheck-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['overall_score'], 75)
    
    def test_create_resume_check(self):
        url = reverse('resumecheck-list')
        
        # Create a test file
        test_file = SimpleUploadedFile(
            'test_resume.pdf',
            b'file_content',
            content_type='application/pdf'
        )
        
        data = {
            'resume_file': test_file,
            'job_description': 'Sample job description'
        }
        
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ResumeCheck.objects.count(), 2)
        
        # Clean up the created file
        if os.path.exists(ResumeCheck.objects.last().resume_file.path):
            os.remove(ResumeCheck.objects.last().resume_file.path)
    
    def test_get_issues(self):
        url = reverse('resumeissue-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
    
    def test_resolve_issue(self):
        url = reverse('resumecheck-resolve-issue', args=[self.resume_check.id])
        data = {'issue_id': self.issue1.id}
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Refresh the issue from the database
        self.issue1.refresh_from_db()
        self.assertTrue(self.issue1.is_resolved)

class ResumeCheckSettingsTest(TestCase):
    def setUp(self):
        self.setting1 = ResumeCheckSettings.objects.create(
            name='min_score_threshold',
            value=50,
            description='Minimum score threshold for passing',
            is_active=True
        )
        
        self.setting2 = ResumeCheckSettings.objects.create(
            name='max_file_size_mb',
            value=10,
            description='Maximum file size in MB',
            is_active=True
        )
    
    def test_settings_creation(self):
        self.assertEqual(ResumeCheckSettings.objects.count(), 2)
        self.assertEqual(self.setting1.name, 'min_score_threshold')
        self.assertEqual(self.setting2.value, 10)
    
    def test_settings_str_representation(self):
        self.assertEqual(str(self.setting1), 'min_score_threshold')
