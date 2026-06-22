import {   schemaPost } from "@/schemas/CreatePost.schema"
import { createProjectSchema } from "@/schemas/createProject.schema"
import { editProjectSchema } from "@/schemas/EditProject.schema"
import { inviteMemberSchema } from "@/schemas/InviteMember.schema"
import {  requestSchema } from "@/schemas/requestSupervisor.schema"
import { schemaProfile } from "@/schemas/Profile.schema"
import { ReplaceMembershipSchema, RequestJoinSchema } from "@/schemas/requestJoin.schema"
import { schemaStudent } from "@/schemas/Student.schema"
import { schemaSupervisor } from "@/schemas/Supervisor.schema"
import { createTaskSchema,updateTaskSchema,moveTaskSchema, createFeedbackSchema } from "@/schemas/task.schema"
export type createFeedback = z.infer<typeof createFeedbackSchema>
export type CreateTextPostValues = z.infer<typeof schemaPost>
export type CompleteProfileType = z.infer<typeof schemaProfile>
export type createProjectValues = z.infer<typeof createProjectSchema>
export type editProjectValues = z.infer<typeof editProjectSchema>
export type inviteMember = z.infer<typeof inviteMemberSchema>
export type requestJoin = z.infer<typeof RequestJoinSchema>
export type replaceMembership = z.infer<typeof ReplaceMembershipSchema>


export type RequestType = z.infer<typeof requestSchema>;
export type FeedbackValue = z.infer<typeof createFeedbackSchema>;

export type CreateTaskValues = z.infer<typeof createTaskSchema>;
export type UpdateTaskValues = z.infer<typeof updateTaskSchema>;
export type CreateTaskLabelValues = z.infer<typeof createTaskLabelSchema>;
export type UpdateTaskLabelValues = z.infer<typeof updateTaskLabelSchema>;
export type CreateTaskCommentValues = z.infer<typeof createTaskCommentSchema>;
export type UpdateTaskCommentValues = z.infer<typeof updateTaskCommentSchema>;
export type UploadTaskAttachmentValues = z.infer<typeof uploadTaskAttachmentSchema>;
export type UpdateChecklistItemValues = z.infer<typeof updateChecklistItemSchema>;
export type CreateChecklistItemValues = z.infer<typeof createChecklistItemSchema>;
export type UpdateTaskChecklistValues = z.infer<typeof updateTaskChecklistSchema>;
export type CreateTaskChecklistValues = z.infer<typeof createTaskChecklistSchema>;
