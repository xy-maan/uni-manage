from django.contrib.auth import get_user_model
from rest_framework import serializers

from . import services
from .models import (
    AcademicYear, Category, Deliverable, DeliverableFile, Feedback, JoinRequest,
    Meeting, MeetingAttendance, MeetingNote, Project,
    ProjectInvitation, ProjectMembership, ProjectSupervisor, Semester,
    Subject, SupervisorRequest, Technology,
)
from users.serializers import SkillSerializer
from users.models import Skill

User = get_user_model()


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name', 'code', 'credit_hours', 'description']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class SemesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semester
        fields = ['id', 'name']


class AcademicYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicYear
        fields = ['id', 'name']


class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = ['id', 'name', 'is_official']


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
    subject = SubjectSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    semester = SemesterSerializer(read_only=True)
    academic_year = AcademicYearSerializer(read_only=True)
    technologies = TechnologySerializer(many=True, read_only=True)
    archive_tags = SkillSerializer(many=True, read_only=True)
    archive_tag_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False,
    )
    technology_names = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False,
    )

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'subject', 'category', 'semester',
            'academic_year', 'technologies', 'project_type', 'methodology',
            'status', 'creator', 'creator_detail', 'memberships', 'supervisors',
            'min_members', 'max_members', 'is_public', 'proposal', 'abstract',
            'expected_scope', 'repository_url', 'documentation_url',
            'archive_year', 'archive_tags', 'deleted_at', 'created_at', 'updated_at',
            'technology_names', 'archive_tag_ids',
        ]
        read_only_fields = ['creator', 'status', 'deleted_at', 'created_at', 'updated_at']

    def validate(self, attrs):
        min_members = attrs.get('min_members', self.instance.min_members if self.instance else 1)
        max_members = attrs.get('max_members', self.instance.max_members if self.instance else 6)
        if min_members > max_members:
            raise serializers.ValidationError({'min_members': 'Minimum members cannot exceed maximum members.'})
        return attrs

    def create(self, validated_data):
        technology_names = validated_data.pop('technology_names', [])
        archive_tag_ids = validated_data.pop('archive_tag_ids', [])
        project = services.create_project(creator=self.context['request'].user, **validated_data)
        if technology_names:
            resolved = services.resolve_technologies(technology_names, user=self.context['request'].user)
            project.technologies.set(resolved)
        if archive_tag_ids:
            project.archive_tags.set(Skill.objects.filter(id__in=archive_tag_ids))
        return project

    def update(self, instance, validated_data):
        technology_names = validated_data.pop('technology_names', None)
        archive_tag_ids = validated_data.pop('archive_tag_ids', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if technology_names is not None:
            resolved = services.resolve_technologies(technology_names, user=self.context['request'].user)
            instance.technologies.set(resolved)
        if archive_tag_ids is not None:
            instance.archive_tags.set(Skill.objects.filter(id__in=archive_tag_ids))
        return instance


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
    technology_stack = TechnologySerializer(many=True, read_only=True)
    technology_names = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False,
    )

    class Meta:
        model = SupervisorRequest
        fields = [
            'id', 'project', 'requested_by', 'supervisor', 'role',
            'message', 'proposal', 'abstract', 'technology_stack',
            'expected_scope', 'modification_note', 'status',
            'responded_at', 'created_at', 'updated_at',
            'requested_by_detail', 'supervisor_detail', 'technology_names',
        ]
        read_only_fields = ['requested_by', 'status', 'responded_at', 'modification_note', 'created_at', 'updated_at']

    def create(self, validated_data):
        technology_names = validated_data.pop('technology_names', None)
        return services.create_supervisor_request(
            requested_by=self.context['request'].user,
            _technology_names=technology_names,
            **validated_data,
        )


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
