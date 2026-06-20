// ============================================================
// Notification
// ============================================================

export type NotificationVerb =
  | "supervisor_accepted"
  | "supervisor_rejected"
  | "member_invited"
  | "member_requested_to_join"
  | "member_joined"
  | "member_rejected"
  | "team_status_changed"
  | "team_locked"
  | "team_unlocked"
  | "team_methodology_changed"
  | "role_changed"
  | "member_removed"
  | "member_left"
  | "task_assigned"
  | "task_completed"
  | "deliverable_completed"
  | "deliverable_approved"
  | "feedback_posted"
  | "submission_graded"
  | "team_completed";

export interface Notification {
  id: number;
  recipient: number;
  recipient_username: string;
  actor: number | null;
  actor_username: string | null;
  verb: NotificationVerb;
  description: string | null;
  target_content_type: number;
  target_object_id: number;
  target_type: string;
  target_repr: string;
  read_at: string | null;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
}

export interface UnreadCountResponse {
  unread: number;
}

export interface MarkAllReadResponse {
  updated: number;
}
