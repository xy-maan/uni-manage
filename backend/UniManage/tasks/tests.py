from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.test import APITestCase

from notifications.models import Notification
from projects.models import Project
from projects.services import create_project
from users.models import User

from .models import (
    BoardColumn, Milestone, MilestoneTask, Sprint, SprintTask, Task, TaskActivity,
    TaskAttachment, TaskChecklist, TaskChecklistItem, TaskComment, TaskLabel,
)
from .services import validate_sprint


class TaskWorkflowTests(APITestCase):
    def setUp(self):
        self.leader = User.objects.create_user(username='tasklead', email='tasklead@uni.edu.eg', role=User.Role.STUDENT)
        self.member = User.objects.create_user(username='assignee', email='assignee@uni.edu.eg', role=User.Role.STUDENT)
        self.outsider = User.objects.create_user(username='outsider', email='outsider@uni.edu.eg', role=User.Role.STUDENT)
        self.project = create_project(
            creator=self.leader,
            name='Task Team',
            project_type=Project.Type.COURSE,
            methodology=Project.Methodology.KANBAN,
        )
        self.project.memberships.create(user=self.member)

    # ── Existing service-level tests ──

    def test_task_assignment_and_comment_generate_notifications(self):
        task = Task.objects.create(project=self.project, title='Build API', creator=self.leader, assignee=self.member)
        self.assertTrue(Notification.objects.filter(recipient=self.member, notification_type='task_assignment').exists())
        TaskComment.objects.create(task=task, author=self.member, content='Started')
        self.assertTrue(Notification.objects.filter(recipient=self.leader, notification_type='comment').exists())

    def test_methodology_specific_records_are_rejected(self):
        with self.assertRaises(ValidationError):
            validate_sprint({'project': self.project}, None)


