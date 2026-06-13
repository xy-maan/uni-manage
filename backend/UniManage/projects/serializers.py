"""
DRF serializers for the ``projects`` app.

Exposes:

* :class:`TeamSerializer` - main CRUD serializer with subject/project_type
  cross-field validation, auto-creates the requesting user as the team
  leader, and triggers ``unlock_and_require_reapproval()`` when a leader
  edits a locked team.
* :class:`TeamMemberSerializer` - read/write serializer for the join table.
* :class:`TeamSupervisorSerializer` - read/write serializer for supervisor
  links.
* :class:`TaskSerializer` / :class:`DeliverableSerializer` /
  :class:`SprintSerializer` / :class:`PhaseSerializer` /
  :class:`FeedbackSerializer` / :class:`SubmissionSerializer` - work-item
  and review serializers.
* Lightweight action serializers for invite/join/request-supervisor
  payloads and methodology switches.
"""

from __future__ import annotations

from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from .models import (
    AcademicTerm,
    Deliverable,
    Feedback,
    Phase,
    Sprint,
    Subject,
    Submission,
    Task,
    Team,
    TeamMember,
    TeamSupervisor,
)

User = get_user_model()


class TeamMemberSerializer(serializers.ModelSerializer):
    student_username = serializers.CharField(source='student.username', read_only=True)
    student_full_name = serializers.SerializerMethodField(read_only=True)
    student_avatar = serializers.URLField(source='student.avatar_url', read_only=True)

    class Meta:
        model = TeamMember
        fields = [
            'id',
            'team',
            'student',
            'student_username',
            'student_full_name',
            'student_avatar',
            'role',
            'status',
            'is_invite',
            'joined_at',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['team', 'joined_at', 'created_at', 'updated_at']

    def get_student_full_name(self, obj: TeamMember) -> str:
        full = obj.student.get_full_name()
        return full or obj.student.username


class TeamSupervisorSerializer(serializers.ModelSerializer):
    supervisor_username = serializers.CharField(source='supervisor.username', read_only=True)
    supervisor_full_name = serializers.SerializerMethodField(read_only=True)
    supervisor_title = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TeamSupervisor
        fields = [
            'id',
            'team',
            'supervisor',
            'supervisor_username',
            'supervisor_full_name',
            'supervisor_title',
            'role',
            'status',
            'responded_at',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['team', 'responded_at', 'created_at', 'updated_at']

    def get_supervisor_full_name(self, obj: TeamSupervisor) -> str:
        full = obj.supervisor.get_full_name()
        return full or obj.supervisor.username

    def get_supervisor_title(self, obj: TeamSupervisor) -> str | None:
        profile = getattr(obj.supervisor, 'supervisor_profile', None)
        return profile.title if profile else None


class AcademicTermSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicTerm
        fields = ['id', 'name', 'start_date', 'end_date', 'is_current']


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name', 'code', 'description']


class TeamSerializer(serializers.ModelSerializer):
    members = TeamMemberSerializer(source='teammember_set', many=True, read_only=True)
    supervisors = TeamSupervisorSerializer(source='teamsupervisor_set', many=True, read_only=True)
    member_count = serializers.SerializerMethodField(read_only=True)
    has_capacity = serializers.SerializerMethodField(read_only=True)
    current_user_role = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Team
        fields = [
            'id',
            'name',
            'project_type',
            'philosophy',
            'status',
            'description',
            'board_config',
            'is_locked',
            'is_recruiting',
            'max_capacity',
            'term',
            'subject',
            'members',
            'supervisors',
            'member_count',
            'has_capacity',
            'current_user_role',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'status',
            'philosophy',
            'created_at',
            'updated_at',
        ]

    # ----- computed fields -------------------------------------------------

    def get_member_count(self, obj: Team) -> int:
        return obj.teammember_set.filter(status=TeamMember.Status.ACCEPTED).count()

    def get_has_capacity(self, obj: Team) -> bool:
        return self.get_member_count(obj) < obj.max_capacity

    def get_current_user_role(self, obj: Team) -> str | None:
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return None
        membership = obj.teammember_set.filter(student=request.user).first()
        if not membership or membership.status != TeamMember.Status.ACCEPTED:
            return None
        return membership.role

    # ----- field-level validation -----------------------------------------

    def validate_name(self, value: str) -> str:
        value = (value or '').strip()
        if not value:
            raise serializers.ValidationError('Team name cannot be empty.')
        return value

    def validate(self, attrs: dict) -> dict:
        """Cross-field rule: COURSE needs a subject, GRADUATION must not have one."""
        project_type = attrs.get(
            'project_type',
            self.instance.project_type if self.instance else Team.ProjectType.COURSE,
        )
        subject = attrs.get(
            'subject',
            self.instance.subject if self.instance else None,
        )

        if project_type == Team.ProjectType.COURSE and subject is None:
            raise serializers.ValidationError(
                {'subject': 'A subject is required for COURSE projects.'}
            )
        if project_type == Team.ProjectType.GRADUATION and subject is not None:
            raise serializers.ValidationError(
                {'subject': 'Subject must be null for GRADUATION projects.'}
            )
        return attrs

    # ----- create ----------------------------------------------------------

    @transaction.atomic
    def create(self, validated_data: dict) -> Team:
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None
        if user is None:
            raise serializers.ValidationError('Authentication is required to create a team.')

        board_config = validated_data.pop('board_config', None) or {}
        team = Team.objects.create(
            **validated_data,
            status=Team.Status.FORMING,
            board_config=board_config,
        )

        TeamMember.objects.create(
            team=team,
            student=user,
            role=TeamMember.Role.LEADER,
            status=TeamMember.Status.ACCEPTED,
            is_invite=False,
            joined_at=timezone.now(),
        )
        return team

    # ----- update ----------------------------------------------------------

    def update(self, instance: Team, validated_data: dict) -> Team:
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None

        is_leader = False
        if user is not None:
            is_leader = TeamMember.objects.filter(
                team=instance,
                student=user,
                status=TeamMember.Status.ACCEPTED,
                role=TeamMember.Role.LEADER,
            ).exists()

        if not is_leader:
            raise serializers.ValidationError(
                {'detail': 'Only the team leader can modify a team.'}
            )

        # Detect edits to lock-sensitive fields on a locked team.
        lock_sensitive_fields = {'name', 'description'}
        touches_lock_sensitive = bool(
            instance.is_locked and (set(validated_data) & lock_sensitive_fields)
        )

        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()

        if touches_lock_sensitive:
            instance.unlock_and_require_reapproval()

        return instance


# ---------------------------------------------------------------------------
# Lightweight action serializers
# ---------------------------------------------------------------------------


class InviteStudentSerializer(serializers.Serializer):
    student_id = serializers.IntegerField()

    def validate_student_id(self, value: int) -> int:
        try:
            User.objects.get(pk=value)
        except User.DoesNotExist as exc:
            raise serializers.ValidationError('Student not found.') from exc
        return value


class JoinTeamSerializer(serializers.Serializer):
    """No payload; team is taken from the URL."""


class RequestSupervisorSerializer(serializers.Serializer):
    supervisor_id = serializers.IntegerField()
    role = serializers.ChoiceField(choices=TeamSupervisor.Role.choices)

    def validate_supervisor_id(self, value: int) -> int:
        try:
            supervisor = User.objects.get(pk=value)
        except User.DoesNotExist as exc:
            raise serializers.ValidationError('Supervisor not found.') from exc
        profile = getattr(supervisor, 'supervisor_profile', None)
        if profile is None:
            raise serializers.ValidationError('User is not registered as a supervisor.')
        return value


class InvitationResponseSerializer(serializers.Serializer):
    ACTION_CHOICES = (
        ('ACCEPT', 'Accept'),
        ('REJECT', 'Reject'),
    )
    action = serializers.ChoiceField(choices=ACTION_CHOICES)


class AvailableStudentSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField(read_only=True)
    student_id = serializers.CharField(
        source='student_profile.student_id', read_only=True
    )
    department = serializers.SerializerMethodField(read_only=True)
    academic_level = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'full_name',
            'email',
            'avatar_url',
            'student_id',
            'department',
            'academic_level',
        ]

    def get_full_name(self, obj: User) -> str:
        full = obj.get_full_name()
        return full or obj.username

    def get_department(self, obj: User) -> str | None:
        profile = getattr(obj, 'student_profile', None)
        return profile.department.name if profile and profile.department else None

    def get_academic_level(self, obj: User) -> str | None:
        profile = getattr(obj, 'student_profile', None)
        return profile.academic_level.name if profile and profile.academic_level else None


class AvailableSupervisorSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField(read_only=True)
    title = serializers.CharField(source='supervisor_profile.title', read_only=True)
    department = serializers.SerializerMethodField(read_only=True)
    max_team_capacity = serializers.IntegerField(
        source='supervisor_profile.max_team_capacity', read_only=True
    )
    active_team_count = serializers.IntegerField(read_only=True)
    has_capacity = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'full_name',
            'email',
            'avatar_url',
            'title',
            'department',
            'max_team_capacity',
            'active_team_count',
            'has_capacity',
        ]

    def get_full_name(self, obj: User) -> str:
        full = obj.get_full_name()
        return full or obj.username

    def get_department(self, obj: User) -> str | None:
        profile = getattr(obj, 'supervisor_profile', None)
        return profile.department.name if profile and profile.department else None

    def get_has_capacity(self, obj: User) -> bool:
        max_cap = getattr(obj.supervisor_profile, 'max_team_capacity', None) if hasattr(obj, 'supervisor_profile') else None
        active = getattr(obj, 'active_team_count', 0)
        if max_cap is None:
            return True
        return active < max_cap


