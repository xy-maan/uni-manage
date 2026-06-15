from rest_framework import serializers

from projects.serializers import UserSummarySerializer

from . import services
from .models import (
    BoardColumn, Milestone, MilestoneTask, Sprint, SprintTask, Task,
    TaskActivity, TaskAttachment, TaskChecklist, TaskChecklistItem, TaskComment,
    TaskLabel,
)


class TaskLabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskLabel
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class BoardColumnSerializer(serializers.ModelSerializer):
    class Meta:
        model = BoardColumn
        fields = '__all__'
        read_only_fields = ['deleted_at', 'created_at', 'updated_at']

    def validate(self, attrs):
        services.validate_board_column(attrs, self.instance)
        return attrs


class TaskCommentSerializer(serializers.ModelSerializer):
    author_detail = UserSummarySerializer(source='author', read_only=True)

    class Meta:
        model = TaskComment
        fields = '__all__'
        read_only_fields = ['author', 'created_at', 'updated_at']


class TaskAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskAttachment
        fields = '__all__'
        read_only_fields = ['uploaded_by', 'created_at', 'updated_at']


class TaskActivitySerializer(serializers.ModelSerializer):
    actor_detail = UserSummarySerializer(source='actor', read_only=True)

    class Meta:
        model = TaskActivity
        fields = '__all__'
        read_only_fields = ['actor', 'created_at', 'updated_at']


class TaskChecklistItemSerializer(serializers.ModelSerializer):
    completed_by_detail = UserSummarySerializer(source='completed_by', read_only=True)

    class Meta:
        model = TaskChecklistItem
        fields = '__all__'
        read_only_fields = ['completed_by', 'completed_at', 'created_at', 'updated_at']


class TaskChecklistSerializer(serializers.ModelSerializer):
    items = TaskChecklistItemSerializer(many=True, read_only=True)

    class Meta:
        model = TaskChecklist
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class TaskSerializer(serializers.ModelSerializer):
    creator_detail = UserSummarySerializer(source='creator', read_only=True)
    assignee_detail = UserSummarySerializer(source='assignee', read_only=True)
    comments = TaskCommentSerializer(many=True, read_only=True)
    attachments = TaskAttachmentSerializer(many=True, read_only=True)
    checklists = TaskChecklistSerializer(many=True, read_only=True)
    activity = TaskActivitySerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ['creator', 'completed_at', 'deleted_at', 'created_at', 'updated_at']


class SprintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sprint
        fields = '__all__'
        read_only_fields = ['deleted_at', 'created_at', 'updated_at']

    def validate(self, attrs):
        services.validate_sprint(attrs, self.instance)
        return attrs


class SprintTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = SprintTask
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

    def validate(self, attrs):
        sprint = attrs.get('sprint') or self.instance.sprint
        task = attrs.get('task') or self.instance.task
        services.validate_sprint_task(sprint, task)
        return attrs


class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = '__all__'
        read_only_fields = ['deleted_at', 'created_at', 'updated_at']

    def validate(self, attrs):
        services.validate_milestone(attrs, self.instance)
        return attrs


class MilestoneTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = MilestoneTask
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

    def validate(self, attrs):
        milestone = attrs.get('milestone') or self.instance.milestone
        task = attrs.get('task') or self.instance.task
        services.validate_milestone_task(milestone, task)
        return attrs
