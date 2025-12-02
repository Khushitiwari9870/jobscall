from django.test import TestCase, override_settings
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from django.utils import timezone
import json
import os

from .models import SharedIvrResource, SharedIvrTemplate, SharedIvrUsageLog

User = get_user_model()

class SharedIvrResourceModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        
        self.resource = SharedIvrResource.objects.create(
            name='Test Resource',
            description='A test IVR resource',
            resource_type='audio',
            content='Test content',
            language='en',
            is_active=True,
            created_by=self.user
        )
    
    def test_resource_creation(self):
        """Test that a resource can be created"""
        self.assertEqual(str(self.resource), 'Audio File: Test Resource')
        self.assertEqual(self.resource.resource_type, 'audio')
        self.assertEqual(self.resource.language, 'en')
        self.assertTrue(self.resource.is_active)
        self.assertEqual(self.resource.created_by, self.user)


class SharedIvrTemplateModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        
        self.template = SharedIvrTemplate.objects.create(
            name='Test Template',
            description='A test IVR template',
            template_type='greeting',
            content={'message': 'Hello, world!'},
            version='1.0',
            is_active=True,
            is_public=False,
            created_by=self.user
        )
    
    def test_template_creation(self):
        """Test that a template can be created"""
        self.assertEqual(str(self.template), 'Greeting: Test Template (v1.0)')
        self.assertEqual(self.template.template_type, 'greeting')
        self.assertEqual(self.template.version, '1.0')
        self.assertTrue(self.template.is_active)
        self.assertFalse(self.template.is_public)
        self.assertEqual(self.template.created_by, self.user)
        self.assertEqual(self.template.content, {'message': 'Hello, world!'})


class SharedIvrUsageLogModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        
        self.template = SharedIvrTemplate.objects.create(
            name='Test Template',
            template_type='greeting',
            content={},
            created_by=self.user
        )
        
        self.usage_log = SharedIvrUsageLog.objects.create(
            resource_type='template',
            resource_id=self.template.id,
            action='created',
            user=self.user,
            ip_address='127.0.0.1',
            user_agent='Test User Agent',
            metadata={'test': 'data'}
        )
    
    def test_usage_log_creation(self):
        """Test that a usage log can be created"""
        self.assertEqual(self.usage_log.resource_type, 'template')
        self.assertEqual(self.usage_log.resource_id, self.template.id)
        self.assertEqual(self.usage_log.action, 'created')
        self.assertEqual(self.usage_log.user, self.user)
        self.assertEqual(self.usage_log.ip_address, '127.0.0.1')
        self.assertEqual(self.usage_log.metadata, {'test': 'data'})


