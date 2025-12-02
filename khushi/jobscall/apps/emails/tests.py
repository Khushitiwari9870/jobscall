from django.test import TestCase, RequestFactory
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

from .models import EmailTemplate, EmailRecipient, EmailCampaign, EmailLog
from .serializers import EmailTemplateSerializer

User = get_user_model()


class EmailTemplateTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        
        self.template_data = {
            'name': 'Test Template',
            'subject': 'Test Subject',
            'body': 'This is a test email template',
            'template_type': 'candidate',
            'is_active': True
        }
    
    def test_create_email_template(self):
        """Test creating a new email template"""
        response = self.client.post(
            '/api/v1/emails/templates/',
            self.template_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(EmailTemplate.objects.count(), 1)
        self.assertEqual(EmailTemplate.objects.get().name, 'Test Template')
    
    def test_retrieve_email_template(self):
        """Test retrieving an email template"""
        template = EmailTemplate.objects.create(
            **self.template_data,
            created_by=self.user
        )
        response = self.client.get(f'/api/v1/emails/templates/{template.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], template.name)


class EmailCampaignTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='campaign@example.com',
            password='testpass123',
            first_name='Campaign',
            last_name='Manager'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        
        self.template = EmailTemplate.objects.create(
            name='Campaign Template',
            subject='Campaign Subject',
            body='Campaign body',
            template_type='marketing',
            created_by=self.user
        )
        
        self.campaign_data = {
            'name': 'Test Campaign',
            'template': self.template.id,
            'status': 'draft'
        }
    
    def test_create_campaign(self):
        """Test creating a new email campaign"""
        response = self.client.post(
            '/api/v1/emails/campaigns/',
            self.campaign_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(EmailCampaign.objects.count(), 1)
        self.assertEqual(EmailCampaign.objects.get().name, 'Test Campaign')


class EmailSendTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='sender@example.com',
            password='testpass123',
            first_name='Sender',
            last_name='User'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        
        self.recipient = EmailRecipient.objects.create(
            email='recipient@example.com',
            first_name='Recipient',
            last_name='User'
        )
    
    def test_send_individual_email(self):
        """Test sending an individual email"""
        email_data = {
            'to': 'test@example.com',
            'subject': 'Test Email',
            'message': 'This is a test email'
        }
        
        response = self.client.post(
            '/api/v1/emails/send/',
            email_data,
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(EmailLog.objects.count(), 1)
        self.assertEqual(EmailLog.objects.first().subject, 'Test Email')
