from rest_framework.permissions import BasePermission, SAFE_METHODS

from .services import is_project_leader, is_project_participant


class IsProjectParticipantOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        project = obj if obj.__class__.__name__ == 'Project' else obj.project
        if request.method in SAFE_METHODS:
            return project.is_public or is_project_participant(request.user, project)
        return is_project_leader(request.user, project)
