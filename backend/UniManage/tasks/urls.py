from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    BoardColumnViewSet, MilestoneTaskViewSet, MilestoneViewSet, SprintTaskViewSet,
    SprintViewSet, TaskActivityViewSet, TaskAttachmentViewSet,
    TaskChecklistItemViewSet, TaskChecklistViewSet, TaskCommentViewSet,
    TaskLabelViewSet, TaskViewSet,
)

router = DefaultRouter()
router.register('', TaskViewSet, basename='task')
router.register('comments', TaskCommentViewSet, basename='task-comment')
router.register('attachments', TaskAttachmentViewSet, basename='task-attachment')
router.register('checklists', TaskChecklistViewSet, basename='task-checklist')
router.register('checklist-items', TaskChecklistItemViewSet, basename='task-checklist-item')
router.register('activity', TaskActivityViewSet, basename='task-activity')
router.register('labels', TaskLabelViewSet, basename='task-label')
router.register('sprints', SprintViewSet, basename='sprint')
router.register('sprint-tasks', SprintTaskViewSet, basename='sprint-task')
router.register('milestones', MilestoneViewSet, basename='milestone')
router.register('milestone-tasks', MilestoneTaskViewSet, basename='milestone-task')
router.register('board-columns', BoardColumnViewSet, basename='board-column')

urlpatterns = [path('', include(router.urls))]
