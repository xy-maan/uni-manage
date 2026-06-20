export interface UserDetail {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role: string;
  avatar_url: string | null;
}

export interface JoinRequest {
  id: number;

  user: number;
  user_detail: UserDetail;

  project: number;

  message: string;

  status: "pending" | "accepted" | "rejected";

  responded_at: string | null;

  created_at: string;
  updated_at: string;
}