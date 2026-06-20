import { z } from "zod";

export const attendanceStatusEnum = z.enum(["invited", "present", "absent", "excused"]);

// schemas/meeting.schema.ts

export const createMeetingSchema = z
  .object({
    project: z.number(),
    title: z.string().min(1, "Title is required").max(255, "Title is too long"),
    description: z.string().optional(),
    starts_at: z.string().min(1, "Start time is required"),
    ends_at: z.string().optional(),
    location: z.string().max(255, "Location is too long").optional(),
    attendees: z.array(z.number()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.ends_at && new Date(data.ends_at) <= new Date(data.starts_at)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End time must be after start time",
        path: ["ends_at"],
      });
    }
  });
export type CreateMeetingValues = z.infer<typeof createMeetingSchema>;
export const updateMeetingSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long").optional(),
  description: z.string().optional(),
  starts_at: z.string().optional(),
  ends_at: z.string().optional(),
  location: z.string().max(255, "Location is too long").optional(),
  attendees: z.array(z.number()).optional(),
});
export type UpdateMeetingValues = z.infer<typeof updateMeetingSchema>;

export const createAttendanceRecordSchema = z.object({
  meeting: z.number({ message: "Meeting is required" }),
  user: z.number({ message: "User is required" }),
  status: attendanceStatusEnum.optional(),
  note: z.string().optional(),
});
export type CreateAttendanceRecordValues = z.infer<typeof createAttendanceRecordSchema>;

export const updateAttendanceRecordSchema = z.object({
  status: attendanceStatusEnum.optional(),
  note: z.string().optional(),
});
export type UpdateAttendanceRecordValues = z.infer<typeof updateAttendanceRecordSchema>;

export const createMeetingNoteSchema = z.object({
  meeting: z.number({ message: "Meeting is required" }),
  content: z.string().min(1, "Note cannot be empty"),
});
export type CreateMeetingNoteValues = z.infer<typeof createMeetingNoteSchema>;

export const updateMeetingNoteSchema = z.object({
  content: z.string().min(1, "Note cannot be empty"),
});
export type UpdateMeetingNoteValues = z.infer<typeof updateMeetingNoteSchema>;