from django.test import TestCase


class CompaniesPingTest(TestCase):
    def test_ping(self):
        resp = self.client.get('/api/v1/companies/ping/')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json().get('app'), 'companies')
