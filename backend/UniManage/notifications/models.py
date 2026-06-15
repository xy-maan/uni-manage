from django.conf import settings
from django.db import models


class Notification(models.Model):
    class Type(models.TextChoices):
        INVITATION = 'invitation', 'Invitation'
        REQUEST = 'request', 'Request'
        APPROVAL = 'approval', 'Approval'
        COMMENT = 'comment', 'Comment'
        TASK_ASSIGNMENT = 'task_assignment', 'Task assignment'
        TASK_UPDATE = 'task_update', 'Task update'
        FEEDBACK = 'feedback', 'Feedback'
        MEETING = 'meeting', 'Meeting'
        DELIVERABLE_REVIEW = 'deliverable_review', 'Deliverable review'
        SYSTEM = 'system', 'System'

    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='triggered_notifications')
    notification_type = models.CharField(max_length=30, choices=Type.choices)
    title = models.CharField(max_length=255)
    message = models.TextField()
    data = models.JSONField(default=dict, blank=True)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [models.Index(fields=['recipient', 'read_at', '-created_at'])]

    @property
    def is_read(self):
        return self.read_at is not None
