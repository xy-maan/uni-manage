"""DRF throttle classes for sensitive ``projects`` endpoints.

These bound the rate at which a user can perform a small set of
high-impact actions (methodology switch, kick, leader transfer).
DRF's ``UserRateThrottle`` already provides global throttling; these
classes add *per-action* throttles so a leader can't rapidly mutate
team structure.
"""

from __future__ import annotations

from rest_framework.throttling import UserRateThrottle


class MethodologySwitchThrottle(UserRateThrottle):
    """Max 5 methodology switches per user per hour."""

    scope = 'methodology-switch'
    rate = '5/hour'


class MembershipActionThrottle(UserRateThrottle):
    """Max 30 membership-mutating actions per user per hour.

    Covers kick / transfer / leave. Higher than methodology switch
    because a leader can plausibly need to remove multiple members
    in a short period (e.g., a wave of accepted joiners needs to be
    pruned after a bot incident).
    """

    scope = 'membership-action'
    rate = '30/hour'
