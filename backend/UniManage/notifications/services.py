from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.utils import timezone

from .models import Notification


def serialize_for_socket(notification):
    return {
        'id': notification.id,
        'notification_type': notification.notification_type,
        'title': notification.title,
        'message': notification.message,
        'data': notification.data,
        'actor_id': notification.actor_id,
        'read_at': notification.read_at.isoformat() if notification.read_at else None,
        'created_at': notification.created_at.isoformat(),
    }


def create_notification(*, recipient, notification_type, title, message, actor=None, data=None):
    notification = Notification.objects.create(
        recipient=recipient,
        actor=actor,
        notification_type=notification_type,
        title=title,
        message=message,
        data=data or {},
    )
    channel_layer = get_channel_layer()
    if channel_layer:
        async_to_sync(channel_layer.group_send)(
            f'notifications_{recipient.pk}',
            {'type': 'notification.message', 'notification': serialize_for_socket(notification)},
        )
    return notification


def mark_read(notification):
    if not notification.read_at:
        notification.read_at = timezone.now()
        notification.save(update_fields=['read_at'])
    return notification
