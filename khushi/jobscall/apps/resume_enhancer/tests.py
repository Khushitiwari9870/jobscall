import os
import tempfile
from django.test import TestCase, override_settings
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

from .models import ResumeEnhancement, ResumeEnhancementFeedback

User = get_user_model()


def create_test_file(filename='test_resume.pdf', content=b'Test resume content'):
    """Create a test file for upload"""
    return SimpleUploadedFile(
        name=filename,
        content=content,
        content_type='application/pdf'
    )


class ResumeEnhancementModelTest(TestCase):
    """Test the ResumeEnhancement model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            user_type='candidate'
        )
        
    def test_create_enhancement(self):
        ""Test creating a resume enhancement"""
        enhancement = ResumeEnhancement.objects.create(
            user=self.user,
            original_resume=create_test_file(),
            enhancement_type='entry_level',
            status='completed'
        )
        self.assertEqual(str(enhancement), f"Entry Level - {self.user.email}")
        self.assertEqual(enhancement.user, self.user)
        self.assertEqual(enhancement.status, 'completed')
        
        # Test file paths
        self.assertIn('original/', enhancement.original_resume.name)


class ResumeEnhancementFeedbackModelTest(TestCase):
    ""Test the ResumeEnhancementFeedback model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            user_type='candidate'
        )
        self.enhancement = ResumeEnhancement.objects.create(
            user=self.user,
            original_resume=create_test_file(),
            enhancement_type='entry_level',
            status='completed'
        )
    
    def test_create_feedback(self):
        ""Test creating feedback for an enhancement"""
        feedback = ResumeEnhancementFeedback.objects.create(
            enhancement=self.enhancement,
            rating=5,
            comments='Great service!',
            would_recommend=True
        )
        self.assertEqual(str(feedback), f"Feedback for {self.enhancement}")
        self.assertEqual(feedback.enhancement, self.enhancement)
        self.assertEqual(feedback.rating, 5)


@override_settings(MEDIA_ROOT=tempfile.mkdtemp())
class ResumeEnhancementAPITest(APITestCase):
    ""Test the resume enhancement API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            user_type='candidate'
        )
        self.client.force_authenticate(user=self.user)
    
    def test_create_enhancement(self):
        ""Test creating a new resume enhancement"""
        url = '/api/resume-enhancer/enhancements/'
        
        with create_test_file() as test_file:
            data = {
                'resume': test_file,
                'job_title': 'Software Engineer',
                'job_description': 'Looking for a skilled software engineer.'
            }
            
            response = self.client.post(url, data, format='multipart')
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            
            # Verify the enhancement was created
            enhancement_id = response.data['id']
            enhancement = ResumeEnhancement.objects.get(id=enhancement_id)
            self.assertEqual(enhancement.user, self.user)
            self.assertEqual(enhancement.job_title, 'Software Engineer')
    
    def test_list_enhancements(self):
        ""Test listing resume enhancements"""
        # Create test enhancements
        ResumeEnhancement.objects.create(
            user=self.user,
            original_resume=create_test_file('resume1.pdf'),
            enhancement_type='entry_level',
            status='completed'
        )
        
        url = '/api/resume-enhancer/enhancements/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_enhancement_types(self):
        ""Test getting available enhancement types"""
        url = '/api/resume-enhancer/enhancement-types/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertGreater(len(response.data), 0)
        self.assertIn('id', response.data[0])
        self.assertIn('name', response.data[0])
    
    def test_provide_feedback(self):
        ""Test providing feedback for an enhancement"""
        # Create a test enhancement
        enhancement = ResumeEnhancement.objects.create(
            user=self.user,
            original_resume=create_test_file(),
            enhancement_type='entry_level',
            status='completed'
        )
        
        url = f'/api/resume-enhancer/enhancements/{enhancement.id}/provide_feedback/'
        data = {
            'rating': 5,
            'comments': 'Great service!',
            'would_recommend': True
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify the feedback was created
        self.assertTrue(hasattr(enhancement, 'feedback'))
        self.assertEqual(enhancement.feedback.rating, 5)
        self.assertEqual(enhancement.feedback.comments, 'Great service!')
