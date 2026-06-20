import { z } from "zod";
export const createProjectSchema = z.object({
  // Required
  name: z.string().min(1, "Project name is required"),
  project_type: z.enum(["course", "graduation"], {
    message: "Project type is required",
  }),
  methodology: z.enum(["kanban", "sprint", "milestone"], {
    message: "Methodology is required",
  }),

  // Optional
  description: z.string().optional(),
  category_id: z.number().optional(),
  semester_id: z.number().optional(),
  academic_year_id: z.number().optional(),
  subject_id: z.number().optional(),
  technology_names: z.array(z.union([z.number(), z.string()])).optional(),
  min_members: z.number().min(5),
  max_members: z.number().min(5).max(7),
  is_public: z.boolean(),
	archive_tags:z.array(z.union([z.number(), z.string()])).optional(),

  proposal: z.string().optional(),
  abstract: z.string().optional(),
  expected_scope: z.string().optional(),
})
.superRefine((data, ctx) => {

  if (data.max_members < data.min_members) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Max members must be greater than min members",
      path: ["max_members"],
    });
  }

  if (data.project_type === "graduation" && !data.proposal) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Proposal is required for graduation projects",
      path: ["proposal"],
    });
  }
});

