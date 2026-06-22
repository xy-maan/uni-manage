import json

from rest_framework.exceptions import APIException

from .llm_service import LLMService
from .prompts.techstack_prompt import build_techstack_prompt

llm = LLMService()


class AIResponseError(APIException):
    status_code = 502
    default_detail = 'AI returned an invalid response.'
    default_code = 'AI_RESPONSE_ERROR'


def recommend_tech_stack(*, user, idea, skills=None, project_id=None):
    project = None
    if project_id:
        from projects.models import Project
        try:
            project = Project.objects.get(id=project_id, memberships__user=user)
        except Project.DoesNotExist:
            pass

    prompt = build_techstack_prompt(
        idea=idea,
        skills=skills or [],
        project=project,
    )
    response = llm.generate(prompt)
    try:
        data = json.loads(response)
        required = ['frontend', 'backend', 'database', 'deployment', 'reasoning']
        if not all(k in data for k in required):
            raise AIResponseError()
        return data
    except (json.JSONDecodeError, KeyError):
        raise AIResponseError()
