from django.contrib import admin

from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'recipient', 'actor', 'verb', 'read_at', 'created_at')
    list_filter = ('verb', 'is_archived', 'target_content_type')
    search_fields = ('recipient__username', 'actor__username', 'verb', 'description')
    readonly_fields = ('created_at',)
