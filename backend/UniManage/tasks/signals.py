from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from .models import Task, TaskComment


@receiver(pre_save, sender=Task)
def remember_previous_assignee(sender, instance, **kwargs):
    if not instance.pk:
        instance._previous_assignee_id = None
        return
    instance._previous_assignee_id = sender.all_objects.filter(pk=instance.pk).values_list('assignee_id', flat=True).first()


@receiver(post_save, sender=Task)
def notify_task_assignment(sender, instance, created, **kwargs):
    previous = getattr(instance, '_previous_assignee_id', None)
    if instance.assignee_id and (created or previous != instance.assignee_id):
        from notifications.services import create_notification
        create_notification(
            recipient=instance.assignee, actor=instance.creator, notification_type='task_assignment',
            title='Task assigned', message=f'You were assigned: {instance.title}',
            data={'project_id': instance.project_id, 'task_id': instance.id},
        )


@receiver(post_save, sender=TaskComment)
def notify_task_comment(sender, instance, created, **kwargs):
    if not created:
        return
    from notifications.services import create_notification
    recipients = {instance.task.creator}
    if instance.task.assignee:
        recipients.add(instance.task.assignee)
    recipients.discard(instance.author)
    for recipient in recipients:
        create_notification(
            recipient=recipient, actor=instance.author, notification_type='comment',
            title='New task comment', message=f'{instance.author.get_full_name() or instance.author.username} commented on {instance.task.title}.',
            data={'project_id': instance.task.project_id, 'task_id': instance.task_id, 'comment_id': instance.id},
        )
