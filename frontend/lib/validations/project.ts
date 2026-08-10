import { z } from "zod"

export const createProjectSchema = z.object({
  name: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  description: z
    .string()
    .transform((val) => (val?.trim() === "" ? undefined : val))
    .optional(),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
