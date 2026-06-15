from django.test import TestCase
from rest_framework.exceptions import ValidationError

from notifications.models import Notification
from projects.models import Project
from projects.services import create_project
from users.models import User

from .models import Sprint, Task, TaskComment
from .services import validate_sprint


class TaskWorkflowTests(TestCase):
    def setUp(self):
        self.leader = User.objects.create_user(username='tasklead', email='tasklead@uni.edu.eg', role=User.Role.STUDENT)
        self.member = User.objects.create_user(username='assignee', email='assignee@uni.edu.eg', role=User.Role.STUDENT)
        self.project = create_project(
            creator=self.leader,
            name='Task Team',
            project_type=Project.Type.COURSE,
            methodology=Project.Methodology.KANBAN,
        )
        self.project.memberships.create(user=self.member)

    def test_task_assignment_and_comment_generate_notifications(self):
        task = Task.objects.create(project=self.project, title='Build API', creator=self.leader, assignee=self.member)
        self.assertTrue(Notification.objects.filter(recipient=self.member, notification_type='task_assignment').exists())
        TaskComment.objects.create(task=task, author=self.member, content='Started')
        self.assertTrue(Notification.objects.filter(recipient=self.leader, notification_type='comment').exists())

    def test_methodology_specific_records_are_rejected(self):
        with self.assertRaises(ValidationError):
            validate_sprint({'project': self.project}, None)
