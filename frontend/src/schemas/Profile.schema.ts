import { z } from "zod";
// export const schemaProfile = z.discriminatedUnion("role", [
//   z.object({
//     role: z.literal("student"),
//     username: z.string(),
//     first_name: z.string(),
//     last_name: z.string(),
//     bio: z.string(),
//     student_id: z.string().min(1).regex(/^\d{14}$/, "Invalid Student ID format"),

//   skills: z.array(
//     z.union([
//       z.number(),
//       z.string().min(1, "Skill name cannot be empty"),
//     ])
//   ).min(1, "Select at least one skill"),
//   expertise: z.array(z.union([  z.number(),  z.string().min(1)])).optional(),
//     gpa: z.number({ message: "GPA must be a number" })
//       .min(1, "GPA must be between 1 and 4")
//       .max(4, "GPA must be between 1 and 4"),
//    department: z.number().optional().refine((val) => val !== undefined, {
//     message: "Department is required",
//   }),
//   academic_level: z.number().optional().refine((val) => val !== undefined, {
//     message: "Academic Level is required",
//   }),
// github_url: z.string().url("Invalid URL")
//   .refine(
//     (url) => !url || url.includes("github.com"),
//     "Must be a GitHub URL"
//   ).optional(),
// linkedin_url: z.string().url("Invalid URL")
//   .refine(
//     (url) => !url || url.includes("linkedin.com"),
//     "Must be a LinkedIn URL"
//   ).optional(),
//   }),
//    z.object({
//     role:  z.literal("supervisor"),
//     username: z.string(),
//     first_name: z.string(),
//     last_name: z.string(),
//     student_id: z.string().min(1).regex(/^\d{14}$/, "Invalid Student ID format").optional(),
//     bio: z.string(),
//     registration_code: z.string().min(1, "Registration code is required"),
//  department: z.number().optional().refine((val) => val !== undefined, {
//     message: "Department is required",
//   }),
//       max_team_capacity: z.number()
//       .min(1)
//       .max(20)
//       .default(5),
//     expertise: z.array(
//       z.union([
//         z.number(),
//         z.string().min(1)
//       ])
//     ),
//       skills: z.array(z.union([z.number(),z.string().min(1, "Skill name cannot be empty"),])).min(1, "Select at least one skill").optional(),
//     academic_level: z.number().optional(),
//     gpa: z.number({ message: "GPA must be a number" })
//       .min(1, "GPA must be between 1 and 4")
//       .max(4, "GPA must be between 1 and 4").optional(),
//     scholar_url: z.string()
//       .url("Invalid Scholar URL")
//       .optional(),
//     linkedin_url: z.string()
//       .url("Invalid LinkedIn URL")
//       .refine(
//         url => !url || url.includes("linkedin.com"),
//         "Must be a LinkedIn URL"
//       )
//       .optional(),
//       github_url: z.string().url("Invalid URL")
//   .refine(
//     (url) => !url || url.includes("github.com"),
//     "Must be a GitHub URL"
//   ).optional(),
//   }),
// ]);
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