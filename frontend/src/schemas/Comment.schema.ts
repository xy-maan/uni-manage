import { z } from "zod";
export const commentSchema = z.object({
  content: z.string().min(1, "Comment is required"),
})
export type CommentValues = z.infer<typeof commentSchema>
