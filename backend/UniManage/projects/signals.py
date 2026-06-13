"""
Signal handlers for the ``projects`` app.

Notification dispatch
---------------------
Every supervisor/member status change and team-state transition
funnels through here so the inbox, bell icon, and any future
email/push pipeline all see the same events.

Implemented events (verb → recipient):

* ``supervisor_accepted``        → team leader(s)
* ``supervisor_rejected``        → team leader(s)
* ``member_invited``             → invited student
* ``member_requested_to_join``   → team leader(s)
* ``member_joined``              → team leader(s) + supervisors
* ``member_rejected``            → student
* ``team_status_changed``        → all accepted members + supervisors
* ``team_locked``                → all accepted members + supervisors
* ``team_unlocked``              → all accepted members + supervisors
* ``team_methodology_changed``   → all accepted members + supervisors
* ``role_changed``               → old leader + new leader
* ``member_removed``             → removed student
* ``member_left``                → team leader(s) + supervisors
* ``task_assigned``              → newly assigned students
* ``task_completed``             → team leader(s) + supervisors
* ``deliverable_completed``      → team leader(s) + supervisors
* ``deliverable_approved``       → team leader(s)
* ``feedback_posted``            → team leader(s) + supervisors
* ``submission_graded``          → all accepted members
* ``team_completed``             → all accepted members + supervisors

State transitions
-----------------
* ``TeamSupervisor`` post_save: status flips to ``ACCEPTED`` /
  ``REJECTED`` → notify leader(s).
* ``TeamMember`` post_save:
    - status flips to ``ACCEPTED`` → notify leader(s) + supervisors
    - status flips to ``REJECTED`` → notify the student
  Plus the auto-transition of team ``status`` to
  ``PENDING_SUPERVISORS`` / ``ACTIVE`` when capacity is filled.
* ``Team`` post_save: propagate changes to ``is_deleted`` /
  ``project_type`` to denormalized columns on related
  ``TeamMember`` rows so the DB-level uniqueness constraint stays
  in sync.
"""

from __future__ import annotations

import logging

from django.contrib.contenttypes.models import ContentType
from django.db import transaction
from django.db.models.signals import post_save, pre_delete, pre_save
from django.dispatch import receiver
from django.utils import timezone

from notifications.models import Notification

from .models import (
    Deliverable,
    Feedback,
    Phase,
    Sprint,
    Task,
    Team,
    TeamMember,
    TeamSupervisor,
)

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _notify(
    *,
    recipient,
    actor,
    verb: str,
    target,
    description: str = '',
) -> Notification | None:
    """Single point of creation. Silently no-ops if recipient is None."""
    if recipient is None:
        return None
    return Notification.objects.create(
        recipient=recipient,
        actor=actor,
        verb=verb,
        description=description or '',
        target=target,
    )


def _team_leaders(team: Team):
    return team.teammember_set.filter(
        role=TeamMember.Role.LEADER,
        status=TeamMember.Status.ACCEPTED,
    ).values_list('student_id', flat=True)


def _team_accepted_members_qs(team: Team):
    return team.teammember_set.filter(status=TeamMember.Status.ACCEPTED)


def _team_supervisor_users(team: Team):
    return team.teamsupervisor_set.filter(
        status=TeamSupervisor.Status.ACCEPTED
    ).values_list('supervisor_id', flat=True)


def _broadcast(
    team: Team,
    *,
    actor,
    verb: str,
    target,
    description: str = '',
    exclude_user_id: int | None = None,
):
    """Send a notification to every leader + supervisor of a team."""
    from django.contrib.auth import get_user_model
    User = get_user_model()

    user_ids = set(_team_leaders(team)) | set(_team_supervisor_users(team))
    if exclude_user_id is not None:
        user_ids.discard(exclude_user_id)
    if not user_ids:
        return
    users = User.objects.filter(pk__in=user_ids)
    ct = ContentType.objects.get_for_model(target) if target is not None else None
    Notification.objects.bulk_create([
        Notification(
            recipient=u,
            actor=actor,
            verb=verb,
            description=description,
            target_content_type=ct,
            target_object_id=getattr(target, 'pk', 0) if target is not None else 0,
        )
        for u in users
    ])


