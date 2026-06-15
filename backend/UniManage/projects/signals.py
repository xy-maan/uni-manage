from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import JoinRequest, Meeting, ProjectInvitation, SupervisorRequest


@receiver(post_save, sender=ProjectInvitation)
def notify_invitation(sender, instance, created, **kwargs):
    if created:
        from notifications.services import create_notification
        create_notification(
            recipient=instance.invitee, actor=instance.invited_by, notification_type='invitation',
            title='Project invitation', message=f'You were invited to join {instance.project.name}.',
            data={'project_id': instance.project_id, 'invitation_id': instance.id},
        )


@receiver(post_save, sender=JoinRequest)
def notify_join_request(sender, instance, created, **kwargs):
    if created:
        from notifications.services import create_notification
        leader = instance.project.memberships.filter(role='leader').select_related('user').first()
        if leader:
            create_notification(
                recipient=leader.user, actor=instance.user, notification_type='request',
                title='Project join request', message=f'{instance.user.get_full_name() or instance.user.username} requested to join {instance.project.name}.',
                data={'project_id': instance.project_id, 'join_request_id': instance.id},
            )


@receiver(post_save, sender=SupervisorRequest)
def notify_supervisor_request(sender, instance, created, **kwargs):
    if created:
        from notifications.services import create_notification
        create_notification(
            recipient=instance.supervisor, actor=instance.requested_by, notification_type='request',
            title='Supervision request', message=f'You were asked to supervise {instance.project.name}.',
            data={'project_id': instance.project_id, 'supervisor_request_id': instance.id},
        )


@receiver(post_save, sender=Meeting)
def notify_meeting_change(sender, instance, created, **kwargs):
    from notifications.services import create_notification
    recipients = {membership.user for membership in instance.project.memberships.select_related('user')}
    recipients.update(supervisor.supervisor for supervisor in instance.project.supervisors.select_related('supervisor'))
    recipients.discard(instance.created_by)
    for recipient in recipients:
        create_notification(
            recipient=recipient,
            actor=instance.created_by,
            notification_type='meeting',
            title='Meeting scheduled' if created else 'Meeting updated',
            message=f'{instance.title} was {"scheduled" if created else "updated"}.',
            data={'project_id': instance.project_id, 'meeting_id': instance.id},
        )
