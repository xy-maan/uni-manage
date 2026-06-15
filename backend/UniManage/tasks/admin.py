from django.contrib import admin

from .models import (
    BoardColumn, Milestone, MilestoneTask, Sprint, SprintTask, Task, TaskActivity,
    TaskAttachment, TaskChecklist, TaskChecklistItem, TaskComment, TaskLabel,
)

admin.site.register([
    Task, TaskComment, TaskAttachment, TaskChecklist, TaskChecklistItem,
    TaskActivity, TaskLabel, Sprint, SprintTask, Milestone, MilestoneTask,
    BoardColumn,
])
