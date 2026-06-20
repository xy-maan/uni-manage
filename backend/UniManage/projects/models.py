from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.text import slugify


class ActiveManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(deleted_at__isnull=True)


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class SoftDeleteModel(TimeStampedModel):
    deleted_at = models.DateTimeField(null=True, blank=True)
    objects = ActiveManager()
    all_objects = models.Manager()

    class Meta:
        abstract = True

    def delete(self, using=None, keep_parents=False):
        self.deleted_at = timezone.now()
        self.save(update_fields=['deleted_at', 'updated_at'])

    def hard_delete(self):
        return super().delete()


class Subject(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    credit_hours = models.PositiveSmallIntegerField()
    description = models.TextField(blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['code']),
        ]

    def __str__(self):
        return f'{self.code} - {self.name}'


class Category(models.Model):
    name = models.CharField(max_length=120, unique=True)

    def __str__(self):
        return self.name


class Semester(models.Model):
    name = models.CharField(max_length=40, unique=True)

    def __str__(self):
        return self.name


class AcademicYear(models.Model):
    name = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.name


class Technology(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    is_official = models.BooleanField(default=False)
    generated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='generated_technologies',
    )

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class TechnologyAlias(models.Model):
    technology = models.ForeignKey(Technology, on_delete=models.CASCADE, related_name='aliases')
    alias = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.alias


class Project(SoftDeleteModel):
    class Type(models.TextChoices):
        COURSE = 'course', 'Course'
        GRADUATION = 'graduation', 'Graduation'

    class Methodology(models.TextChoices):
        SPRINT = 'sprint', 'Sprint'
        MILESTONE = 'milestone', 'Milestone'
        KANBAN = 'kanban', 'Kanban'

    class Status(models.TextChoices):
        FORMING = 'forming', 'Forming'
        UNDER_REVIEW = 'under_review', 'Under review'
        ACTIVE = 'active', 'Active'
        SUBMITTED = 'submitted', 'Submitted'
        ARCHIVED = 'archived', 'Archived'

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True, blank=True, related_name='projects')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='projects')
    semester = models.ForeignKey(Semester, on_delete=models.SET_NULL, null=True, blank=True, related_name='projects')
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.SET_NULL, null=True, blank=True, related_name='projects')
    technologies = models.ManyToManyField(Technology, related_name='projects', blank=True)
    project_type = models.CharField(max_length=20, choices=Type.choices)
    methodology = models.CharField(max_length=20, choices=Methodology.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.FORMING)
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='created_projects')
    min_members = models.PositiveSmallIntegerField(default=1)
    max_members = models.PositiveSmallIntegerField(default=6)
    is_public = models.BooleanField(default=True)
    proposal = models.TextField(blank=True)
    abstract = models.TextField(blank=True)
    expected_scope = models.TextField(blank=True)
    repository_url = models.URLField(blank=True)
    documentation_url = models.URLField(blank=True)
    archive_year = models.PositiveSmallIntegerField(null=True, blank=True)
    archive_tags = models.ManyToManyField('users.Skill', related_name='archive_tagged_projects', blank=True)

    def __str__(self):
        return self.name


class ProjectMembership(TimeStampedModel):
    class Role(models.TextChoices):
        LEADER = 'leader', 'Leader'
        CO_LEADER = 'co_leader', 'Co-leader'
        MEMBER = 'member', 'Member'

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='memberships')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='project_memberships')
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.MEMBER)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['project', 'user'], name='unique_project_member'),
            models.UniqueConstraint(fields=['project'], condition=models.Q(role='leader'), name='unique_project_leader'),
        ]
    

class RequestStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    ACCEPTED = 'accepted', 'Accepted'
    REJECTED = 'rejected', 'Rejected'
    NEEDS_MODIFICATION = 'needs_modification', 'Needs modification'
    CANCELLED = 'cancelled', 'Cancelled'


class ProjectInvitation(TimeStampedModel):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='invitations')
    invited_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_project_invitations')
    invitee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='project_invitations')
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=RequestStatus.choices, default=RequestStatus.PENDING)
    responded_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['project', 'invitee'], condition=models.Q(status='pending'), name='unique_pending_invitation'),
        ]


class JoinRequest(TimeStampedModel):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='join_requests')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='project_join_requests')
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=RequestStatus.choices, default=RequestStatus.PENDING)
    responded_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['project', 'user'], condition=models.Q(status='pending'), name='unique_pending_join_request'),
        ]


class SupervisorRequest(TimeStampedModel):
    class Role(models.TextChoices):
        PRIMARY = 'primary', 'Primary'
        SECONDARY = 'secondary', 'Secondary'

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='supervisor_requests')
    requested_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_supervisor_requests')
    supervisor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='supervisor_requests')
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.PRIMARY)
    message = models.TextField(blank=True)
    proposal = models.TextField(blank=True)
    abstract = models.TextField(blank=True)
    technology_stack = models.ManyToManyField(Technology, related_name='supervisor_requests', blank=True)
    expected_scope = models.TextField(blank=True)
    modification_note = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=RequestStatus.choices, default=RequestStatus.PENDING)
    responded_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['project', 'role'], condition=models.Q(status='pending'), name='unique_pending_supervisor_role'),
        ]


class ProjectSupervisor(TimeStampedModel):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='supervisors')
    supervisor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='supervised_projects')
    role = models.CharField(max_length=20, choices=SupervisorRequest.Role.choices)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['project', 'role'], name='unique_project_supervisor_role'),
            models.UniqueConstraint(fields=['project', 'supervisor'], name='unique_project_supervisor'),
        ]


class Deliverable(SoftDeleteModel):
    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        PENDING = 'pending', 'Pending'
        SUBMITTED = 'submitted', 'Submitted'
        APPROVED = 'approved', 'Approved'
        REJECTED = 'rejected', 'Rejected'
        NEEDS_REVISION = 'needs_revision', 'Needs revision'

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='deliverables')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    due_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='created_deliverables')
    submitted_at = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_deliverables')
    reviewed_at = models.DateTimeField(null=True, blank=True)
    review_note = models.TextField(blank=True)


class DeliverableFile(TimeStampedModel):
    deliverable = models.ForeignKey(Deliverable, on_delete=models.CASCADE, related_name='files')
    file = models.FileField(upload_to='projects/deliverables/')
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='deliverable_files')


class Meeting(SoftDeleteModel):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='meetings')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField(null=True, blank=True)
    location = models.CharField(max_length=255, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='created_meetings')
    attendees = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name='project_meetings')


class MeetingAttendance(TimeStampedModel):
    class Status(models.TextChoices):
        INVITED = 'invited', 'Invited'
        PRESENT = 'present', 'Present'
        ABSENT = 'absent', 'Absent'
        EXCUSED = 'excused', 'Excused'

    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='attendance_records')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='meeting_attendance_records')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.INVITED)
    note = models.TextField(blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['meeting', 'user'], name='unique_meeting_attendance_user'),
        ]


class MeetingNote(TimeStampedModel):
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='notes')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='meeting_notes')
    content = models.TextField()


class Feedback(TimeStampedModel):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='feedback', null=True, blank=True)
    task = models.ForeignKey('tasks.Task', on_delete=models.CASCADE, related_name='feedback', null=True, blank=True)
    deliverable = models.ForeignKey(Deliverable, on_delete=models.CASCADE, related_name='feedback', null=True, blank=True)
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='feedback', null=True, blank=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='authored_feedback')
    content = models.TextField()
