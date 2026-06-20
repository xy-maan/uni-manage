// "use server";
// export interface Task {
//   id: number;
//   team: number;
//   title: string;
//   description: string | null;
//   status: string;
//   priority: string;
//   assignees: TaskAssignee[];
//   labels: string[];
//   due_date: string | null;
//   estimate: number | null;
//   order: number;
//   parent_task: number | null;
//   sprint: number | null;
//   phase: number | null;
//   created_by: number;
//   created_by_username: string;
//   completed_at: string | null;
//   column_id: string;
//   is_overdue: boolean;
//   created_at: string;
//   updated_at: string;
// }

// export interface TaskAssignee {
//   id: number;
//   username: string;
//   full_name: string;
//   avatar_url: string | null;
// }

// export interface CreateTaskInput {
//   title: string;
//   description?: string;
//   status?: string;
//   priority?: string;
//   labels?: string[];
//   due_date?: string;
//   estimate?: number;
//   order?: number;
//   sprint?: number | null;
//   phase?: number | null;
//   assignee_ids?: number[];
//   parent_task?: number | null;
// }

// export interface TransitionTaskInput {
//   status: string;
// }

// export interface ReorderTasksInput {
//   order: number[];
// }

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
