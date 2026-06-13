"""
Project management models for the university system.

Provides the core domain models for organizing student teams around
academic projects, including terms, subjects, teams, the many-to-many
membership/supervision join tables, and the methodology-specific
work-item models (Tasks, Sprints, Phases, Deliverables, Feedback,
Submissions).
"""

from __future__ import annotations

from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone

from simple_history.models import HistoricalRecords


# ---------------------------------------------------------------------------
# Taxonomy
# ---------------------------------------------------------------------------


class AcademicTerm(models.Model):
    """Represents an academic semester/term (e.g., ``Fall 2026``)."""

    name = models.CharField(max_length=50, unique=True)
    start_date = models.DateField()
    end_date = models.DateField()
    is_current = models.BooleanField(
        default=False,
        help_text="Flag indicating the active term. Only one term should have this set to True.",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-start_date',)
        verbose_name = 'Academic Term'
        verbose_name_plural = 'Academic Terms'

    def __str__(self) -> str:
        return self.name

    def clean(self):
        """Ensure ``is_current=True`` is unique across terms at the application level."""
        super().clean()
        if self.is_current:
            qs = AcademicTerm.objects.filter(is_current=True).exclude(pk=self.pk)
            if qs.exists():
                raise models.ValidationError(
                    {'is_current': 'Only one AcademicTerm can be marked as current.'}
                )


class Subject(models.Model):
    """An academic subject/course a team can be associated with."""

    name = models.CharField(max_length=150)
    code = models.CharField(max_length=30, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('code',)
        verbose_name = 'Subject'
        verbose_name_plural = 'Subjects'

    def __str__(self) -> str:
        return f"{self.code} - {self.name}"


# ---------------------------------------------------------------------------
# Team
# ---------------------------------------------------------------------------


class TeamManager(models.Manager):
    """Default manager for :class:`Team` returning all rows (including soft-deleted)."""

    def get_queryset(self) -> models.QuerySet:
        return super().get_queryset()


class ActiveTeamManager(models.Manager):
    """Manager exposing only non soft-deleted teams (``is_deleted=False``)."""

    def get_queryset(self) -> models.QuerySet:
        return super().get_queryset().filter(is_deleted=False)


# Default ``board_config`` for each methodology, used when a team is
# created and when ``select-methodology`` is invoked. Each column may
# include a ``wip_limit`` for kanban / sprint boards. Implemented as
# a function so the dict can reference ``Team.Philosophy`` after the
# class is defined.
def default_board_config(philosophy: str) -> dict:
    return {
        'KANBAN': {
            'columns': [
                {'id': 'backlog', 'name': 'Backlog', 'wip_limit': None},
                {'id': 'todo', 'name': 'To Do', 'wip_limit': None},
                {'id': 'in_progress', 'name': 'In Progress', 'wip_limit': 4},
                {'id': 'review', 'name': 'Review', 'wip_limit': 3},
                {'id': 'done', 'name': 'Done', 'wip_limit': None},
            ],
        },
        'SPRINT': {
            'columns': [
                {'id': 'todo', 'name': 'To Do', 'wip_limit': None},
                {'id': 'in_progress', 'name': 'In Progress', 'wip_limit': 5},
                {'id': 'done', 'name': 'Done', 'wip_limit': None},
            ],
        },
        'MILESTONE': {
            'columns': [
                {'id': 'pending', 'name': 'Pending', 'wip_limit': None},
                {'id': 'in_progress', 'name': 'In Progress', 'wip_limit': None},
                {'id': 'completed', 'name': 'Completed', 'wip_limit': None},
            ],
        },
    }.get(philosophy, {'columns': []})


class Team(models.Model):
    """A student team working on a course or graduation project."""

    class ProjectType(models.TextChoices):
        COURSE = 'COURSE', 'Course Project'
        GRADUATION = 'GRADUATION', 'Graduation Project'

    class Philosophy(models.TextChoices):
        KANBAN = 'KANBAN', 'Kanban'
        SPRINT = 'SPRINT', 'Sprint'
        MILESTONE = 'MILESTONE', 'Milestone'

    class Status(models.TextChoices):
        FORMING = 'FORMING', 'Forming'
        PENDING_SUPERVISORS = 'PENDING_SUPERVISORS', 'Pending Supervisors'
        ACTIVE = 'ACTIVE', 'Active'
        COMPLETED = 'COMPLETED', 'Completed'

    name = models.CharField(max_length=120, unique=True)
    project_type = models.CharField(
        max_length=20,
        choices=ProjectType.choices,
        default=ProjectType.COURSE,
    )
    philosophy = models.CharField(
        max_length=20,
        choices=Philosophy.choices,
        default=Philosophy.KANBAN,
    )
    status = models.CharField(
        max_length=30,
        choices=Status.choices,
        default=Status.FORMING,
    )
    description = models.TextField(blank=True)
    board_config = models.JSONField(
        default=dict,
        blank=True,
        help_text="Free-form JSON configuration for the team board (columns, swimlanes, etc).",
    )
    is_locked = models.BooleanField(
        default=False,
        help_text="When True, the team structure is locked and edits require re-approval.",
    )
    is_recruiting = models.BooleanField(
        default=True,
        help_text="Whether the team is currently open to new members.",
    )
    max_capacity = models.PositiveIntegerField(
        default=5,
        help_text="Maximum number of accepted student members.",
    )

    is_deleted = models.BooleanField(default=False, db_index=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    term = models.ForeignKey(
        AcademicTerm,
        on_delete=models.PROTECT,
        related_name='teams',
    )
    subject = models.ForeignKey(
        Subject,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='teams',
    )

    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        through='TeamMember',
        related_name='teams_as_member',
        blank=True,
    )
    supervisors = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        through='TeamSupervisor',
        related_name='teams_as_supervisor',
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    history = HistoricalRecords()

    objects = TeamManager()
    active_objects = ActiveTeamManager()

    class Meta:
        ordering = ('-created_at',)
        verbose_name = 'Team'
        verbose_name_plural = 'Teams'
        indexes = [
            models.Index(fields=['term', 'project_type']),
            models.Index(fields=['status']),
        ]

    def __str__(self) -> str:
        return self.name

    def soft_delete(self) -> None:
        """Mark the team as soft-deleted and stamp ``deleted_at``."""
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save(update_fields=['is_deleted', 'deleted_at', 'updated_at'])

    def restore(self) -> None:
        """Restore a soft-deleted team."""
        self.is_deleted = False
        self.deleted_at = None
        self.save(update_fields=['is_deleted', 'deleted_at', 'updated_at'])

    def accepted_members_count(self) -> int:
        """Return the count of accepted student members on the team."""
        return self.teammember_set.filter(status=TeamMember.Status.ACCEPTED).count()

    def unlock_and_require_reapproval(self) -> None:
        """Unlock the team and (if graduation) require supervisors to re-approve.

        - Always sets ``is_locked=False``.
        - For ``GRADUATION`` projects, sets status to ``PENDING_SUPERVISORS``
          and resets every supervisor's status back to ``PENDING``.
        """
        self.is_locked = False
        if self.project_type == self.ProjectType.GRADUATION:
            self.status = self.Status.PENDING_SUPERVISORS
            self.teamsupervisor_set.update(status=TeamSupervisor.Status.PENDING)
        self.save(update_fields=['is_locked', 'status', 'updated_at'])


class TeamMember(models.Model):
    """Through-model linking a student (User) to a :class:`Team`."""

    class Role(models.TextChoices):
        LEADER = 'LEADER', 'Leader'
        MEMBER = 'MEMBER', 'Member'

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        ACCEPTED = 'ACCEPTED', 'Accepted'
        REJECTED = 'REJECTED', 'Rejected'

    team = models.ForeignKey(
        Team,
        on_delete=models.CASCADE,
        related_name='teammember_set',
    )
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='teammembership_set',
    )
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.MEMBER,
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    is_invite = models.BooleanField(
        default=True,
        help_text="True when the row was created as a supervisor/leader invite, False on student self-join.",
    )
    team_project_type = models.CharField(
        max_length=20,
        choices=Team.ProjectType.choices,
        default=Team.ProjectType.COURSE,
        editable=False,
        help_text="Denormalized copy of team.project_type; required for the database-level uniqueness rule.",
    )
    team_is_deleted = models.BooleanField(
        default=False,
        editable=False,
        help_text="Denormalized copy of team.is_deleted; required for the database-level uniqueness rule.",
    )
    joined_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    history = HistoricalRecords()

    class Meta:
        verbose_name = 'Team Member'
        verbose_name_plural = 'Team Members'
        constraints = [
            models.UniqueConstraint(
                fields=['team', 'student'],
                name='uniq_teammember_team_student',
            ),
            models.UniqueConstraint(
                fields=['student'],
                condition=models.Q(
                    status='ACCEPTED',
                    team_is_deleted=False,
                    team_project_type=Team.ProjectType.GRADUATION,
                ),
                name='uniq_active_graduation_membership_per_student',
            ),
        ]
        indexes = [
            models.Index(fields=['student', 'status']),
        ]

    def __str__(self) -> str:
        return f"{self.student} in {self.team} ({self.status})"

    def save(self, *args, **kwargs):
        """Sync denormalized team fields before persisting."""
        if self.team_id:
            self.team_project_type = self.team.project_type
            self.team_is_deleted = self.team.is_deleted
        super().save(*args, **kwargs)


class TeamSupervisor(models.Model):
    """Through-model linking a supervisor (User) to a :class:`Team`."""

    class Role(models.TextChoices):
        DOCTOR = 'DOCTOR', 'Doctor'
        TA = 'TA', 'Teaching Assistant'

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        ACCEPTED = 'ACCEPTED', 'Accepted'
        REJECTED = 'REJECTED', 'Rejected'

    team = models.ForeignKey(
        Team,
        on_delete=models.CASCADE,
        related_name='teamsupervisor_set',
    )
    supervisor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='supervised_teams',
    )
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.DOCTOR,
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    responded_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    history = HistoricalRecords()

    class Meta:
        verbose_name = 'Team Supervisor'
        verbose_name_plural = 'Team Supervisors'
        constraints = [
            models.UniqueConstraint(
                fields=['team', 'supervisor'],
                name='uniq_teamsupervisor_team_supervisor',
            ),
        ]
        indexes = [
            models.Index(fields=['supervisor', 'status']),
        ]

    def __str__(self) -> str:
        return f"{self.supervisor} supervises {self.team} ({self.status})"


