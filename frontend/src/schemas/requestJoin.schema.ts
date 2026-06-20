import { z } from "zod";
export const RequestJoinSchema = z.object({
  // Required
  message: z.string().optional(),
  project: z.number()
})
export const ReplaceMembershipSchema= z.object({
  // Required
    role: z.string().optional(),
project:z.number(),
user:z.number(),

})
