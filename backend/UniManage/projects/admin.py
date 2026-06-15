from django.contrib import admin

from .models import (
    Deliverable, DeliverableFile, Feedback, JoinRequest, Meeting, MeetingAttendance,
    MeetingNote, Project, ProjectInvitation, ProjectMembership, ProjectSupervisor,
    SupervisorRequest,
)

admin.site.register([
    Project, ProjectMembership, ProjectInvitation, JoinRequest, SupervisorRequest,
    ProjectSupervisor, Deliverable, DeliverableFile, Meeting, MeetingAttendance,
    MeetingNote, Feedback,
])
