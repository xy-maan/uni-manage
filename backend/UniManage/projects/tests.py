from django.test import TestCase
from rest_framework.exceptions import ValidationError

from notifications.models import Notification
from users.models import SupervisorProfile, User

from .models import Project, ProjectMembership, SupervisorRequest
from .services import (
    activate_project, create_invitation, create_project, create_supervisor_request,
    respond_to_invitation, respond_to_supervisor_request,
)


class ProjectServiceTests(TestCase):
    def setUp(self):
        self.leader = User.objects.create_user(username='leader', email='leader@uni.edu.eg', role=User.Role.STUDENT)
        self.member = User.objects.create_user(username='member', email='member@uni.edu.eg', role=User.Role.STUDENT)

    def test_creator_becomes_leader_and_course_project_can_activate(self):
        project = create_project(
            creator=self.leader,
            name='Course Team',
            project_type=Project.Type.COURSE,
            methodology=Project.Methodology.KANBAN,
        )
        self.assertTrue(project.memberships.filter(user=self.leader, role=ProjectMembership.Role.LEADER).exists())
        activate_project(project=project, user=self.leader)
        project.refresh_from_db()
        self.assertEqual(project.status, Project.Status.ACTIVE)

    def test_accepted_invitation_creates_membership(self):
        project = create_project(
            creator=self.leader,
            name='Inviting Team',
            project_type=Project.Type.COURSE,
            methodology=Project.Methodology.SPRINT,
        )
        invitation = create_invitation(project=project, invited_by=self.leader, invitee=self.member)
        respond_to_invitation(invitation=invitation, user=self.member, accept=True)
        self.assertTrue(project.memberships.filter(user=self.member).exists())
        self.assertTrue(Notification.objects.filter(recipient=self.member, notification_type='invitation').exists())

    def test_graduation_project_requires_approved_primary_supervisor(self):
        project = create_project(
            creator=self.leader,
            name='Graduation Team',
            project_type=Project.Type.GRADUATION,
            methodology=Project.Methodology.MILESTONE,
        )
        with self.assertRaises(ValidationError):
            activate_project(project=project, user=self.leader)

        doctor = User.objects.create_user(username='doctor', email='doctor@uni.edu.eg', role=User.Role.SUPERVISOR)
        SupervisorProfile.objects.create(user=doctor, title=SupervisorProfile.Title.DOCTOR)
        request = create_supervisor_request(
            project=project,
            requested_by=self.leader,
            supervisor=doctor,
            role=SupervisorRequest.Role.PRIMARY,
        )
        respond_to_supervisor_request(supervisor_request=request, user=doctor, accept=True)
        activate_project(project=project, user=self.leader)
        project.refresh_from_db()
        self.assertEqual(project.status, Project.Status.ACTIVE)
