from django.test import TestCase
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
import json
import os

from .models import ResumeScore, ScoreImprovement, ResumeScoreSettings

User = get_user_model()

class ResumeScoreModelTest(TestCase):
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
        
        self.resume_score = ResumeScore.objects.create(
            user=self.user,
            resume_file=self.sample_file,
            original_filename='test_resume.pdf',
            file_size=12345,
            status='completed',
            overall_score=75,
            analysis={"sections": ["summary"]}
        )
    
    def test_resume_score_creation(self):
        self.assertEqual(self.resume_score.user.email, 'test@example.com')
        self.assertEqual(self.resume_score.overall_score, 75)
        self.assertEqual(self.resume_score.status, 'completed')
        self.assertTrue('sections' in self.resume_score.analysis)
    
    def test_score_improvement_creation(self):
        improvement = ScoreImprovement.objects.create(
            resume_score=self.resume_score,
            category='content',
            priority='high',
            title='Add more skills',
            description='Consider adding more technical skills to your resume.'
        )
        self.assertEqual(improvement.title, 'Add more skills')
        self.assertEqual(improvement.priority, 'high')
        self.assertEqual(improvement.resume_score, self.resume_score)

class ResumeScoreAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        
        # Create a sample resume score
        self.resume_score = ResumeScore.objects.create(
            user=self.user,
            original_filename='test_resume.pdf',
            file_size=12345,
            status='completed',
            overall_score=75
        )
        
        # Create sample improvements
        self.improvement1 = ScoreImprovement.objects.create(
            resume_score=self.resume_score,
            category='content',
            priority='high',
            title='Improvement 1',
            description='First improvement'
        )
        
        self.improvement2 = ScoreImprovement.objects.create(
            resume_score=self.resume_score,
            category='format',
            priority='medium',
            title='Improvement 2',
            description='Second improvement'
        )
    
    def test_get_resume_scores(self):
        url = reverse('resumescore-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['overall_score'], 75)
    
    def test_create_resume_score(self):
        url = reverse('resumescore-list')
        
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
        self.assertEqual(ResumeScore.objects.count(), 2)
        
        # Clean up the created file
        if os.path.exists(ResumeScore.objects.last().resume_file.path):
            os.remove(ResumeScore.objects.last().resume_file.path)
    
    def test_get_improvements(self):
        url = reverse('scoreimprovement-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
    
    def test_apply_improvement(self):
        url = reverse('resumescore-apply-improvement', args=[self.resume_score.id])
        data = {'improvement_id': self.improvement1.id}
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Refresh the improvement from the database
        self.improvement1.refresh_from_db()
        self.assertTrue(self.improvement1.is_applied)

class ResumeScoreSettingsTest(TestCase):
    def setUp(self):
        self.setting1 = ResumeScoreSettings.objects.create(
            name='min_score_threshold',
            value=50,
            description='Minimum score threshold for passing',
            is_active=True
        )
        
        self.setting2 = ResumeScoreSettings.objects.create(
            name='max_file_size_mb',
            value=10,
            description='Maximum file size in MB',
            is_active=True
        )
    
    def test_settings_creation(self):
        self.assertEqual(ResumeScoreSettings.objects.count(), 2)
        self.assertEqual(self.setting1.name, 'min_score_threshold')
        self.assertEqual(self.setting2.value, 10)
    
    def test_settings_str_representation(self):
        self.assertEqual(str(self.setting1), 'min_score_threshold')
