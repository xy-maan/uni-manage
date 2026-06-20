import { z } from "zod";
export const inviteMemberSchema = z.object({
  // Required
  message: z.string().optional(),
  project: z.number(),
  invitee: z.number({ message: "Invitee is required" }),

})
