import { z } from "zod";
export const schemaStudent = z.object({
  major: z.string().min(1, "Major is required"),
  academic_level: z.string().min(1, "Academic level is required"),
  skills: z.string().min(1, "Add at least one skill"),
gpa: z
  .number({
    message: "GPA must be a number",
  })
  .min(1, "GPA must be between 1 and 4")
  .max(4, "GPA must be between 1 and 4")
});