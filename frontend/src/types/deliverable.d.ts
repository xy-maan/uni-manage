export type DeliverableStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "needs_revision"
  | "submitted"; // legacy value, still accepted

export interface DeliverableFile {
  id: number;
  deliverable: number;
  file: string;
  uploaded_by: number;
  created_at: string;
  updated_at: string;
}

export interface Deliverable {
  id: number;
  project: number;
  title: string;
  description: string;
  due_at: string | null;
  status: DeliverableStatus;
  created_by: number;
  submitted_at: string | null;
  reviewed_by: number | null;
  reviewed_at: string | null;
  review_note: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  files: DeliverableFile[];
}