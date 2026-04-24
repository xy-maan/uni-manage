import {   schemaPost } from "@/schemas/CreatePost.schema"
import { schemaStudent } from "@/schemas/schemaStudent/Student.schema"
import { schemaSupervisor } from "@/schemas/schemaSupervisor/Supervisor.schema"
import {z} from "zod"
export type StudentFormType=z.infer<typeof schemaStudent>
export type SupervisorFormType=z.infer<typeof schemaSupervisor>
export type CreateTextPostValues = z.infer<typeof schemaPost>