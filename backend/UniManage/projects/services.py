from django.db import transaction
from django.db.models import Count, Prefetch, Q
from django.utils import timezone
from rest_framework.exceptions import PermissionDenied, ValidationError

from users.models import SupervisorProfile, User

from .models import (
    Deliverable, Feedback, JoinRequest, Project, ProjectInvitation, ProjectMembership,
    ProjectSupervisor, RequestStatus, SupervisorRequest, Technology,
)


def resolve_technologies(technology_input_list, user=None):
    technology_objs = []
    for item in technology_input_list:
        try:
            tech_id = int(item)
            tech = Technology.objects.filter(id=tech_id).first()
            if tech:
                technology_objs.append(tech)
        except ValueError:
            item_str = str(item).strip()
            if item_str:
                tech, created = Technology.objects.get_or_create(
                    name__iexact=item_str,
                    defaults={'name': item_str, 'is_official': False, 'generated_by': user},
                )
                technology_objs.append(tech)
    return technology_objs


def is_project_leader(user, project):
    return project.memberships.filter(user=user, role=ProjectMembership.Role.LEADER).exists()


def is_project_participant(user, project):
    return (
        project.memberships.filter(user=user).exists()
        or project.supervisors.filter(supervisor=user).exists()
    )


def require_leader(user, project):
    if not is_project_leader(user, project):
        raise PermissionDenied('Only the project leader may perform this action.')


def require_capacity(project):
    if project.memberships.count() >= project.max_members:
        raise ValidationError('The project has reached its member capacity.')


def require_minimum_team(project):
    if project.memberships.count() < project.min_members:
        raise ValidationError('The project has not reached its minimum team size.')


@transaction.atomic
def create_project(*, creator, **data):
    if data.get('min_members', 1) > data.get('max_members', 6):
        raise ValidationError({'min_members': 'Minimum members cannot exceed maximum members.'})
    project = Project.objects.create(creator=creator, **data)
    ProjectMembership.objects.create(project=project, user=creator, role=ProjectMembership.Role.LEADER)
    return project


@transaction.atomic
def create_invitation(*, project, invited_by, invitee, message=''):
    require_leader(invited_by, project)
    if project.memberships.filter(user=invitee).exists():
        raise ValidationError('This user is already a project member.')
    require_capacity(project)
    return ProjectInvitation.objects.create(project=project, invited_by=invited_by, invitee=invitee, message=message)


@transaction.atomic
def respond_to_invitation(*, invitation, user, accept):
    if invitation.invitee_id != user.id:
        raise PermissionDenied('Only the invitee may respond.')
    if invitation.status != RequestStatus.PENDING:
        raise ValidationError('This invitation has already been resolved.')
    if accept:
        require_capacity(invitation.project)
        ProjectMembership.objects.get_or_create(project=invitation.project, user=user)
        invitation.status = RequestStatus.ACCEPTED
    else:
        invitation.status = RequestStatus.REJECTED
    invitation.responded_at = timezone.now()
    invitation.save(update_fields=['status', 'responded_at', 'updated_at'])
    from notifications.services import create_notification
    create_notification(
        recipient=invitation.invited_by, actor=user, notification_type='approval',
        title='Invitation response',
        message=f'{user.get_full_name() or user.username} {invitation.status} the invitation to {invitation.project.name}.',
        data={'project_id': invitation.project_id, 'invitation_id': invitation.id},
    )
    return invitation


@transaction.atomic
def create_join_request(*, project, user, message=''):
    if project.memberships.filter(user=user).exists():
        raise ValidationError('You are already a project member.')
    return JoinRequest.objects.create(project=project, user=user, message=message)


