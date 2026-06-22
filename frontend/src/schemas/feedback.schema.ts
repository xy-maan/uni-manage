import { z } from "zod";

export const createFeedbackSchema = z
  .object({
    project: z.number().nullable().optional(),
    task: z.number().nullable().optional(),
    deliverable: z.number().nullable().optional(),
    meeting: z.number().nullable().optional(),
    content: z.string().min(1, "Feedback content is required"),
  })