# ---------------------------------------------------------------------------
# Work-item serializers
# ---------------------------------------------------------------------------


class _UserMiniSerializer(serializers.ModelSerializer):
    """Compact user payload for nested assignee / author fields."""

    full_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'avatar_url']
        read_only_fields = fields

    def get_full_name(self, obj: User) -> str:
        full = obj.get_full_name()
        return full or obj.username


class TaskSerializer(serializers.ModelSerializer):
    assignees = _UserMiniSerializer(many=True, read_only=True)
    assignee_ids = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, required=False,
        queryset=User.objects.all(), source='assignees',
    )
    created_by_username = serializers.CharField(
        source='created_by.username', read_only=True, default=None
    )
    column_id = serializers.SerializerMethodField(read_only=True)
    is_overdue = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Task
        fields = [
            'id', 'team', 'title', 'description', 'status', 'priority',
            'assignees', 'assignee_ids', 'labels', 'due_date', 'estimate',
            'order', 'parent_task', 'sprint', 'phase',
            'created_by', 'created_by_username', 'completed_at',
            'column_id', 'is_overdue',
            'created_at', 'updated_at',
        ]
        read_only_fields = [
            'team', 'created_by', 'completed_at', 'column_id', 'is_overdue',
            'created_at', 'updated_at',
        ]

    def get_column_id(self, obj: Task) -> str:
        """Map the task's status back to a column id from board_config."""
        mapping = {
            Task.Status.TODO: 'todo',
            Task.Status.IN_PROGRESS: 'in_progress',
            Task.Status.IN_REVIEW: 'review',
            Task.Status.BLOCKED: 'in_progress',
            Task.Status.DONE: 'done',
        }
        return mapping.get(obj.status, 'todo')

    def get_is_overdue(self, obj: Task) -> bool:
        return bool(
            obj.due_date and obj.status != Task.Status.DONE and obj.due_date < timezone.now().date()
        )

    def validate(self, attrs: dict) -> dict:
        team = self.context.get('team') or (
            self.instance.team if self.instance else None
        )
        if team is not None:
            philosophy = team.philosophy
            sprint = attrs.get('sprint', getattr(self.instance, 'sprint', None))
            phase = attrs.get('phase', getattr(self.instance, 'phase', None))
            if philosophy == Team.Philosophy.KANBAN and (sprint or phase):
                raise serializers.ValidationError(
                    'KANBAN teams cannot have sprint or phase on a task.'
                )
            if philosophy == Team.Philosophy.SPRINT and phase:
                raise serializers.ValidationError(
                    'SPRINT teams cannot have a phase on a task.'
                )
            if philosophy == Team.Philosophy.MILESTONE and sprint:
                raise serializers.ValidationError(
                    'MILESTONE teams cannot have a sprint on a task.'
                )
        return attrs