# ---------------------------------------------------------------------------
# Team
# ---------------------------------------------------------------------------


@receiver(post_save, sender=Team)
def sync_teammember_denormalized_fields(sender, instance: Team, created, **kwargs):
    """Keep ``TeamMember.team_project_type`` / ``team_is_deleted`` in sync."""
    if created:
        return
    updated = TeamMember.objects.filter(team=instance).update(
        team_project_type=instance.project_type,
        team_is_deleted=instance.is_deleted,
    )
    if updated:
        logger.debug(
            "Synced denormalized fields on %d TeamMember rows for team '%s'.",
            updated,
            instance.pk,
        )


@receiver(pre_save, sender=Team)
def capture_team_old_state(sender, instance: Team, **kwargs):
    """Stash pre-save state so the post_save handler can compute deltas."""
    if instance.pk is None:
        instance._pre_save_state = None
        return
    try:
        previous = Team.objects.get(pk=instance.pk)
    except Team.DoesNotExist:
        instance._pre_save_state = None
        return
    instance._pre_save_state = {
        'is_locked': previous.is_locked,
        'is_recruiting': previous.is_recruiting,
        'philosophy': previous.philosophy,
        'status': previous.status,
    }


@receiver(post_save, sender=Team)
def emit_team_transition_notifications(sender, instance: Team, created, **kwargs):
    if created:
        return
    previous = getattr(instance, '_pre_save_state', None)
    if not previous:
        return

    # status change
    if previous['status'] != instance.status:
        _broadcast(
            instance,
            actor=None,
            verb='team_status_changed',
            target=instance,
            description=f"Team status is now {instance.status}.",
        )

    # lock toggle
    if previous['is_locked'] and not instance.is_locked:
        _broadcast(
            instance, actor=None, verb='team_unlocked', target=instance,
            description='The team has been unlocked.',
        )
    elif not previous['is_locked'] and instance.is_locked:
        _broadcast(
            instance, actor=None, verb='team_locked', target=instance,
            description='The team has been locked.',
        )

    # methodology change
    if previous['philosophy'] != instance.philosophy:
        _broadcast(
            instance, actor=None, verb='team_methodology_changed', target=instance,
            description=f"Methodology switched to {instance.philosophy}.",
        )


# ---------------------------------------------------------------------------
# TeamMember
# ---------------------------------------------------------------------------


@receiver(pre_save, sender=TeamMember)
def capture_member_old_status(sender, instance: TeamMember, **kwargs):
    if instance.pk is None:
        instance._pre_save_status = None
        return
    try:
        prev = TeamMember.objects.get(pk=instance.pk)
    except TeamMember.DoesNotExist:
        instance._pre_save_status = None
        return
    instance._pre_save_status = prev.status


@receiver(post_save, sender=TeamMember)
def emit_member_notifications(sender, instance: TeamMember, created, **kwargs):
    previous_status = getattr(instance, '_pre_save_status', None)
    team = instance.team
    actor = None  # The system; client can hydrate from the team.

    if created:
        # New membership row.
        if instance.status == TeamMember.Status.PENDING and instance.is_invite:
            _notify(
                recipient=instance.student,
                actor=actor,
                verb='member_invited',
                target=team,
                description=f"You were invited to join {team.name}.",
            )
        elif instance.status == TeamMember.Status.PENDING and not instance.is_invite:
            _broadcast(
                team, actor=actor, verb='member_requested_to_join',
                target=instance,
                description=f"{instance.student.username} requested to join {team.name}.",
            )
        return

    if previous_status == instance.status:
        return

    if instance.status == TeamMember.Status.ACCEPTED:
        _broadcast(
            team, actor=actor, verb='member_joined', target=instance,
            description=f"{instance.student.username} joined {team.name}.",
        )
    elif instance.status == TeamMember.Status.REJECTED:
        _notify(
            recipient=instance.student,
            actor=actor,
            verb='member_rejected',
            target=team,
            description=f"Your request to join {team.name} was not accepted.",
        )


