import { z } from "zod"

export const createTaskSchema = z.object({
  title: z
    .string({ message: "Le titre de la tâche est requis" })
    .min(2, "Le titre doit contenir au moins 2 caractères"),

  description: z.string().optional(),

  priority: z
    .enum(["LOW", "MEDIUM", "HIGH", "URGENT"], {
      message: "La priorité doit être LOW, MEDIUM, HIGH ou URGENT",
    })
    .default("MEDIUM"),

  status: z
    .enum(["TODO", "IN_PROGRESS", "DONE"], {
      message: "Le statut doit être TODO, IN_PROGRESS ou DONE",
    })
    .default("TODO"),

  projectId: z
    .string({ message: "L'ID du projet est requis" })
    .uuid("L'ID du projet doit être un UUID valide"),

  dueDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),

  estimatedHours: z
    .number({ message: "Les heures estimées doivent être un nombre" })
    .min(0, "Les heures ne peuvent pas être négatives")
    .optional(),

  assigneeId: z
    .string()
    .uuid("L'ID de l'assigné doit être un UUID valide")
    .optional()
    .or(z.literal("")),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
