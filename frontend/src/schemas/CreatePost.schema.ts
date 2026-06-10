import { z } from "zod";

  export const schemaPost = z.object({
  post_type: z.enum(["TEXT", "POLL"]),
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  category: z.number({ message: "Category is required" }).min(1, "Add at least one category"),
    file: z.instanceof(File).optional(),
  tag_names: z.array(z.union([z.number(), z.string()])).optional(),
 poll_option_texts: z.array(
  z.object({
    value: z.string(),
  })
)
.optional(),
  // .min(2, "At least 2 options required")
  // .max(5, "Maximum 5 options")
}).superRefine((data, ctx) => {
  if (data.post_type === "TEXT" && !data.content) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "content is required",
      path: ["content"],
    });
  }
  
  if (data.post_type === "POLL") {
  if (!data.poll_option_texts || data.poll_option_texts.length < 2) {
    ctx.addIssue({
      path: ["poll_option_texts"],
      message: "At least 2 options required",
      code: z.ZodIssueCode.custom,
    });
  }
      else {
        data.poll_option_texts.forEach((opt, index) => {
          if (!opt.value.trim()) {
            ctx.addIssue({
              path: ["poll_option_texts", index, "value"],
              message: "Option is required",
              code: z.ZodIssueCode.custom,
            });
          }
        });
      }
}
});