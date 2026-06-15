from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AcademicYearListView, CategoryListView, DeliverableFileViewSet, DeliverableViewSet,
    FeedbackViewSet, JoinRequestViewSet, MeetingAttendanceViewSet, MeetingNoteViewSet,
    MeetingViewSet, ProjectInvitationViewSet, ProjectMembershipViewSet,
    ProjectSupervisorViewSet, ProjectViewSet, SemesterListView, SubjectListView,
    SupervisorRequestViewSet, TechnologySearchView,
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

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('semesters/', SemesterListView.as_view(), name='semester-list'),
    path('academic-years/', AcademicYearListView.as_view(), name='academic-year-list'),
    path('technologies/search/', TechnologySearchView.as_view(), name='technology-search'),
    path('subjects/', SubjectListView.as_view(), name='subject-list'),
    path('', include(router.urls)),
]
