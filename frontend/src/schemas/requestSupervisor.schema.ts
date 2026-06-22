import { z } from "zod";

export const requestSchema = z.object({
  project:z.number(),
  // role: z.enum(["primary", "secondary"]),
  supervisor: z.number({ message: "Supervisor is required" }),
  message: z.string().optional(),
  proposal: z.string().optional(),
  expected_scope: z.string().optional(),
  technology_names: z.array(z.union([z.number(), z.string()])).optional(),
})
// .superRefine((data, ctx) => {
//   if (data.role === "primary") {
//     if (!data.proposal) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: "Proposal is required",
//         path: ["proposal"],
//       });
//     }
//     if (!data.abstract) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: "Abstract is required",
//         path: ["abstract"],
//       });
//     }
//     if (!data.expected_scope) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: "Expected scope is required",
//         path: ["expected_scope"],
//       });
//     }
//   }
// });