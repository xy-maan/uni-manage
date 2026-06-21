from django.db.models import Q
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from . import services
from .models import (
    AcademicYear, Category, Deliverable, DeliverableFile, Feedback, JoinRequest,
    Meeting, MeetingAttendance, MeetingNote, Project,
    ProjectInvitation, ProjectMembership, ProjectSupervisor, Semester,
    Subject, SupervisorRequest, Technology, TechnologyAlias,
)
from .serializers import (
    AcademicYearSerializer, CategorySerializer, DeliverableFileSerializer,
    DeliverableSerializer, FeedbackSerializer,
    JoinRequestSerializer, MeetingAttendanceSerializer, MeetingNoteSerializer,
    MeetingSerializer, ProjectInvitationSerializer, ProjectMembershipSerializer,
    MarketplaceProjectDetailSerializer, MarketplaceProjectListSerializer,
    MarketplaceMemberSerializer, MarketplaceSupervisorSerializer,
    ProjectSerializer, ProjectSupervisorSerializer, SemesterSerializer,
    SubjectSerializer, SupervisorRequestSerializer, TechnologySerializer,
)


class SoftDeleteViewSetMixin:
    def perform_destroy(self, instance):
        instance.delete()


class ProjectViewSet(SoftDeleteViewSetMixin, viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_value_regex = r'\d+'

    def get_queryset(self):
        user = self.request.user
        queryset = Project.objects.select_related('creator').prefetch_related('memberships__user', 'supervisors__supervisor')
        return queryset.filter(
            Q(is_public=True) | Q(memberships__user=user) | Q(supervisors__supervisor=user)
        ).distinct().order_by('-created_at')

    def perform_update(self, serializer):
        services.require_leader(self.request.user, serializer.instance)
        serializer.save()

    def perform_destroy(self, instance):
        services.require_leader(self.request.user, instance)
        super().perform_destroy(instance)

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        project = services.activate_project(project=self.get_object(), user=request.user)
        return Response(self.get_serializer(project).data)

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        project = services.submit_project_for_review(project=self.get_object(), user=request.user)
        return Response(self.get_serializer(project).data)

    @action(detail=True, methods=['post'], url_path='approve-submission')
    def approve_submission(self, request, pk=None):
        project = services.approve_project_submission(project=self.get_object(), user=request.user)
        return Response(self.get_serializer(project).data)

    @action(detail=True, methods=['post'])
    def archive(self, request, pk=None):
        project = self.get_object()
        services.require_leader(request.user, project)
        project.status = Project.Status.ARCHIVED
        project.save(update_fields=['status', 'updated_at'])
        return Response(self.get_serializer(project).data)


class ProjectMembershipViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectMembershipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ProjectMembership.objects.filter(
            Q(project__memberships__user=self.request.user) | Q(project__supervisors__supervisor=self.request.user)
        ).distinct().select_related('project', 'user')

    def perform_create(self, serializer):
        project = serializer.validated_data['project']
        services.require_leader(self.request.user, project)
        services.require_capacity(project)
        serializer.save()

    def perform_update(self, serializer):
        services.require_leader(self.request.user, serializer.instance.project)
        serializer.save()

    def perform_destroy(self, instance):
        services.require_leader(self.request.user, instance.project)
        if instance.role == ProjectMembership.Role.LEADER:
            from rest_framework.exceptions import ValidationError
            raise ValidationError('The project leader membership cannot be deleted.')
        instance.delete()


class ProjectInvitationViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectInvitationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ProjectInvitation.objects.filter(
            Q(invitee=self.request.user) | Q(invited_by=self.request.user) | Q(project__memberships__user=self.request.user)
        ).distinct().select_related('project', 'invited_by', 'invitee').order_by('-created_at')

    def perform_update(self, serializer):
        services.require_leader(self.request.user, serializer.instance.project)
        serializer.save()

    def perform_destroy(self, instance):
        services.require_leader(self.request.user, instance.project)
        instance.delete()

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        obj = services.respond_to_invitation(invitation=self.get_object(), user=request.user, accept=True)
        return Response(self.get_serializer(obj).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        obj = services.respond_to_invitation(invitation=self.get_object(), user=request.user, accept=False)
        return Response(self.get_serializer(obj).data)


class JoinRequestViewSet(viewsets.ModelViewSet):
    serializer_class = JoinRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return JoinRequest.objects.filter(
            Q(user=self.request.user) | Q(project__memberships__user=self.request.user, project__memberships__role='leader')
        ).distinct().select_related('project', 'user').order_by('-created_at')

    def perform_update(self, serializer):
        services.require_leader(self.request.user, serializer.instance.project)
        serializer.save()

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        obj = services.respond_to_join_request(join_request=self.get_object(), user=request.user, accept=True)
        return Response(self.get_serializer(obj).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        obj = services.respond_to_join_request(join_request=self.get_object(), user=request.user, accept=False)
        return Response(self.get_serializer(obj).data)


class SupervisorRequestViewSet(viewsets.ModelViewSet):
    serializer_class = SupervisorRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SupervisorRequest.objects.filter(
            Q(supervisor=self.request.user) | Q(requested_by=self.request.user) | Q(project__memberships__user=self.request.user)
        ).distinct().select_related('project', 'requested_by', 'supervisor').order_by('-created_at')

    def perform_update(self, serializer):
        services.require_leader(self.request.user, serializer.instance.project)
        serializer.save()

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        obj = services.respond_to_supervisor_request(supervisor_request=self.get_object(), user=request.user, accept=True)
        return Response(self.get_serializer(obj).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        obj = services.respond_to_supervisor_request(supervisor_request=self.get_object(), user=request.user, accept=False)
        return Response(self.get_serializer(obj).data)

    @action(detail=True, methods=['post'], url_path='request-modification')
    def request_modification(self, request, pk=None):
        obj = services.request_supervisor_modification(
            supervisor_request=self.get_object(),
            user=request.user,
            note=request.data.get('note', ''),
        )
        return Response(self.get_serializer(obj).data)


class ProjectSupervisorViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSupervisorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ProjectSupervisor.objects.filter(
            Q(project__memberships__user=self.request.user) | Q(supervisor=self.request.user)
        ).distinct().select_related('project', 'supervisor')

    def perform_create(self, serializer):
        project = serializer.validated_data['project']
        supervisor = serializer.validated_data['supervisor']
        role = serializer.validated_data['role']
        services.require_leader(self.request.user, project)
        if not SupervisorRequest.objects.filter(
            project=project,
            supervisor=supervisor,
            role=role,
            status='accepted',
        ).exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError('A matching accepted supervisor request is required.')
        serializer.save()

    def perform_update(self, serializer):
        services.require_leader(self.request.user, serializer.instance.project)
        serializer.save()

    def perform_destroy(self, instance):
        services.require_leader(self.request.user, instance.project)
        instance.delete()


class DeliverableViewSet(SoftDeleteViewSetMixin, viewsets.ModelViewSet):
    serializer_class = DeliverableSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Deliverable.objects.filter(
            Q(project__memberships__user=self.request.user) | Q(project__supervisors__supervisor=self.request.user)
        ).distinct().select_related('project', 'created_by', 'reviewed_by').prefetch_related('files')

    def perform_create(self, serializer):
        project = serializer.validated_data['project']
        if not services.is_project_participant(self.request.user, project):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('You are not a project participant.')
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        obj = services.submit_deliverable(deliverable=self.get_object(), user=request.user)
        return Response(self.get_serializer(obj).data)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        obj = services.review_deliverable(deliverable=self.get_object(), user=request.user, approve=True, note=request.data.get('note', ''))
        return Response(self.get_serializer(obj).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        obj = services.review_deliverable(deliverable=self.get_object(), user=request.user, approve=False, note=request.data.get('note', ''))
        return Response(self.get_serializer(obj).data)

    @action(detail=True, methods=['post'], url_path='request-revision')
    def request_revision(self, request, pk=None):
        obj = services.request_deliverable_revision(deliverable=self.get_object(), user=request.user, note=request.data.get('note', ''))
        return Response(self.get_serializer(obj).data)


class DeliverableFileViewSet(viewsets.ModelViewSet):
    serializer_class = DeliverableFileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return DeliverableFile.objects.filter(
            Q(deliverable__project__memberships__user=self.request.user) |
            Q(deliverable__project__supervisors__supervisor=self.request.user)
        ).distinct().select_related('deliverable', 'uploaded_by')

    def perform_create(self, serializer):
        deliverable = serializer.validated_data['deliverable']
        if not services.is_project_participant(self.request.user, deliverable.project):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('You are not a project participant.')
        serializer.save(uploaded_by=self.request.user)


class MeetingViewSet(SoftDeleteViewSetMixin, viewsets.ModelViewSet):
    serializer_class = MeetingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Meeting.objects.filter(
            Q(project__memberships__user=self.request.user) | Q(project__supervisors__supervisor=self.request.user)
        ).distinct().select_related('project', 'created_by').prefetch_related('attendees', 'notes__author', 'attendance_records__user')

    def perform_create(self, serializer):
        project = serializer.validated_data['project']
        if not services.is_project_participant(self.request.user, project):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('You are not a project participant.')
        serializer.save(created_by=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'message': 'Meeting deleted successfully.'}, status=status.HTTP_200_OK)


class MeetingAttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = MeetingAttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MeetingAttendance.objects.filter(
            Q(meeting__project__memberships__user=self.request.user) |
            Q(meeting__project__supervisors__supervisor=self.request.user)
        ).distinct().select_related('meeting', 'user')

    def perform_create(self, serializer):
        meeting = serializer.validated_data['meeting']
        if not services.is_project_participant(self.request.user, meeting.project):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('You are not a project participant.')
        serializer.save()


class MeetingNoteViewSet(viewsets.ModelViewSet):
    serializer_class = MeetingNoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MeetingNote.objects.filter(
            Q(meeting__project__memberships__user=self.request.user) |
            Q(meeting__project__supervisors__supervisor=self.request.user)
        ).distinct().select_related('meeting', 'author')

    def perform_create(self, serializer):
        meeting = serializer.validated_data['meeting']
        if not services.is_project_participant(self.request.user, meeting.project):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('You are not a project participant.')
        serializer.save(author=self.request.user)

    def perform_update(self, serializer):
        if serializer.instance.author_id != self.request.user.id:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only the note author may edit it.')
        serializer.save()

    def perform_destroy(self, instance):
        if instance.author_id != self.request.user.id:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only the note author may delete it.')
        instance.delete()


class FeedbackViewSet(viewsets.ModelViewSet):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Feedback.objects.filter(
            Q(project__memberships__user=user) |
            Q(project__supervisors__supervisor=user) |
            Q(task__project__memberships__user=user) |
            Q(task__project__supervisors__supervisor=user) |
            Q(deliverable__project__memberships__user=user) |
            Q(deliverable__project__supervisors__supervisor=user) |
            Q(meeting__project__memberships__user=user) |
            Q(meeting__project__supervisors__supervisor=user)
        ).distinct().select_related('project', 'task', 'deliverable', 'meeting', 'author')

    def perform_update(self, serializer):
        if serializer.instance.author_id != self.request.user.id:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only the feedback author may edit it.')
        data = {
            'project': serializer.validated_data.get('project', serializer.instance.project),
            'task': serializer.validated_data.get('task', serializer.instance.task),
            'deliverable': serializer.validated_data.get('deliverable', serializer.instance.deliverable),
            'meeting': serializer.validated_data.get('meeting', serializer.instance.meeting),
        }
        target_project = services.feedback_target_project(data)
        if not target_project.supervisors.filter(supervisor=self.request.user).exists():
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only a project supervisor may move feedback to this target.')
        serializer.save()

    def perform_destroy(self, instance):
        if instance.author_id != self.request.user.id:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only the feedback author may delete it.')
        instance.delete()


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = []


class SemesterListView(generics.ListAPIView):
    queryset = Semester.objects.all().order_by('name')
    serializer_class = SemesterSerializer
    permission_classes = []


class AcademicYearListView(generics.ListAPIView):
    queryset = AcademicYear.objects.all().order_by('-name')
    serializer_class = AcademicYearSerializer
    permission_classes = []


class TechnologySearchView(generics.ListAPIView):
    serializer_class = TechnologySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        query = self.request.GET.get('q', '').strip()
        if not query:
            return Technology.objects.none()
        aliases = TechnologyAlias.objects.filter(alias__icontains=query)
        alias_techs = [a.technology_id for a in aliases]
        return Technology.objects.filter(
            Q(name__icontains=query) | Q(id__in=alias_techs)
        ).distinct()


class SubjectListView(generics.ListAPIView):
    queryset = Subject.objects.all().order_by('code')
    serializer_class = SubjectSerializer
    permission_classes = []


from rest_framework.pagination import PageNumberPagination


class MarketplacePagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 50


class MarketplaceProjectListView(generics.ListAPIView):
    serializer_class = MarketplaceProjectListSerializer
    permission_classes = []
    pagination_class = MarketplacePagination

    def get_queryset(self):
        search = self.request.GET.get('search', '')
        category = self.request.GET.get('category')
        technology = self.request.GET.get('technology')
        project_type = self.request.GET.get('project_type')
        academic_year = self.request.GET.get('academic_year')
        ordering = self.request.GET.get('ordering', '-created_at')

        return services.get_marketplace_projects(
            search=search,
            category=category,
            technology=technology,
            project_type=project_type,
            academic_year=academic_year,
            ordering=ordering,
        )


class MarketplaceProjectDetailView(generics.RetrieveAPIView):
    serializer_class = MarketplaceProjectDetailSerializer
    permission_classes = []

    def get_object(self):
        project = services.get_marketplace_project_details(
            project_id=self.kwargs['project_id'],
        )
        if project is None:
            from rest_framework.exceptions import Http404
            raise Http404
        return project


class MarketplaceTechnologyListView(generics.ListAPIView):
    queryset = Technology.objects.filter(is_official=True).order_by('name')
    serializer_class = TechnologySerializer
    permission_classes = []
