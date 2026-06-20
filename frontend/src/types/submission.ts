"use server";
import getAuthData from "@/utilities/getAuthData";

export interface Submission {
  id: number;
  team: number;
  final_grade: number | null;
  defense_date: string | null;
  feedback_summary: string | null;
  submitted_at: string | null;
  graded_at: string | null;
  graded_by: number | null;
  graded_by_username: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateOrUpdateSubmissionInput {
  final_grade?: number;
  defense_date?: string;
  feedback_summary?: string;
}

export interface GradeSubmissionInput {
  final_grade: number;
  feedback_summary?: string;
}
