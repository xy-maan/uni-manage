// import { UserDetail } from "./common.types";

export type AttendanceStatus = "invited" | "present" | "absent" | "excused";
export interface UserDetail {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role: string;
  avatar_url: string | null;
}

export interface MeetingAttendance {
  id: number;
  meeting: number;
  user: number;
  user_detail: UserDetail;
  status: AttendanceStatus;
  note: string;
  created_at: string;
  updated_at: string;
}

export interface MeetingNote {
    id:            number;
    meeting:       number;
    author:        number;
    author_detail: AuthorDetail;
    content:       string;
    created_at:    Date;
    updated_at:    Date;
}

export interface AuthorDetail {
    id:         number;
    username:   string;
    full_name:  string;
    email:      string;
    role:       string;
    avatar_url: null;
}

export interface Meeting {
    id:                 number;
    project:            number;
    title:              string;
    description:        string;
    starts_at:          Date;
    ends_at:            Date;
    location:           string;
    created_by:         number;
    attendees:          number[];
    deleted_at:         null;
    created_at:         Date;
    updated_at:         Date;
    notes:              MeetingNote[];
    attendance_records: any[];
}
