from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    DeliverableFileViewSet, DeliverableViewSet, FeedbackViewSet, JoinRequestViewSet,
    MeetingAttendanceViewSet, MeetingNoteViewSet, MeetingViewSet,
    ProjectInvitationViewSet, ProjectMembershipViewSet, ProjectSupervisorViewSet,
    ProjectViewSet, SupervisorRequestViewSet,
)

router = DefaultRouter()
router.register('', ProjectViewSet, basename='project')
router.register('memberships', ProjectMembershipViewSet, basename='project-membership')
router.register('invitations', ProjectInvitationViewSet, basename='project-invitation')
router.register('join-requests', JoinRequestViewSet, basename='join-request')
router.register('supervisor-requests', SupervisorRequestViewSet, basename='supervisor-request')
router.register('supervisors', ProjectSupervisorViewSet, basename='project-supervisor')
router.register('deliverables', DeliverableViewSet, basename='deliverable')
router.register('deliverable-files', DeliverableFileViewSet, basename='deliverable-file')
router.register('meetings', MeetingViewSet, basename='meeting')
router.register('meeting-attendance', MeetingAttendanceViewSet, basename='meeting-attendance')
router.register('meeting-notes', MeetingNoteViewSet, basename='meeting-note')
router.register('feedback', FeedbackViewSet, basename='feedback')

urlpatterns = [path('', include(router.urls))]
