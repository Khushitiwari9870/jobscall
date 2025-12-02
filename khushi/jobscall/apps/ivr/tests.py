from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from django.utils import timezone

from .models import IvrCall, IvrMenu, IvrMenuOption, IvrCallLog

User = get_user_model()

class IvrModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        
        self.menu = IvrMenu.objects.create(
            name='Test Menu',
            menu_type='main',
            greeting_text='Welcome to the test menu',
            invalid_choice_text='Invalid choice. Please try again.',
            max_retries=3,
            timeout=5,
            finish_on_key='#',
            is_active=True
        )
        
        self.option1 = IvrMenuOption.objects.create(
            menu=self.menu,
            digit='1',
            description='Option 1',
            action='menu',
            order=1
        )
        
        self.call = IvrCall.objects.create(
            call_sid='CA1234567890abcdef1234567890abcdef',
            from_number='+1234567890',
            to_number='+1987654321',
            direction='inbound',
            status='in-progress',
            user=self.user
        )
    
    def test_ivr_menu_creation(self):
        self.assertEqual(str(self.menu), 'Main Menu: Test Menu')
        self.assertEqual(self.menu.options.count(), 1)
    
    def test_ivr_call_creation(self):
        self.assertEqual(str(self.call), 'inbound call from +1234567890 (in-progress)')
        self.assertEqual(self.call.direction, 'inbound')
    
    def test_ivr_call_end(self):
        self.call.end_call('completed')
        self.assertEqual(self.call.status, 'completed')
        self.assertIsNotNone(self.call.end_time)
    
    def test_ivr_call_log_creation(self):
        log = IvrCallLog.objects.create(
            call=self.call,
            event_type='test_event',
            details={'key': 'value'}
        )
        self.assertEqual(str(log), f"{log.timestamp} - {self.call} - test_event")


@override_settings(ROOT_URLCONF='ivr.urls')
class IvrApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            is_staff=True
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        
        self.menu = IvrMenu.objects.create(
            name='Test Menu',
            menu_type='main',
            greeting_text='Welcome',
            is_active=True
        )
        
        self.call = IvrCall.objects.create(
            call_sid='CA1234567890abcdef1234567890abcdef',
            from_number='+1234567890',
            to_number='+1987654321',
            direction='inbound',
            status='in-progress'
        )
    
    def test_create_ivr_menu(self):
        url = reverse('ivr:ivr-menu-list')
        data = {
            'name': 'New Menu',
            'menu_type': 'submenu',
            'greeting_text': 'Welcome to the new menu',
            'is_active': True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(IvrMenu.objects.count(), 2)
        self.assertEqual(IvrMenu.objects.get(name='New Menu').menu_type, 'submenu')
    
    def test_initiate_call(self):
        url = reverse('ivr:ivr-call-initiate-call')
        data = {
            'to_number': '+1987654321',
            'from_number': '+1234567890',
            'menu_id': self.menu.id,
            'user_id': self.user.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['direction'], 'outbound')
    
    def test_handle_call_response(self):
        url = reverse('ivr:ivr-call-handle-response', kwargs={'pk': self.call.id})
        data = {
            'call_sid': self.call.call_sid,
            'digits': '1',
            'call_status': 'in-progress'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify the call was updated
        self.call.refresh_from_db()
        self.assertEqual(self.call.digits_pressed, '1')
        
        # Verify a log was created
        self.assertTrue(IvrCallLog.objects.filter(call=self.call, event_type='dtmf_received').exists())


class IvrTwilioWebhookTests(APITestCase):
    def setUp(self):
        self.url = reverse('ivr:ivr-twilio-webhook')
        self.call_sid = 'CA1234567890abcdef1234567890abcdef'
    
    def test_incoming_call_webhook(self):
        data = {
            'CallSid': self.call_sid,
            'CallStatus': 'in-progress',
            'Direction': 'inbound',
            'From': '+1234567890',
            'To': '+1987654321'
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify the call was created
        call = IvrCall.objects.get(call_sid=self.call_sid)
        self.assertEqual(call.from_number, '+1234567890')
        self.assertEqual(call.status, 'in-progress')
        
        # Verify a log was created
        self.assertTrue(IvrCallLog.objects.filter(call=call, event_type='twilio_in-progress').exists())
    
    def test_call_status_update_webhook(self):
        # First create a call
        call = IvrCall.objects.create(
            call_sid=self.call_sid,
            from_number='+1234567890',
            to_number='+1987654321',
            direction='inbound',
            status='in-progress'
        )
        
        # Send status update
        data = {
            'CallSid': self.call_sid,
            'CallStatus': 'completed',
            'CallDuration': '45'
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify the call was updated
        call.refresh_from_db()
        self.assertEqual(call.status, 'completed')
        self.assertEqual(call.duration, 45)
        self.assertIsNotNone(call.end_time)
