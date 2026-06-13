"""URL configuration for the ``projects`` app."""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    DeliverableViewSet,
    FeedbackViewSet,
    MyInvitationRespondView,
    MyInvitationsListView,
    PhaseViewSet,
    SprintViewSet,
    SubmissionViewSet,
    TaskViewSet,
    TeamDashboardView,
    TeamViewSet,
)

app_name = 'projects'

router = DefaultRouter()
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'deliverables', DeliverableViewSet, basename='deliverable')
router.register(r'sprints', SprintViewSet, basename='sprint')
router.register(r'phases', PhaseViewSet, basename='phase')
router.register(r'feedback', FeedbackViewSet, basename='feedback')
router.register(r'submissions', SubmissionViewSet, basename='submission')

urlpatterns = [
    path('', include(router.urls)),
    path(
        'me/invitations/',
        MyInvitationsListView.as_view(),
        name='my-invitations',
    ),
    path(
        'me/invitations/<int:pk>/respond/',
        MyInvitationRespondView.as_view(),
        name='my-invitation-respond',
    ),
    path(
        'teams/<int:team_id>/dashboard/',
        TeamDashboardView.as_view(),
        name='team-dashboard',
    ),
]
