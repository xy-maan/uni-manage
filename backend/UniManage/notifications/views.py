from django.utils import timezone
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Notification
from .serializers import NotificationSerializer
from .services import mark_read


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_value_regex = r'\d+'

    def get_queryset(self):
        queryset = Notification.objects.filter(recipient=self.request.user).select_related('actor')
        unread = self.request.query_params.get('unread')
        if unread and unread.lower() in {'1', 'true', 'yes'}:
            queryset = queryset.filter(read_at__isnull=True)
        return queryset

    def perform_create(self, serializer):
        serializer.save(recipient=self.request.user, actor=self.request.user)

    @action(detail=True, methods=['post'], url_path='mark-read')
    def mark_read(self, request, pk=None):
        notification = mark_read(self.get_object())
        return Response(self.get_serializer(notification).data)

    @action(detail=False, methods=['post'], url_path='mark-all-read')
    def mark_all_read(self, request):
        count = self.get_queryset().filter(read_at__isnull=True).update(read_at=timezone.now())
        return Response({'updated': count})

    @action(detail=False, methods=['get'], url_path='unread-count')
    def unread_count(self, request):
        return Response({'count': self.get_queryset().filter(read_at__isnull=True).count()})
