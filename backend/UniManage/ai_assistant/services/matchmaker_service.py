import json

from rest_framework.exceptions import APIException

from .llm_service import LLMService
from .prompts.matchmaker_prompt import build_matchmaker_prompt

llm = LLMService()


class AIResponseError(APIException):
    status_code = 502
    default_detail = 'AI returned an invalid response.'
    default_code = 'AI_RESPONSE_ERROR'


def generate_project_ideas(*, user, team_size, project_type, project_id=None):
    skills = list(user.student_profile.skills.all())
    current_project = None
    if project_id:
        from projects.models import Project
        try:
            current_project = Project.objects.get(id=project_id, memberships__user=user)
        except Project.DoesNotExist:
            pass

    prompt = build_matchmaker_prompt(
        skills=skills,
        team_size=team_size,
        project_type=project_type,
        current_project=current_project,
    )
    response = llm.generate(prompt)
    try:
        data = json.loads(response)
        if 'ideas' not in data:
            raise AIResponseError()
        return data
    except (json.JSONDecodeError, KeyError):
        raise AIResponseError()
