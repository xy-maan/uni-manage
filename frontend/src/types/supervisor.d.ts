export interface UserDetail {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role: string;
  avatar_url: string | null;
}

export interface TechnologyStack {
  id: number;
  name: string;
  is_official: boolean;
}

export interface SupervisorRequest {
  id: number;
  project: number;
  requested_by: number;
  requested_by_detail: UserDetail;
  supervisor: number;
  supervisor_detail: UserDetail;
  role: "primary" | "secondary";
  message: string;
  proposal: string;
  abstract: string;
  technology_stack: TechnologyStack[];
  expected_scope: string;
  modification_note: string;
  status: "pending" | "approved" | "rejected";
  responded_at: string | null;
  created_at: string;
  updated_at: string;
}
export interface SupervisorDetail {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role: "";
  avatar_url: string | null;
}

export interface ProjectSupervisor {
  id: number;
  project: number;
  supervisor: number;
  supervisor_detail: SupervisorDetail;
  role: "primary" | "secondary";
  created_at: string;
  updated_at: string;
}
