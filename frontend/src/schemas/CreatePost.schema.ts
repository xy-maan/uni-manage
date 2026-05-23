import { z } from "zod";
export const   schemaPost = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  category: z.number({ message: "Category is required" }).min(1, "Add at least one category"),
  tag_names: z.string().min(1,"At least 1 tag required"),
  file: z.instanceof(File).optional(),
  post_type: z.enum(["TEXT", "POLL"]),

    poll_option_texts: z
      .array(
        z.object({
          value: z.string(),
        })
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.post_type == "TEXT") {
      if (!data.content || data.content.trim() == "") {
        ctx.addIssue({
          path: ["content"],
          message: "Content is required",
          code: z.ZodIssueCode.custom,
        });
      }
    }

    if (data.post_type == "POLL") {
      if (!data.poll_option_texts || data.poll_option_texts.length <2) {
        ctx.addIssue({
          path: ["poll_option_texts"],
          message: "At least 1 options required",
          code: z.ZodIssueCode.custom,
        });
      } else {
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