@transaction.atomic
def respond_to_join_request(*, join_request, user, accept):
    require_leader(user, join_request.project)
    if join_request.status != RequestStatus.PENDING:
        raise ValidationError('This join request has already been resolved.')
    if accept:
        require_capacity(join_request.project)
        ProjectMembership.objects.get_or_create(project=join_request.project, user=join_request.user)
        join_request.status = RequestStatus.ACCEPTED
    else:
        join_request.status = RequestStatus.REJECTED
    join_request.responded_at = timezone.now()
    join_request.save(update_fields=['status', 'responded_at', 'updated_at'])
    from notifications.services import create_notification
    create_notification(
        recipient=join_request.user, actor=user, notification_type='approval',
        title='Join request response',
        message=f'Your request to join {join_request.project.name} was {join_request.status}.',
        data={'project_id': join_request.project_id, 'join_request_id': join_request.id},
    )
    return join_request


@transaction.atomic
def create_supervisor_request(
    *,
    project,
    requested_by,
    supervisor,
    role,
    message='',
    proposal='',
    abstract='',
    _technology_names=None,
    expected_scope='',
    modification_note='',
):
    require_leader(requested_by, project)
    if supervisor.role != User.Role.SUPERVISOR or not hasattr(supervisor, 'supervisor_profile'):
        raise ValidationError('The selected user is not a supervisor.')
    expected_title = SupervisorProfile.Title.DOCTOR if role == SupervisorRequest.Role.PRIMARY else SupervisorProfile.Title.TA
    if supervisor.supervisor_profile.title != expected_title:
        raise ValidationError('Primary supervisors must be doctors and secondary supervisors must be teaching assistants.')
    if project.supervisors.filter(role=role).exists():
        raise ValidationError(f'This project already has a {role} supervisor.')
    request = SupervisorRequest.objects.create(
        project=project,
        requested_by=requested_by,
        supervisor=supervisor,
        role=role,
        message=message,
        proposal=proposal or project.proposal,
        abstract=abstract or project.abstract,
        expected_scope=expected_scope or project.expected_scope,
        modification_note=modification_note,
    )
    if _technology_names is None:
        resolved = list(project.technologies.all())
    else:
        resolved = resolve_technologies(_technology_names, user=requested_by)
    if resolved:
        request.technology_stack.set(resolved)
    if project.project_type == Project.Type.GRADUATION:
        project.status = Project.Status.UNDER_REVIEW
        project.save(update_fields=['status', 'updated_at'])
    return request


@transaction.atomic
def respond_to_supervisor_request(*, supervisor_request, user, accept):
    if supervisor_request.supervisor_id != user.id:
        raise PermissionDenied('Only the requested supervisor may respond.')
    if supervisor_request.status != RequestStatus.PENDING:
        raise ValidationError('This supervisor request has already been resolved.')
    if accept:
        ProjectSupervisor.objects.create(
            project=supervisor_request.project,
            supervisor=user,
            role=supervisor_request.role,
        )
        supervisor_request.status = RequestStatus.ACCEPTED
    else:
        supervisor_request.status = RequestStatus.REJECTED
    supervisor_request.responded_at = timezone.now()
    supervisor_request.save(update_fields=['status', 'responded_at', 'updated_at'])
    from notifications.services import create_notification
    create_notification(
        recipient=supervisor_request.requested_by, actor=user, notification_type='approval',
        title='Supervisor request response',
        message=f'{user.get_full_name() or user.username} {supervisor_request.status} the supervision request for {supervisor_request.project.name}.',
        data={'project_id': supervisor_request.project_id, 'supervisor_request_id': supervisor_request.id},
    )
    return supervisor_request


@transaction.atomic
def request_supervisor_modification(*, supervisor_request, user, note=''):
    if supervisor_request.supervisor_id != user.id:
        raise PermissionDenied('Only the requested supervisor may request modifications.')
    if supervisor_request.status != RequestStatus.PENDING:
        raise ValidationError('This supervisor request has already been resolved.')
    supervisor_request.status = RequestStatus.NEEDS_MODIFICATION
    supervisor_request.modification_note = note
    supervisor_request.responded_at = timezone.now()
    supervisor_request.save(update_fields=['status', 'modification_note', 'responded_at', 'updated_at'])
    from notifications.services import create_notification
    create_notification(
        recipient=supervisor_request.requested_by,
        actor=user,
        notification_type='feedback',
        title='Supervisor requested modifications',
        message=f'{user.get_full_name() or user.username} requested changes for {supervisor_request.project.name}.',
        data={'project_id': supervisor_request.project_id, 'supervisor_request_id': supervisor_request.id},
    )
    return supervisor_request


