from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model

from .models import Folder, FolderProfile
from apps.profile.models import UserProfile

User = get_user_model()

class FolderModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.folder = Folder.objects.create(
            name='Test Folder',
            description='Test Description',
            created_by=self.user
        )
    
    def test_folder_creation(self):
        self.assertEqual(self.folder.name, 'Test Folder')
        self.assertEqual(self.folder.created_by, self.user)
        self.assertEqual(str(self.folder), 'Test Folder')
    
    def test_default_folder_creation(self):
        # Creating a default folder should make it the only default
        default_folder = Folder.objects.create(
            name='Default Folder',
            is_default=True,
            created_by=self.user
        )
        self.folder.refresh_from_db()
        self.assertFalse(self.folder.is_default)
        self.assertTrue(default_folder.is_default)


class FolderAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        
        # Create test profiles
        self.profile1 = UserProfile.objects.create(
            user=User.objects.create_user(
                email='candidate1@example.com',
                password='testpass123',
                first_name='John',
                last_name='Doe'
            )
        )
        self.profile2 = UserProfile.objects.create(
            user=User.objects.create_user(
                email='candidate2@example.com',
                password='testpass123',
                first_name='Jane',
                last_name='Smith'
            )
        )
    
    def test_create_folder(self):
        url = reverse('folders:folders-list')
        data = {
            'name': 'New Folder',
            'description': 'A test folder',
            'is_default': True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Folder.objects.count(), 1)
        self.assertEqual(Folder.objects.get().name, 'New Folder')
    
    def test_add_profiles_to_folder(self):
        folder = Folder.objects.create(
            name='Test Folder',
            created_by=self.user
        )
        url = reverse('folders:folder-add-profiles', kwargs={'pk': folder.id})
        data = {
            'profile_ids': [self.profile1.id, self.profile2.id]
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(folder.folder_profiles.count(), 2)
    
    def test_move_profiles_between_folders(self):
        folder1 = Folder.objects.create(name='Folder 1', created_by=self.user)
        folder2 = Folder.objects.create(name='Folder 2', created_by=self.user)
        
        # Add profiles to folder1
        FolderProfile.objects.create(
            folder=folder1,
            profile=self.profile1,
            added_by=self.user
        )
        
        url = reverse('folders:move-between-folders')
        data = {
            'source_folder_id': folder1.id,
            'target_folder_id': folder2.id,
            'profile_ids': [self.profile1.id]
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(folder1.folder_profiles.count(), 0)
        self.assertEqual(folder2.folder_profiles.count(), 1)
