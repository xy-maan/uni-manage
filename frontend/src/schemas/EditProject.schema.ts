import { z } from "zod";
export const editProjectSchema = z.object({
  // Required
 name:z.string().optional(),
	description: z.string().optional(),
  min_members: z.number().min(5),
  max_members: z.number().min(5).max(7),
  is_public: z.boolean(),
repository_url: z.string().optional(),
	// archive_tag_ids:z.array(z.union([z.number(), z.string()])).optional(),
	archive_tags:z.array(z.union([z.number(), z.string()])).optional(),
}).superRefine((data, ctx) => {

  if (data.max_members < data.min_members) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Max members must be greater than min members",
      path: ["max_members"],
    });
  }
});

