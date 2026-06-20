"use server";
import getAuthData from "@/utilities/getAuthData";

export interface Phase {
  id: number;
  team: number;
  name: string;
  description: string | null;
  order: number;
  start_date: string | null;
  due_date: string | null;
  status: string;
  completed_at: string | null;
  progress_pct: number;
  deliverable_count: number;
  completed_deliverable_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePhaseInput {
  name: string;
  description?: string;
  order?: number;
  start_date?: string;
  due_date?: string;
  status?: string;
}

export interface ReorderPhasesInput {
  order: number[];
}
