export interface UserSummary {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role: string;
  avatar_url: string | null;
}

export interface Technology {
  id: number;
  name: string;
  is_official: boolean;
}

export interface SupervisorRequest {
  id: number;
  project: number;
  requested_by: number;
  supervisor: number;

  requested_by_detail: UserSummary;
  supervisor_detail: UserSummary;

  role: string;
  message: string;
  proposal: string;
  abstract: string;

  technology_stack: Technology[];

  expected_scope: string;
  modification_note: string;

  status: string;
  responded_at: string | null;

  created_at: string;
  updated_at: string;
}