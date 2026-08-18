import { z } from "zod"

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(2, "The name must be at least 2 characters long")
    .max(50, "The name must be less than 50 characters"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  description: z.string().optional(),
})

export const updateProjectSchema = createProjectSchema.partial()

export const addProjectMemberSchema = z.object({
  identifier: z
    .string({ message: "Email or username is required" })
    .min(2, "Identifier must be at least 2 characters long"),
  role: z.enum(["OWNER", "ADMIN", "MEMBER", "VIEWER"]).optional(),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
export type AddProjectMemberInput = z.infer<typeof addProjectMemberSchema>
