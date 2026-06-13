"""
Shared team-access helpers used by the ``projects`` app views.

These were previously local functions in ``views.py``; promoting them
here keeps the new viewset code (Tasks, Sprints, Phases, Feedback,
etc.) from re-defining the same logic.
"""

from __future__ import annotations

from .models import AcademicTerm, Team, TeamMember, TeamSupervisor


def get_current_term() -> AcademicTerm | None:
    return AcademicTerm.objects.filter(is_current=True).first()


def accepted_member_count(team: Team) -> int:
    return team.teammember_set.filter(status=TeamMember.Status.ACCEPTED).count()


def active_teams_for_supervisor_count(supervisor_user) -> int:
    return Team.objects.filter(
        is_deleted=False,
        teamsupervisor__supervisor=supervisor_user,
        teamsupervisor__status=TeamSupervisor.Status.ACCEPTED,
    ).distinct().count()


def is_accepted_member(user, team: Team) -> bool:
    if user is None or not getattr(user, 'is_authenticated', False):
        return False
    return TeamMember.objects.filter(
        team=team, student=user, status=TeamMember.Status.ACCEPTED,
    ).exists()


def is_accepted_leader(user, team: Team) -> bool:
    if user is None or not getattr(user, 'is_authenticated', False):
        return False
    return TeamMember.objects.filter(
        team=team,
        student=user,
        status=TeamMember.Status.ACCEPTED,
        role=TeamMember.Role.LEADER,
    ).exists()


def is_accepted_supervisor(user, team: Team) -> bool:
    if user is None or not getattr(user, 'is_authenticated', False):
        return False
    return TeamSupervisor.objects.filter(
        team=team, supervisor=user, status=TeamSupervisor.Status.ACCEPTED,
    ).exists()
