// Team

export interface TeamMember {
  id: number;
  team: number;
  student: number;
  student_username: string;
  student_full_name: string;
  student_avatar: string | null;
  role: "LEADER" | "MEMBER";
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  is_invite: boolean;
  joined_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamSupervisor {
  id: number;
  team: number;
  supervisor: number;
  supervisor_username: string;
  supervisor_full_name: string;
  supervisor_title: string;
  role: "DOCTOR" | "TA";
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  created_at: string;
  updated_at: string;
}

export interface BoardColumn {
  id: string;
  name: string;
  wip_limit?: number;
}

export interface BoardConfig {
  columns: BoardColumn[];
}

export type ProjectType = "COURSE" | "GRADUATION";
export type Philosophy = "KANBAN" | "SPRINT" | "MILESTONE";
export type TeamStatus = "FORMING" | "PENDING_SUPERVISORS" | "ACTIVE" | "COMPLETED";

export interface Team {
  id: number;
  name: string;
  project_type: ProjectType;
  philosophy: Philosophy;
  status: TeamStatus;
  description: string;
  board_config: BoardConfig;
  is_locked: boolean;
  is_recruiting: boolean;
  max_capacity: number;
  term: number;
  subject: number | null;
  is_deleted: boolean;
  deleted_at: string | null;
  members: TeamMember[];
  supervisors: TeamSupervisor[];
  member_count: number;
  has_capacity: boolean;
  current_user_role: "LEADER" | "MEMBER" | null;
  created_at: string;
  updated_at: string;
}


export interface CreateTeamInput {
  name: string;
  project_type: ProjectType;
  philosophy?: Philosophy;
  description?: string;
  board_config?: BoardConfig;
  is_recruiting?: boolean;
  max_capacity?: number;
  term: number;
  subject: number | null;
}
export interface Semesters {
  name: string;
  id:number
}
export interface AcademicYears {
  name: string;
  id:number
}

export interface UpdateTeamInput {
  name?: string;
  description?: string;
  board_config?: BoardConfig;
  is_recruiting?: boolean;
  max_capacity?: number;
}

export interface InviteStudentInput {
  student_id: number;
}

export interface RequestSupervisorInput {
  supervisor_id: number;
  role: "DOCTOR" | "TA";
}

export interface RespondInvitationInput {
  action: "ACCEPT" | "REJECT";
}

// My Invitations

export interface TeamInvitation {
  id: number;
  team: number;
  student: number;
  student_username: string;
  student_full_name: string;
  student_avatar: string | null;
  role: "LEADER" | "MEMBER";
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  is_invite: boolean;
  joined_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupervisorRequest {
  id: number;
  team: number;
  supervisor: number;
  supervisor_username: string;
  supervisor_full_name: string;
  supervisor_title: string;
  role: "DOCTOR" | "TA";
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  responded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MyInvitations {
  team_invitations: TeamInvitation[];
  supervisor_requests: SupervisorRequest[];
}

// Available Students / Supervisors

export interface AvailableStudent {
  id: number;
  username: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  student_id: string | null;
  department: string;
  academic_level: string;
}


export interface AvailableSupervisor {
  id: number;
  username: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  title: string;
  department: string;
  max_team_capacity: number;
  active_team_count: number;
  has_capacity: boolean;
}



// Team Dashboard

export interface DashboardCounts {
  tasks: number;
  tasks_done: number;
  deliverables: number;
  deliverables_completed: number;
  sprints: number;
  sprints_active: number;
  phases: number;
  phases_completed: number;
}

export interface DashboardNextStepsPhase {
  id: number;
  name: string;
  [key: string]: unknown;
}

export interface DashboardNextStepsDeliverable {
  id: number;
  title: string;
  [key: string]: unknown;
}

export interface DashboardNextStepsSprint {
  id: number;
  name: string;
  [key: string]: unknown;
}

export interface DashboardNextSteps {
  phase?: DashboardNextStepsPhase;
  deliverables?: DashboardNextStepsDeliverable[];
  sprint?: DashboardNextStepsSprint;
  tasks?: DashboardTask[];
  in_progress?: DashboardTask[];
  in_review?: DashboardTask[];
}

export interface DashboardTask {
  id: number;
  team: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assignees: DashboardAssignee[];
  labels: string[];
  due_date: string | null;
  estimate: number | null;
  order: number;
  parent_task: number | null;
  sprint: number | null;
  phase: number | null;
  created_by: number;
  created_by_username: string;
  completed_at: string | null;
  column_id: string;
  is_overdue: boolean;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

export interface DashboardAssignee {
  id: number;
  username: string;
  full_name: string;
  avatar_url: string | null;
  [key: string]: unknown;
}

export interface DashboardDeliverable {
  id: number;
  team: number;
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
  order: number;
  sprint: number | null;
  phase: number | null;
  completed_at: string | null;
  completed_by: number | null;
  completed_by_username: string | null;
  approved_at: string | null;
  approved_by: number | null;
  approved_by_username: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

export interface DashboardSprint {
  id: number;
  team: number;
  name: string;
  goal: string | null;
  start_date: string;
  end_date: string;
  status: string;
  order: number;
  days_remaining: number;
  completion_pct: number;
  task_count: number;
  completed_task_count: number;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

export interface DashboardPhase {
  id: number;
  team: number;
  name: string;
  description: string | null;
  order: number;
  start_date: string | null;
  due_date: string | null;
  status: string;
  completed_at: string | null;
  progress_pct: number;
  deliverable_count: number;
  completed_deliverable_count: number;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

export interface DashboardFeedback {
  id: number;
  team: number;
  author: number;
  author_username: string;
  author_full_name: string;
  kind: string;
  body: string;
  target_content_type: number;
  target_object_id: number;
  target_type: string;
  target_repr: string;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

export interface TeamDashboard {
  team: Team;
  philosophy: Philosophy;
  counts: DashboardCounts;
  tasks: DashboardTask[];
  deliverables: DashboardDeliverable[];
  sprints: DashboardSprint[];
  phases: DashboardPhase[];
  feedback: DashboardFeedback[];
  next_steps: DashboardNextSteps;
}
export interface Technology {
  id: number;
  name: string;
  is_official: boolean;
}

export interface UserDetail {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role: string;
  avatar_url: string | null;
}

export interface Membership {
  id: number;
  user_detail: UserDetail;
  created_at: string;
  updated_at: string;
  role: string;
  joined_at: string;
  project: number;
  user: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface Semester {
  id: number;
  name: string;
}

export interface AcademicYear {
  id: number;
  name: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  subject: string | null;
  category: Category | null;       
  semester: Semester | null;      
  academic_year: AcademicYear | null; 
  technologies: Technology[];
  project_type: string;
  methodology: string;
  status: string;
  creator: number;
  creator_detail: UserDetail;
  memberships: Membership[];
  supervisors: Supervsiors[];
  min_members: number;
  max_members: number;
  is_public: boolean;
  proposal: string;
  abstract: string;
  expected_scope: string;
  repository_url: string;
  documentation_url: string;
  archive_year: number | null;
  archive_tags: any[];
  deleted_at: string | null;
  created_at: string;  
  updated_at: string;  
}
// export interface Supervsiors {
//     id:                number;
//     username:          string;
//     full_name:         string;
//     email:             string;
//     role:              string;
//     avatar_url:        null;
//     title:             string;
//     title_display:     string;
//     department:        Department;
//     expertise:         Expertise[];
//     max_team_capacity: number;
//     scholar_url:       null;
//     linkedin_url:      null;
// }

export interface Department {
    id:   number;
    name: string;
}

export interface Expertise {
    id:          number;
    name:        string;
    is_official: boolean;
}


export interface Memberships {
  id: number;
  project: number;
  user: number;
  role: string;
  joined_at: string;
  created_at: string;
  updated_at: string;
  user_detail: UserDetail;
}
export interface Supervsiors {
    id:                number;
    project:           number;
    supervisor:        number;
    supervisor_detail: SupervisorDetail;
    role:              string;
    created_at:        Date;
    updated_at:        Date;
}

export interface SupervisorDetail {
    id:         number;
    username:   string;
    full_name:  string;
    email:      string;
    role:       string;
    avatar_url: null;
}