@override_settings(ROOT_URLCONF='ivr_shared.urls')
class SharedIvrResourceApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            is_staff=True
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        
        self.resource_data = {
            'name': 'Test Resource',
            'description': 'A test IVR resource',
            'resource_type': 'audio',
            'content': 'Test content',
            'language': 'en',
            'is_active': True
        }
    
    def test_create_resource(self):
        """Test creating a new resource"""
        url = reverse('ivr_shared:ivr-resource-list')
        response = self.client.post(url, self.resource_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SharedIvrResource.objects.count(), 1)
        self.assertEqual(SharedIvrResource.objects.get().name, 'Test Resource')
        
        # Verify usage log was created
        self.assertTrue(SharedIvrUsageLog.objects.filter(
            resource_type='resource',
            action='created'
        ).exists())
    
    def test_list_resources(self):
        """Test listing resources"""
        # Create test resources
        SharedIvrResource.objects.create(
            name='Resource 1',
            resource_type='audio',
            created_by=self.user
        )
        SharedIvrResource.objects.create(
            name='Resource 2',
            resource_type='prompt',
            created_by=self.user
        )
        
        url = reverse('ivr_shared:ivr-resource-list')
        response = self.client.get(url, {'resource_type': 'audio'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Resource 1')


@override_settings(ROOT_URLCONF='ivr_shared.urls')
class SharedIvrTemplateApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            is_staff=True
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        
        self.template_data = {
            'name': 'Test Template',
            'description': 'A test IVR template',
            'template_type': 'greeting',
            'content': {'message': 'Hello, world!'},
            'version': '1.0',
            'is_active': True,
            'is_public': False
        }
        
        # Create a test resource
        self.resource = SharedIvrResource.objects.create(
            name='Test Resource',
            resource_type='audio',
            created_by=self.user
        )
    
    def test_create_template(self):
        """Test creating a new template"""
        self.template_data['resource_ids'] = [self.resource.id]
        
        url = reverse('ivr_shared:ivr-template-list')
        response = self.client.post(url, self.template_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SharedIvrTemplate.objects.count(), 1)
        template = SharedIvrTemplate.objects.get()
        self.assertEqual(template.name, 'Test Template')
        self.assertEqual(template.resources.count(), 1)
        
        # Verify usage log was created
        self.assertTrue(SharedIvrUsageLog.objects.filter(
            resource_type='template',
            action='created'
        ).exists())
    
    def test_export_template(self):
        """Test exporting a template"""
        template = SharedIvrTemplate.objects.create(
            name='Export Test',
            template_type='greeting',
            content={'message': 'Hello'},
            created_by=self.user
        )
        template.resources.add(self.resource)
        
        url = reverse('ivr_shared:ivr-template-export', kwargs={'pk': template.id})
        response = self.client.post(url, {'format': 'json'}, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Export Test')
        self.assertEqual(len(response.data.get('resources', [])), 1)
    
    def test_import_template(self):
        """Test importing a template"""
        # Create a test export file
        export_data = {
            'name': 'Imported Template',
            'description': 'An imported template',
            'template_type': 'menu',
            'content': {'menu': 'test'},
            'version': '1.0',
            'is_active': True,
            'is_public': True,
            'resources': [
                {
                    'name': 'Imported Resource',
                    'resource_type': 'prompt',
                    'content': 'Test prompt',
                    'language': 'en',
                    'is_active': True
                }
            ]
        }
        
        # Create a temporary file for import
        file_content = json.dumps(export_data).encode('utf-8')
        test_file = SimpleUploadedFile(
            'test_import.json',
            file_content,
            content_type='application/json'
        )
        
        url = reverse('ivr_shared:ivr-template-import')
        response = self.client.post(
            url,
            {'file': test_file, 'import_type': 'template'},
            format='multipart'
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SharedIvrTemplate.objects.count(), 1)
        self.assertEqual(SharedIvrResource.objects.count(), 1)
        
        template = SharedIvrTemplate.objects.get()
        self.assertEqual(template.name, 'Imported Template')
        self.assertEqual(template.template_type, 'menu')
        self.assertEqual(template.resources.count(), 1)
        
        # Verify usage log was created
        self.assertTrue(SharedIvrUsageLog.objects.filter(
            resource_type='template',
            action='imported'
        ).exists())


class SharedIvrAdminTests(TestCase):
    def setUp(self):
        self.admin_user = User.objects.create_superuser(
            email='admin@example.com',
            password='adminpass123'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.admin_user)
        
        self.resource = SharedIvrResource.objects.create(
            name='Test Resource',
            resource_type='audio',
            created_by=self.admin_user
        )
        
        self.template = SharedIvrTemplate.objects.create(
            name='Test Template',
            template_type='greeting',
            content={},
            created_by=self.admin_user
        )
        
        self.usage_log = SharedIvrUsageLog.objects.create(
            resource_type='template',
            resource_id=self.template.id,
            action='created',
            user=self.admin_user,
            ip_address='127.0.0.1'
        )
    
    def test_resource_admin(self):
        """Test the resource admin interface"""
        url = f'/admin/ivr_shared/sharedivrresource/{self.resource.id}/change/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.resource.name)
    
    def test_template_admin(self):
        """Test the template admin interface"""
        url = f'/admin/ivr_shared/sharedivrtemplate/{self.template.id}/change/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.template.name)
    
    def test_usage_log_admin(self):
        """Test the usage log admin interface"""
        url = f'/admin/ivr_shared/sharedivrusagelog/{self.usage_log.id}/change/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.usage_log.get_action_display())