# ---------------------------------------------------------------------------
# Methodology-specific / universal work items
# ---------------------------------------------------------------------------


class _WorkItemMixin:
    """Shared clean() rules for ``Task`` and ``Deliverable``.

    A work item belongs to exactly one of these scopes:
      * KANBAN  — flat; sprint/phase MUST be null
      * SPRINT  — sprint SHOULD be set, phase MUST be null
      * MILESTONE — phase SHOULD be set, sprint MUST be null
    """

    def clean_sprint_phase_invariant(self) -> None:
        philosophy = self.team.philosophy if self.team_id else None
        sprint = getattr(self, 'sprint_id', None)
        phase = getattr(self, 'phase_id', None)

        if philosophy == Team.Philosophy.KANBAN:
            if sprint is not None or phase is not None:
                raise ValidationError(
                    'KANBAN teams cannot have sprint or phase on work items.'
                )
        elif philosophy == Team.Philosophy.SPRINT:
            if phase is not None:
                raise ValidationError('SPRINT teams cannot have phase on work items.')
        elif philosophy == Team.Philosophy.MILESTONE:
            if sprint is not None:
                raise ValidationError('MILESTONE teams cannot have sprint on work items.')


class Task(_WorkItemMixin, models.Model):
    """A unit of work on a team board."""

    class Status(models.TextChoices):
        TODO = 'TODO', 'To Do'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        IN_REVIEW = 'IN_REVIEW', 'In Review'
        BLOCKED = 'BLOCKED', 'Blocked'
        DONE = 'DONE', 'Done'

    class Priority(models.TextChoices):
        LOW = 'LOW', 'Low'
        MEDIUM = 'MEDIUM', 'Medium'
        HIGH = 'HIGH', 'High'
        URGENT = 'URGENT', 'Urgent'

    team = models.ForeignKey(
        Team, on_delete=models.CASCADE, related_name='tasks',
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.TODO,
    )
    priority = models.CharField(
        max_length=20, choices=Priority.choices, default=Priority.MEDIUM,
    )

    assignees = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='assigned_tasks',
        blank=True,
    )
    labels = models.JSONField(
        default=list, blank=True,
        help_text="Free-form labels/tags shown as chips on the card.",
    )
    due_date = models.DateField(null=True, blank=True)
    estimate = models.DecimalField(
        max_digits=6, decimal_places=2, null=True, blank=True,
        help_text="Story-point or hour estimate.",
    )
    order = models.PositiveIntegerField(
        default=0, db_index=True,
        help_text="Position within the column for drag/drop ordering.",
    )
    parent_task = models.ForeignKey(
        'self', on_delete=models.CASCADE, null=True, blank=True,
        related_name='subtasks',
    )

    sprint = models.ForeignKey(
        'Sprint', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='tasks',
    )
    phase = models.ForeignKey(
        'Phase', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='tasks',
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='created_tasks',
    )
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('order', 'id')
        indexes = [
            models.Index(fields=['team', 'status']),
            models.Index(fields=['team', 'sprint']),
            models.Index(fields=['team', 'phase']),
        ]
        verbose_name = 'Task'
        verbose_name_plural = 'Tasks'

    def __str__(self) -> str:
        return f"[{self.team.name}] {self.title}"

    def clean(self) -> None:
        super().clean()
        self.clean_sprint_phase_invariant()
        if self.parent_task_id and self.parent_task.team_id != self.team_id:
            raise ValidationError({'parent_task': 'Parent task must belong to the same team.'})


