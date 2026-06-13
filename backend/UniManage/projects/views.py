"""
DRF views for the ``projects`` app.

* :class:`TeamViewSet` - exposes the full team CRUD plus custom actions
  for invite/join/request-supervisor, plus ``available-students`` and
  ``available-supervisors`` lookups, methodology switch, member
  management, completion, and submission.
* :class:`MyInvitationsListView` - lists pending invitations/requests for
  the authenticated user.
* :class:`MyInvitationRespondView` - accepts or rejects one such
  invitation.
* :class:`TaskViewSet` / :class:`DeliverableViewSet` /
  :class:`SprintViewSet` / :class:`PhaseViewSet` /
  :class:`FeedbackViewSet` / :class:`SubmissionViewSet` -
  work-item and review viewsets (nested under team).
* :class:`TeamDashboardView` - single round-trip for the project
  dashboard, composes prefetched task / deliverable / sprint / phase /
  feedback / membership data into one payload.
"""

from __future__ import annotations

from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import Count, F, Q
from django.utils import timezone
from django_filters import rest_framework as filters
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from .access import (
    accepted_member_count,
    active_teams_for_supervisor_count,
    get_current_term,
)
from .models import (
    AcademicTerm,
    Deliverable,
    Feedback,
    Phase,
    Sprint,
    Submission,
    Task,
    Team,
    TeamMember,
    TeamSupervisor,
    default_board_config,
)
from .throttles import (
    MembershipActionThrottle,
    MethodologySwitchThrottle,
)
from .permissions import (
    IsTeamLeader,
    IsTeamLeaderOrSupervisor,
    IsTeamMember,
    IsTeamMemberOrSupervisor,
    IsTeamSupervisor,
)
from .serializers import (
    AvailableStudentSerializer,
    AvailableSupervisorSerializer,
    DeliverableSerializer,
    FeedbackSerializer,
    InvitationResponseSerializer,
    InviteStudentSerializer,
    PhaseReorderSerializer,
    PhaseSerializer,
    RequestSupervisorSerializer,
    SelectMethodologySerializer,
    SprintSerializer,
    SubmissionSerializer,
    TaskReorderSerializer,
    TaskSerializer,
    TaskTransitionSerializer,
    TeamMemberSerializer,
    TeamSerializer,
    TeamSupervisorSerializer,
    TransferLeadershipSerializer,
)

User = get_user_model()


# ---------------------------------------------------------------------------
# Filtering
# ---------------------------------------------------------------------------


class TeamFilter(filters.FilterSet):
    """django-filter integration for ``/api/teams/``."""

    project_type = filters.CharFilter(field_name='project_type', lookup_expr='iexact')
    status = filters.CharFilter(field_name='status', lookup_expr='iexact')
    is_recruiting = filters.BooleanFilter(field_name='is_recruiting')
    name = filters.CharFilter(field_name='name', lookup_expr='icontains')
    subject = filters.NumberFilter(field_name='subject_id')
    term = filters.NumberFilter(field_name='term_id')

    class Meta:
        model = Team
        fields = ['project_type', 'status', 'is_recruiting', 'name', 'subject', 'term']


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
# ``_get_current_term`` / ``_accepted_member_count`` /
# ``_active_teams_for_supervisor_count`` are now in ``projects.access``;
# legacy underscore-prefixed names are kept as thin aliases so the
# rest of this module reads naturally.


def _get_current_term() -> AcademicTerm | None:
    return get_current_term()


def _accepted_member_count(team: Team) -> int:
    return accepted_member_count(team)


def _active_teams_for_supervisor_count(supervisor_user) -> int:
    return active_teams_for_supervisor_count(supervisor_user)


# ---------------------------------------------------------------------------
# Team ViewSet
# ---------------------------------------------------------------------------


