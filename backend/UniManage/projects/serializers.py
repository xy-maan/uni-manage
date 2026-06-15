from django.contrib.auth import get_user_model
from rest_framework import serializers

from . import services
from .models import (
    Deliverable, DeliverableFile, Feedback, JoinRequest, Meeting, MeetingAttendance,
    MeetingNote, Project,
    ProjectInvitation, ProjectMembership, ProjectSupervisor, SupervisorRequest,
)

User = get_user_model()


class UserSummarySerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='get_full_name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'email', 'role', 'avatar_url']


class ProjectMembershipSerializer(serializers.ModelSerializer):
    user_detail = UserSummarySerializer(source='user', read_only=True)

    class Meta:
        model = ProjectMembership
        fields = '__all__'
        read_only_fields = ['joined_at', 'created_at', 'updated_at']


class ProjectSupervisorSerializer(serializers.ModelSerializer):
    supervisor_detail = UserSummarySerializer(source='supervisor', read_only=True)

    class Meta:
        model = ProjectSupervisor
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

    def validate(self, attrs):
        supervisor = attrs.get('supervisor') or (self.instance.supervisor if self.instance else None)
        role = attrs.get('role') or (self.instance.role if self.instance else None)
        if not supervisor or not hasattr(supervisor, 'supervisor_profile'):
            raise serializers.ValidationError({'supervisor': 'The selected user is not a supervisor.'})
        expected = 'DOCTOR' if role == SupervisorRequest.Role.PRIMARY else 'TA'
        if supervisor.supervisor_profile.title != expected:
            raise serializers.ValidationError({'role': 'Primary supervisors must be doctors and secondary supervisors must be teaching assistants.'})
        return attrs


class ProjectSerializer(serializers.ModelSerializer):
    creator_detail = UserSummarySerializer(source='creator', read_only=True)
    memberships = ProjectMembershipSerializer(many=True, read_only=True)
    supervisors = ProjectSupervisorSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ['creator', 'status', 'deleted_at', 'created_at', 'updated_at']

    def validate(self, attrs):
        min_members = attrs.get('min_members', self.instance.min_members if self.instance else 1)
        max_members = attrs.get('max_members', self.instance.max_members if self.instance else 6)
        if min_members > max_members:
            raise serializers.ValidationError({'min_members': 'Minimum members cannot exceed maximum members.'})
        return attrs

    def create(self, validated_data):
        return services.create_project(creator=self.context['request'].user, **validated_data)


class ProjectInvitationSerializer(serializers.ModelSerializer):
    invited_by_detail = UserSummarySerializer(source='invited_by', read_only=True)
    invitee_detail = UserSummarySerializer(source='invitee', read_only=True)

    class Meta:
        model = ProjectInvitation
        fields = '__all__'
        read_only_fields = ['invited_by', 'status', 'responded_at', 'created_at', 'updated_at']

    def create(self, validated_data):
        return services.create_invitation(invited_by=self.context['request'].user, **validated_data)


class JoinRequestSerializer(serializers.ModelSerializer):
    user_detail = UserSummarySerializer(source='user', read_only=True)

    class Meta:
        model = JoinRequest
        fields = '__all__'
        read_only_fields = ['user', 'status', 'responded_at', 'created_at', 'updated_at']

    def create(self, validated_data):
        return services.create_join_request(user=self.context['request'].user, **validated_data)


class SupervisorRequestSerializer(serializers.ModelSerializer):
    requested_by_detail = UserSummarySerializer(source='requested_by', read_only=True)
    supervisor_detail = UserSummarySerializer(source='supervisor', read_only=True)

    class Meta:
        model = SupervisorRequest
        fields = '__all__'
        read_only_fields = ['requested_by', 'status', 'responded_at', 'modification_note', 'created_at', 'updated_at']

    def create(self, validated_data):
        return services.create_supervisor_request(requested_by=self.context['request'].user, **validated_data)


class DeliverableFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliverableFile
        fields = '__all__'
        read_only_fields = ['uploaded_by', 'created_at', 'updated_at']


class DeliverableSerializer(serializers.ModelSerializer):
    files = DeliverableFileSerializer(many=True, read_only=True)

    class Meta:
        model = Deliverable
        fields = '__all__'
        read_only_fields = [
            'created_by', 'status', 'submitted_at', 'reviewed_by', 'reviewed_at',
            'review_note', 'deleted_at', 'created_at', 'updated_at',
        ]


class MeetingSerializer(serializers.ModelSerializer):
    notes = serializers.SerializerMethodField()
    attendance_records = serializers.SerializerMethodField()

    class Meta:
        model = Meeting
        fields = '__all__'
        read_only_fields = ['created_by', 'deleted_at', 'created_at', 'updated_at']

    def validate(self, attrs):
        starts_at = attrs.get('starts_at') or (self.instance.starts_at if self.instance else None)
        ends_at = attrs.get('ends_at') or (self.instance.ends_at if self.instance else None)
        if ends_at and starts_at and ends_at <= starts_at:
            raise serializers.ValidationError({'ends_at': 'Meeting end must be after its start.'})
        return attrs

    def get_notes(self, obj):
        return MeetingNoteSerializer(obj.notes.select_related('author'), many=True, context=self.context).data

    def get_attendance_records(self, obj):
        return MeetingAttendanceSerializer(obj.attendance_records.select_related('user'), many=True, context=self.context).data


class MeetingAttendanceSerializer(serializers.ModelSerializer):
    user_detail = UserSummarySerializer(source='user', read_only=True)

    class Meta:
        model = MeetingAttendance
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class MeetingNoteSerializer(serializers.ModelSerializer):
    author_detail = UserSummarySerializer(source='author', read_only=True)

    class Meta:
        model = MeetingNote
        fields = '__all__'
        read_only_fields = ['author', 'created_at', 'updated_at']


class FeedbackSerializer(serializers.ModelSerializer):
    author_detail = UserSummarySerializer(source='author', read_only=True)

    class Meta:
        model = Feedback
        fields = '__all__'
        read_only_fields = ['author', 'created_at', 'updated_at']

    def validate(self, attrs):
        data = {
            'project': attrs.get('project', self.instance.project if self.instance else None),
            'task': attrs.get('task', self.instance.task if self.instance else None),
            'deliverable': attrs.get('deliverable', self.instance.deliverable if self.instance else None),
            'meeting': attrs.get('meeting', self.instance.meeting if self.instance else None),
        }
        services.validate_feedback_targets(data)
        return attrs

    def create(self, validated_data):
        return services.create_feedback(author=self.context['request'].user, **validated_data)
