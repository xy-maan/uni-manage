
export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: number;
  project: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  creator: number;
  assignee: number | null;
  creator_detail: Detail;
  assignee_detail: Detail | null;
  labels: number[];
  board_column: number | null;
  due_at: string | null;
  estimated_hours: string | null;
  actual_hours: string | null;
  story_points: number | null;
  completed_at: string | null;
  position: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  comments: TaskComment[];
  attachments: TaskAttachment[];
  checklists: TaskChecklist[];
  activity: TaskActivity[];
}

export interface TaskLabel {
  id: number;
  project: number;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface TaskComment {
  id: number;
  task: number;
  author: number;
  author_detail: Detail;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface TaskAttachment {
  id: number;
  task: number;
  file: string;
  uploaded_by: number;
  created_at: string;
  updated_at: string;
}

export interface TaskChecklistItem {
  id: number;
  checklist: number;
  content: string;
  is_completed: boolean;
  completed_by: number | null;
  completed_at: string | null;
  completed_by_detail: Detail | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface TaskChecklist {
  id: number;
  task: number;
  title: string;
  position: number;
  items: TaskChecklistItem[];
  created_at: string;
  updated_at: string;
}

export type TaskActivityAction = string;

export interface TaskActivity {
  id: number;
  task: number;
  actor: number;
  actor_detail: Detail;
  action: TaskActivityAction;
  message: string;
  data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
export interface Label {
    id:         number;
    project:    number;
    name:       string;
    color:      string;
    created_at: Date;
    updated_at: Date;
}

export interface Task {
    id:              number;
    project:         number;
    title:           string;
    description:     string;
    status:          string;
    priority:        string;
    creator:         number;
    assignee:        number;
    creator_detail:  Detail;
    assignee_detail: Detail;
    labels:          number[];
    board_column:    number;
    due_at:          Date;
    estimated_hours: string;
    actual_hours:    null;
    story_points:    number;
    completed_at:    null;
    position:        number;
    deleted_at:      null;
    created_at:      Date;
    updated_at:      Date;
    comments:        any[];
    attachments:     any[];
    checklists:      any[];
    activity:        any[];
}

export interface Detail {
    id:         number;
    username:   string;
    full_name:  string;
    email:      string;
    role:       string;
    avatar_url: null;
}
export interface TaskActivity {
    id:           number;
    task:         number;
    actor:        number;
    actor_detail: ActorDetail;
    action:       string;
    message:      string;
    data:         Data;
    created_at:   Date;
    updated_at:   Date;
}

export interface ActorDetail {
    id:         number;
    username:   string;
    full_name:  string;
    email:      string;
    role:       string;
    avatar_url: null;
}
