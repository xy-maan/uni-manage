import { z } from "zod";

export const createBoardColumnSchema = z.object({
  project: z.number({ message: "Project is required" }),
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  position: z.number().int().positive().optional(),
  wip_limit: z.number().int().positive().optional(),
});
export type CreateBoardColumnValues = z.infer<typeof createBoardColumnSchema>;

export const updateBoardColumnSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long").optional(),
  position: z.number().int().optional(),
  wip_limit: z.number().int().positive().optional(),
});
export type UpdateBoardColumnValues = z.infer<typeof updateBoardColumnSchema>;

export const reorderBoardColumnSchema = z.object({
  position: z.number().int(),
});
export type ReorderBoardColumnValues = z.infer<typeof reorderBoardColumnSchema>;