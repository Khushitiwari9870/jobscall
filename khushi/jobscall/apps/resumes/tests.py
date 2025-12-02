from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token

from apps.users.models import User
from .models import Resume, WorkExperience, Education, Skill

class ResumeModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        
    def test_create_resume(self):
        resume = Resume.objects.create(
            user=self.user,
            title='My Resume',
            professional_title='Senior Developer',
            summary='Experienced developer',
            status='draft'
        )
        self.assertEqual(str(resume), 'My Resume - test@example.com')
        self.assertEqual(resume.work_experiences.count(), 0)
        self.assertEqual(resume.educations.count(), 0)
        self.assertEqual(resume.skills.count(), 0)

class ResumeAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        
        # Create a test resume
        self.resume = Resume.objects.create(
            user=self.user,
            title='My Resume',
            professional_title='Senior Developer',
            summary='Experienced developer',
            status='draft'
        )
        
    def test_create_resume(self):
        url = reverse('resume-list')
        data = {
            'title': 'New Resume',
            'professional_title': 'Full Stack Developer',
            'summary': 'Skilled in multiple technologies',
            'status': 'draft',
            'work_experiences': [
                {
                    'job_title': 'Senior Developer',
                    'company_name': 'Tech Corp',
                    'start_date': '2020-01-01',
                    'currently_working': True,
                    'description': 'Developed awesome features'
                }
            ],
            'educations': [
                {
                    'degree': 'bachelor',
                    'field_of_study': 'Computer Science',
                    'institution': 'University of Tech',
                    'start_date': '2015-01-01',
                    'end_date': '2019-01-01'
                }
            ],
            'skills': [
                {'name': 'Python', 'level': 4},
                {'name': 'Django', 'level': 4}
            ]
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Resume.objects.count(), 2)
        self.assertEqual(Resume.objects.get(title='New Resume').work_experiences.count(), 1)
        self.assertEqual(Resume.objects.get(title='New Resume').educations.count(), 1)
        self.assertEqual(Resume.objects.get(title='New Resume').skills.count(), 2)
    
    def test_get_resume_detail(self):
        url = reverse('resume-detail', args=[self.resume.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'My Resume')
    
    def test_update_resume(self):
        url = reverse('resume-detail', args=[self.resume.id])
        data = {'title': 'Updated Resume'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.resume.refresh_from_db()
        self.assertEqual(self.resume.title, 'Updated Resume')
    
    def test_delete_resume(self):
        url = reverse('resume-detail', args=[self.resume.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Resume.objects.count(), 0)
    
    def test_set_default_resume(self):
        # Create a second resume
        resume2 = Resume.objects.create(
            user=self.user,
            title='Second Resume',
            status='draft',
            is_default=True
        )
        
        # Set the first resume as default
        url = reverse('resume-set-default', args=[self.resume.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Refresh both resumes
        self.resume.refresh_from_db()
        resume2.refresh_from_db()
        
        # Check that only the first resume is now default
        self.assertTrue(self.resume.is_default)
        self.assertFalse(resume2.is_default)

class WorkExperienceAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        
        self.resume = Resume.objects.create(
            user=self.user,
            title='My Resume',
            status='draft'
        )
    
    def test_create_work_experience(self):
        url = reverse('work-experience-list', args=[self.resume.id])
        data = {
            'job_title': 'Senior Developer',
            'company_name': 'Tech Corp',
            'start_date': '2020-01-01',
            'currently_working': True,
            'description': 'Developed awesome features'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.resume.work_experiences.count(), 1)
        self.assertEqual(self.resume.work_experiences.first().job_title, 'Senior Developer')

class EducationAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        
        self.resume = Resume.objects.create(
            user=self.user,
            title='My Resume',
            status='draft'
        )
    
    def test_create_education(self):
        url = reverse('education-list', args=[self.resume.id])
        data = {
            'degree': 'bachelor',
            'field_of_study': 'Computer Science',
            'institution': 'University of Tech',
            'start_date': '2015-01-01',
            'end_date': '2019-01-01'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.resume.educations.count(), 1)
        self.assertEqual(self.resume.educations.first().field_of_study, 'Computer Science')

class SkillAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        
        self.resume = Resume.objects.create(
            user=self.user,
            title='My Resume',
            status='draft'
        )
    
    def test_create_skill(self):
        url = reverse('skill-list', args=[self.resume.id])
        data = {'name': 'Python', 'level': 4}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.resume.skills.count(), 1)
        self.assertEqual(self.resume.skills.first().name, 'Python')
