import { Task } from "./tasks";

export interface Sprint {
    id:         number;
    project:    number;
    name:       string;
    goal:       string;
    starts_at:  Date;
    ends_at:    Date;
    status:     string;
    deleted_at: null;
    created_at: Date;
    updated_at: Date;
}
export interface Milestone {
    id:          number;
    project:     number;
    name:        string;
    description: string;
    due_at:      Date;
    status:      string;
    position:    number;
    deleted_at:  null;
    created_at:  Date;
    updated_at:  Date;
}
export interface Kanban {
    id:         number;
    project:    number;
    name:       string;
    position:   number;
    wip_limit:  number;
    deleted_at: null;
    created_at: Date;
    updated_at: Date;
}
export interface KanbanColumnWithTasks extends Kanban {
  tasks: Task[];
}

export interface KanbanDashboard {
  columns: KanbanColumnWithTasks[];
  throughput: number;
  blocked_tasks: number;
  cycle_time_hours: number | null;
}