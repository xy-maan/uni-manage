from django.contrib import admin

from .models import (
    AcademicYear, Category, Deliverable, DeliverableFile, Feedback, JoinRequest,
    Meeting, MeetingAttendance, MeetingNote, Project, ProjectInvitation,
    ProjectMembership, ProjectSupervisor, Semester, SupervisorRequest, Technology,
    TechnologyAlias,
)

admin.site.register([
    Category, Semester, AcademicYear, Technology, TechnologyAlias,
    Project, ProjectMembership, ProjectInvitation, JoinRequest, SupervisorRequest,
    ProjectSupervisor, Deliverable, DeliverableFile, Meeting, MeetingAttendance,
    MeetingNote, Feedback,
])
