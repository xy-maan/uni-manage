"""DRF serializers for the ``notifications`` app."""

from __future__ import annotations

from rest_framework import serializers

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    target_type = serializers.SerializerMethodField(read_only=True)
    target_repr = serializers.SerializerMethodField(read_only=True)
    actor_username = serializers.CharField(
        source='actor.username', read_only=True, default=None
    )
    recipient_username = serializers.CharField(
        source='recipient.username', read_only=True
    )
    is_read = serializers.BooleanField(read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id',
            'recipient',
            'recipient_username',
            'actor',
            'actor_username',
            'verb',
            'description',
            'target_content_type',
            'target_object_id',
            'target_type',
            'target_repr',
            'read_at',
            'is_read',
            'is_archived',
            'created_at',
        ]
        read_only_fields = fields

    def get_target_type(self, obj: Notification) -> str | None:
        if obj.target_content_type is None:
            return None
        return f"{obj.target_content_type.app_label}.{obj.target_content_type.model}"

    def get_target_repr(self, obj: Notification) -> str | None:
        if obj.target is None:
            return None
        return str(obj.target)[:200]
