from django.db.models import Q
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response

from projects.services import is_project_participant

from . import services
from .models import (
    BoardColumn, Milestone, MilestoneTask, Sprint, SprintTask, Task, TaskActivity,
    TaskAttachment, TaskChecklist, TaskChecklistItem, TaskComment, TaskLabel,
)
from .serializers import (
    BoardColumnSerializer, MilestoneSerializer, MilestoneTaskSerializer,
    SprintSerializer, SprintTaskSerializer, TaskActivitySerializer,
    TaskAttachmentSerializer, TaskChecklistItemSerializer, TaskChecklistSerializer,
    TaskCommentSerializer, TaskLabelSerializer, TaskSerializer,
)


def participant_filter(user, prefix='project'):
    return Q(**{f'{prefix}__memberships__user': user}) | Q(**{f'{prefix}__supervisors__supervisor': user})


class SoftDeleteViewSetMixin:
    def perform_destroy(self, instance):
        instance.delete()


class ProjectResourceViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    project_field = 'project'

    def get_queryset(self):
        return self.queryset.filter(participant_filter(self.request.user, self.project_field)).distinct()

    def _project(self, serializer):
        return serializer.validated_data.get(self.project_field) or getattr(serializer.instance, self.project_field)

    def perform_create(self, serializer):
        services.require_participant(self.request.user, self._project(serializer))
        serializer.save()

    def perform_update(self, serializer):
        services.require_participant(self.request.user, self._project(serializer))
        serializer.save()


