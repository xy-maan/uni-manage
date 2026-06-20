
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  bio: string;
  role: string;
  avatar_url: string | null;
}

export interface Department {
  id: number;
  name: string;
}

export interface AcademicLevel {
  id: number;
  name: string;
}

export interface Skill {
  id: number;
  name: string;
  is_official: boolean;
}

export interface StudentProfile {
  user: User;
  student_id: string;
  department: Department;
  academic_level: AcademicLevel;
  gpa: number;
  skills: Skill[];
  looking_for_course_project_team: boolean;
  looking_for_grad_project_team: boolean;
  github_url: string;
  linkedin_url: string;
}