class DeliverableSerializer(serializers.ModelSerializer):
    completed_by_username = serializers.CharField(
        source='completed_by.username', read_only=True, default=None
    )
    approved_by_username = serializers.CharField(
        source='approved_by.username', read_only=True, default=None
    )

    class Meta:
        model = Deliverable
        fields = [
            'id', 'team', 'title', 'description', 'status',
            'due_date', 'order', 'sprint', 'phase',
            'completed_at', 'completed_by', 'completed_by_username',
            'approved_at', 'approved_by', 'approved_by_username',
            'created_at', 'updated_at',
        ]
        read_only_fields = [
            'team', 'completed_at', 'completed_by',
            'approved_at', 'approved_by',
            'created_at', 'updated_at',
        ]

    def validate(self, attrs: dict) -> dict:
        team = self.context.get('team') or (
            self.instance.team if self.instance else None
        )
        if team is not None:
            philosophy = team.philosophy
            sprint = attrs.get('sprint', getattr(self.instance, 'sprint', None))
            phase = attrs.get('phase', getattr(self.instance, 'phase', None))
            if philosophy == Team.Philosophy.KANBAN and (sprint or phase):
                raise serializers.ValidationError(
                    'KANBAN teams cannot have sprint or phase on a deliverable.'
                )
            if philosophy == Team.Philosophy.SPRINT and phase:
                raise serializers.ValidationError(
                    'SPRINT teams cannot have a phase on a deliverable.'
                )
            if philosophy == Team.Philosophy.MILESTONE and sprint:
                raise serializers.ValidationError(
                    'MILESTONE teams cannot have a sprint on a deliverable.'
                )
        return attrs


