import { z } from "zod"

export const createProjectSchema = z.object({
  name: z.string().min(2, "The name must be at least 2 characters long"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  description: z.string().optional(),
})

export const updateProjectSchema = createProjectSchema.extend({
  id: z
    .string({ message: "The project ID is required" })
    .uuid("The project ID must be a valid UUID"),
})
export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
