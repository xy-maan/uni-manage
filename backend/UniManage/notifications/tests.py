from django.urls import reverse
from rest_framework.test import APITestCase

from users.models import User

from .models import Notification


class NotificationApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='notified', email='notified@uni.edu.eg')
        self.client.force_authenticate(self.user)
        self.notification = Notification.objects.create(
            recipient=self.user,
            notification_type=Notification.Type.SYSTEM,
            title='Hello',
            message='World',
        )

    def test_mark_read_and_unread_count(self):
        response = self.client.post(reverse('notification-mark-read', args=[self.notification.pk]))
        self.assertEqual(response.status_code, 200)
        response = self.client.get(reverse('notification-unread-count'))
        self.assertEqual(response.data['count'], 0)
