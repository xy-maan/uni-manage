"""
Lightweight in-app notifications.

Designed to be a minimal stand-in for ``django-notifications-hq``:
the team-supervision flow needs a small, typed surface (recipient,
actor, verb, target) without pulling in another dependency. If the
platform later needs email/push delivery, swap the dispatch layer
but keep the model.

The ``target`` GenericForeignKey points at the object the notification
is *about* (e.g. a Team, a Task, a Deliverable, a Phase). The
notification's owner is always ``recipient``.

Notifications are never user-deleted in this design; they get an
``is_archived`` flag for power-user inbox pruning. (Currently unused
in the API surface; included for future-proofing.)
"""

from __future__ import annotations

from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models


class Notification(models.Model):
    """A single notification addressed to ``recipient`` about ``target``."""

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
    )
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='+',
        help_text="The user who triggered the event (may be system, hence null).",
    )
    verb = models.CharField(
        max_length=64,
        help_text="Short verb identifier, e.g. 'supervisor_accepted', 'task_assigned'.",
    )
    description = models.TextField(
        blank=True,
        help_text="Optional human-readable body of the notification.",
    )

    target_content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        related_name='+',
    )
    target_object_id = models.PositiveBigIntegerField()
    target = GenericForeignKey('target_content_type', 'target_object_id')

    read_at = models.DateTimeField(null=True, blank=True)
    is_archived = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-created_at',)
        indexes = [
            models.Index(fields=['recipient', 'read_at']),
            models.Index(fields=['recipient', 'created_at']),
            models.Index(fields=['target_content_type', 'target_object_id']),
        ]
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'

    def __str__(self) -> str:
        return f"Notif<{self.verb} → {self.recipient_id}>"

    @property
    def is_read(self) -> bool:
        return self.read_at is not None

    def mark_read(self) -> None:
        if self.read_at is None:
            from django.utils import timezone
            self.read_at = timezone.now()
            self.save(update_fields=['read_at'])
