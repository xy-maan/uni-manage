from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import PermissionDenied, ValidationError

from projects.models import Project
from projects.services import is_project_participant

from .models import BoardColumn, Milestone, MilestoneTask, Sprint, SprintTask, Task, TaskActivity


def require_participant(user, project):
    if not is_project_participant(user, project):
        raise PermissionDenied('You are not a participant in this project.')


def require_methodology(project, methodology):
    if project.methodology != methodology:
        raise ValidationError(f'This operation requires the {methodology} methodology.')


def validate_task_relations(data, instance=None):
    project = data.get('project') or (instance.project if instance else None)
    assignee = data.get('assignee', instance.assignee if instance else None)
    column = data.get('board_column', instance.board_column if instance else None)
    labels = data.get('labels', [])
    if assignee and not project.memberships.filter(user=assignee).exists():
        raise ValidationError({'assignee': 'The assignee must be a project member.'})
    if column and column.project_id != project.id:
        raise ValidationError({'board_column': 'The board column belongs to another project.'})
    if any(label.project_id != project.id for label in labels):
        raise ValidationError({'labels': 'All labels must belong to the task project.'})


@transaction.atomic
def save_task(*, serializer, user):
    project = serializer.validated_data.get('project') or serializer.instance.project
    require_participant(user, project)
    validate_task_relations(serializer.validated_data, serializer.instance)
    created = serializer.instance is None
    task = serializer.save(creator=user) if serializer.instance is None else serializer.save()
    if task.status == Task.Status.DONE and not task.completed_at:
        task.completed_at = timezone.now()
        task.save(update_fields=['completed_at', 'updated_at'])
    elif task.status != Task.Status.DONE and task.completed_at:
        task.completed_at = None
        task.save(update_fields=['completed_at', 'updated_at'])
    TaskActivity.objects.create(
        task=task,
        actor=user,
        action='created' if created else 'updated',
        message=f'Task {"created" if created else "updated"}: {task.title}',
    )
    from notifications.services import create_notification
    recipients = {membership.user for membership in task.project.memberships.select_related('user')}
    recipients.update(supervisor.supervisor for supervisor in task.project.supervisors.select_related('supervisor'))
    recipients.discard(user)
    for recipient in recipients:
        create_notification(
            recipient=recipient,
            actor=user,
            notification_type='task_update',
            title='Task updated',
            message=f'{task.title} was {"created" if created else "updated"}.',
            data={'project_id': task.project_id, 'task_id': task.id},
        )
    return task


@transaction.atomic
def save_checklist_item(*, serializer, user):
    item = serializer.instance
    checklist = serializer.validated_data.get('checklist') or item.checklist
    require_participant(user, checklist.task.project)
    was_completed = item.is_completed if item else False
    saved = serializer.save()
    if saved.is_completed and not was_completed:
        saved.completed_by = user
        saved.completed_at = timezone.now()
        saved.save(update_fields=['completed_by', 'completed_at', 'updated_at'])
    elif not saved.is_completed and (saved.completed_by_id or saved.completed_at):
        saved.completed_by = None
        saved.completed_at = None
        saved.save(update_fields=['completed_by', 'completed_at', 'updated_at'])
    return saved


def validate_sprint(data, instance=None):
    project = data.get('project') or (instance.project if instance else None)
    require_methodology(project, Project.Methodology.SPRINT)
    starts_at = data.get('starts_at') or (instance.starts_at if instance else None)
    ends_at = data.get('ends_at') or (instance.ends_at if instance else None)
    if starts_at and ends_at and ends_at <= starts_at:
        raise ValidationError({'ends_at': 'Sprint end must be after its start.'})


def validate_milestone(data, instance=None):
    project = data.get('project') or (instance.project if instance else None)
    require_methodology(project, Project.Methodology.MILESTONE)


def validate_board_column(data, instance=None):
    project = data.get('project') or (instance.project if instance else None)
    require_methodology(project, Project.Methodology.KANBAN)


def validate_sprint_task(sprint, task):
    if sprint.project_id != task.project_id:
        raise ValidationError('The sprint and task must belong to the same project.')


def validate_milestone_task(milestone, task):
    if milestone.project_id != task.project_id:
        raise ValidationError('The milestone and task must belong to the same project.')
