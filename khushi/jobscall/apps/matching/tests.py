from django.test import TestCase


class MatchingPingTest(TestCase):
    def test_ping(self):
        resp = self.client.get('/api/v1/match/ping/')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json().get('app'), 'matching')