class TaskAPITests(APITestCase):
    def setUp(self):
        self.leader = User.objects.create_user(username='tasklead', email='tasklead@uni.edu.eg', role=User.Role.STUDENT)
        self.member = User.objects.create_user(username='assignee', email='assignee@uni.edu.eg', role=User.Role.STUDENT)
        self.outsider = User.objects.create_user(username='outsider', email='outsider@uni.edu.eg', role=User.Role.STUDENT)
        self.project = create_project(
            creator=self.leader,
            name='Task Team',
            project_type=Project.Type.COURSE,
            methodology=Project.Methodology.KANBAN,
        )
        self.project.memberships.create(user=self.member)

    # ── List Tasks ──

    def test_list_tasks_empty(self):
        self.client.force_authenticate(self.leader)
        response = self.client.get(reverse('task-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_list_tasks_unauthenticated(self):
        response = self.client.get(reverse('task-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_tasks_filter_by_project(self):
        self.client.force_authenticate(self.leader)
        task = Task.objects.create(project=self.project, title='My task', creator=self.leader)
        other = create_project(
            creator=self.leader, name='Other', project_type=Project.Type.COURSE, methodology=Project.Methodology.KANBAN,
        )
        Task.objects.create(project=other, title='Other task', creator=self.leader)
        response = self.client.get(reverse('task-list'), {'project': self.project.id})
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'My task')

    def test_list_tasks_filter_by_assignee(self):
        self.client.force_authenticate(self.leader)
        Task.objects.create(project=self.project, title='Task A', creator=self.leader, assignee=self.member)
        Task.objects.create(project=self.project, title='Task B', creator=self.leader, assignee=self.leader)
        response = self.client.get(reverse('task-list'), {'assignee': self.member.id})
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Task A')

    def test_list_tasks_filter_by_status(self):
        self.client.force_authenticate(self.leader)
        Task.objects.create(project=self.project, title='Todo task', creator=self.leader, status=Task.Status.TODO)
        Task.objects.create(project=self.project, title='Done task', creator=self.leader, status=Task.Status.DONE)
        response = self.client.get(reverse('task-list'), {'status': 'done'})
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Done task')

    def test_outsider_sees_no_tasks(self):
        self.client.force_authenticate(self.outsider)
        Task.objects.create(project=self.project, title='Hidden', creator=self.leader)
        response = self.client.get(reverse('task-list'))
        self.assertEqual(response.data, [])

    # ── Create Task ──

    def test_create_task_as_leader(self):
        self.client.force_authenticate(self.leader)
        data = {
            'project': self.project.id,
            'title': 'Build API',
            'description': 'Create endpoints',
            'priority': 'high',
            'assignee': self.member.id,
        }
        response = self.client.post(reverse('task-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'Build API')
        self.assertEqual(response.data['creator_detail']['username'], 'tasklead')
        self.assertEqual(response.data['assignee_detail']['username'], 'assignee')
        self.assertTrue(Task.objects.filter(title='Build API').exists())

    def test_create_task_as_member(self):
        self.client.force_authenticate(self.member)
        data = {'project': self.project.id, 'title': 'Member task'}
        response = self.client.post(reverse('task-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_task_as_outsider_fails(self):
        self.client.force_authenticate(self.outsider)
        data = {'project': self.project.id, 'title': 'Should fail'}
        response = self.client.post(reverse('task-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_task_unauthenticated(self):
        data = {'project': self.project.id, 'title': 'No auth'}
        response = self.client.post(reverse('task-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_task_missing_required_fields(self):
        self.client.force_authenticate(self.leader)
        response = self.client.post(reverse('task-list'), {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('project', response.data)
        self.assertIn('title', response.data)

    def test_create_task_with_invalid_assignee_fails(self):
        self.client.force_authenticate(self.leader)
        data = {'project': self.project.id, 'title': 'Bad assignee', 'assignee': self.outsider.id}
        response = self.client.post(reverse('task-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_task_sets_completed_at_when_done(self):
        self.client.force_authenticate(self.leader)
        data = {'project': self.project.id, 'title': 'Already done', 'status': 'done'}
        response = self.client.post(reverse('task-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIsNotNone(response.data['completed_at'])

    # ── Get Task ──

    def test_get_task(self):
        self.client.force_authenticate(self.leader)
        task = Task.objects.create(project=self.project, title='Detail', creator=self.leader)
        response = self.client.get(reverse('task-detail', args=[task.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Detail')

    def test_get_task_not_found(self):
        self.client.force_authenticate(self.leader)
        response = self.client.get(reverse('task-detail', args=[9999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_task_outsider_fails(self):
        self.client.force_authenticate(self.outsider)
        task = Task.objects.create(project=self.project, title='Hidden', creator=self.leader)
        response = self.client.get(reverse('task-detail', args=[task.id]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # ── Replace Task (PUT) ──

    def test_replace_task(self):
        self.client.force_authenticate(self.leader)
        task = Task.objects.create(project=self.project, title='Old title', creator=self.leader)
        data = {
            'project': self.project.id,
            'title': 'New title',
            'description': 'Replaced',
            'status': 'in_progress',
            'priority': 'urgent',
        }
        response = self.client.put(reverse('task-detail', args=[task.id]), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'New title')
        self.assertEqual(response.data['priority'], 'urgent')

    # ── Update Task (PATCH) ──

    def test_patch_task_status(self):
        self.client.force_authenticate(self.leader)
        task = Task.objects.create(project=self.project, title='Move me', creator=self.leader)
        response = self.client.patch(reverse('task-detail', args=[task.id]), {'status': 'review'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'review')

    def test_patch_task_done_sets_completed_at(self):
        self.client.force_authenticate(self.leader)
        task = Task.objects.create(project=self.project, title='Complete', creator=self.leader)
        self.assertIsNone(task.completed_at)
        response = self.client.patch(reverse('task-detail', args=[task.id]), {'status': 'done'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data['completed_at'])

    # ── Delete Task ──

    def test_delete_task(self):
        self.client.force_authenticate(self.leader)
        task = Task.objects.create(project=self.project, title='Delete me', creator=self.leader)
        response = self.client.delete(reverse('task-detail', args=[task.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_deleted_task_not_listed(self):
        self.client.force_authenticate(self.leader)
        task = Task.objects.create(project=self.project, title='Gone', creator=self.leader)
        task.delete()
        response = self.client.get(reverse('task-list'))
        titles = [t['title'] for t in response.data]
        self.assertNotIn('Gone', titles)


class TaskLabelAPITests(APITestCase):
    def setUp(self):
        self.leader = User.objects.create_user(username='tasklead', email='tasklead@uni.edu.eg', role=User.Role.STUDENT)
        self.member = User.objects.create_user(username='assignee', email='assignee@uni.edu.eg', role=User.Role.STUDENT)
        self.outsider = User.objects.create_user(username='outsider', email='outsider@uni.edu.eg', role=User.Role.STUDENT)
        self.project = create_project(
            creator=self.leader,
            name='Task Team',
            project_type=Project.Type.COURSE,
            methodology=Project.Methodology.KANBAN,
        )
        self.project.memberships.create(user=self.member)

    # ── List Labels ──

    def test_list_labels(self):
        self.client.force_authenticate(self.leader)
        TaskLabel.objects.create(project=self.project, name='Backend', color='#2563eb')
        response = self.client.get(reverse('task-label-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Backend')

    def test_list_labels_unauthenticated(self):
        response = self.client.get(reverse('task-label-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_outsider_sees_no_labels(self):
        self.client.force_authenticate(self.outsider)
        TaskLabel.objects.create(project=self.project, name='Hidden', color='#000')
        response = self.client.get(reverse('task-label-list'))
        self.assertEqual(response.data, [])

    # ── Create Label ──

    def test_create_label(self):
        self.client.force_authenticate(self.leader)
        data = {'project': self.project.id, 'name': 'Frontend', 'color': '#ef4444'}
        response = self.client.post(reverse('task-label-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'Frontend')

    def test_create_label_as_member(self):
        self.client.force_authenticate(self.member)
        data = {'project': self.project.id, 'name': 'Bug', 'color': '#f59e0b'}
        response = self.client.post(reverse('task-label-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_label_as_outsider_fails(self):
        self.client.force_authenticate(self.outsider)
        data = {'project': self.project.id, 'name': 'Fail', 'color': '#000'}
        response = self.client.post(reverse('task-label-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_label_missing_required_fields(self):
        self.client.force_authenticate(self.leader)
        response = self.client.post(reverse('task-label-list'), {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_duplicate_label_name_fails(self):
        self.client.force_authenticate(self.leader)
        TaskLabel.objects.create(project=self.project, name='Duplicate', color='#fff')
        data = {'project': self.project.id, 'name': 'Duplicate', 'color': '#000'}
        response = self.client.post(reverse('task-label-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # ── Get Label ──

    def test_get_label(self):
        self.client.force_authenticate(self.leader)
        label = TaskLabel.objects.create(project=self.project, name='API', color='#22c55e')
        response = self.client.get(reverse('task-label-detail', args=[label.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'API')

    def test_get_label_not_found(self):
        self.client.force_authenticate(self.leader)
        response = self.client.get(reverse('task-label-detail', args=[9999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # ── Replace Label (PUT) ──

    def test_replace_label(self):
        self.client.force_authenticate(self.leader)
        label = TaskLabel.objects.create(project=self.project, name='Old', color='#fff')
        data = {'project': self.project.id, 'name': 'Renamed', 'color': '#000'}
        response = self.client.put(reverse('task-label-detail', args=[label.id]), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Renamed')

    # ── Update Label (PATCH) ──

    def test_patch_label(self):
        self.client.force_authenticate(self.leader)
        label = TaskLabel.objects.create(project=self.project, name='Colorful', color='#fff')
        response = self.client.patch(reverse('task-label-detail', args=[label.id]), {'color': '#000'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['color'], '#000')

    # ── Delete Label ──

    def test_delete_label(self):
        self.client.force_authenticate(self.leader)
        label = TaskLabel.objects.create(project=self.project, name='Delete', color='#000')
        response = self.client.delete(reverse('task-label-detail', args=[label.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(TaskLabel.objects.filter(id=label.id).exists())

    def test_delete_label_as_outsider_fails(self):
        self.client.force_authenticate(self.outsider)
        label = TaskLabel.objects.create(project=self.project, name='NoAccess', color='#000')
        response = self.client.delete(reverse('task-label-detail', args=[label.id]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class TaskCommentAPITests(APITestCase):
    def setUp(self):
        self.leader = User.objects.create_user(username='tasklead', email='tasklead@uni.edu.eg', role=User.Role.STUDENT)
        self.member = User.objects.create_user(username='assignee', email='assignee@uni.edu.eg', role=User.Role.STUDENT)
        self.outsider = User.objects.create_user(username='outsider', email='outsider@uni.edu.eg', role=User.Role.STUDENT)
        self.project = create_project(
            creator=self.leader,
            name='Task Team',
            project_type=Project.Type.COURSE,
            methodology=Project.Methodology.KANBAN,
        )
        self.project.memberships.create(user=self.member)
        self.task = Task.objects.create(project=self.project, title='Test task', creator=self.leader)

    # ── List Comments ──

    def test_list_comments_empty(self):
        self.client.force_authenticate(self.leader)
        response = self.client.get(reverse('task-comment-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_list_comments_unauthenticated(self):
        response = self.client.get(reverse('task-comment-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_outsider_sees_no_comments(self):
        self.client.force_authenticate(self.outsider)
        TaskComment.objects.create(task=self.task, author=self.leader, content='Hidden')
        response = self.client.get(reverse('task-comment-list'))
        self.assertEqual(response.data, [])

    # ── Create Comment ──

    def test_create_comment(self):
        self.client.force_authenticate(self.leader)
        data = {'task': self.task.id, 'content': 'Great work!'}
        response = self.client.post(reverse('task-comment-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['content'], 'Great work!')
        self.assertEqual(response.data['author_detail']['username'], 'tasklead')

    def test_create_comment_as_member(self):
        self.client.force_authenticate(self.member)
        data = {'task': self.task.id, 'content': 'Nice!'}
        response = self.client.post(reverse('task-comment-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_comment_as_outsider_fails(self):
        self.client.force_authenticate(self.outsider)
        data = {'task': self.task.id, 'content': 'No access'}
        response = self.client.post(reverse('task-comment-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_comment_missing_required_fields(self):
        self.client.force_authenticate(self.leader)
        response = self.client.post(reverse('task-comment-list'), {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # ── Get Comment ──

    def test_get_comment(self):
        self.client.force_authenticate(self.leader)
        comment = TaskComment.objects.create(task=self.task, author=self.leader, content='Detail')
        response = self.client.get(reverse('task-comment-detail', args=[comment.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['content'], 'Detail')

    def test_get_comment_not_found(self):
        self.client.force_authenticate(self.leader)
        response = self.client.get(reverse('task-comment-detail', args=[9999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # ── Replace Comment (PUT) ──

    def test_replace_comment(self):
        self.client.force_authenticate(self.leader)
        comment = TaskComment.objects.create(task=self.task, author=self.leader, content='Old')
        data = {'task': self.task.id, 'content': 'Replaced'}
        response = self.client.put(reverse('task-comment-detail', args=[comment.id]), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['content'], 'Replaced')

    def test_replace_comment_by_non_author_fails(self):
        self.client.force_authenticate(self.member)
        comment = TaskComment.objects.create(task=self.task, author=self.leader, content='Mine')
        data = {'task': self.task.id, 'content': 'Hacked'}
        response = self.client.put(reverse('task-comment-detail', args=[comment.id]), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # ── Update Comment (PATCH) ──

    def test_patch_comment(self):
        self.client.force_authenticate(self.leader)
        comment = TaskComment.objects.create(task=self.task, author=self.leader, content='Original')
        response = self.client.patch(reverse('task-comment-detail', args=[comment.id]), {'content': 'Updated'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['content'], 'Updated')

    def test_patch_comment_by_non_author_fails(self):
        self.client.force_authenticate(self.member)
        comment = TaskComment.objects.create(task=self.task, author=self.leader, content='Not yours')
        response = self.client.patch(reverse('task-comment-detail', args=[comment.id]), {'content': 'Hacked'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # ── Delete Comment ──

    def test_delete_comment_by_author(self):
        self.client.force_authenticate(self.leader)
        comment = TaskComment.objects.create(task=self.task, author=self.leader, content='Delete me')
        response = self.client.delete(reverse('task-comment-detail', args=[comment.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(TaskComment.objects.filter(id=comment.id).exists())

    def test_delete_comment_by_non_author_fails(self):
        self.client.force_authenticate(self.member)
        comment = TaskComment.objects.create(task=self.task, author=self.leader, content='Not yours')
        response = self.client.delete(reverse('task-comment-detail', args=[comment.id]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_comment_by_outsider_fails(self):
        self.client.force_authenticate(self.outsider)
        comment = TaskComment.objects.create(task=self.task, author=self.leader, content='Hidden')
        response = self.client.delete(reverse('task-comment-detail', args=[comment.id]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class TaskAttachmentAPITests(APITestCase):
    def setUp(self):
        self.leader = User.objects.create_user(username='tasklead', email='tasklead@uni.edu.eg', role=User.Role.STUDENT)
        self.member = User.objects.create_user(username='assignee', email='assignee@uni.edu.eg', role=User.Role.STUDENT)
        self.outsider = User.objects.create_user(username='outsider', email='outsider@uni.edu.eg', role=User.Role.STUDENT)
        self.project = create_project(
            creator=self.leader,
            name='Task Team',
            project_type=Project.Type.COURSE,
            methodology=Project.Methodology.KANBAN,
        )
        self.project.memberships.create(user=self.member)
        self.task = Task.objects.create(project=self.project, title='Test task', creator=self.leader)

    # ── List Attachments ──

    def test_list_attachments_empty(self):
        self.client.force_authenticate(self.leader)
        response = self.client.get(reverse('task-attachment-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_list_attachments_unauthenticated(self):
        response = self.client.get(reverse('task-attachment-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_outsider_sees_no_attachments(self):
        self.client.force_authenticate(self.outsider)
        TaskAttachment.objects.create(task=self.task, uploaded_by=self.leader, file='tasks/attachments/test.pdf')
        response = self.client.get(reverse('task-attachment-list'))
        self.assertEqual(response.data, [])

    # ── Upload Attachment ──

    def test_upload_attachment(self):
        self.client.force_authenticate(self.leader)
        f = SimpleUploadedFile('spec.pdf', b'PDF content', content_type='application/pdf')
        data = {'task': self.task.id, 'file': f}
        response = self.client.post(reverse('task-attachment-list'), data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('file', response.data)

    def test_upload_attachment_as_member(self):
        self.client.force_authenticate(self.member)
        f = SimpleUploadedFile('notes.pdf', b'Notes', content_type='application/pdf')
        data = {'task': self.task.id, 'file': f}
        response = self.client.post(reverse('task-attachment-list'), data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_upload_attachment_as_outsider_fails(self):
        self.client.force_authenticate(self.outsider)
        f = SimpleUploadedFile('hack.pdf', b'x', content_type='application/pdf')
        data = {'task': self.task.id, 'file': f}
        response = self.client.post(reverse('task-attachment-list'), data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_upload_attachment_unauthenticated(self):
        f = SimpleUploadedFile('noauth.pdf', b'x', content_type='application/pdf')
        data = {'task': self.task.id, 'file': f}
        response = self.client.post(reverse('task-attachment-list'), data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # ── Get Attachment ──

    def test_get_attachment(self):
        self.client.force_authenticate(self.leader)
        att = TaskAttachment.objects.create(task=self.task, uploaded_by=self.leader, file='tasks/attachments/test.pdf')
        response = self.client.get(reverse('task-attachment-detail', args=[att.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('file', response.data)

    def test_get_attachment_not_found(self):
        self.client.force_authenticate(self.leader)
        response = self.client.get(reverse('task-attachment-detail', args=[9999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # ── Delete Attachment ──

    def test_delete_attachment(self):
        self.client.force_authenticate(self.leader)
        att = TaskAttachment.objects.create(task=self.task, uploaded_by=self.leader, file='tasks/attachments/del.pdf')
        response = self.client.delete(reverse('task-attachment-detail', args=[att.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(TaskAttachment.objects.filter(id=att.id).exists())

    def test_delete_attachment_as_outsider_fails(self):
        self.client.force_authenticate(self.outsider)
        att = TaskAttachment.objects.create(task=self.task, uploaded_by=self.leader, file='tasks/attachments/hidden.pdf')
        response = self.client.delete(reverse('task-attachment-detail', args=[att.id]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class TaskActivityAPITests(APITestCase):
    def setUp(self):
        self.leader = User.objects.create_user(username='tasklead', email='tasklead@uni.edu.eg', role=User.Role.STUDENT)
        self.member = User.objects.create_user(username='assignee', email='assignee@uni.edu.eg', role=User.Role.STUDENT)
        self.outsider = User.objects.create_user(username='outsider', email='outsider@uni.edu.eg', role=User.Role.STUDENT)
        self.project = create_project(
            creator=self.leader,
            name='Task Team',
            project_type=Project.Type.COURSE,
            methodology=Project.Methodology.KANBAN,
        )
        self.project.memberships.create(user=self.member)
        self.task = Task.objects.create(project=self.project, title='Test task', creator=self.leader)
        self.activity = TaskActivity.objects.create(task=self.task, actor=self.leader, action='created', message='Task created')

    # ── List Activity ──

    def test_list_activity(self):
        self.client.force_authenticate(self.leader)
        response = self.client.get(reverse('task-activity-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['action'], 'created')

    def test_list_activity_unauthenticated(self):
        response = self.client.get(reverse('task-activity-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_outsider_sees_no_activity(self):
        self.client.force_authenticate(self.outsider)
        response = self.client.get(reverse('task-activity-list'))
        self.assertEqual(response.data, [])

    # ── Get Activity Record ──

    def test_get_activity_record(self):
        self.client.force_authenticate(self.leader)
        response = self.client.get(reverse('task-activity-detail', args=[self.activity.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['action'], 'created')

    def test_get_activity_not_found(self):
        self.client.force_authenticate(self.leader)
        response = self.client.get(reverse('task-activity-detail', args=[9999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_activity_is_read_only(self):
        self.client.force_authenticate(self.leader)
        response = self.client.post(reverse('task-activity-list'), {'task': self.task.id, 'action': 'test'}, format='json')
        self.assertIn(response.status_code, [status.HTTP_405_METHOD_NOT_ALLOWED, status.HTTP_403_FORBIDDEN])


class TaskChecklistAPITests(APITestCase):
    def setUp(self):
        self.leader = User.objects.create_user(username='tasklead', email='tasklead@uni.edu.eg', role=User.Role.STUDENT)
        self.member = User.objects.create_user(username='assignee', email='assignee@uni.edu.eg', role=User.Role.STUDENT)
        self.outsider = User.objects.create_user(username='outsider', email='outsider@uni.edu.eg', role=User.Role.STUDENT)
        self.project = create_project(
            creator=self.leader,
            name='Task Team',
            project_type=Project.Type.COURSE,
            methodology=Project.Methodology.KANBAN,
        )
        self.project.memberships.create(user=self.member)
        self.task = Task.objects.create(project=self.project, title='Test task', creator=self.leader)

    # ── List Checklists ──

    def test_list_checklists_empty(self):
        self.client.force_authenticate(self.leader)
        response = self.client.get(reverse('task-checklist-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_list_checklists_unauthenticated(self):
        response = self.client.get(reverse('task-checklist-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_outsider_sees_no_checklists(self):
        self.client.force_authenticate(self.outsider)
        TaskChecklist.objects.create(task=self.task, title='Hidden')
        response = self.client.get(reverse('task-checklist-list'))
        self.assertEqual(response.data, [])

    # ── Create Checklist ──

    def test_create_checklist(self):
        self.client.force_authenticate(self.leader)
        data = {'task': self.task.id, 'title': 'Acceptance checklist', 'position': 1}
        response = self.client.post(reverse('task-checklist-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'Acceptance checklist')

    def test_create_checklist_as_member(self):
        self.client.force_authenticate(self.member)
        data = {'task': self.task.id, 'title': 'Member checklist'}
        response = self.client.post(reverse('task-checklist-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_checklist_as_outsider_fails(self):
        self.client.force_authenticate(self.outsider)
        data = {'task': self.task.id, 'title': 'Fail'}
        response = self.client.post(reverse('task-checklist-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_checklist_missing_required_fields(self):
        self.client.force_authenticate(self.leader)
        response = self.client.post(reverse('task-checklist-list'), {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # ── Get Checklist ──

    def test_get_checklist(self):
        self.client.force_authenticate(self.leader)
        cl = TaskChecklist.objects.create(task=self.task, title='My checklist')
        response = self.client.get(reverse('task-checklist-detail', args=[cl.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'My checklist')

    def test_get_checklist_not_found(self):
        self.client.force_authenticate(self.leader)
        response = self.client.get(reverse('task-checklist-detail', args=[9999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # ── Update Checklist (PATCH) ──

    def test_patch_checklist(self):
        self.client.force_authenticate(self.leader)
        cl = TaskChecklist.objects.create(task=self.task, title='Original')
        response = self.client.patch(reverse('task-checklist-detail', args=[cl.id]), {'title': 'Updated'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated')

    # ── Delete Checklist ──

    def test_delete_checklist(self):
        self.client.force_authenticate(self.leader)
        cl = TaskChecklist.objects.create(task=self.task, title='Delete me')
        response = self.client.delete(reverse('task-checklist-detail', args=[cl.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(TaskChecklist.objects.filter(id=cl.id).exists())

    def test_delete_checklist_as_outsider_fails(self):
        self.client.force_authenticate(self.outsider)
        cl = TaskChecklist.objects.create(task=self.task, title='Hidden')
        response = self.client.delete(reverse('task-checklist-detail', args=[cl.id]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class TaskChecklistItemAPITests(APITestCase):
    def setUp(self):
        self.leader = User.objects.create_user(username='tasklead', email='tasklead@uni.edu.eg', role=User.Role.STUDENT)
        self.member = User.objects.create_user(username='assignee', email='assignee@uni.edu.eg', role=User.Role.STUDENT)
        self.outsider = User.objects.create_user(username='outsider', email='outsider@uni.edu.eg', role=User.Role.STUDENT)
        self.project = create_project(
            creator=self.leader,
            name='Task Team',
            project_type=Project.Type.COURSE,
            methodology=Project.Methodology.KANBAN,
        )
        self.project.memberships.create(user=self.member)
        self.task = Task.objects.create(project=self.project, title='Test task', creator=self.leader)
        self.checklist = TaskChecklist.objects.create(task=self.task, title='My checklist')

    # ── List Items ──

    def test_list_checklist_items_empty(self):
        self.client.force_authenticate(self.leader)
        response = self.client.get(reverse('task-checklist-item-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_list_checklist_items_unauthenticated(self):
        response = self.client.get(reverse('task-checklist-item-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_outsider_sees_no_checklist_items(self):
        self.client.force_authenticate(self.outsider)
        TaskChecklistItem.objects.create(checklist=self.checklist, content='Hidden')
        response = self.client.get(reverse('task-checklist-item-list'))
        self.assertEqual(response.data, [])

    # ── Create Item ──

    def test_create_checklist_item(self):
        self.client.force_authenticate(self.leader)
        data = {'checklist': self.checklist.id, 'content': 'Write tests', 'position': 1}
        response = self.client.post(reverse('task-checklist-item-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['content'], 'Write tests')

    def test_create_checklist_item_as_member(self):
        self.client.force_authenticate(self.member)
        data = {'checklist': self.checklist.id, 'content': 'Member item'}
        response = self.client.post(reverse('task-checklist-item-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_checklist_item_as_outsider_fails(self):
        self.client.force_authenticate(self.outsider)
        data = {'checklist': self.checklist.id, 'content': 'Fail'}
        response = self.client.post(reverse('task-checklist-item-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_checklist_item_missing_required_fields(self):
        self.client.force_authenticate(self.leader)
        response = self.client.post(reverse('task-checklist-item-list'), {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # ── Update Item (PATCH) ──

    def test_patch_checklist_item_complete(self):
        self.client.force_authenticate(self.leader)
        item = TaskChecklistItem.objects.create(checklist=self.checklist, content='Do this')
        self.assertFalse(item.is_completed)
        response = self.client.patch(reverse('task-checklist-item-detail', args=[item.id]), {'is_completed': True}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['is_completed'])
        self.assertIsNotNone(response.data['completed_by'])
        self.assertIsNotNone(response.data['completed_at'])

    def test_patch_checklist_item_uncomplete(self):
        self.client.force_authenticate(self.leader)
        item = TaskChecklistItem.objects.create(checklist=self.checklist, content='Redo', is_completed=True, completed_by=self.leader)
        response = self.client.patch(reverse('task-checklist-item-detail', args=[item.id]), {'is_completed': False}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['is_completed'])
        self.assertIsNone(response.data['completed_by'])
        self.assertIsNone(response.data['completed_at'])

    # ── Delete Item ──

    def test_delete_checklist_item(self):
        self.client.force_authenticate(self.leader)
        item = TaskChecklistItem.objects.create(checklist=self.checklist, content='Delete me')
        response = self.client.delete(reverse('task-checklist-item-detail', args=[item.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(TaskChecklistItem.objects.filter(id=item.id).exists())

    def test_delete_checklist_item_as_outsider_fails(self):
        self.client.force_authenticate(self.outsider)
        item = TaskChecklistItem.objects.create(checklist=self.checklist, content='Hidden')
        response = self.client.delete(reverse('task-checklist-item-detail', args=[item.id]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class SprintAPITests(APITestCase):
    def setUp(self):
        self.leader = User.objects.create_user(username='sprintlead', email='sprintlead@uni.edu.eg', role=User.Role.STUDENT)
        self.member = User.objects.create_user(username='sprintmember', email='sprintmember@uni.edu.eg', role=User.Role.STUDENT)
        self.outsider = User.objects.create_user(username='outsider', email='outsider@uni.edu.eg', role=User.Role.STUDENT)
        self.project = create_project(
            creator=self.leader,
            name='Sprint Project',
            project_type=Project.Type.COURSE,
            methodology=Project.Methodology.SPRINT,
        )
        self.project.memberships.create(user=self.member)

    # ── List Sprints ──

    def test_list_sprints_empty(self):
        self.client.force_authenticate(self.leader)
        response = self.client.get(reverse('sprint-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_list_sprints_unauthenticated(self):
        response = self.client.get(reverse('sprint-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # ── Create Sprint ──

    def test_create_sprint(self):
        self.client.force_authenticate(self.leader)
        data = {
            'project': self.project.id,
            'name': 'Sprint 1',
            'starts_at': '2026-07-01T09:00:00Z',
            'ends_at': '2026-07-14T17:00:00Z',
        }
        response = self.client.post(reverse('sprint-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'Sprint 1')

    def test_create_sprint_as_member(self):
        self.client.force_authenticate(self.member)
        data = {
            'project': self.project.id,
            'name': 'Sprint 2',
            'starts_at': '2026-07-01T09:00:00Z',
            'ends_at': '2026-07-14T17:00:00Z',
        }
        response = self.client.post(reverse('sprint-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_sprint_as_outsider_fails(self):
        self.client.force_authenticate(self.outsider)
        data = {
            'project': self.project.id,
            'name': 'Sprint Fail',
            'starts_at': '2026-07-01T09:00:00Z',
            'ends_at': '2026-07-14T17:00:00Z',
        }
        response = self.client.post(reverse('sprint-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_sprint_on_wrong_methodology_fails(self):
        self.client.force_authenticate(self.leader)
        kanban_project = create_project(
            creator=self.leader, name='Kanban', project_type=Project.Type.COURSE, methodology=Project.Methodology.KANBAN,
        )
        data = {
            'project': kanban_project.id,
            'name': 'Bad Sprint',
            'starts_at': '2026-07-01T09:00:00Z',
            'ends_at': '2026-07-14T17:00:00Z',
        }
        response = self.client.post(reverse('sprint-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_sprint_ends_before_starts_fails(self):
        self.client.force_authenticate(self.leader)
        data = {
            'project': self.project.id,
            'name': 'Bad dates',
            'starts_at': '2026-07-14T09:00:00Z',
            'ends_at': '2026-07-01T17:00:00Z',
        }
        response = self.client.post(reverse('sprint-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_sprint_missing_required_fields(self):
        self.client.force_authenticate(self.leader)
        response = self.client.post(reverse('sprint-list'), {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # ── Get Sprint ──

    def test_get_sprint(self):
        self.client.force_authenticate(self.leader)
        sprint = Sprint.objects.create(project=self.project, name='My Sprint', starts_at='2026-07-01T09:00:00Z', ends_at='2026-07-14T17:00:00Z')
        response = self.client.get(reverse('sprint-detail', args=[sprint.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'My Sprint')

    def test_get_sprint_not_found(self):
        self.client.force_authenticate(self.leader)
        response = self.client.get(reverse('sprint-detail', args=[9999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # ── Sprint Dashboard ──

    def test_sprint_dashboard(self):
        self.client.force_authenticate(self.leader)
        sprint = Sprint.objects.create(project=self.project, name='Dashboard Sprint', starts_at='2026-07-01T09:00:00Z', ends_at='2026-07-14T17:00:00Z')
        response = self.client.get(reverse('sprint-dashboard', args=[sprint.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('current_sprint', response.data)
        self.assertIn('total_tasks', response.data)
        self.assertIn('backlog_count', response.data)

    # ── Replace Sprint (PUT) ──

    def test_replace_sprint(self):
        self.client.force_authenticate(self.leader)
        sprint = Sprint.objects.create(project=self.project, name='Old Sprint', starts_at='2026-07-01T09:00:00Z', ends_at='2026-07-14T17:00:00Z')
        data = {
            'project': self.project.id,
            'name': 'Renamed Sprint',
            'starts_at': '2026-07-01T09:00:00Z',
            'ends_at': '2026-07-14T17:00:00Z',
        }
        response = self.client.put(reverse('sprint-detail', args=[sprint.id]), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Renamed Sprint')

    # ── Update Sprint (PATCH) ──

    def test_patch_sprint_status_to_active(self):
        self.client.force_authenticate(self.leader)
        sprint = Sprint.objects.create(project=self.project, name='Start Sprint', starts_at='2026-07-01T09:00:00Z', ends_at='2026-07-14T17:00:00Z')
        response = self.client.patch(reverse('sprint-detail', args=[sprint.id]), {'status': 'active'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'active')

    # ── Delete Sprint ──

    def test_delete_sprint(self):
        self.client.force_authenticate(self.leader)
        sprint = Sprint.objects.create(project=self.project, name='Delete Sprint', starts_at='2026-07-01T09:00:00Z', ends_at='2026-07-14T17:00:00Z')
        response = self.client.delete(reverse('sprint-detail', args=[sprint.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_deleted_sprint_not_listed(self):
        self.client.force_authenticate(self.leader)
        sprint = Sprint.objects.create(project=self.project, name='Gone', starts_at='2026-07-01T09:00:00Z', ends_at='2026-07-14T17:00:00Z')
        sprint.delete()
        response = self.client.get(reverse('sprint-list'))
        names = [s['name'] for s in response.data]
        self.assertNotIn('Gone', names)


class SprintTaskAPITests(APITestCase):
    def setUp(self):
        self.leader = User.objects.create_user(username='sprintlead', email='sprintlead@uni.edu.eg', role=User.Role.STUDENT)
        self.member = User.objects.create_user(username='sprintmember', email='sprintmember@uni.edu.eg', role=User.Role.STUDENT)
        self.outsider = User.objects.create_user(username='outsider', email='outsider@uni.edu.eg', role=User.Role.STUDENT)
        self.project = create_project(
            creator=self.leader,
            name='Sprint Project',
            project_type=Project.Type.COURSE,
            methodology=Project.Methodology.SPRINT,
        )
        self.project.memberships.create(user=self.member)
        self.sprint = Sprint.objects.create(project=self.project, name='Sprint 1', starts_at='2026-07-01T09:00:00Z', ends_at='2026-07-14T17:00:00Z')
        self.task = Task.objects.create(project=self.project, title='Sprint Task', creator=self.leader)

    # ── List Sprint-Task Assignments ──

    def test_list_sprint_tasks_empty(self):
        self.client.force_authenticate(self.leader)
        response = self.client.get(reverse('sprint-task-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_list_sprint_tasks_unauthenticated(self):
        response = self.client.get(reverse('sprint-task-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # ── Assign Task to Sprint ──

    def test_assign_task_to_sprint(self):
        self.client.force_authenticate(self.leader)
        data = {'sprint': self.sprint.id, 'task': self.task.id}
        response = self.client.post(reverse('sprint-task-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['sprint'], self.sprint.id)
        self.assertEqual(response.data['task'], self.task.id)

    def test_assign_task_to_sprint_as_member(self):
        self.client.force_authenticate(self.member)
        data = {'sprint': self.sprint.id, 'task': self.task.id}
        response = self.client.post(reverse('sprint-task-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_assign_task_to_sprint_as_outsider_fails(self):
        self.client.force_authenticate(self.outsider)
        data = {'sprint': self.sprint.id, 'task': self.task.id}
        response = self.client.post(reverse('sprint-task-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_assign_task_to_sprint_duplicate_fails(self):
        self.client.force_authenticate(self.leader)
        SprintTask.objects.create(sprint=self.sprint, task=self.task)
        data = {'sprint': self.sprint.id, 'task': self.task.id}
        response = self.client.post(reverse('sprint-task-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # ── Get Sprint-Task Assignment ──

    def test_get_sprint_task(self):
        self.client.force_authenticate(self.leader)
        st = SprintTask.objects.create(sprint=self.sprint, task=self.task)
        response = self.client.get(reverse('sprint-task-detail', args=[st.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['task'], self.task.id)

    # ── Remove Task from Sprint ──

    def test_delete_sprint_task(self):
        self.client.force_authenticate(self.leader)
        st = SprintTask.objects.create(sprint=self.sprint, task=self.task)
        response = self.client.delete(reverse('sprint-task-detail', args=[st.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_sprint_task_not_found(self):
        self.client.force_authenticate(self.leader)
        response = self.client.delete(reverse('sprint-task-detail', args=[9999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class MilestoneAPITests(APITestCase):
    def setUp(self):
        self.leader = User.objects.create_user(username='milelead', email='milelead@uni.edu.eg', role=User.Role.STUDENT)
        self.member = User.objects.create_user(username='milemember', email='milemember@uni.edu.eg', role=User.Role.STUDENT)
        self.outsider = User.objects.create_user(username='outsider', email='outsider@uni.edu.eg', role=User.Role.STUDENT)
        self.project = create_project(
            creator=self.leader,
            name='Milestone Project',
            project_type=Project.Type.COURSE,
            methodology=Project.Methodology.MILESTONE,
        )
        self.project.memberships.create(user=self.member)

    # ── List Milestones ──

    def test_list_milestones_empty(self):
        self.client.force_authenticate(self.leader)
        response = self.client.get(reverse('milestone-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_list_milestones_unauthenticated(self):
        response = self.client.get(reverse('milestone-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # ── Create Milestone ──

    def test_create_milestone(self):
        self.client.force_authenticate(self.leader)
        data = {'project': self.project.id, 'name': 'Prototype Review', 'due_at': '2026-08-01T12:00:00Z'}
        response = self.client.post(reverse('milestone-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'Prototype Review')

    def test_create_milestone_as_member(self):
        self.client.force_authenticate(self.member)
        data = {'project': self.project.id, 'name': 'Alpha', 'due_at': '2026-08-01T12:00:00Z'}
        response = self.client.post(reverse('milestone-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_milestone_as_outsider_fails(self):
        self.client.force_authenticate(self.outsider)
        data = {'project': self.project.id, 'name': 'Fail', 'due_at': '2026-08-01T12:00:00Z'}
        response = self.client.post(reverse('milestone-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_milestone_on_wrong_methodology_fails(self):
        self.client.force_authenticate(self.leader)
        kanban_project = create_project(
            creator=self.leader, name='Kanban', project_type=Project.Type.COURSE, methodology=Project.Methodology.KANBAN,
        )
        data = {'project': kanban_project.id, 'name': 'Bad', 'due_at': '2026-08-01T12:00:00Z'}
        response = self.client.post(reverse('milestone-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_milestone_missing_required_fields(self):
        self.client.force_authenticate(self.leader)
        response = self.client.post(reverse('milestone-list'), {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # ── Get Milestone ──

    def test_get_milestone(self):
        self.client.force_authenticate(self.leader)
        milestone = Milestone.objects.create(project=self.project, name='My Mile', due_at='2026-08-01T12:00:00Z')
        response = self.client.get(reverse('milestone-detail', args=[milestone.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'My Mile')

    def test_get_milestone_not_found(self):
        self.client.force_authenticate(self.leader)
        response = self.client.get(reverse('milestone-detail', args=[9999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # ── Milestone Dashboard ──

    def test_milestone_dashboard(self):
        self.client.force_authenticate(self.leader)
        milestone = Milestone.objects.create(project=self.project, name='Mile Dash', due_at='2026-08-01T12:00:00Z')
        response = self.client.get(reverse('milestone-dashboard', args=[milestone.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('milestone', response.data)
        self.assertIn('total_tasks', response.data)
        self.assertIn('progress_percent', response.data)

    # ── Replace Milestone (PUT) ──

    def test_replace_milestone(self):
        self.client.force_authenticate(self.leader)
        milestone = Milestone.objects.create(project=self.project, name='Old', due_at='2026-08-01T12:00:00Z')
        data = {'project': self.project.id, 'name': 'Renamed', 'due_at': '2026-09-01T12:00:00Z'}
        response = self.client.put(reverse('milestone-detail', args=[milestone.id]), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Renamed')

    # ── Update Milestone (PATCH) ──

    def test_patch_milestone_status_to_completed(self):
        self.client.force_authenticate(self.leader)
        milestone = Milestone.objects.create(project=self.project, name='Complete', due_at='2026-08-01T12:00:00Z')
        response = self.client.patch(reverse('milestone-detail', args=[milestone.id]), {'status': 'completed'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'completed')

    # ── Delete Milestone ──

    def test_delete_milestone(self):
        self.client.force_authenticate(self.leader)
        milestone = Milestone.objects.create(project=self.project, name='Delete Mile', due_at='2026-08-01T12:00:00Z')
        response = self.client.delete(reverse('milestone-detail', args=[milestone.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_deleted_milestone_not_listed(self):
        self.client.force_authenticate(self.leader)
        milestone = Milestone.objects.create(project=self.project, name='Gone', due_at='2026-08-01T12:00:00Z')
        milestone.delete()
        response = self.client.get(reverse('milestone-list'))
        names = [m['name'] for m in response.data]
        self.assertNotIn('Gone', names)


class MilestoneTaskAPITests(APITestCase):
    def setUp(self):
        self.leader = User.objects.create_user(username='milelead', email='milelead@uni.edu.eg', role=User.Role.STUDENT)
        self.member = User.objects.create_user(username='milemember', email='milemember@uni.edu.eg', role=User.Role.STUDENT)
        self.outsider = User.objects.create_user(username='outsider', email='outsider@uni.edu.eg', role=User.Role.STUDENT)
        self.project = create_project(
            creator=self.leader,
            name='Milestone Project',
            project_type=Project.Type.COURSE,
            methodology=Project.Methodology.MILESTONE,
        )
        self.project.memberships.create(user=self.member)
        self.milestone = Milestone.objects.create(project=self.project, name='M1', due_at='2026-08-01T12:00:00Z')
        self.task = Task.objects.create(project=self.project, title='MTask', creator=self.leader)

    def test_list_milestone_tasks_empty(self):
        self.client.force_authenticate(self.leader)
        response = self.client.get(reverse('milestone-task-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_assign_task_to_milestone(self):
        self.client.force_authenticate(self.leader)
        data = {'milestone': self.milestone.id, 'task': self.task.id}
        response = self.client.post(reverse('milestone-task-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['milestone'], self.milestone.id)
        self.assertEqual(response.data['task'], self.task.id)

    def test_assign_task_to_milestone_as_member(self):
        self.client.force_authenticate(self.member)
        data = {'milestone': self.milestone.id, 'task': self.task.id}
        response = self.client.post(reverse('milestone-task-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_assign_task_to_milestone_as_outsider_fails(self):
        self.client.force_authenticate(self.outsider)
        data = {'milestone': self.milestone.id, 'task': self.task.id}
        response = self.client.post(reverse('milestone-task-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_assign_task_cross_project_fails(self):
        self.client.force_authenticate(self.leader)
        other = create_project(
            creator=self.leader, name='Other', project_type=Project.Type.COURSE, methodology=Project.Methodology.KANBAN,
        )
        other_task = Task.objects.create(project=other, title='Other task', creator=self.leader)
        data = {'milestone': self.milestone.id, 'task': other_task.id}
        response = self.client.post(reverse('milestone-task-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_milestone_task(self):
        self.client.force_authenticate(self.leader)
        mt = MilestoneTask.objects.create(milestone=self.milestone, task=self.task)
        response = self.client.get(reverse('milestone-task-detail', args=[mt.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_milestone_task(self):
        self.client.force_authenticate(self.leader)
        mt = MilestoneTask.objects.create(milestone=self.milestone, task=self.task)
        response = self.client.delete(reverse('milestone-task-detail', args=[mt.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class BoardColumnAPITests(APITestCase):
    def setUp(self):
        self.leader = User.objects.create_user(username='kanbanlead', email='kanbanlead@uni.edu.eg', role=User.Role.STUDENT)
        self.member = User.objects.create_user(username='kanbanmember', email='kanbanmember@uni.edu.eg', role=User.Role.STUDENT)
        self.outsider = User.objects.create_user(username='outsider', email='outsider@uni.edu.eg', role=User.Role.STUDENT)
        self.project = create_project(
            creator=self.leader,
            name='Kanban Project',
            project_type=Project.Type.COURSE,
            methodology=Project.Methodology.KANBAN,
        )
        self.project.memberships.create(user=self.member)

    # ── List Columns ──

    def test_list_columns_empty(self):
        self.client.force_authenticate(self.leader)
        response = self.client.get(reverse('board-column-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_list_columns_unauthenticated(self):
        response = self.client.get(reverse('board-column-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # ── Create Column ──

    def test_create_column(self):
        self.client.force_authenticate(self.leader)
        data = {'project': self.project.id, 'name': 'To Do', 'position': 10}
        response = self.client.post(reverse('board-column-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'To Do')

    def test_create_column_as_member(self):
        self.client.force_authenticate(self.member)
        data = {'project': self.project.id, 'name': 'In Progress', 'position': 20}
        response = self.client.post(reverse('board-column-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_column_as_outsider_fails(self):
        self.client.force_authenticate(self.outsider)
        data = {'project': self.project.id, 'name': 'Fail', 'position': 10}
        response = self.client.post(reverse('board-column-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_column_on_wrong_methodology_fails(self):
        self.client.force_authenticate(self.leader)
        sprint_project = create_project(
            creator=self.leader, name='Sprint', project_type=Project.Type.COURSE, methodology=Project.Methodology.SPRINT,
        )
        data = {'project': sprint_project.id, 'name': 'Bad Column'}
        response = self.client.post(reverse('board-column-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_duplicate_column_name_fails(self):
        self.client.force_authenticate(self.leader)
        BoardColumn.objects.create(project=self.project, name='Duplicate')
        data = {'project': self.project.id, 'name': 'Duplicate'}
        response = self.client.post(reverse('board-column-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # ── Get Column ──

    def test_get_column(self):
        self.client.force_authenticate(self.leader)
        col = BoardColumn.objects.create(project=self.project, name='Review')
        response = self.client.get(reverse('board-column-detail', args=[col.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Review')

    def test_get_column_not_found(self):
        self.client.force_authenticate(self.leader)
        response = self.client.get(reverse('board-column-detail', args=[9999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # ── Replace Column (PUT) ──

    def test_replace_column(self):
        self.client.force_authenticate(self.leader)
        col = BoardColumn.objects.create(project=self.project, name='Old', position=10)
        data = {'project': self.project.id, 'name': 'Renamed', 'position': 20}
        response = self.client.put(reverse('board-column-detail', args=[col.id]), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Renamed')

    # ── Update Column (PATCH) ──

    def test_patch_column_position(self):
        self.client.force_authenticate(self.leader)
        col = BoardColumn.objects.create(project=self.project, name='Move Me', position=10)
        response = self.client.patch(reverse('board-column-detail', args=[col.id]), {'position': 50}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['position'], 50)

    # ── Delete Column ──

    def test_delete_column(self):
        self.client.force_authenticate(self.leader)
        col = BoardColumn.objects.create(project=self.project, name='Delete Me')
        response = self.client.delete(reverse('board-column-detail', args=[col.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(BoardColumn.objects.filter(id=col.id).exists())

    def test_deleted_column_not_listed(self):
        self.client.force_authenticate(self.leader)
        col = BoardColumn.objects.create(project=self.project, name='Gone')
        col.delete()
        response = self.client.get(reverse('board-column-list'))
        names = [c['name'] for c in response.data]
        self.assertNotIn('Gone', names)

    # ── Kanban Dashboard ──

    def test_kanban_dashboard(self):
        self.client.force_authenticate(self.leader)
        BoardColumn.objects.create(project=self.project, name='To Do', position=10)
        response = self.client.get(reverse('board-column-dashboard'), {'project': self.project.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('columns', response.data)
        self.assertIn('tasks', response.data)
        self.assertIn('throughput', response.data)
        self.assertIn('blocked_tasks', response.data)