class TaskViewSet(SoftDeleteViewSetMixin, viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Task.objects.filter(participant_filter(self.request.user)).distinct().select_related(
            'project', 'creator', 'assignee', 'board_column'
        ).prefetch_related('labels', 'comments__author', 'attachments', 'checklists__items', 'activity')
        project_id = self.request.query_params.get('project')
        assignee_id = self.request.query_params.get('assignee')
        status_value = self.request.query_params.get('status')
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        if assignee_id:
            queryset = queryset.filter(assignee_id=assignee_id)
        if status_value:
            queryset = queryset.filter(status=status_value)
        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        services.save_task(serializer=serializer, user=self.request.user)

    def perform_update(self, serializer):
        services.save_task(serializer=serializer, user=self.request.user)


class TaskCommentViewSet(viewsets.ModelViewSet):
    serializer_class = TaskCommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TaskComment.objects.filter(participant_filter(self.request.user, 'task__project')).distinct().select_related('task', 'author')

    def perform_create(self, serializer):
        task = serializer.validated_data['task']
        services.require_participant(self.request.user, task.project)
        serializer.save(author=self.request.user)

    def perform_update(self, serializer):
        if serializer.instance.author_id != self.request.user.id:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only the comment author may edit it.')
        serializer.save()

    def perform_destroy(self, instance):
        if instance.author_id != self.request.user.id:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only the comment author may delete it.')
        instance.delete()


class TaskAttachmentViewSet(viewsets.ModelViewSet):
    serializer_class = TaskAttachmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return TaskAttachment.objects.filter(participant_filter(self.request.user, 'task__project')).distinct().select_related('task', 'uploaded_by')

    def perform_create(self, serializer):
        task = serializer.validated_data['task']
        services.require_participant(self.request.user, task.project)
        serializer.save(uploaded_by=self.request.user)


class TaskChecklistViewSet(viewsets.ModelViewSet):
    serializer_class = TaskChecklistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TaskChecklist.objects.filter(participant_filter(self.request.user, 'task__project')).distinct().select_related('task')

    def perform_create(self, serializer):
        task = serializer.validated_data['task']
        services.require_participant(self.request.user, task.project)
        serializer.save()

    def perform_update(self, serializer):
        services.require_participant(self.request.user, serializer.instance.task.project)
        serializer.save()


class TaskChecklistItemViewSet(viewsets.ModelViewSet):
    serializer_class = TaskChecklistItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TaskChecklistItem.objects.filter(participant_filter(self.request.user, 'checklist__task__project')).distinct().select_related(
            'checklist', 'completed_by'
        )

    def perform_create(self, serializer):
        services.save_checklist_item(serializer=serializer, user=self.request.user)

    def perform_update(self, serializer):
        services.save_checklist_item(serializer=serializer, user=self.request.user)


class TaskActivityViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TaskActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TaskActivity.objects.filter(participant_filter(self.request.user, 'task__project')).distinct().select_related('task', 'actor')


class TaskLabelViewSet(ProjectResourceViewSet):
    queryset = TaskLabel.objects.select_related('project')
    serializer_class = TaskLabelSerializer


class SprintViewSet(SoftDeleteViewSetMixin, ProjectResourceViewSet):
    queryset = Sprint.objects.select_related('project')
    serializer_class = SprintSerializer

    @action(detail=True, methods=['get'])
    def dashboard(self, request, pk=None):
        sprint = self.get_object()
        tasks = Task.objects.filter(sprint_task__sprint=sprint).select_related('assignee', 'creator', 'board_column')
        completed = tasks.filter(status=Task.Status.DONE)
        total_story_points = sum(task.story_points or 0 for task in tasks)
        completed_story_points = sum(task.story_points or 0 for task in completed)
        backlog_count = Task.objects.filter(project=sprint.project, sprint_task__isnull=True).count()
        return Response({
            'current_sprint': self.get_serializer(sprint).data,
            'backlog_count': backlog_count,
            'total_tasks': tasks.count(),
            'completed_tasks': completed.count(),
            'story_points': total_story_points,
            'velocity': completed_story_points,
            'sprint_tasks': TaskSerializer(tasks, many=True, context={'request': request}).data,
        })


class SprintTaskViewSet(viewsets.ModelViewSet):
    serializer_class = SprintTaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SprintTask.objects.filter(participant_filter(self.request.user, 'sprint__project')).distinct().select_related('sprint', 'task')

    def perform_create(self, serializer):
        services.require_participant(self.request.user, serializer.validated_data['sprint'].project)
        serializer.save()


class MilestoneViewSet(SoftDeleteViewSetMixin, ProjectResourceViewSet):
    queryset = Milestone.objects.select_related('project')
    serializer_class = MilestoneSerializer

    @action(detail=True, methods=['get'])
    def dashboard(self, request, pk=None):
        milestone = self.get_object()
        tasks = Task.objects.filter(milestone_task__milestone=milestone).select_related('assignee', 'creator')
        completed_count = tasks.filter(status=Task.Status.DONE).count()
        total_count = tasks.count()
        return Response({
            'milestone': self.get_serializer(milestone).data,
            'total_tasks': total_count,
            'completed_tasks': completed_count,
            'progress_percent': round((completed_count / total_count) * 100, 2) if total_count else 0,
            'tasks': TaskSerializer(tasks, many=True, context={'request': request}).data,
        })


class MilestoneTaskViewSet(viewsets.ModelViewSet):
    serializer_class = MilestoneTaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MilestoneTask.objects.filter(participant_filter(self.request.user, 'milestone__project')).distinct().select_related('milestone', 'task')

    def perform_create(self, serializer):
        services.require_participant(self.request.user, serializer.validated_data['milestone'].project)
        serializer.save()


class BoardColumnViewSet(SoftDeleteViewSetMixin, ProjectResourceViewSet):
    queryset = BoardColumn.objects.select_related('project')
    serializer_class = BoardColumnSerializer

    @action(detail=False, methods=['get'], url_path='dashboard')
    def dashboard(self, request):
        project_id = request.query_params.get('project')
        columns = self.get_queryset()
        if project_id:
            columns = columns.filter(project_id=project_id)
        tasks = Task.objects.filter(project_id__in=columns.values_list('project_id', flat=True)).select_related('assignee', 'creator', 'board_column')
        if project_id:
            tasks = tasks.filter(project_id=project_id)
        completed_tasks = tasks.filter(status=Task.Status.DONE)
        return Response({
            'columns': BoardColumnSerializer(columns, many=True, context={'request': request}).data,
            'tasks': TaskSerializer(tasks, many=True, context={'request': request}).data,
            'throughput': completed_tasks.count(),
            'blocked_tasks': tasks.filter(priority=Task.Priority.URGENT).exclude(status=Task.Status.DONE).count(),
            'cycle_time_hours': None,
        })
