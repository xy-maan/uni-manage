import { z } from "zod";
export const schemaProfile = z.object({
  role: z.enum(["STUDENT", "SUPERVISOR"]),
  username: z.string().min(1, "Username is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  bio: z.string().optional(),
  department: z.number().optional(),
  linkedin_url: z.string().optional(),
  // student ده
  student_id: z.string().optional(),
  academic_level: z.number().optional(),
  gpa: z.number().min(0).max(4).optional(),
  skills: z.array(z.union([z.number(), z.string()])).optional(),
  github_url: z.string().optional(),
  // supervisor ده
  registration_code: z.string().optional(),
  max_team_capacity: z.number().default(5).optional(),
  expertise: z.array(z.union([z.number(), z.string()])).optional(),
  scholar_url: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.role === "SUPERVISOR" && !data.registration_code) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Registration code is required",
      path: ["registration_code"],
    });
  }
});