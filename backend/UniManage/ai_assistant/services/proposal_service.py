import json

from rest_framework.exceptions import APIException

from .llm_service import LLMService
from .prompts.proposal_prompt import build_proposal_refiner_prompt

llm = LLMService()


class AIResponseError(APIException):
    status_code = 502
    default_detail = 'AI returned an invalid response.'
    default_code = 'AI_RESPONSE_ERROR'


def refine_proposal(*, user, proposal, project_id=None):
    project = None
    if project_id:
        from projects.models import Project
        try:
            project = Project.objects.get(id=project_id, memberships__user=user)
        except Project.DoesNotExist:
            pass

    prompt = build_proposal_refiner_prompt(
        proposal=proposal,
        project=project,
    )
    response = llm.generate(prompt)
    try:
        data = json.loads(response)
        required = ['improved_proposal', 'weaknesses', 'recommendations']
        if not all(k in data for k in required):
            raise AIResponseError()
        return data
    except (json.JSONDecodeError, KeyError):
        raise AIResponseError()
