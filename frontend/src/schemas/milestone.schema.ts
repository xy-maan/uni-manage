import { z } from "zod";

export const milestoneStatusEnum = z.enum(["planned", "in_progress", "completed"]);

export const createMilestoneSchema = z.object({
  project: z.number({ message: "Project is required" }),
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  description: z.string().optional(),
  due_at: z.string().min(1, "Due date is required"),
  status: milestoneStatusEnum.optional(),
  position: z.number().int().positive().optional(),
});
export type CreateMilestoneValues = z.infer<typeof createMilestoneSchema>;

export const updateMilestoneSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long").optional(),
  description: z.string().optional(),
  due_at: z.string().optional(),
  status: milestoneStatusEnum.optional(),
  position: z.number().int().positive().optional(),
});
export type UpdateMilestoneValues = z.infer<typeof updateMilestoneSchema>;

export const completeMilestoneSchema = z.object({
  status: z.literal("completed"),
});
export type CompleteMilestoneValues = z.infer<typeof completeMilestoneSchema>;

export const assignTaskToMilestoneSchema = z.object({
  milestone: z.number({ message: "Milestone is required" }),
  task: z.number({ message: "Task is required" }),
});
export type AssignTaskToMilestoneValues = z.infer<typeof assignTaskToMilestoneSchema>;