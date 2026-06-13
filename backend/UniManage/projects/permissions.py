"""
Custom DRF permission classes for the ``projects`` app.

These permissions are designed to work in two contexts:

1. **Object-level** (default DRF): when the view calls
   ``check_object_permissions`` on a model instance, the permission
   inspects ``obj`` directly. For child resources (Task, Sprint, etc.)
   the instance does not itself carry a ``team`` attribute as a local
   field — the base class walks the instance's fields to find the
   FK to ``Team`` and follows it.

2. **URL-level**: for ``@action`` endpoints like ``/teams/{id}/invite/``
   the instance is looked up from the ``team_id``/``pk`` URL kwarg
   when ``obj`` is not supplied. The lookup uses the active
   queryset (excludes soft-deleted).
"""

from __future__ import annotations

from rest_framework import permissions

from .models import Team, TeamMember, TeamSupervisor


def _get_team_from_request(view, obj=None) -> Team | None:
    """Resolve the :class:`Team` instance the permission should check against."""
    if obj is not None and isinstance(obj, Team):
        return obj
    lookup_url_kwarg = view.lookup_url_kwarg or view.lookup_field or 'pk'
    team_id = view.kwargs.get(lookup_url_kwarg) or view.kwargs.get('team_id')
    if team_id is None:
        return None
    try:
        return Team.active_objects.get(pk=team_id)
    except (Team.DoesNotExist, ValueError):
        return None


def _resolve_team_from_obj(obj) -> Team | None:
    """Walk a child object's FKs to find the owning :class:`Team`.

    Used when a permission is checked against a Task, Sprint, Phase,
    Deliverable, Feedback, etc. — any child resource that ultimately
    hangs off a team. Returns None if the object is a Team itself
    (the caller should special-case that).
    """
    if obj is None:
        return None
    if isinstance(obj, Team):
        return obj
    # Direct FK to Team
    team_id = getattr(obj, 'team_id', None)
    if team_id is not None:
        try:
            return Team.active_objects.get(pk=team_id)
        except Team.DoesNotExist:
            return None
    # Fallback: scan the field tree for a FK to projects.Team.
    for field in obj._meta.get_fields():
        if field.many_to_one and getattr(field, 'related_model', None) is Team:
            parent_id = getattr(obj, f"{field.name}_id", None)
            if parent_id is not None:
                try:
                    return Team.active_objects.get(pk=parent_id)
                except Team.DoesNotExist:
                    return None
    return None


# ---------------------------------------------------------------------------
# Base classes
# ---------------------------------------------------------------------------


class TeamScopedPermission(permissions.BasePermission):
    """Base that knows how to resolve a team from any object / URL kwarg.

    Subclasses implement :meth:`user_has_team_role`.
    """

    message = 'You do not have access to this team resource.'

    # Subclasses override: 'MEMBER' or 'LEADER' or 'SUPERVISOR'
    role: str = 'MEMBER'

    def has_permission(self, request, view) -> bool:
        if not request.user or not request.user.is_authenticated:
            return False
        # For SAFE methods without a team context, allow — DRF will
        # call has_object_permission on each instance. For unsafe
        # methods we need a team to authorize.
        if request.method in permissions.SAFE_METHODS:
            return True
        team = _get_team_from_request(view)
        if team is None:
            return False
        return self.user_has_team_role(request.user, team)

    def has_object_permission(self, request, view, obj) -> bool:
        if not request.user or not request.user.is_authenticated:
            return False
        team = _resolve_team_from_obj(obj) or _get_team_from_request(view, obj)
        if team is None:
            return False
        return self.user_has_team_role(request.user, team)

    def user_has_team_role(self, user, team: Team) -> bool:
        raise NotImplementedError


class IsTeamMember(TeamScopedPermission):
    """Allow access only to users that are ACCEPTED members of the team."""

    message = 'You must be an accepted member of this team.'
    role = 'MEMBER'

    def user_has_team_role(self, user, team: Team) -> bool:
        return TeamMember.objects.filter(
            team=team,
            student=user,
            status=TeamMember.Status.ACCEPTED,
        ).exists()


class IsTeamLeader(TeamScopedPermission):
    """Allow write access only to ACCEPTED members with role ``LEADER``.

    For SAFE methods (GET/HEAD/OPTIONS) the requirement relaxes to
    ``IsTeamMember`` so leaders can still browse the team.
    """

    message = 'Only the team leader can perform this action.'
    role = 'LEADER'

    def has_permission(self, request, view) -> bool:
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in permissions.SAFE_METHODS:
            return IsTeamMember().has_permission(request, view)
        team = _get_team_from_request(view)
        if team is None:
            return False
        return self.user_has_team_role(request.user, team)

    def has_object_permission(self, request, view, obj) -> bool:
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in permissions.SAFE_METHODS:
            return IsTeamMember().has_object_permission(request, view, obj)
        team = _resolve_team_from_obj(obj) or _get_team_from_request(view, obj)
        if team is None:
            return False
        return self.user_has_team_role(request.user, team)

    def user_has_team_role(self, user, team: Team) -> bool:
        return TeamMember.objects.filter(
            team=team,
            student=user,
            status=TeamMember.Status.ACCEPTED,
            role=TeamMember.Role.LEADER,
        ).exists()


class IsTeamSupervisor(TeamScopedPermission):
    """Allow access only to users that are ACCEPTED supervisors of the team."""

    message = 'You must be an accepted supervisor of this team.'
    role = 'SUPERVISOR'

    def user_has_team_role(self, user, team: Team) -> bool:
        return TeamSupervisor.objects.filter(
            team=team,
            supervisor=user,
            status=TeamSupervisor.Status.ACCEPTED,
        ).exists()


class IsTeamMemberOrSupervisor(TeamScopedPermission):
    """Read access for any accepted member OR any accepted supervisor."""

    message = 'You must be an accepted member or supervisor of this team.'

    def user_has_team_role(self, user, team: Team) -> bool:
        member_q = TeamMember.objects.filter(
            team=team, student=user, status=TeamMember.Status.ACCEPTED,
        )
        if member_q.exists():
            return True
        return TeamSupervisor.objects.filter(
            team=team, supervisor=user, status=TeamSupervisor.Status.ACCEPTED,
        ).exists()


class IsTeamLeaderOrSupervisor(TeamScopedPermission):
    """Write access for the leader OR any accepted supervisor.

    Supervisors use this for actions like grading a submission,
    approving a deliverable, or posting feedback.
    """

    message = 'Only the team leader or an accepted supervisor can perform this action.'

    def user_has_team_role(self, user, team: Team) -> bool:
        if IsTeamLeader().user_has_team_role(user, team):
            return True
        return IsTeamSupervisor().user_has_team_role(user, team)