class TeamViewSet(viewsets.ModelViewSet):
    """CRUD for :class:`Team` plus team-membership actions."""

    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_class = TeamFilter

    def get_queryset(self):
        """Filter to teams visible to the requester.

        A team is visible if the requester:
          * is an accepted member,
          * is an accepted supervisor,
          * is staff, OR
          * the team is recruiting and in the current term
            (the "marketplace" view).
        """
        user = self.request.user
        qs = (
            Team.active_objects
            .select_related('term', 'subject')
            .prefetch_related('teammember_set__student', 'teamsupervisor_set__supervisor')
        )

        if user.is_staff:
            return qs.order_by('-created_at')

        member_team_ids = TeamMember.objects.filter(
            student=user, status=TeamMember.Status.ACCEPTED,
        ).values_list('team_id', flat=True)
        supervisor_team_ids = TeamSupervisor.objects.filter(
            supervisor=user, status=TeamSupervisor.Status.ACCEPTED,
        ).values_list('team_id', flat=True)

        current = get_current_term()
        marketplace_q = Q(is_recruiting=True)
        if current is not None:
            marketplace_q &= Q(term=current)

        return qs.filter(
            Q(pk__in=member_team_ids)
            | Q(pk__in=supervisor_team_ids)
            | marketplace_q
        ).order_by('-created_at').distinct()

    def get_permissions(self):
        if self.action in {'update', 'partial_update', 'destroy'}:
            return [permissions.IsAuthenticated(), IsTeamLeader()]
        if self.action in {'invite', 'request_supervisor'}:
            return [permissions.IsAuthenticated(), IsTeamLeader()]
        if self.action == 'join':
            return [permissions.IsAuthenticated()]
        return super().get_permissions()

    # ------------------------------------------------------------------
    # Custom actions
    # ------------------------------------------------------------------

    @action(detail=True, methods=['post'], url_path='invite')
    def invite(self, request, pk=None):
        """Leader invites a student to the team."""
        team = self.get_object()
        if team.is_locked:
            return Response(
                {'detail': 'Team is locked. Unlock before inviting new members.'},
                status=status.HTTP_423_LOCKED,
            )
        if _accepted_member_count(team) >= team.max_capacity:
            return Response(
                {'detail': 'Team has reached its max capacity.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = InviteStudentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        student_id = serializer.validated_data['student_id']

        try:
            student = User.objects.get(pk=student_id)
        except User.DoesNotExist:
            return Response({'detail': 'Student not found.'}, status=status.HTTP_404_NOT_FOUND)

        if TeamMember.objects.filter(team=team, student=student).exists():
            return Response(
                {'detail': 'Student already has a membership record on this team.'},
                status=status.HTTP_409_CONFLICT,
            )

        membership = TeamMember.objects.create(
            team=team,
            student=student,
            role=TeamMember.Role.MEMBER,
            status=TeamMember.Status.PENDING,
            is_invite=True,
        )
        return Response(
            TeamMemberSerializer(membership).data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=['post'], url_path='join')
    def join(self, request, pk=None):
        """Authenticated student requests to join the team."""
        team = self.get_object()
        user = request.user

        if not team.is_recruiting:
            return Response(
                {'detail': 'Team is not currently recruiting.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if team.is_locked:
            return Response(
                {'detail': 'Team is locked.'},
                status=status.HTTP_423_LOCKED,
            )
        if TeamMember.objects.filter(team=team, student=user).exists():
            return Response(
                {'detail': 'You already have a membership record on this team.'},
                status=status.HTTP_409_CONFLICT,
            )
        if _accepted_member_count(team) >= team.max_capacity:
            return Response(
                {'detail': 'Team has reached its max capacity.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        membership = TeamMember.objects.create(
            team=team,
            student=user,
            role=TeamMember.Role.MEMBER,
            status=TeamMember.Status.PENDING,
            is_invite=False,
        )
        return Response(
            TeamMemberSerializer(membership).data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=['post'], url_path='request-supervisor')
    def request_supervisor(self, request, pk=None):
        """Leader requests a Doctor/TA to supervise the team."""
        team = self.get_object()
        serializer = RequestSupervisorSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        supervisor_id = serializer.validated_data['supervisor_id']
        role = serializer.validated_data['role']

        try:
            supervisor = User.objects.select_related('supervisor_profile').get(pk=supervisor_id)
        except User.DoesNotExist:
            return Response({'detail': 'Supervisor not found.'}, status=status.HTTP_404_NOT_FOUND)

        profile = getattr(supervisor, 'supervisor_profile', None)
        if profile is None:
            return Response(
                {'detail': 'User is not registered as a supervisor.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Graduation: gate on supervisor capacity.
        if team.project_type == Team.ProjectType.GRADUATION:
            active_count = _active_teams_for_supervisor_count(supervisor)
            if active_count >= profile.max_team_capacity:
                return Response(
                    {
                        'detail': (
                            f"Supervisor has reached max team capacity "
                            f"({active_count}/{profile.max_team_capacity})."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        if TeamSupervisor.objects.filter(team=team, supervisor=supervisor).exists():
            return Response(
                {'detail': 'Supervisor already linked to this team.'},
                status=status.HTTP_409_CONFLICT,
            )

        # COURSE projects bypass approval.
        initial_status = (
            TeamSupervisor.Status.ACCEPTED
            if team.project_type == Team.ProjectType.COURSE
            else TeamSupervisor.Status.PENDING
        )
        link = TeamSupervisor.objects.create(
            team=team,
            supervisor=supervisor,
            role=role,
            status=initial_status,
            responded_at=timezone.now() if initial_status == TeamSupervisor.Status.ACCEPTED else None,
        )
        return Response(
            TeamSupervisorSerializer(link).data,
            status=status.HTTP_201_CREATED,
        )

    # ------------------------------------------------------------------
    # Availability lookups
    # ------------------------------------------------------------------

    @action(detail=False, methods=['get'], url_path='available-students')
    def available_students(self, request):
        """Students eligible to be invited: excludes those already in an active
        GRADUATION team in the current ``AcademicTerm``."""
        term = _get_current_term()
        qs = User.objects.filter(role=User.Role.STUDENT).select_related(
            'student_profile__department',
            'student_profile__academic_level',
        )

        if term is not None:
            occupied_student_ids = TeamMember.objects.filter(
                status=TeamMember.Status.ACCEPTED,
                team__is_deleted=False,
                team__project_type=Team.ProjectType.GRADUATION,
                team__term=term,
            ).values_list('student_id', flat=True)
            qs = qs.exclude(id__in=occupied_student_ids)

        search = request.query_params.get('q')
        if search:
            qs = qs.filter(
                Q(username__icontains=search)
                | Q(first_name__icontains=search)
                | Q(last_name__icontains=search)
                | Q(email__icontains=search)
            )

        page = self.paginate_queryset(qs)
        serializer = AvailableStudentSerializer(page or qs, many=True)
        if page is not None:
            return self.get_paginated_response(serializer.data)
        return Response(serializer.data)

    @action(
        detail=False,
        methods=['get'],
        url_path='available-supervisors',
    )
    def available_supervisors(self, request):
        """Supervisors (Doctor/TA), annotated with active team count and
        filtered out if they have hit ``max_team_capacity`` (for GRADUATION)."""
        project_type = request.query_params.get('project_type')
        include_full = request.query_params.get('include_full', 'false').lower() == 'true'

        qs = (
            User.objects
            .filter(role=User.Role.SUPERVISOR, supervisor_profile__isnull=False)
            .select_related('supervisor_profile__department')
        )

        qs = qs.annotate(
            active_team_count=Count(
                'supervised_teams',
                filter=Q(
                    supervised_teams__status=TeamSupervisor.Status.ACCEPTED,
                    supervised_teams__team__is_deleted=False,
                ),
                distinct=True,
            )
        )

        if project_type == Team.ProjectType.GRADUATION and not include_full:
            # Use __lt lookup against a subquery to keep it DB-friendly.
            qs = qs.filter(active_team_count__lt=F('supervisor_profile__max_team_capacity'))

        search = request.query_params.get('q')
        if search:
            qs = qs.filter(
                Q(username__icontains=search)
                | Q(first_name__icontains=search)
                | Q(last_name__icontains=search)
                | Q(email__icontains=search)
            )

        page = self.paginate_queryset(qs)
        serializer = AvailableSupervisorSerializer(page or qs, many=True)
        if page is not None:
            return self.get_paginated_response(serializer.data)
        return Response(serializer.data)


# ---------------------------------------------------------------------------
# /api/me/invitations/ and /api/me/invitations/{id}/respond/
# ---------------------------------------------------------------------------


class MyInvitationsListView(ListAPIView):
    """List pending team membership + supervisor requests for the requester."""

    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None  # simple flat list is friendlier for the inbox view

    def list(self, request, *args, **kwargs):
        user = request.user

        team_invites = (
            TeamMember.objects
            .filter(student=user, status=TeamMember.Status.PENDING)
            .select_related('team__term', 'team__subject')
        )
        supervisor_requests = (
            TeamSupervisor.objects
            .filter(supervisor=user, status=TeamSupervisor.Status.PENDING)
            .select_related('team__term', 'team__subject')
        )

        return Response({
            'team_invitations': TeamMemberSerializer(team_invites, many=True).data,
            'supervisor_requests': TeamSupervisorSerializer(supervisor_requests, many=True).data,
        })


class MyInvitationRespondView(APIView):
    """Accept or reject a single pending team/supervisor row."""

    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, pk: int):
        serializer = InvitationResponseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        action_choice = serializer.validated_data['action']

        # Try membership first.
        membership = (
            TeamMember.objects
            .select_for_update()
            .filter(pk=pk, student=request.user, status=TeamMember.Status.PENDING)
            .first()
        )
        if membership is not None:
            return self._respond_membership(membership, action_choice, request)

        supervisor_link = (
            TeamSupervisor.objects
            .select_for_update()
            .filter(pk=pk, supervisor=request.user, status=TeamSupervisor.Status.PENDING)
            .first()
        )
        if supervisor_link is not None:
            return self._respond_supervisor(supervisor_link, action_choice)

        return Response(
            {'detail': 'No pending invitation found with the given id.'},
            status=status.HTTP_404_NOT_FOUND,
        )

    def _respond_membership(self, membership: TeamMember, action_choice: str, request):
        team = membership.team

        if action_choice == 'REJECT':
            membership.status = TeamMember.Status.REJECTED
            membership.joined_at = None
            membership.save(update_fields=['status', 'joined_at', 'updated_at'])
            return Response(TeamMemberSerializer(membership).data, status=status.HTTP_200_OK)

        # ACCEPT path
        if _accepted_member_count(team) >= team.max_capacity:
            return Response(
                {'detail': 'Team has reached its max capacity.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if team.is_locked:
            return Response(
                {'detail': 'Team is locked.'},
                status=status.HTTP_423_LOCKED,
            )

        membership.status = TeamMember.Status.ACCEPTED
        membership.joined_at = timezone.now()
        membership.save(update_fields=['status', 'joined_at', 'updated_at'])
        return Response(
            TeamMemberSerializer(membership).data,
            status=status.HTTP_200_OK,
        )

    def _respond_supervisor(self, link: TeamSupervisor, action_choice: str):
        if action_choice == 'REJECT':
            link.status = TeamSupervisor.Status.REJECTED
            link.responded_at = timezone.now()
            link.save(update_fields=['status', 'responded_at', 'updated_at'])
            return Response(TeamSupervisorSerializer(link).data, status=status.HTTP_200_OK)

        # ACCEPT path (graduation only: capacity check)
        team = link.team
        if team.project_type == Team.ProjectType.GRADUATION:
            profile = getattr(link.supervisor, 'supervisor_profile', None)
            max_cap = profile.max_team_capacity if profile else None
            if max_cap is not None and _active_teams_for_supervisor_count(link.supervisor) >= max_cap:
                return Response(
                    {'detail': 'Supervisor has reached max team capacity.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        link.status = TeamSupervisor.Status.ACCEPTED
        link.responded_at = timezone.now()
        link.save(update_fields=['status', 'responded_at', 'updated_at'])
        return Response(
            TeamSupervisorSerializer(link).data,
            status=status.HTTP_200_OK,
        )


# ===========================================================================
# Helper mixins for team-scoped viewsets
# ===========================================================================


def _resolve_team_id_from_kwargs(kwargs: dict) -> int | None:
    """Pull a team_id from URL kwargs regardless of nesting depth."""
    for key in ('team_id', 'team_pk', 'team_lookup_id', 'pk'):
        val = kwargs.get(key)
        if val is not None:
            try:
                return int(val)
            except (TypeError, ValueError):
                return None
    return None


class _TeamScopedMixin:
    """Common plumbing for nested team-scoped viewsets.

    Resolves the team from URL kwargs and filters the queryset
    accordingly. Subclasses must define ``scope_model`` and may
    override ``scope_filter_kwargs``.
    """

    scope_model = None  # set on subclass
    scope_filter_kwargs = {'team_id': 'team_id'}

    def _get_team(self):
        team_id = _resolve_team_id_from_kwargs(self.kwargs)
        if team_id is None:
            return None
        return Team.active_objects.filter(pk=team_id).first()

    def get_queryset(self):
        team = self._get_team()
        if team is None:
            return self.scope_model.objects.none()
        return (
            self.scope_model.objects
            .filter(team=team)
            .select_related(*self._scope_select_related())
        )

    def _scope_select_related(self) -> tuple:
        return ()

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['team'] = self._get_team()
        return ctx

    def perform_create(self, serializer):
        team = self._get_team()
        if team is None:
            raise ValidationError({'team': 'Could not resolve team from URL.'})
        extra = {}
        if isinstance(serializer.instance, type(None)) is False and hasattr(self, '_create_extras'):
            extra = self._create_extras(serializer.validated_data, team)
        save_kwargs = {'team': team, **extra}
        # Track the creator for audit fields when present.
        request = self.context.get('request') if hasattr(self, 'context') else None
        if request is None:
            request = serializer.context.get('request')
        # Some subclasses (Task) accept assignee_ids; the serializer
        # handles M2M assignment after save via the standard pattern.
        serializer.save(**save_kwargs)

    def check_object_permissions(self, request, obj):
        # Delegate to the team's per-action permission classes.
        super().check_object_permissions(request, obj)


# ===========================================================================
# TaskViewSet
# ===========================================================================


class TaskViewSet(_TeamScopedMixin, viewsets.ModelViewSet):
    """CRUD for :class:`Task` plus ``transition`` and ``reorder`` actions."""

    scope_model = Task
    serializer_class = TaskSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsTeamMemberOrSupervisor,
    ]

    def _scope_select_related(self) -> tuple:
        return ('sprint', 'phase', 'created_by')

    def get_permissions(self):
        if self.action in {'update', 'partial_update', 'destroy',
                           'transition', 'reorder'}:
            return [permissions.IsAuthenticated(), IsTeamMember()]
        return super().get_permissions()

    def perform_create(self, serializer):
        team = self._get_team()
        if team is None:
            raise ValidationError({'team': 'Could not resolve team from URL.'})
        serializer.save(team=team, created_by=self.request.user)

    @action(detail=True, methods=['post'], url_path='transition')
    def transition(self, request, pk=None):
        """Move a task to a new status, enforcing WIP limits from board_config."""
        task = self.get_object()
        serializer = TaskTransitionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        new_status = serializer.validated_data['status']

        team = task.team
        board = team.board_config or {}
        target_column_id = self._status_to_column_id(new_status)
        columns = {c.get('id'): c for c in board.get('columns', [])}
        target_col = columns.get(target_column_id) if columns else None
        if target_col and target_col.get('wip_limit'):
            # Count tasks currently sitting in this column (any status
            # that maps to it, except the moving task).
            wip_statuses = self._column_to_statuses(target_column_id)
            in_column = Task.objects.filter(
                team=team, status__in=wip_statuses
            ).exclude(pk=task.pk).count()
            if in_column >= target_col['wip_limit']:
                return Response(
                    {
                        'detail': (
                            f"WIP limit reached for column "
                            f"'{target_col.get('name', target_column_id)}' "
                            f"({in_column}/{target_col['wip_limit']})."
                        )
                    },
                    status=status.HTTP_409_CONFLICT,
                )

        task.status = new_status
        if new_status == Task.Status.DONE:
            task.completed_at = timezone.now()
        else:
            task.completed_at = None
        task.save(update_fields=['status', 'completed_at', 'updated_at'])
        return Response(TaskSerializer(task).data)

    @staticmethod
    def _status_to_column_id(status: str) -> str:
        return {
            Task.Status.TODO: 'todo',
            Task.Status.IN_PROGRESS: 'in_progress',
            Task.Status.IN_REVIEW: 'review',
            Task.Status.BLOCKED: 'in_progress',
            Task.Status.DONE: 'done',
        }.get(status, 'todo')

    @staticmethod
    def _column_to_statuses(column_id: str) -> list:
        return {
            'todo': [Task.Status.TODO],
            'in_progress': [Task.Status.IN_PROGRESS, Task.Status.BLOCKED],
            'review': [Task.Status.IN_REVIEW],
            'done': [Task.Status.DONE],
        }.get(column_id, [])

    @action(detail=False, methods=['post'], url_path='reorder')
    def reorder(self, request):
        """Reorder tasks within a column.

        Payload: ``{"order": [task_id_1, task_id_2, ...]}``. IDs not in
        the team are silently ignored. ``order`` is set by index, then
        saved.
        """
        serializer = TaskReorderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ids = serializer.validated_data['order']
        team = self._get_team()
        if team is None:
            raise ValidationError({'team': 'Could not resolve team from URL.'})
        with transaction.atomic():
            tasks = {
                t.pk: t for t in
                Task.objects.select_for_update().filter(team=team, pk__in=ids)
            }
            for index, task_id in enumerate(ids):
                if task_id in tasks:
                    tasks[task_id].order = index
            Task.objects.bulk_update(tasks.values(), ['order'])
        return Response({'updated': len(tasks)})


# ===========================================================================
# DeliverableViewSet
# ===========================================================================


class DeliverableViewSet(_TeamScopedMixin, viewsets.ModelViewSet):
    """CRUD for :class:`Deliverable` plus ``complete`` and ``approve``."""

    scope_model = Deliverable
    serializer_class = DeliverableSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeamMemberOrSupervisor]

    def _scope_select_related(self) -> tuple:
        return ('sprint', 'phase', 'completed_by', 'approved_by')

    def get_permissions(self):
        if self.action in {'update', 'partial_update', 'destroy'}:
            return [permissions.IsAuthenticated(), IsTeamMember()]
        if self.action == 'approve':
            return [permissions.IsAuthenticated(), IsTeamSupervisor()]
        return super().get_permissions()

    @action(detail=True, methods=['post'], url_path='complete')
    def complete(self, request, pk=None):
        """Mark a deliverable as COMPLETED. Any accepted member can do this."""
        deliverable = self.get_object()
        if deliverable.status in (
            Deliverable.Status.COMPLETED, Deliverable.Status.APPROVED,
        ):
            return Response(
                {'detail': 'Deliverable is already completed/approved.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        deliverable.status = Deliverable.Status.COMPLETED
        deliverable.completed_at = timezone.now()
        deliverable.completed_by = request.user
        deliverable.save(update_fields=[
            'status', 'completed_at', 'completed_by', 'updated_at',
        ])
        return Response(DeliverableSerializer(deliverable).data)

    @action(detail=True, methods=['post'], url_path='approve')
    def approve(self, request, pk=None):
        """Accepted supervisor approves a COMPLETED deliverable.

        One-way: APPROVED is sticky. To reject, the supervisor uses
        the Feedback model with kind=REJECTION instead.
        """
        deliverable = self.get_object()
        if deliverable.status != Deliverable.Status.COMPLETED:
            return Response(
                {'detail': 'Only completed deliverables can be approved.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        deliverable.status = Deliverable.Status.APPROVED
        deliverable.approved_at = timezone.now()
        deliverable.approved_by = request.user
        deliverable.save(update_fields=[
            'status', 'approved_at', 'approved_by', 'updated_at',
        ])
        return Response(DeliverableSerializer(deliverable).data)


# ===========================================================================
# SprintViewSet
# ===========================================================================


class SprintViewSet(_TeamScopedMixin, viewsets.ModelViewSet):
    """CRUD for :class:`Sprint` plus ``start`` and ``complete`` actions."""

    scope_model = Sprint
    serializer_class = SprintSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeamMemberOrSupervisor]

    def get_permissions(self):
        if self.action in {'update', 'partial_update', 'destroy', 'start'}:
            return [permissions.IsAuthenticated(), IsTeamLeader()]
        return super().get_permissions()

    @action(detail=True, methods=['post'], url_path='start')
    @transaction.atomic
    def start(self, request, pk=None):
        sprint = self.get_object()
        if sprint.status != Sprint.Status.UPCOMING:
            return Response(
                {'detail': 'Only UPCOMING sprints can be started.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # Atomic flip: any current ACTIVE → COMPLETED, this → ACTIVE.
        Sprint.objects.select_for_update().filter(
            team=sprint.team, status=Sprint.Status.ACTIVE
        ).exclude(pk=sprint.pk).update(
            status=Sprint.Status.COMPLETED, updated_at=timezone.now(),
        )
        sprint.status = Sprint.Status.ACTIVE
        sprint.save(update_fields=['status', 'updated_at'])
        return Response(SprintSerializer(sprint).data)

    @action(detail=True, methods=['post'], url_path='complete')
    @transaction.atomic
    def complete(self, request, pk=None):
        sprint = self.get_object()
        if sprint.status != Sprint.Status.ACTIVE:
            return Response(
                {'detail': 'Only ACTIVE sprints can be completed.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        sprint.status = Sprint.Status.COMPLETED
        sprint.save(update_fields=['status', 'updated_at'])
        return Response(SprintSerializer(sprint).data)


# ===========================================================================
# PhaseViewSet
# ===========================================================================


class PhaseViewSet(_TeamScopedMixin, viewsets.ModelViewSet):
    """CRUD for :class:`Phase` plus ``reorder``."""

    scope_model = Phase
    serializer_class = PhaseSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeamMemberOrSupervisor]

    def get_permissions(self):
        if self.action in {'update', 'partial_update', 'destroy', 'reorder'}:
            return [permissions.IsAuthenticated(), IsTeamLeader()]
        return super().get_permissions()

    @action(detail=False, methods=['post'], url_path='reorder')
    @transaction.atomic
    def reorder(self, request):
        serializer = PhaseReorderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ids = serializer.validated_data['order']
        team = self._get_team()
        if team is None:
            raise ValidationError({'team': 'Could not resolve team from URL.'})
        phases = {
            p.pk: p for p in
            Phase.objects.select_for_update().filter(team=team, pk__in=ids)
        }
        for index, phase_id in enumerate(ids):
            if phase_id in phases:
                phases[phase_id].order = index
        Phase.objects.bulk_update(phases.values(), ['order'])
        return Response({'updated': len(phases)})


# ===========================================================================
# FeedbackViewSet
# ===========================================================================


class FeedbackViewSet(_TeamScopedMixin, viewsets.ModelViewSet):
    """CRUD for :class:`Feedback`. Read for members+supervisors; write for both."""

    scope_model = Feedback
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeamMemberOrSupervisor]
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

    def _scope_select_related(self) -> tuple:
        return ('author', 'target_content_type')

    def get_permissions(self):
        if self.action in {'update', 'partial_update', 'destroy'}:
            # Only the author (or a leader) can mutate; we do a finer
            # check in perform_update / perform_destroy.
            return [permissions.IsAuthenticated()]
        return super().get_permissions()

    def get_queryset(self):
        qs = super().get_queryset()
        params = self.request.query_params
        if params.get('kind'):
            qs = qs.filter(kind=params['kind'])
        if params.get('target_type'):
            from django.contrib.contenttypes.models import ContentType
            try:
                app_label, model = params['target_type'].split('.', 1)
                ct = ContentType.objects.get(app_label=app_label, model=model)
                qs = qs.filter(target_content_type=ct)
            except (ValueError, ContentType.DoesNotExist):
                qs = qs.none()
        return qs

    def perform_create(self, serializer):
        team = self._get_team()
        if team is None:
            raise ValidationError({'team': 'Could not resolve team from URL.'})
        # Only accepted supervisors and accepted members can post
        # feedback on team resources.
        user = self.request.user
        is_member = TeamMember.objects.filter(
            team=team, student=user, status=TeamMember.Status.ACCEPTED,
        ).exists()
        is_supervisor = TeamSupervisor.objects.filter(
            team=team, supervisor=user, status=TeamSupervisor.Status.ACCEPTED,
        ).exists()
        if not (is_member or is_supervisor):
            raise permissions.exceptions.PermissionDenied(
                'Only accepted members or supervisors can post feedback.'
            )
        serializer.save(team=team, author=user)

    def perform_update(self, serializer):
        feedback = self.get_object()
        if feedback.author_id != self.request.user.id and not IsTeamLeader().user_has_team_role(
            self.request.user, feedback.team
        ):
            raise permissions.exceptions.PermissionDenied(
                'Only the author or the team leader can edit feedback.'
            )
        serializer.save()

    def perform_destroy(self, instance):
        if instance.author_id != self.request.user.id and not IsTeamLeader().user_has_team_role(
            self.request.user, instance.team
        ):
            raise permissions.exceptions.PermissionDenied(
                'Only the author or the team leader can delete feedback.'
            )
        instance.delete()


# ===========================================================================
# SubmissionViewSet
# ===========================================================================


class SubmissionViewSet(_TeamScopedMixin, viewsets.ModelViewSet):
    """Read+update the team's :class:`Submission`."""

    scope_model = Submission
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeamMemberOrSupervisor]
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

    def get_permissions(self):
        if self.action in {'create', 'update', 'partial_update', 'destroy'}:
            return [permissions.IsAuthenticated(), IsTeamMember()]
        if self.action == 'grade':
            return [permissions.IsAuthenticated(), IsTeamSupervisor()]
        return super().get_permissions()

    def get_object(self):
        # The submission is unique-per-team, so URL pk is the team pk.
        team = self._get_team()
        if team is None:
            raise ValidationError({'team': 'Could not resolve team from URL.'})
        submission, _ = Submission.objects.get_or_create(team=team)
        return submission

    def perform_create(self, serializer):
        team = self._get_team()
        if team is None:
            raise ValidationError({'team': 'Could not resolve team from URL.'})
        submission, _ = Submission.objects.get_or_create(team=team)
        for field, value in serializer.validated_data.items():
            setattr(submission, field, value)
        submission.submitted_at = timezone.now()
        submission.save()
        # Return the updated object via the response cycle
        serializer.instance = submission

    @action(detail=False, methods=['post'], url_path='grade')
    @transaction.atomic
    def grade(self, request):
        team = self._get_team()
        if team is None:
            raise ValidationError({'team': 'Could not resolve team from URL.'})
        final_grade = request.data.get('final_grade')
        feedback_summary = request.data.get('feedback_summary', '')
        if final_grade is None:
            return Response(
                {'detail': 'final_grade is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        submission, _ = Submission.objects.get_or_create(team=team)
        submission.final_grade = final_grade
        submission.feedback_summary = feedback_summary
        submission.graded_at = timezone.now()
        submission.graded_by = request.user
        submission.save(update_fields=[
            'final_grade', 'feedback_summary',
            'graded_at', 'graded_by', 'updated_at',
        ])
        return Response(SubmissionSerializer(submission).data)


# ===========================================================================
# Team dashboard aggregate
# ===========================================================================


class TeamDashboardView(APIView):
    """One round-trip payload powering the project dashboard.

    Returns data shaped by the team's philosophy so the frontend
    does not have to switch on methodology client-side.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, team_id: int):
        team = (
            Team.active_objects
            .filter(pk=team_id)
            .select_related('term', 'subject')
            .prefetch_related(
                'teammember_set__student',
                'teamsupervisor_set__supervisor',
            )
            .first()
        )
        if team is None:
            return Response({'detail': 'Team not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Authorization: member, supervisor, or staff.
        user = request.user
        is_member = team.teammember_set.filter(
            student=user, status=TeamMember.Status.ACCEPTED,
        ).exists()
        is_supervisor = team.teamsupervisor_set.filter(
            supervisor=user, status=TeamSupervisor.Status.ACCEPTED,
        ).exists()
        if not (is_member or is_supervisor or user.is_staff):
            return Response(
                {'detail': 'You do not have access to this team.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        tasks = team.tasks.select_related('sprint', 'phase', 'created_by').prefetch_related('assignees')
        deliverables = team.deliverables.select_related('sprint', 'phase', 'completed_by', 'approved_by')
        sprints = team.sprints.all()
        phases = team.phases.all()
        feedback = team.feedback.select_related('author', 'target_content_type').order_by('-created_at')[:50]

        payload = {
            'team': TeamSerializer(team, context={'request': request}).data,
            'philosophy': team.philosophy,
            'counts': {
                'tasks': tasks.count(),
                'tasks_done': tasks.filter(status=Task.Status.DONE).count(),
                'deliverables': deliverables.count(),
                'deliverables_completed': deliverables.filter(
                    status__in=[Deliverable.Status.COMPLETED, Deliverable.Status.APPROVED]
                ).count(),
                'sprints': sprints.count(),
                'sprints_active': sprints.filter(status=Sprint.Status.ACTIVE).count(),
                'phases': phases.count(),
                'phases_completed': phases.filter(status=Phase.Status.COMPLETED).count(),
            },
            'tasks': TaskSerializer(tasks, many=True).data,
            'deliverables': DeliverableSerializer(deliverables, many=True).data,
            'sprints': SprintSerializer(sprints, many=True).data,
            'phases': PhaseSerializer(phases, many=True).data,
            'feedback': FeedbackSerializer(feedback, many=True).data,
        }

        # Methodology-specific next step.
        if team.philosophy == Team.Philosophy.MILESTONE:
            next_phase = phases.filter(
                status__in=[Phase.Status.UPCOMING, Phase.Status.IN_PROGRESS]
            ).order_by('order').first()
            next_steps = []
            if next_phase is not None:
                next_steps = next_phase.deliverables.exclude(
                    status__in=[Deliverable.Status.COMPLETED, Deliverable.Status.APPROVED]
                ).order_by('order')[:3]
            payload['next_steps'] = {
                'phase': PhaseSerializer(next_phase).data if next_phase else None,
                'deliverables': DeliverableSerializer(next_steps, many=True).data,
            }
        elif team.philosophy == Team.Philosophy.SPRINT:
            active = sprints.filter(status=Sprint.Status.ACTIVE).first()
            payload['next_steps'] = {
                'sprint': SprintSerializer(active).data if active else None,
                'tasks': TaskSerializer(
                    tasks.filter(sprint=active).exclude(status=Task.Status.DONE)
                    if active else tasks.none(),
                    many=True,
                ).data,
            }
        else:
            payload['next_steps'] = {
                'in_progress': TaskSerializer(
                    tasks.filter(status=Task.Status.IN_PROGRESS), many=True
                ).data,
                'in_review': TaskSerializer(
                    tasks.filter(status=Task.Status.IN_REVIEW), many=True
                ).data,
            }
        return Response(payload)


# ===========================================================================
# select-methodology, transfer-leadership, kick, leave, complete
# ===========================================================================


# Per-methodology: which work-item kinds are incompatible when switching AWAY.
INCOMPATIBLE_KINDS_FOR_SWITCH: dict[str, dict[str, str]] = {
    Team.Philosophy.KANBAN: {
        'sprints': 'Sprints',
        'phases': 'Phases',
    },
    Team.Philosophy.SPRINT: {
        'phases': 'Phases',
    },
    Team.Philosophy.MILESTONE: {
        'sprints': 'Sprints',
    },
}


@action(detail=True, methods=['post'], url_path='select-methodology',
        throttle_classes=[MethodologySwitchThrottle])
@transaction.atomic
def select_methodology(self, request, pk=None):
    """Switch the team's work methodology.

    Refuses with 409 if any incompatible work-item kind is non-empty.
    Resets ``board_config`` to the new methodology's defaults in the
    same transaction.
    """
    team = self.get_object()
    serializer = SelectMethodologySerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    new_philosophy = serializer.validated_data['philosophy']

    if new_philosophy == team.philosophy:
        return Response(
            {'detail': 'Team is already using this methodology.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    blocked_by = []
    incompat = INCOMPATIBLE_KINDS_FOR_SWITCH.get(new_philosophy, {})
    if 'sprints' in incompat and team.sprints.exists():
        blocked_by.append({'kind': 'sprints', 'count': team.sprints.count()})
    if 'phases' in incompat and team.phases.exists():
        blocked_by.append({'kind': 'phases', 'count': team.phases.count()})
    if blocked_by:
        return Response(
            {'detail': 'Cannot switch methodology with active incompatible work items.',
             'blocked_by': blocked_by},
            status=status.HTTP_409_CONFLICT,
        )

    # Cascade-clear sprint/phase on existing tasks & deliverables to
    # keep invariants valid.
    team.tasks.update(sprint=None, phase=None)
    team.deliverables.update(sprint=None, phase=None)

    team.philosophy = new_philosophy
    team.board_config = default_board_config(new_philosophy)
    team.save(update_fields=['philosophy', 'board_config', 'updated_at'])
    return Response(TeamSerializer(team, context={'request': request}).data)


# Attach the select_methodology action to TeamViewSet outside the
# class body to keep the methods above readable. Done in two
# monkey-patch lines below.
TeamViewSet.select_methodology = select_methodology


@action(detail=True, methods=['post'], url_path='transfer-leadership',
        throttle_classes=[MembershipActionThrottle])
@transaction.atomic
def transfer_leadership(self, request, pk=None):
    team = self.get_object()
    serializer = TransferLeadershipSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    new_leader_id = serializer.validated_data['new_leader_membership_id']

    new_membership = (
        TeamMember.objects.select_for_update()
        .filter(pk=new_leader_id, team=team, status=TeamMember.Status.ACCEPTED)
        .first()
    )
    if new_membership is None:
        return Response(
            {'detail': 'Target membership is not an accepted member of this team.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    current_leader = (
        TeamMember.objects.select_for_update()
        .filter(team=team, role=TeamMember.Role.LEADER, status=TeamMember.Status.ACCEPTED)
        .first()
    )
    if current_leader is not None and current_leader.pk == new_membership.pk:
        return Response(
            {'detail': 'This member is already the leader.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if current_leader is not None:
        current_leader.role = TeamMember.Role.MEMBER
        current_leader.save(update_fields=['role', 'updated_at'])
    new_membership.role = TeamMember.Role.LEADER
    new_membership.save(update_fields=['role', 'updated_at'])

    return Response(
        {'detail': 'Leadership transferred.',
         'leader': TeamMemberSerializer(new_membership).data}
    )


TeamViewSet.transfer_leadership = transfer_leadership


@action(detail=True, methods=['delete'], url_path='members/(?P<member_id>[^/.]+)',
        throttle_classes=[MembershipActionThrottle])
@transaction.atomic
def kick_member(self, request, pk=None, member_id=None):
    team = self.get_object()
    target = (
        TeamMember.objects.select_for_update()
        .filter(pk=member_id, team=team, status=TeamMember.Status.ACCEPTED)
        .first()
    )
    if target is None:
        return Response(
            {'detail': 'Accepted membership not found.'},
            status=status.HTTP_404_NOT_FOUND,
        )
    if target.role == TeamMember.Role.LEADER:
        return Response(
            {'detail': 'Cannot kick the team leader. Transfer leadership first.'},
            status=status.HTTP_400_BAD_REQUEST,
        )
    target.status = TeamMember.Status.REJECTED
    target.save(update_fields=['status', 'updated_at'])
    return Response({'detail': 'Member removed from team.'})


TeamViewSet.kick_member = kick_member


@action(detail=True, methods=['post'], url_path='leave',
        throttle_classes=[MembershipActionThrottle])
@transaction.atomic
def leave_team(self, request, pk=None):
    team = self.get_object()
    user = request.user
    membership = (
        TeamMember.objects.select_for_update()
        .filter(team=team, student=user, status=TeamMember.Status.ACCEPTED)
        .first()
    )
    if membership is None:
        return Response(
            {'detail': 'You are not an accepted member of this team.'},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if membership.role == TeamMember.Role.LEADER:
        successor_id = request.data.get('new_leader_membership_id')
        if not successor_id:
            return Response(
                {'detail': 'Leader must transfer leadership before leaving. Provide new_leader_membership_id.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        successor = (
            TeamMember.objects.select_for_update()
            .filter(pk=successor_id, team=team, status=TeamMember.Status.ACCEPTED)
            .first()
        )
        if successor is None:
            return Response(
                {'detail': 'Successor membership not found.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        successor.role = TeamMember.Role.LEADER
        successor.save(update_fields=['role', 'updated_at'])
    membership.status = TeamMember.Status.REJECTED
    membership.save(update_fields=['status', 'updated_at'])
    return Response({'detail': 'You have left the team.'})


TeamViewSet.leave_team = leave_team


@action(detail=True, methods=['post'], url_path='complete')
@transaction.atomic
def complete_team(self, request, pk=None):
    team = self.get_object()
    if team.status == Team.Status.COMPLETED:
        return Response(
            {'detail': 'Team is already completed.'},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if team.philosophy == Team.Philosophy.MILESTONE:
        # All phases must be completed.
        incomplete = team.phases.exclude(status=Phase.Status.COMPLETED).count()
        if incomplete:
            return Response(
                {'detail': f'{incomplete} phase(s) still incomplete.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # All deliverables must be COMPLETED or APPROVED.
        incomplete_d = team.deliverables.exclude(
            status__in=[Deliverable.Status.COMPLETED, Deliverable.Status.APPROVED]
        ).count()
        if incomplete_d:
            return Response(
                {'detail': f'{incomplete_d} deliverable(s) still pending.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
    team.status = Team.Status.COMPLETED
    team.save(update_fields=['status', 'updated_at'])
    return Response(TeamSerializer(team, context={'request': request}).data)


TeamViewSet.complete_team = complete_team


@action(detail=True, methods=['post'], url_path='restore')
def restore_team(self, request, pk=None):
    team = self.get_object()
    if not team.is_deleted:
        return Response(
            {'detail': 'Team is not soft-deleted.'},
            status=status.HTTP_400_BAD_REQUEST,
        )
    team.restore()
    return Response(TeamSerializer(team, context={'request': request}).data)


TeamViewSet.restore_team = restore_team
