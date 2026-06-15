from rest_framework import serializers

from projects.serializers import UserSummarySerializer

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    actor_detail = UserSummarySerializer(source='actor', read_only=True)
    is_read = serializers.BooleanField(read_only=True)

    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ['recipient', 'actor', 'created_at', 'read_at']
