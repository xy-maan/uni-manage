import io
import tempfile

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.test import APITestCase

from notifications.models import Notification
from users.models import SupervisorProfile, User

from tasks.models import Task

from .models import (
    Deliverable, DeliverableFile, Feedback, Meeting, MeetingAttendance, MeetingNote,
    Project, ProjectMembership, SupervisorRequest,
)
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


class DeliverableAPITests(APITestCase):
    def setUp(self):
        self.leader = User.objects.create_user(username='lead', email='lead@uni.edu.eg', role=User.Role.STUDENT)
        self.member = User.objects.create_user(username='member', email='member@uni.edu.eg', role=User.Role.STUDENT)
        self.supervisor = User.objects.create_user(username='super', email='super@uni.edu.eg', role=User.Role.SUPERVISOR)
        SupervisorProfile.objects.create(user=self.supervisor, title=SupervisorProfile.Title.DOCTOR)
        self.outsider = User.objects.create_user(username='outsider', email='outsider@uni.edu.eg', role=User.Role.STUDENT)
        self.project = create_project(
            creator=self.leader,
            name='Deliverable Project',
            project_type=Project.Type.COURSE,
            methodology=Project.Methodology.KANBAN,
        )
        self.project.memberships.create(user=self.member)
        self.project.supervisors.create(supervisor=self.supervisor, role=SupervisorRequest.Role.PRIMARY)

    # ── List Deliverables ──

    def test_list_deliverables_empty(self):
        self.client.force_authenticate(self.leader)
        response = self.client.get(reverse('deliverable-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_list_deliverables_unauthenticated(self):
        response = self.client.get(reverse('deliverable-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_outsider_sees_no_deliverables(self):
        self.client.force_authenticate(self.outsider)
        Deliverable.objects.create(project=self.project, title='Hidden', created_by=self.leader)
        response = self.client.get(reverse('deliverable-list'))
        self.assertEqual(response.data, [])

    # ── Create Deliverable ──

    def test_create_deliverable(self):
        self.client.force_authenticate(self.leader)
        data = {'project': self.project.id, 'title': 'Final Report', 'description': 'PDF report'}
        response = self.client.post(reverse('deliverable-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'Final Report')
        self.assertEqual(response.data['status'], 'draft')

    def test_create_deliverable_as_member(self):
        self.client.force_authenticate(self.member)
        data = {'project': self.project.id, 'title': 'Member Deliverable'}
        response = self.client.post(reverse('deliverable-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_deliverable_as_outsider_fails(self):
        self.client.force_authenticate(self.outsider)
        data = {'project': self.project.id, 'title': 'Should fail'}
        response = self.client.post(reverse('deliverable-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_deliverable_missing_required_fields(self):
        self.client.force_authenticate(self.leader)
        response = self.client.post(reverse('deliverable-list'), {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # ── Get Deliverable ──

    def test_get_deliverable(self):
        self.client.force_authenticate(self.leader)
        d = Deliverable.objects.create(project=self.project, title='Detail', created_by=self.leader)
        response = self.client.get(reverse('deliverable-detail', args=[d.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Detail')

    def test_get_deliverable_not_found(self):
        self.client.force_authenticate(self.leader)
        response = self.client.get(reverse('deliverable-detail', args=[9999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # ── Replace Deliverable (PUT) ──

    def test_replace_deliverable(self):
        self.client.force_authenticate(self.leader)
        d = Deliverable.objects.create(project=self.project, title='Old', created_by=self.leader)
        data = {'project': self.project.id, 'title': 'Renamed'}
        response = self.client.put(reverse('deliverable-detail', args=[d.id]), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Renamed')

    # ── Update Deliverable (PATCH) ──

    def test_patch_deliverable(self):
        self.client.force_authenticate(self.leader)
        d = Deliverable.objects.create(project=self.project, title='Original', created_by=self.leader)
        response = self.client.patch(reverse('deliverable-detail', args=[d.id]), {'description': 'Updated'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['description'], 'Updated')

    # ── Delete Deliverable ──

    def test_delete_deliverable(self):
        self.client.force_authenticate(self.leader)
        d = Deliverable.objects.create(project=self.project, title='Delete me', created_by=self.leader)
        response = self.client.delete(reverse('deliverable-detail', args=[d.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Deliverable.objects.filter(id=d.id).exists())

    # ── Submit Deliverable ──

    def test_submit_deliverable_by_member(self):
        self.client.force_authenticate(self.member)
        d = Deliverable.objects.create(project=self.project, title='Submit me', created_by=self.leader)
        response = self.client.post(reverse('deliverable-submit', args=[d.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'pending')

    def test_submit_deliverable_by_outsider_fails(self):
        self.client.force_authenticate(self.outsider)
        d = Deliverable.objects.create(project=self.project, title='No submit', created_by=self.leader)
        response = self.client.post(reverse('deliverable-submit', args=[d.id]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # ── Approve Deliverable ──

    def test_approve_deliverable_by_supervisor(self):
        self.client.force_authenticate(self.supervisor)
        d = Deliverable.objects.create(project=self.project, title='Approve me', created_by=self.leader)
        d.status = Deliverable.Status.PENDING
        d.submitted_at = '2026-06-15T10:00:00Z'
        d.save()
        response = self.client.post(reverse('deliverable-approve', args=[d.id]), {'note': 'Good job!'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'approved')

    def test_approve_deliverable_by_member_fails(self):
        self.client.force_authenticate(self.member)
        d = Deliverable.objects.create(project=self.project, title='No approve', created_by=self.leader)
        d.status = Deliverable.Status.PENDING
        d.submitted_at = '2026-06-15T10:00:00Z'
        d.save()
        response = self.client.post(reverse('deliverable-approve', args=[d.id]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # ── Reject Deliverable ──

    def test_reject_deliverable_by_supervisor(self):
        self.client.force_authenticate(self.supervisor)
        d = Deliverable.objects.create(project=self.project, title='Reject me', created_by=self.leader)
        d.status = Deliverable.Status.PENDING
        d.submitted_at = '2026-06-15T10:00:00Z'
        d.save()
        response = self.client.post(reverse('deliverable-reject', args=[d.id]), {'note': 'Needs work'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'rejected')

    # ── Request Revision ──

    def test_request_revision_by_supervisor(self):
        self.client.force_authenticate(self.supervisor)
        d = Deliverable.objects.create(project=self.project, title='Revise me', created_by=self.leader)
        d.status = Deliverable.Status.PENDING
        d.submitted_at = '2026-06-15T10:00:00Z'
        d.save()
        response = self.client.post(reverse('deliverable-request-revision', args=[d.id]), {'note': 'Add section'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'needs_revision')


class DeliverableFileAPITests(APITestCase):
    def setUp(self):
        self.leader = User.objects.create_user(username='lead', email='lead@uni.edu.eg', role=User.Role.STUDENT)
        self.member = User.objects.create_user(username='member', email='member@uni.edu.eg', role=User.Role.STUDENT)
        self.outsider = User.objects.create_user(username='outsider', email='outsider@uni.edu.eg', role=User.Role.STUDENT)
        self.project = create_project(
            creator=self.leader,
            name='File Project',
            project_type=Project.Type.COURSE,
            methodology=Project.Methodology.KANBAN,
        )
        self.project.memberships.create(user=self.member)
        self.deliverable = Deliverable.objects.create(project=self.project, title='With Files', created_by=self.leader)

    # ── List Deliverable Files ──

    def test_list_files_empty(self):
        self.client.force_authenticate(self.leader)
        response = self.client.get(reverse('deliverable-file-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_list_files_unauthenticated(self):
        response = self.client.get(reverse('deliverable-file-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_outsider_sees_no_files(self):
        self.client.force_authenticate(self.outsider)
        DeliverableFile.objects.create(
            deliverable=self.deliverable, uploaded_by=self.leader,
            file='projects/deliverables/test.pdf',
        )
        response = self.client.get(reverse('deliverable-file-list'))
        self.assertEqual(response.data, [])

    # ── Upload File ──

    def test_upload_file(self):
        self.client.force_authenticate(self.leader)
        f = SimpleUploadedFile('report.pdf', b'PDF content', content_type='application/pdf')
        data = {'deliverable': self.deliverable.id, 'file': f}
        response = self.client.post(reverse('deliverable-file-list'), data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('file', response.data)

    def test_upload_file_as_member(self):
        self.client.force_authenticate(self.member)
        f = SimpleUploadedFile('notes.pdf', b'Notes', content_type='application/pdf')
        data = {'deliverable': self.deliverable.id, 'file': f}
        response = self.client.post(reverse('deliverable-file-list'), data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_upload_file_as_outsider_fails(self):
        self.client.force_authenticate(self.outsider)
        f = SimpleUploadedFile('hack.pdf', b'x', content_type='application/pdf')
        data = {'deliverable': self.deliverable.id, 'file': f}
        response = self.client.post(reverse('deliverable-file-list'), data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # ── Get File ──

    def test_get_file(self):
        self.client.force_authenticate(self.leader)
        df = DeliverableFile.objects.create(
            deliverable=self.deliverable, uploaded_by=self.leader,
            file='projects/deliverables/test.pdf',
        )
        response = self.client.get(reverse('deliverable-file-detail', args=[df.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('file', response.data)

    # ── Delete File ──

    def test_delete_file(self):
        self.client.force_authenticate(self.leader)
        df = DeliverableFile.objects.create(
            deliverable=self.deliverable, uploaded_by=self.leader,
            file='projects/deliverables/test.pdf',
        )
        response = self.client.delete(reverse('deliverable-file-detail', args=[df.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(DeliverableFile.objects.filter(id=df.id).exists())


class MeetingAPITests(APITestCase):
    def setUp(self):
        self.leader = User.objects.create_user(username='lead', email='lead@uni.edu.eg', role=User.Role.STUDENT)
        self.member = User.objects.create_user(username='member', email='member@uni.edu.eg', role=User.Role.STUDENT)
        self.supervisor = User.objects.create_user(username='super', email='super@uni.edu.eg', role=User.Role.SUPERVISOR)
        SupervisorProfile.objects.create(user=self.supervisor, title=SupervisorProfile.Title.DOCTOR)
        self.outsider = User.objects.create_user(username='outsider', email='outsider@uni.edu.eg', role=User.Role.STUDENT)
        self.project = create_project(
            creator=self.leader,
            name='Meeting Project',
            project_type=Project.Type.COURSE,
            methodology=Project.Methodology.KANBAN,
        )
        self.project.memberships.create(user=self.member)
        self.project.supervisors.create(supervisor=self.supervisor, role=SupervisorRequest.Role.PRIMARY)

    # ── List Meetings ──

    def test_list_meetings_empty(self):
        self.client.force_authenticate(self.leader)
        response = self.client.get(reverse('meeting-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_list_meetings_unauthenticated(self):
        response = self.client.get(reverse('meeting-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_outsider_sees_no_meetings(self):
        self.client.force_authenticate(self.outsider)
        Meeting.objects.create(project=self.project, title='Hidden', starts_at='2026-07-05T10:00:00Z', created_by=self.leader)
        response = self.client.get(reverse('meeting-list'))
        self.assertEqual(response.data, [])

    # ── Create Meeting ──

    def test_create_meeting(self):
        self.client.force_authenticate(self.leader)
        data = {
            'project': self.project.id,
            'title': 'Sprint planning',
            'description': 'Plan the next sprint.',
            'starts_at': '2026-07-05T10:00:00Z',
            'ends_at': '2026-07-05T11:00:00Z',
            'location': 'Room 302',
        }
        response = self.client.post(reverse('meeting-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'Sprint planning')
        self.assertEqual(response.data['location'], 'Room 302')

    def test_create_meeting_as_member(self):
        self.client.force_authenticate(self.member)
        data = {
            'project': self.project.id,
            'title': 'Sync',
            'starts_at': '2026-07-05T10:00:00Z',
        }
        response = self.client.post(reverse('meeting-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_meeting_as_outsider_fails(self):
        self.client.force_authenticate(self.outsider)
        data = {
            'project': self.project.id,
            'title': 'Fail',
            'starts_at': '2026-07-05T10:00:00Z',
        }
        response = self.client.post(reverse('meeting-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_meeting_missing_required_fields(self):
        self.client.force_authenticate(self.leader)
        response = self.client.post(reverse('meeting-list'), {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_meeting_ends_before_starts_fails(self):
        self.client.force_authenticate(self.leader)
        data = {
            'project': self.project.id,
            'title': 'Bad dates',
            'starts_at': '2026-07-05T11:00:00Z',
            'ends_at': '2026-07-05T10:00:00Z',
        }
        response = self.client.post(reverse('meeting-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # ── Get Meeting ──

    def test_get_meeting(self):
        self.client.force_authenticate(self.leader)
        m = Meeting.objects.create(project=self.project, title='Detail', starts_at='2026-07-05T10:00:00Z', created_by=self.leader)
        response = self.client.get(reverse('meeting-detail', args=[m.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Detail')

    def test_get_meeting_not_found(self):
        self.client.force_authenticate(self.leader)
        response = self.client.get(reverse('meeting-detail', args=[9999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # ── Replace Meeting (PUT) ──

    def test_replace_meeting(self):
        self.client.force_authenticate(self.leader)
        m = Meeting.objects.create(project=self.project, title='Old', starts_at='2026-07-05T10:00:00Z', created_by=self.leader)
        data = {
            'project': self.project.id,
            'title': 'Renamed',
            'starts_at': '2026-07-05T10:00:00Z',
        }
        response = self.client.put(reverse('meeting-detail', args=[m.id]), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Renamed')

    # ── Update Meeting (PATCH) ──

    def test_patch_meeting(self):
        self.client.force_authenticate(self.leader)
        m = Meeting.objects.create(project=self.project, title='Original', starts_at='2026-07-05T10:00:00Z', created_by=self.leader)
        response = self.client.patch(reverse('meeting-detail', args=[m.id]), {'description': 'Updated desc'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['description'], 'Updated desc')

    # ── Delete Meeting ──

    def test_delete_meeting(self):
        self.client.force_authenticate(self.leader)
        m = Meeting.objects.create(project=self.project, title='Delete me', starts_at='2026-07-05T10:00:00Z', created_by=self.leader)
        response = self.client.delete(reverse('meeting-detail', args=[m.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Meeting.objects.filter(id=m.id).exists())


class MeetingAttendanceAPITests(APITestCase):
    def setUp(self):
        self.leader = User.objects.create_user(username='lead', email='lead@uni.edu.eg', role=User.Role.STUDENT)
        self.member = User.objects.create_user(username='member', email='member@uni.edu.eg', role=User.Role.STUDENT)
        self.outsider = User.objects.create_user(username='outsider', email='outsider@uni.edu.eg', role=User.Role.STUDENT)
        self.project = create_project(
            creator=self.leader,
            name='Attendance Project',
            project_type=Project.Type.COURSE,
            methodology=Project.Methodology.KANBAN,
        )
        self.project.memberships.create(user=self.member)
        self.meeting = Meeting.objects.create(project=self.project, title='Sync', starts_at='2026-07-05T10:00:00Z', created_by=self.leader)

    # ── List Attendance Records ──

    def test_list_attendance_empty(self):
        self.client.force_authenticate(self.leader)
        response = self.client.get(reverse('meeting-attendance-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_list_attendance_unauthenticated(self):
        response = self.client.get(reverse('meeting-attendance-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_outsider_sees_no_attendance(self):
        self.client.force_authenticate(self.outsider)
        MeetingAttendance.objects.create(meeting=self.meeting, user=self.leader)
        response = self.client.get(reverse('meeting-attendance-list'))
        self.assertEqual(response.data, [])

    # ── Create Attendance Record ──

    def test_create_attendance(self):
        self.client.force_authenticate(self.leader)
        data = {'meeting': self.meeting.id, 'user': self.member.id, 'status': 'present', 'note': 'Joined online.'}
        response = self.client.post(reverse('meeting-attendance-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'present')

    def test_create_attendance_as_member(self):
        self.client.force_authenticate(self.member)
        data = {'meeting': self.meeting.id, 'user': self.leader.id}
        response = self.client.post(reverse('meeting-attendance-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_attendance_as_outsider_fails(self):
        self.client.force_authenticate(self.outsider)
        data = {'meeting': self.meeting.id, 'user': self.leader.id}
        response = self.client.post(reverse('meeting-attendance-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_attendance_duplicate_fails(self):
        self.client.force_authenticate(self.leader)
        MeetingAttendance.objects.create(meeting=self.meeting, user=self.member)
        data = {'meeting': self.meeting.id, 'user': self.member.id}
        response = self.client.post(reverse('meeting-attendance-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # ── Update Attendance (PATCH) ──

    def test_patch_attendance_status(self):
        self.client.force_authenticate(self.leader)
        att = MeetingAttendance.objects.create(meeting=self.meeting, user=self.member, status='invited')
        response = self.client.patch(reverse('meeting-attendance-detail', args=[att.id]), {'status': 'absent'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'absent')

    # ── Delete Attendance ──

    def test_delete_attendance(self):
        self.client.force_authenticate(self.leader)
        att = MeetingAttendance.objects.create(meeting=self.meeting, user=self.member)
        response = self.client.delete(reverse('meeting-attendance-detail', args=[att.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(MeetingAttendance.objects.filter(id=att.id).exists())

    def test_delete_attendance_as_outsider_fails(self):
        self.client.force_authenticate(self.outsider)
        att = MeetingAttendance.objects.create(meeting=self.meeting, user=self.leader)
        response = self.client.delete(reverse('meeting-attendance-detail', args=[att.id]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class MeetingNoteAPITests(APITestCase):
    def setUp(self):
        self.leader = User.objects.create_user(username='lead', email='lead@uni.edu.eg', role=User.Role.STUDENT)
        self.member = User.objects.create_user(username='member', email='member@uni.edu.eg', role=User.Role.STUDENT)
        self.outsider = User.objects.create_user(username='outsider', email='outsider@uni.edu.eg', role=User.Role.STUDENT)
        self.project = create_project(
            creator=self.leader,
            name='Note Project',
            project_type=Project.Type.COURSE,
            methodology=Project.Methodology.KANBAN,
        )
        self.project.memberships.create(user=self.member)
        self.meeting = Meeting.objects.create(project=self.project, title='Sync', starts_at='2026-07-05T10:00:00Z', created_by=self.leader)

    # ── List Notes ──

    def test_list_notes_empty(self):
        self.client.force_authenticate(self.leader)
        response = self.client.get(reverse('meeting-note-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_list_notes_unauthenticated(self):
        response = self.client.get(reverse('meeting-note-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_outsider_sees_no_notes(self):
        self.client.force_authenticate(self.outsider)
        MeetingNote.objects.create(meeting=self.meeting, author=self.leader, content='Hidden')
        response = self.client.get(reverse('meeting-note-list'))
        self.assertEqual(response.data, [])

    # ── Create Note ──

    def test_create_note(self):
        self.client.force_authenticate(self.leader)
        data = {'meeting': self.meeting.id, 'content': 'Discussed the prototype.'}
        response = self.client.post(reverse('meeting-note-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['content'], 'Discussed the prototype.')
        self.assertEqual(response.data['author_detail']['username'], 'lead')

    def test_create_note_as_member(self):
        self.client.force_authenticate(self.member)
        data = {'meeting': self.meeting.id, 'content': 'Member note.'}
        response = self.client.post(reverse('meeting-note-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_note_as_outsider_fails(self):
        self.client.force_authenticate(self.outsider)
        data = {'meeting': self.meeting.id, 'content': 'No access.'}
        response = self.client.post(reverse('meeting-note-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # ── Update Note ──

    def test_patch_note_by_author(self):
        self.client.force_authenticate(self.leader)
        note = MeetingNote.objects.create(meeting=self.meeting, author=self.leader, content='Original')
        response = self.client.patch(reverse('meeting-note-detail', args=[note.id]), {'content': 'Updated'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['content'], 'Updated')

    def test_patch_note_by_non_author_fails(self):
        self.client.force_authenticate(self.member)
        note = MeetingNote.objects.create(meeting=self.meeting, author=self.leader, content='Not yours')
        response = self.client.patch(reverse('meeting-note-detail', args=[note.id]), {'content': 'Hacked'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # ── Delete Note ──

    def test_delete_note_by_author(self):
        self.client.force_authenticate(self.leader)
        note = MeetingNote.objects.create(meeting=self.meeting, author=self.leader, content='Delete me')
        response = self.client.delete(reverse('meeting-note-detail', args=[note.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(MeetingNote.objects.filter(id=note.id).exists())

    def test_delete_note_by_non_author_fails(self):
        self.client.force_authenticate(self.member)
        note = MeetingNote.objects.create(meeting=self.meeting, author=self.leader, content='Not yours')
        response = self.client.delete(reverse('meeting-note-detail', args=[note.id]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_note_by_outsider_fails(self):
        self.client.force_authenticate(self.outsider)
        note = MeetingNote.objects.create(meeting=self.meeting, author=self.leader, content='Hidden')
        response = self.client.delete(reverse('meeting-note-detail', args=[note.id]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class FeedbackAPITests(APITestCase):
    def setUp(self):
        self.leader = User.objects.create_user(username='lead', email='lead@uni.edu.eg', role=User.Role.STUDENT)
        self.member = User.objects.create_user(username='member', email='member@uni.edu.eg', role=User.Role.STUDENT)
        self.supervisor = User.objects.create_user(username='super', email='super@uni.edu.eg', role=User.Role.SUPERVISOR)
        SupervisorProfile.objects.create(user=self.supervisor, title=SupervisorProfile.Title.DOCTOR)
        self.outsider = User.objects.create_user(username='outsider', email='outsider@uni.edu.eg', role=User.Role.STUDENT)
        self.project = create_project(
            creator=self.leader,
            name='Feedback Project',
            project_type=Project.Type.COURSE,
            methodology=Project.Methodology.KANBAN,
        )
        self.project.memberships.create(user=self.member)
        self.project.supervisors.create(supervisor=self.supervisor, role=SupervisorRequest.Role.PRIMARY)

    # ── List Feedback ──

    def test_list_feedback_empty(self):
        self.client.force_authenticate(self.leader)
        response = self.client.get(reverse('feedback-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_list_feedback_unauthenticated(self):
        response = self.client.get(reverse('feedback-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_outsider_sees_no_feedback(self):
        self.client.force_authenticate(self.outsider)
        Feedback.objects.create(project=self.project, author=self.supervisor, content='Hidden')
        response = self.client.get(reverse('feedback-list'))
        self.assertEqual(response.data, [])

    # ── Create Feedback (supervisor only) ──

    def test_create_feedback_on_project(self):
        self.client.force_authenticate(self.supervisor)
        data = {'project': self.project.id, 'content': 'Great work on the project.'}
        response = self.client.post(reverse('feedback-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['content'], 'Great work on the project.')
        self.assertEqual(response.data['author_detail']['username'], 'super')

    def test_create_feedback_on_task(self):
        self.client.force_authenticate(self.supervisor)
        task = Task.objects.create(project=self.project, title='Build API', creator=self.leader)
        data = {'task': task.id, 'content': 'Well designed API.'}
        response = self.client.post(reverse('feedback-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['task'], task.id)

    def test_create_feedback_on_deliverable(self):
        self.client.force_authenticate(self.supervisor)
        d = Deliverable.objects.create(project=self.project, title='Report', created_by=self.leader)
        data = {'deliverable': d.id, 'content': 'Well written report.'}
        response = self.client.post(reverse('feedback-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['deliverable'], d.id)

    def test_create_feedback_on_meeting(self):
        self.client.force_authenticate(self.supervisor)
        m = Meeting.objects.create(project=self.project, title='Sync', starts_at='2026-07-05T10:00:00Z', created_by=self.leader)
        data = {'meeting': m.id, 'content': 'Productive meeting.'}
        response = self.client.post(reverse('feedback-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['meeting'], m.id)

    def test_create_feedback_by_member_fails(self):
        self.client.force_authenticate(self.member)
        data = {'project': self.project.id, 'content': 'Member should not be able to create feedback.'}
        response = self.client.post(reverse('feedback-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_feedback_by_leader_fails(self):
        self.client.force_authenticate(self.leader)
        data = {'project': self.project.id, 'content': 'Leader should not be able to create feedback.'}
        response = self.client.post(reverse('feedback-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_feedback_no_target_fails(self):
        self.client.force_authenticate(self.supervisor)
        data = {'content': 'No target specified.'}
        response = self.client.post(reverse('feedback-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_feedback_multiple_targets_fails(self):
        self.client.force_authenticate(self.supervisor)
        task = Task.objects.create(project=self.project, title='Task', creator=self.leader)
        data = {'project': self.project.id, 'task': task.id, 'content': 'Two targets.'}
        response = self.client.post(reverse('feedback-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # ── Get Feedback ──

    def test_get_feedback(self):
        self.client.force_authenticate(self.leader)
        f = Feedback.objects.create(project=self.project, author=self.supervisor, content='Nice work!')
        response = self.client.get(reverse('feedback-detail', args=[f.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['content'], 'Nice work!')

    def test_get_feedback_not_found(self):
        self.client.force_authenticate(self.leader)
        response = self.client.get(reverse('feedback-detail', args=[9999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # ── Update Feedback (author only) ──

    def test_patch_feedback_by_author(self):
        self.client.force_authenticate(self.supervisor)
        f = Feedback.objects.create(project=self.project, author=self.supervisor, content='Original')
        response = self.client.patch(reverse('feedback-detail', args=[f.id]), {'content': 'Updated'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['content'], 'Updated')

    def test_patch_feedback_by_non_author_fails(self):
        self.client.force_authenticate(self.leader)
        f = Feedback.objects.create(project=self.project, author=self.supervisor, content='Not yours')
        response = self.client.patch(reverse('feedback-detail', args=[f.id]), {'content': 'Hacked'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # ── Delete Feedback (author only) ──

    def test_delete_feedback_by_author(self):
        self.client.force_authenticate(self.supervisor)
        f = Feedback.objects.create(project=self.project, author=self.supervisor, content='Delete me')
        response = self.client.delete(reverse('feedback-detail', args=[f.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Feedback.objects.filter(id=f.id).exists())

    def test_delete_feedback_by_non_author_fails(self):
        self.client.force_authenticate(self.leader)
        f = Feedback.objects.create(project=self.project, author=self.supervisor, content='Not yours')
        response = self.client.delete(reverse('feedback-detail', args=[f.id]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_feedback_by_outsider_fails(self):
        self.client.force_authenticate(self.outsider)
        f = Feedback.objects.create(project=self.project, author=self.supervisor, content='Hidden')
        response = self.client.delete(reverse('feedback-detail', args=[f.id]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