class Deliverable(_WorkItemMixin, models.Model):
    """A concrete output a team must produce. Universal across methodologies."""

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        COMPLETED = 'COMPLETED', 'Completed'
        APPROVED = 'APPROVED', 'Approved'
        REJECTED = 'REJECTED', 'Rejected'

    team = models.ForeignKey(
        Team, on_delete=models.CASCADE, related_name='deliverables',
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.PENDING,
    )
    due_date = models.DateField(null=True, blank=True)
    order = models.PositiveIntegerField(default=0, db_index=True)
    sprint = models.ForeignKey(
        'Sprint', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='deliverables',
    )
    phase = models.ForeignKey(
        'Phase', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='deliverables',
    )
    completed_at = models.DateTimeField(null=True, blank=True)
    completed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='completed_deliverables',
    )
    approved_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='approved_deliverables',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('order', 'id')
        indexes = [
            models.Index(fields=['team', 'status']),
            models.Index(fields=['team', 'sprint']),
            models.Index(fields=['team', 'phase']),
        ]
        verbose_name = 'Deliverable'
        verbose_name_plural = 'Deliverables'

    def __str__(self) -> str:
        return f"[{self.team.name}] {self.title}"

    def clean(self) -> None:
        super().clean()
        self.clean_sprint_phase_invariant()


