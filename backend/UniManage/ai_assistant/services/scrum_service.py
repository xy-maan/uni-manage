import json

from rest_framework.exceptions import APIException

from .llm_service import LLMService
from .prompts.scrum_prompt import build_scrum_prompt

llm = LLMService()


class AIResponseError(APIException):
    status_code = 502
    default_detail = 'AI returned an invalid response.'
    default_code = 'AI_RESPONSE_ERROR'


def generate_scrum_breakdown(*, user, project_description, project_id=None):
    project = None
    if project_id:
        from projects.models import Project
        try:
            project = Project.objects.get(id=project_id, memberships__user=user)
        except Project.DoesNotExist:
            pass

    prompt = build_scrum_prompt(
        project_description=project_description,
        project=project,
    )
    response = llm.generate(prompt)
    try:
        data = json.loads(response)
        if 'epics' not in data:
            raise AIResponseError()
        return data
    except (json.JSONDecodeError, KeyError):
        raise AIResponseError()
