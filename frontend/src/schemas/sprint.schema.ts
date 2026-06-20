// schemas/sprint.schema.ts
import { z } from "zod";
export const createSprintSchema = z
  .object({
    project: z.number({ message: "Project is required" }),
    name: z.string().min(1, "Name is required").max(255, "Name is too long"),
    goal: z.string().optional(),
  starts_at: z.string().min(1, "Start date is required"),
ends_at: z.string().min(1, "End date is required"),
    status: z.enum(["planned", "active", "completed"]).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.starts_at && data.ends_at && new Date(data.ends_at) <= new Date(data.starts_at)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date must be after start date",
        path: ["ends_at"],
      });
    }
  });

export type CreateSprintValues = z.infer<typeof createSprintSchema>;