class Sprint(models.Model):
    """A time-boxed iteration. Only meaningful for SPRINT philosophy."""

    class Status(models.TextChoices):
        UPCOMING = 'UPCOMING', 'Upcoming'
        ACTIVE = 'ACTIVE', 'Active'
        COMPLETED = 'COMPLETED', 'Completed'

    team = models.ForeignKey(
        Team, on_delete=models.CASCADE, related_name='sprints',
    )
    name = models.CharField(max_length=120)
    goal = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.UPCOMING,
    )
    order = models.PositiveIntegerField(default=0, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('order', 'start_date')
        constraints = [
            models.UniqueConstraint(
                fields=['team'],
                condition=models.Q(status='ACTIVE'),
                name='uniq_active_sprint_per_team',
            ),
        ]
        indexes = [
            models.Index(fields=['team', 'status']),
        ]
        verbose_name = 'Sprint'
        verbose_name_plural = 'Sprints'

    def __str__(self) -> str:
        return f"[{self.team.name}] {self.name}"

    def clean(self) -> None:
        super().clean()
        if self.team_id and self.team.philosophy != Team.Philosophy.SPRINT:
            raise ValidationError(
                'Sprints can only be created on teams using the SPRINT philosophy.'
            )
        if self.start_date and self.end_date and self.end_date < self.start_date:
            raise ValidationError({'end_date': 'Sprint end date must be on/after the start date.'})


class Phase(models.Model):
    """A milestone-style phase. Only meaningful for MILESTONE philosophy."""

    class Status(models.TextChoices):
        UPCOMING = 'UPCOMING', 'Upcoming'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        COMPLETED = 'COMPLETED', 'Completed'

    team = models.ForeignKey(
        Team, on_delete=models.CASCADE, related_name='phases',
    )
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0, db_index=True)
    start_date = models.DateField(null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.UPCOMING,
    )
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('order', 'id')
        indexes = [
            models.Index(fields=['team', 'status']),
        ]
        verbose_name = 'Phase'
        verbose_name_plural = 'Phases'

    def __str__(self) -> str:
        return f"[{self.team.name}] {self.name}"

    def clean(self) -> None:
        super().clean()
        if self.team_id and self.team.philosophy != Team.Philosophy.MILESTONE:
            raise ValidationError(
                'Phases can only be created on teams using the MILESTONE philosophy.'
            )


