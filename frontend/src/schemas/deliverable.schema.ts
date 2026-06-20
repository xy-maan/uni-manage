import { z } from "zod";

export const createDeliverableSchema = z.object({
  project: z.number(),
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  description: z.string().optional(),
  due_at: z.string().optional(),
});
export type CreateDeliverableValues = z.infer<typeof createDeliverableSchema>;

export const reviewDeliverableSchema = z.object({
  note: z.string().optional(),
});
export type ReviewDeliverableValues = z.infer<typeof reviewDeliverableSchema>;

export const updateDeliverableSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long").optional(),
  description: z.string().optional(),
  due_at: z.string().optional(),
});
export type UpdateDeliverableValues = z.infer<typeof updateDeliverableSchema>;

// Approve / Reject / Request Revision share the same body shape
export const deliverableReviewNoteSchema = z.object({
  note: z.string().optional(),
});
export type DeliverableReviewNoteValues = z.infer<typeof deliverableReviewNoteSchema>;

export const uploadDeliverableFileSchema = z.object({
  deliverable: z.number({ message: "Deliverable is required" }),
  file: z.instanceof(File, { message: "File is required" }),
});
export type UploadDeliverableFileValues = z.infer<typeof uploadDeliverableFileSchema>;