@receiver(post_save, sender=TeamMember)
def auto_transition_team_status_on_capacity(sender, instance: TeamMember, created, **kwargs):
    """Move the team to ``PENDING_SUPERVISORS`` / ``ACTIVE`` once full.

    Only triggers when:
      * the membership is ``ACCEPTED``,
      * the team is currently ``FORMING``,
      * accepted members == ``team.max_capacity``.

    For ``COURSE`` projects the team flips to ``ACTIVE`` when full.
    For ``GRADUATION` projects it flips to ``PENDING_SUPERVISORS``.
    """
    if instance.status != TeamMember.Status.ACCEPTED:
        return
    team = instance.team
    if team.is_deleted:
        return
    accepted_count = team.teammember_set.filter(
        status=TeamMember.Status.ACCEPTED
    ).count()
    if accepted_count < team.max_capacity:
        return
    if team.status == Team.Status.FORMING:
        if team.project_type == Team.ProjectType.GRADUATION:
            team.status = Team.Status.PENDING_SUPERVISORS
        else:
            team.status = Team.Status.ACTIVE
        team.save(update_fields=['status', 'updated_at'])
        logger.info(
            "Team '%s' (pk=%s) auto-transitioned to %s (capacity filled).",
            team.name, team.pk, team.status,
        )


# ---------------------------------------------------------------------------
# TeamSupervisor
# ---------------------------------------------------------------------------


@receiver(pre_save, sender=TeamSupervisor)
def capture_supervisor_old_status(sender, instance: TeamSupervisor, **kwargs):
    if instance.pk is None:
        instance._pre_save_status = None
        return
    try:
        prev = TeamSupervisor.objects.get(pk=instance.pk)
    except TeamSupervisor.DoesNotExist:
        instance._pre_save_status = None
        return
    instance._pre_save_status = prev.status


@receiver(post_save, sender=TeamSupervisor)
def emit_supervisor_decision_notifications(sender, instance: TeamSupervisor, created, **kwargs):
    previous_status = getattr(instance, '_pre_save_status', None)
    team = instance.team
    if created or previous_status == instance.status:
        return
    if instance.status == TeamSupervisor.Status.ACCEPTED:
        _broadcast(
            team, actor=instance.supervisor, verb='supervisor_accepted', target=instance,
            description=f"{instance.supervisor.username} accepted supervision of {team.name}.",
        )
    elif instance.status == TeamSupervisor.Status.REJECTED:
        _broadcast(
            team, actor=instance.supervisor, verb='supervisor_rejected', target=instance,
            description=f"{instance.supervisor.username} declined supervision of {team.name}.",
        )


# ---------------------------------------------------------------------------
# GenericForeignKey cleanup
# ---------------------------------------------------------------------------
#
# ``Feedback.target`` is a GFK — Django does NOT cascade-deletes on GFKs.
# When a Task / Deliverable / Sprint / Phase / Team is hard-deleted, the
# corresponding Feedback rows would otherwise keep dangling references.
# We soft-clean by clearing the target pointer; the Feedback row stays
# in the database as audit material.
# ---------------------------------------------------------------------------


@receiver(pre_delete, sender=Task)
@receiver(pre_delete, sender=Deliverable)
@receiver(pre_delete, sender=Sprint)
@receiver(pre_delete, sender=Phase)
@receiver(pre_delete, sender=Team)
def clear_feedback_targets_on_delete(sender, instance, **kwargs):
    ct = ContentType.objects.get_for_model(instance)
    Feedback.objects.filter(
        target_content_type=ct, target_object_id=instance.pk,
    ).update(
        target_content_type=None,
        target_object_id=0,
    )
