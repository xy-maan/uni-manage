"""URL configuration for the ``notifications`` app."""

from django.urls import path

from .views import (
    NotificationListView,
    NotificationMarkAllReadView,
    NotificationReadView,
    NotificationUnreadCountView,
)

app_name = 'notifications'

urlpatterns = [
    path('', NotificationListView.as_view(), name='list'),
    path('unread-count/', NotificationUnreadCountView.as_view(), name='unread-count'),
    path('mark-all-read/', NotificationMarkAllReadView.as_view(), name='mark-all-read'),
    path('<int:pk>/read/', NotificationReadView.as_view(), name='read'),
]