@transaction.atomic
def activate_project(*, project, user):
    require_leader(user, project)
    require_minimum_team(project)
    if project.project_type == Project.Type.GRADUATION and not project.supervisors.filter(role=SupervisorRequest.Role.PRIMARY).exists():
        raise ValidationError('A graduation project requires an approved primary supervisor before activation.')
    project.status = Project.Status.ACTIVE
    project.save(update_fields=['status', 'updated_at'])
    return project


@transaction.atomic
def submit_project_for_review(*, project, user):
    require_leader(user, project)
    if project.status != Project.Status.ACTIVE:
        raise ValidationError('Only active projects can be submitted for review.')
    project.status = Project.Status.UNDER_REVIEW
    project.save(update_fields=['status', 'updated_at'])
    from notifications.services import create_notification
    recipients = [supervisor.supervisor for supervisor in project.supervisors.select_related('supervisor')]
    for recipient in recipients:
        create_notification(
            recipient=recipient,
            actor=user,
            notification_type='approval',
            title='Project submitted for review',
            message=f'{project.name} is ready for supervisor review.',
            data={'project_id': project.id},
        )
    return project


@transaction.atomic
def approve_project_submission(*, project, user):
    if not project.supervisors.filter(supervisor=user).exists() and not is_project_leader(user, project):
        raise PermissionDenied('Only a project supervisor or leader may mark the project submitted.')
    if project.status != Project.Status.UNDER_REVIEW:
        raise ValidationError('Only projects under review can be marked submitted.')
    project.status = Project.Status.SUBMITTED
    project.save(update_fields=['status', 'updated_at'])
    from notifications.services import create_notification
    for membership in project.memberships.select_related('user'):
        create_notification(
            recipient=membership.user,
            actor=user,
            notification_type='approval',
            title='Project submission approved',
            message=f'{project.name} was marked submitted.',
            data={'project_id': project.id},
        )
    return project


@transaction.atomic
def submit_deliverable(*, deliverable, user):
    if not deliverable.project.memberships.filter(user=user).exists():
        raise PermissionDenied('Only project members may submit deliverables.')
    deliverable.status = Deliverable.Status.PENDING
    deliverable.submitted_at = timezone.now()
    deliverable.reviewed_by = None
    deliverable.reviewed_at = None
    deliverable.review_note = ''
    deliverable.save()
    return deliverable


@transaction.atomic
def review_deliverable(*, deliverable, user, approve, note=''):
    if not deliverable.project.supervisors.filter(supervisor=user).exists():
        raise PermissionDenied('Only a project supervisor may review deliverables.')
    if deliverable.status not in {Deliverable.Status.PENDING, Deliverable.Status.SUBMITTED}:
        raise ValidationError('Only pending deliverables may be reviewed.')
    deliverable.status = Deliverable.Status.APPROVED if approve else Deliverable.Status.REJECTED
    deliverable.reviewed_by = user
    deliverable.reviewed_at = timezone.now()
    deliverable.review_note = note
    deliverable.save()
    from notifications.services import create_notification
    for membership in deliverable.project.memberships.select_related('user'):
        create_notification(
            recipient=membership.user, actor=user, notification_type='deliverable_review',
            title='Deliverable reviewed',
            message=f'{deliverable.title} was {deliverable.status}.',
            data={'project_id': deliverable.project_id, 'deliverable_id': deliverable.id},
        )
    return deliverable


@transaction.atomic
def request_deliverable_revision(*, deliverable, user, note=''):
    if not deliverable.project.supervisors.filter(supervisor=user).exists():
        raise PermissionDenied('Only a project supervisor may review deliverables.')
    if deliverable.status not in {Deliverable.Status.PENDING, Deliverable.Status.SUBMITTED}:
        raise ValidationError('Only pending deliverables may be reviewed.')
    deliverable.status = Deliverable.Status.NEEDS_REVISION
    deliverable.reviewed_by = user
    deliverable.reviewed_at = timezone.now()
    deliverable.review_note = note
    deliverable.save()
    from notifications.services import create_notification
    for membership in deliverable.project.memberships.select_related('user'):
        create_notification(
            recipient=membership.user,
            actor=user,
            notification_type='deliverable_review',
            title='Deliverable needs revision',
            message=f'{deliverable.title} needs revision.',
            data={'project_id': deliverable.project_id, 'deliverable_id': deliverable.id},
        )
    return deliverable


