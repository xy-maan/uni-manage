// import { z } from "zod";

// export const taskStatusEnum = z.enum(["todo", "in_progress", "review", "done"]);
// export const taskPriorityEnum = z.enum(["low", "medium", "high", "urgent"]);

// // Create Task
// export const createTaskSchema = z.object({
//   title: z.string().min(1, "Title is required").max(255, "Title is too long"),
//   description: z.string().optional(),
//   status: taskStatusEnum.optional(),
//   priority: taskPriorityEnum.optional(),
//   assignee: z.number().optional(),
//   labels: z.array(z.number()).optional(),
//   board_column: z.number().optional(),
//   due_at: z.string().optional(),
//   estimated_hours: z.string().optional(),
//   actual_hours: z.string().nullable().optional(),
//     story_points: z.number().int().min(1, "Must be between 1 and 5").max(5, "Must be between 1 and 5").optional(), // ✅ مصححة
//   position: z.number().int().positive().optional(),
// });

// // Update / Move Task (all optional)
// export const moveTaskSchema = z.object({
//   status: taskStatusEnum.optional(),
//   board_column: z.number().optional(),
//   position: z.number().int().optional(),
// });

// // Task Label
// export const createTaskLabelSchema = z.object({
//   project: z.number({ message: "Project is required" }),
//   name: z.string().min(1, "Name is required").max(100, "Name is too long"),
//   color: z
//     .string()
//     .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Enter a valid hex color"),
// });

// export const updateTaskLabelSchema = createTaskLabelSchema.partial();

// // Task Comment
// export const createTaskCommentSchema = z.object({
//   task: z.number({ message: "Task is required" }),
//   content: z.string().min(1, "Comment cannot be empty"),
// });

// export const updateTaskCommentSchema = z.object({
//   content: z.string().min(1, "Comment cannot be empty"),
// });

// // Task Attachment (multipart - file handled separately)
// export const uploadTaskAttachmentSchema = z.object({
//   task: z.number({ message: "Task is required" }),
//   file: z.instanceof(File, { message: "File is required" }),
// });

// // Task Checklist
// export const createTaskChecklistSchema = z.object({
//   task: z.number({ message: "Task is required" }),
//   title: z.string().min(1, "Title is required").max(255, "Title is too long"),
//   position: z.number().int().positive().optional(),
// });

// export const updateTaskChecklistSchema = createTaskChecklistSchema.partial();

// // Checklist Item
// export const createChecklistItemSchema = z.object({
//   checklist: z.number({ message: "Checklist is required" }),
//   content: z.string().min(1, "Content is required").max(255, "Content is too long"),
//   is_completed: z.boolean().optional(),
//   position: z.number().int().positive().optional(),
// });

// export const updateChecklistItemSchema = z.object({
//   content: z.string().min(1, "Content is required").max(255, "Content is too long").optional(),
//   is_completed: z.boolean().optional(),
//   position: z.number().int().positive().optional(),
// });

// export const createFeedbackSchema = z.object(
//    { content:z.string().min(1, "Content is required"),}
// )
// schemas/task.schema.ts
import { z } from "zod";

export const taskPriorityEnum = z.enum(["low", "medium", "high", "urgent"]);
export const taskStatusEnum = z.enum(["todo", "in_progress", "review", "done"]);

export const createTaskSchema = z.object({
  project: z.number({ message: "Project is required" }),
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  description: z.string().optional(),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  assignee: z.number().optional(),
  labels: z.array(z.number()).optional(),
  board_column: z.number().optional(),
  due_at: z.string().optional(),
  estimated_hours: z.string().optional(),
    story_points: z.number().int().min(1, "Must be between 1 and 5").max(5, "Must be between 1 and 5").optional(), 
  position: z.number().int().optional(),
});
export type CreateTaskValues = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long").optional(),
  description: z.string().optional(),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  assignee: z.number().nullable().optional(),
  labels: z.array(z.number()).optional(),
  board_column: z.number().optional(),
  due_at: z.string().optional(),
  estimated_hours: z.string().optional(),
    story_points: z.number().int().min(1, "Must be between 1 and 5").max(5, "Must be between 1 and 5").optional(),
});
export type UpdateTaskValues = z.infer<typeof updateTaskSchema>;

export const createCommentSchema = z.object({
  task: z.number(),
  content: z.string().min(1, "Comment cannot be empty"),
});
export type CreateCommentValues = z.infer<typeof createCommentSchema>;

export const createChecklistSchema = z.object({
  task: z.number(),
  title: z.string().min(1, "Title is required").max(255),
  position: z.number().int().optional(),
});
export type CreateChecklistValues = z.infer<typeof createChecklistSchema>;

export const createChecklistItemSchema = z.object({
  checklist: z.number(),
  content: z.string().min(1, "Content is required").max(255),
  is_completed: z.boolean().optional(),
  position: z.number().int().optional(),
});
export type CreateChecklistItemValues = z.infer<typeof createChecklistItemSchema>;