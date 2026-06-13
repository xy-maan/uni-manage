"""
DRF views for the ``notifications`` app.

* :class:`NotificationListView` — paginated inbox for the requester
  (optionally filtered to ``unread`` / ``verb`` / ``target_type``).
* :class:`NotificationReadView` — POST marks a single notification read.
* :class:`NotificationMarkAllReadView` — POST marks all unread read.
"""

from __future__ import annotations

from django.contrib.contenttypes.models import ContentType
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Notification
from .serializers import NotificationSerializer


class NotificationListView(ListAPIView):
    """List the requester's notifications, newest first."""

    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None  # flat list is friendlier for the bell-icon inbox

    def get_queryset(self):
        qs = (
            Notification.objects
            .filter(recipient=self.request.user, is_archived=False)
            .select_related('actor', 'recipient', 'target_content_type')
            .order_by('-created_at')
        )
        params = self.request.query_params

        if params.get('unread') in {'1', 'true', 'True'}:
            qs = qs.filter(read_at__isnull=True)
        if params.get('verb'):
            qs = qs.filter(verb=params['verb'])
        target_type = params.get('target_type')
        if target_type:
            try:
                app_label, model = target_type.split('.', 1)
                ct = ContentType.objects.get(app_label=app_label, model=model)
                qs = qs.filter(target_content_type=ct)
            except (ValueError, ContentType.DoesNotExist):
                qs = qs.none()
        return qs


class NotificationReadView(APIView):
    """POST /api/notifications/{id}/read/ — mark a single notification read."""

    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, pk: int):
        notif = get_object_or_404(
            Notification.objects.select_for_update(),
            pk=pk,
            recipient=request.user,
        )
        if notif.read_at is None:
            notif.read_at = timezone.now()
            notif.save(update_fields=['read_at'])
        return Response(NotificationSerializer(notif).data, status=status.HTTP_200_OK)


class NotificationMarkAllReadView(APIView):
    """POST /api/notifications/mark-all-read/ — bulk mark unread → read."""

    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        now = timezone.now()
        count = Notification.objects.filter(
            recipient=request.user,
            read_at__isnull=True,
        ).update(read_at=now)
        return Response({'updated': count}, status=status.HTTP_200_OK)


class NotificationUnreadCountView(APIView):
    """GET /api/notifications/unread-count/ — used by the bell-icon badge."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        count = Notification.objects.filter(
            recipient=request.user,
            read_at__isnull=True,
            is_archived=False,
        ).count()
        return Response({'unread': count})