class Feedback(models.Model):
    """A supervisor comment / approval on a team resource.

    Targets: Team, Task, Deliverable, Phase (extensible to others).
    State changes (APPROVAL / REJECTION) live on the target itself;
    this model is the comment/audit trail.
    """

    class Kind(models.TextChoices):
        COMMENT = 'COMMENT', 'Comment'
        APPROVAL = 'APPROVAL', 'Approval'
        REJECTION = 'REJECTION', 'Rejection'
        REQUEST_CHANGES = 'REQUEST_CHANGES', 'Request Changes'

    team = models.ForeignKey(
        Team, on_delete=models.CASCADE, related_name='feedback',
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True,
        related_name='authored_feedback',
    )
    kind = models.CharField(max_length=20, choices=Kind.choices, default=Kind.COMMENT)
    body = models.TextField()

    target_content_type = models.ForeignKey(
        ContentType, on_delete=models.CASCADE, related_name='+',
    )
    target_object_id = models.PositiveBigIntegerField()
    target = GenericForeignKey('target_content_type', 'target_object_id')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-created_at',)
        indexes = [
            models.Index(fields=['team', 'kind']),
            models.Index(fields=['target_content_type', 'target_object_id']),
        ]
        verbose_name = 'Feedback'
        verbose_name_plural = 'Feedback'

    def __str__(self) -> str:
        return f"Feedback<{self.kind} by {self.author_id} on {self.target_type}>"


class Submission(models.Model):
    """Final submission / grade for a team."""

    team = models.OneToOneField(
        Team, on_delete=models.CASCADE, related_name='submission',
    )
    final_grade = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True,
        help_text="Final grade (e.g. 0-100 or 0-4 scale).",
    )
    defense_date = models.DateTimeField(null=True, blank=True)
    feedback_summary = models.TextField(blank=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    graded_at = models.DateTimeField(null=True, blank=True)
    graded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='graded_submissions',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Submission'
        verbose_name_plural = 'Submissions'

    def __str__(self) -> str:
        return f"Submission<team={self.team_id} grade={self.final_grade}>"
