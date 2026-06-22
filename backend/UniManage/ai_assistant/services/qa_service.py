import json

from rest_framework.exceptions import APIException

from .llm_service import LLMService
from .prompts.qa_prompt import build_qa_prompt

llm = LLMService()


class AIResponseError(APIException):
    status_code = 502
    default_detail = 'AI returned an invalid response.'
    default_code = 'AI_RESPONSE_ERROR'


def generate_qa(*, user, project_id):
    from projects.models import Project
    try:
        project = Project.objects.get(id=project_id, memberships__user=user)
    except Project.DoesNotExist:
        from rest_framework.exceptions import PermissionDenied
        raise PermissionDenied('Project not found or access denied.')

    tasks = list(project.tasks.values('title', 'description'))
    deliverables = list(project.deliverables.values('title', 'description'))
    technologies = list(project.technologies.values_list('name', flat=True))

    prompt = build_qa_prompt(
        project_name=project.name,
        project_description=project.description,
        project_proposal=project.proposal,
        project_abstract=project.abstract,
        tasks=tasks,
        deliverables=deliverables,
        technologies=technologies,
    )
    response = llm.generate(prompt)
    try:
        data = json.loads(response)
        required = ['easy', 'medium', 'hard']
        if not all(k in data for k in required):
            raise AIResponseError()
        return data
    except (json.JSONDecodeError, KeyError):
        raise AIResponseError()
