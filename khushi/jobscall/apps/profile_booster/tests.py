import os
import tempfile
from django.test import TestCase, override_settings
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

from .models import ProfileBooster, BoosterRecommendation, BoosterProgress

User = get_user_model()


class ProfileBoosterModelTest(TestCase):
    """Test the ProfileBooster model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            user_type='candidate'
        )
    
    def test_create_booster(self):
        ""Test creating a profile booster"""
        booster = ProfileBooster.objects.create(
            user=self.user,
            booster_type='profile_completion',
            status='completed',
            score_before=40,
            score_after=75
        )
        self.assertEqual(str(booster), f"Profile Completion - {self.user.email}")
        self.assertEqual(booster.improvement_percentage, 87)  # (75-40)/40 * 100 = 87.5 -> 87
        
        # Test status change
        booster.status = 'completed'
        booster.save()
        self.assertIsNotNone(booster.completed_at)


class BoosterRecommendationModelTest(TestCase):
    ""Test the BoosterRecommendation model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            user_type='candidate'
        )
        self.booster = ProfileBooster.objects.create(
            user=self.user,
            booster_type='profile_completion',
            status='completed'
        )
    
    def test_create_recommendation(self):
        ""Test creating a booster recommendation"""
        recommendation = BoosterRecommendation.objects.create(
            booster=self.booster,
            category='skills',
            priority='high',
            title='Add more skills',
            description='Include relevant technical skills',
            action_text='Add Skills',
            action_url='/profile/skills/'
        )
        self.assertEqual(str(recommendation), "High - Add more skills")


class BoosterProgressModelTest(TestCase):
    ""Test the BoosterProgress model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            user_type='candidate'
        )
    
    def test_create_progress(self):
        ""Test creating booster progress"""
        progress = BoosterProgress.objects.create(
            user=self.user,
            overall_score=65,
            completion_percentage=80,
            personal_info_score=90,
            experience_score=70,
            education_score=60,
            skills_score=50,
            certifications_score=40
        )
        self.assertEqual(str(progress), f"{self.user.email} - 62/100")
        
        # Test calculate_overall_score method
        progress.calculate_overall_score()
        self.assertEqual(progress.overall_score, 62)  # Average of all scores


@override_settings(MEDIA_ROOT=tempfile.mkdtemp())
class ProfileBoosterAPITest(APITestCase):
    ""Test the profile booster API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            user_type='candidate'
        )
        self.client.force_authenticate(user=self.user)
        
        # Create test data
        self.booster = ProfileBooster.objects.create(
            user=self.user,
            booster_type='profile_completion',
            status='completed',
            score_before=40,
            score_after=75
        )
        
        self.recommendation = BoosterRecommendation.objects.create(
            booster=self.booster,
            category='skills',
            priority='high',
            title='Add more skills',
            description='Include relevant technical skills',
            action_text='Add Skills',
            action_url='/profile/skills/'
        )
        
        self.progress = BoosterProgress.objects.create(
            user=self.user,
            overall_score=65,
            completion_percentage=80,
            boost_count=1
        )
    
    def test_start_booster(self):
        ""Test starting a new profile booster"""
        url = reverse('profile_booster:booster-start')
        data = {'booster_type': 'skill_improvement'}
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['booster_type'], 'skill_improvement')
        self.assertEqual(response.data['status'], 'completed')  # Because of our mock
    
    def test_complete_recommendation(self):
        ""Test completing a recommendation"""
        url = reverse('profile_booster:complete-recommendation', args=[self.booster.id])
        data = {'recommendation_id': self.recommendation.id, 'is_completed': True}
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify the recommendation was updated
        self.recommendation.refresh_from_db()
        self.assertTrue(self.recommendation.is_completed)
    
    def test_get_stats(self):
        ""Test getting booster statistics"""
        url = reverse('profile_booster:booster-stats')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_boosts', response.data)
        self.assertIn('average_improvement', response.data)
        self.assertIn('category_scores', response.data)
    
    def test_refresh_progress(self):
        ""Test refreshing progress"""
        url = reverse('profile_booster:progress-refresh')
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('overall_score', response.data)
        self.assertIn('completion_percentage', response.data)
