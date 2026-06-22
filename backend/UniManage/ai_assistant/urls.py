from django.urls import path

from .views.chat_view import ChatView
from .views.matchmaker_view import ProjectMatchmakerView
from .views.scrum_view import ScrumMasterView
from .views.proposal_view import ProposalRefinerView
from .views.techstack_view import TechStackAdvisorView
from .views.qa_view import QAGeneratorView

urlpatterns = [
    path('chat/', ChatView.as_view(), name='ai-chat'),
    path('project-matchmaker/', ProjectMatchmakerView.as_view(), name='ai-matchmaker'),
    path('scrum-master/', ScrumMasterView.as_view(), name='ai-scrum'),
    path('proposal-refiner/', ProposalRefinerView.as_view(), name='ai-proposal'),
    path('tech-stack-advisor/', TechStackAdvisorView.as_view(), name='ai-techstack'),
    path('qa-generator/', QAGeneratorView.as_view(), name='ai-qa'),
]