def validate_feedback_targets(data):
    targets = [data.get('project'), data.get('task'), data.get('deliverable'), data.get('meeting')]
    targets = [target for target in targets if target is not None]
    if len(targets) != 1:
        raise ValidationError('Feedback must belong to exactly one project, task, deliverable, or meeting.')


def feedback_target_project(data):
    return (
        data.get('project')
        or (data['task'].project if data.get('task') else None)
        or (data['deliverable'].project if data.get('deliverable') else None)
        or (data['meeting'].project if data.get('meeting') else None)
    )


@transaction.atomic
def create_feedback(*, author, **data):
    validate_feedback_targets(data)
    target_project = feedback_target_project(data)
    if not target_project.supervisors.filter(supervisor=author).exists():
        raise PermissionDenied('Only a project supervisor may create feedback.')
    feedback = Feedback.objects.create(author=author, **data)
    from notifications.services import create_notification
    for membership in target_project.memberships.select_related('user'):
        create_notification(
            recipient=membership.user,
            actor=author,
            notification_type='feedback',
            title='Supervisor feedback',
            message=f'New feedback was added to {target_project.name}.',
            data={'project_id': target_project.id, 'feedback_id': feedback.id},
        )
    return feedback


def get_base_marketplace_queryset():
    return Project.objects.filter(
        is_public=True,
        status=Project.Status.ARCHIVED,
        deleted_at__isnull=True,
    )


def get_marketplace_projects(*, search='', category=None, technology=None,
                              project_type=None, academic_year=None,
                              ordering='-created_at'):
    qs = get_base_marketplace_queryset()

    qs = qs.select_related('category', 'academic_year', 'semester', 'subject')

    qs = qs.prefetch_related(
        'technologies',
        Prefetch(
            'memberships',
            queryset=ProjectMembership.objects.select_related('user'),
        ),
        Prefetch(
            'supervisors',
            queryset=ProjectSupervisor.objects.select_related('supervisor'),
        ),
    )

    qs = qs.annotate(
        _member_count=Count('memberships', distinct=True),
        _supervisor_count=Count('supervisors', distinct=True),
    )

    if search:
        qs = qs.filter(
            Q(name__icontains=search)
            | Q(description__icontains=search)
            | Q(technologies__name__icontains=search)
        ).distinct()

    if category:
        qs = qs.filter(category_id=category)

    if technology:
        qs = qs.filter(technologies__name__iexact=technology)

    if project_type:
        qs = qs.filter(project_type=project_type)

    if academic_year:
        qs = qs.filter(academic_year_id=academic_year)

    allowed_ordering = {
        'created_at': 'created_at',
        '-created_at': '-created_at',
        'updated_at': 'updated_at',
        '-updated_at': '-updated_at',
        'name': 'name',
        '-name': '-name',
    }

    ordering_field = allowed_ordering.get(ordering, '-created_at')
    qs = qs.order_by(ordering_field)

    return qs


def get_marketplace_project_details(project_id):
    qs = get_base_marketplace_queryset()

    qs = qs.select_related('category', 'academic_year', 'semester', 'subject')

    qs = qs.prefetch_related(
        'technologies',
        Prefetch(
            'memberships',
            queryset=ProjectMembership.objects.select_related('user'),
        ),
        Prefetch(
            'supervisors',
            queryset=ProjectSupervisor.objects.select_related('supervisor'),
        ),
    )

    qs = qs.annotate(
        _member_count=Count('memberships', distinct=True),
        _supervisor_count=Count('supervisors', distinct=True),
    )

    try:
        return qs.get(id=project_id)
    except Project.DoesNotExist:
        return None
