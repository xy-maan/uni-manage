export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
}

export interface ChatResponse {
  message: string;
}

export interface ProjectIdea {
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  technologies: string[];
  expected_team_roles: string[];
  innovation_score: number;
}

export interface MatchmakerRequest {
  team_size: number;
  project_type: 'course' | 'graduation';
  project_id?: number | null;
}

export interface MatchmakerResponse {
  ideas: ProjectIdea[];
}

export interface ScrumSubtask {
  title: string;
  description: string;
}

export interface ScrumTask {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimated_hours: number;
  subtasks: ScrumSubtask[];
}

export interface ScrumFeature {
  name: string;
  description: string;
  tasks: ScrumTask[];
}

export interface ScrumEpic {
  name: string;
  description: string;
  features: ScrumFeature[];
}

export interface ScrumRequest {
  project_description: string;
  project_id?: number | null;
}

export interface ScrumResponse {
  epics: ScrumEpic[];
}

export interface ProposalRequest {
  proposal: string;
  project_id?: number | null;
}

export interface ProposalResponse {
  improved_proposal: string;
  weaknesses: string[];
  recommendations: string[];
}

export interface TechStackRequest {
  idea: string;
  skills?: string[];
  project_id?: number | null;
}

export interface TechStackResponse {
  frontend: string;
  backend: string;
  database: string;
  authentication: string;
  deployment: string;
  hosting: string;
  devops: string;
  reasoning: string;
}

export interface QAQuestion {
  question: string;
  answer: string;
  category: string;
}

export interface QARequest {
  project_id: number;
}

export interface QAResponse {
  easy: QAQuestion[];
  medium: QAQuestion[];
  hard: QAQuestion[];
}

export interface AIError {
  error: {
    code: string;
    message: string;
  };
}

export type AITool = 'chat' | 'matchmaker' | 'scrum' | 'proposal' | 'techstack' | 'qa';
