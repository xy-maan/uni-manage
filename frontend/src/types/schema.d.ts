import {   schemaPost } from "@/schemas/CreatePost.schema"
import { schemaProfile } from "@/schemas/Profile.schema"
import { schemaStudent } from "@/schemas/Student.schema"
import { schemaSupervisor } from "@/schemas/Supervisor.schema"
import {z} from "zod"
export type CreateTextPostValues = z.infer<typeof schemaPost>
export type CompleteProfileType = z.infer<typeof schemaProfile>
export type StudentProfileType = z.infer<typeof schemaStudent>;
export type SupervisorProfileType = z.infer<typeof schemaSupervisor>;