class SprintSerializer(serializers.ModelSerializer):
    days_remaining = serializers.SerializerMethodField(read_only=True)
    completion_pct = serializers.SerializerMethodField(read_only=True)
    task_count = serializers.SerializerMethodField(read_only=True)
    completed_task_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Sprint
        fields = [
            'id', 'team', 'name', 'goal', 'start_date', 'end_date',
            'status', 'order',
            'days_remaining', 'completion_pct', 'task_count', 'completed_task_count',
            'created_at', 'updated_at',
        ]
        read_only_fields = [
            'team', 'created_at', 'updated_at',
            'days_remaining', 'completion_pct',
            'task_count', 'completed_task_count',
        ]

    def _due(self, obj: Sprint):
        return (obj.end_date - timezone.now().date()).days

    def get_days_remaining(self, obj: Sprint) -> int:
        if obj.status != Sprint.Status.ACTIVE:
            return 0
        return self._due(obj)

    def get_completion_pct(self, obj: Sprint) -> float:
        total = obj.tasks.count()
        if total == 0:
            return 0.0
        done = obj.tasks.filter(status=Task.Status.DONE).count()
        return round((done / total) * 100, 1)

    def get_task_count(self, obj: Sprint) -> int:
        return obj.tasks.count()

    def get_completed_task_count(self, obj: Sprint) -> int:
        return obj.tasks.filter(status=Task.Status.DONE).count()


class PhaseSerializer(serializers.ModelSerializer):
    progress_pct = serializers.SerializerMethodField(read_only=True)
    deliverable_count = serializers.SerializerMethodField(read_only=True)
    completed_deliverable_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Phase
        fields = [
            'id', 'team', 'name', 'description', 'order',
            'start_date', 'due_date', 'status', 'completed_at',
            'progress_pct', 'deliverable_count', 'completed_deliverable_count',
            'created_at', 'updated_at',
        ]
        read_only_fields = [
            'team', 'completed_at', 'created_at', 'updated_at',
            'progress_pct', 'deliverable_count', 'completed_deliverable_count',
        ]

    def get_deliverable_count(self, obj: Phase) -> int:
        return obj.deliverables.count()

    def get_completed_deliverable_count(self, obj: Phase) -> int:
        return obj.deliverables.filter(
            status__in=[Deliverable.Status.COMPLETED, Deliverable.Status.APPROVED]
        ).count()

    def get_progress_pct(self, obj: Phase) -> float:
        total = self.get_deliverable_count(obj)
        if total == 0:
            return 0.0
        return round((self.get_completed_deliverable_count(obj) / total) * 100, 1)


class FeedbackSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(
        source='author.username', read_only=True, default=None
    )
    author_full_name = serializers.SerializerMethodField(read_only=True)
    target_type = serializers.SerializerMethodField(read_only=True)
    target_repr = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Feedback
        fields = [
            'id', 'team', 'author', 'author_username', 'author_full_name',
            'kind', 'body',
            'target_content_type', 'target_object_id',
            'target_type', 'target_repr',
            'created_at', 'updated_at',
        ]
        read_only_fields = [
            'team', 'author', 'created_at', 'updated_at',
            'target_type', 'target_repr',
        ]

    def get_author_full_name(self, obj: Feedback) -> str | None:
        if obj.author is None:
            return None
        full = obj.author.get_full_name()
        return full or obj.author.username

    def get_target_type(self, obj: Feedback) -> str | None:
        if obj.target_content_type is None:
            return None
        return f"{obj.target_content_type.app_label}.{obj.target_content_type.model}"

    def get_target_repr(self, obj: Feedback) -> str | None:
        return str(obj.target)[:200] if obj.target is not None else None

    def validate(self, attrs: dict) -> dict:
        ct = attrs.get('target_content_type') or (
            self.instance.target_content_type if self.instance else None
        )
        oid = attrs.get('target_object_id') or (
            self.instance.target_object_id if self.instance else None
        )
        if ct is None or oid is None:
            raise serializers.ValidationError(
                'target_content_type and target_object_id are required.'
            )
        # Constraint: target must belong to the same team (or BE the team).
        team = self.context.get('team') or (
            self.instance.team if self.instance else None
        )
        if team is not None:
            model_class = ct.model_class()
            if model_class is None:
                raise serializers.ValidationError('Unknown target type.')
            try:
                target_obj = model_class.objects.get(pk=oid)
            except model_class.DoesNotExist:
                raise serializers.ValidationError('Target object does not exist.')
            target_team_id = getattr(target_obj, 'team_id', None)
            if target_team_id is not None and target_team_id != team.id:
                raise serializers.ValidationError(
                    'Target object does not belong to this team.'
                )
            if isinstance(target_obj, Team) and target_obj.id != team.id:
                raise serializers.ValidationError(
                    'Target team does not match the feedback team.'
                )
        return attrs


class SubmissionSerializer(serializers.ModelSerializer):
    graded_by_username = serializers.CharField(
        source='graded_by.username', read_only=True, default=None
    )

    class Meta:
        model = Submission
        fields = [
            'id', 'team', 'final_grade', 'defense_date',
            'feedback_summary', 'submitted_at', 'graded_at', 'graded_by',
            'graded_by_username', 'created_at', 'updated_at',
        ]
        read_only_fields = [
            'team', 'submitted_at', 'graded_at', 'graded_by',
            'created_at', 'updated_at',
        ]


# ---------------------------------------------------------------------------
# Action / helper serializers
# ---------------------------------------------------------------------------


class SelectMethodologySerializer(serializers.Serializer):
    """Payload for POST /teams/{id}/select-methodology/."""

    philosophy = serializers.ChoiceField(choices=Team.Philosophy.choices)


class TaskTransitionSerializer(serializers.Serializer):
    """Payload for POST /teams/{id}/tasks/{tid}/transition/."""

    status = serializers.ChoiceField(choices=Task.Status.choices)


class TaskReorderSerializer(serializers.Serializer):
    """Payload for POST /teams/{id}/tasks/reorder/."""

    order = serializers.ListField(
        child=serializers.IntegerField(), allow_empty=False
    )


class TransferLeadershipSerializer(serializers.Serializer):
    """Payload for POST /teams/{id}/transfer-leadership/."""

    new_leader_membership_id = serializers.IntegerField()


class PhaseReorderSerializer(serializers.Serializer):
    """Payload for POST /teams/{id}/phases/reorder/."""

    order = serializers.ListField(
        child=serializers.IntegerField(), allow_empty=False
    )

