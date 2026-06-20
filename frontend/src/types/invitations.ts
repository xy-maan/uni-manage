export interface UserDetail {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role: string;
  avatar_url: string | null;
}

export interface Invitation {
  id: number;
  project: number;

  invited_by: number;
  invited_by_detail: UserDetail;

  invitee: number;
  invitee_detail: UserDetail;

  message: string;

  status: "pending" | "accepted" | "rejected";

  responded_at: string | null;

  created_at: string;
  updated_at: string;
}