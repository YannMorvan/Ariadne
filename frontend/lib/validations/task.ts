import { z } from "zod"

export const createTaskSchema = z.object({
  title: z
    .string({ message: "The task title is required" })
    .min(2, "The title must contain at least 2 characters"),

  description: z.string().optional(),

  priority: z
    .enum(["LOW", "MEDIUM", "HIGH", "URGENT"], {
      message: "The priority must be LOW, MEDIUM, HIGH or URGENT",
    })
    .default("MEDIUM"),

  status: z
    .enum(["TODO", "IN_PROGRESS", "DONE"], {
      message: "The status must be TODO, IN_PROGRESS or DONE",
    })
    .default("TODO"),

  projectId: z
    .string({ message: "The project ID is required" })
    .uuid("The project ID must be a valid UUID"),

  dueDate: z.string().optional(),

  estimatedHours: z.preprocess(
    (val) =>
      val === "" || val === null || Number.isNaN(val) ? undefined : Number(val),
    z
      .number({ message: "The estimated hours must be a number" })
      .min(0, "The hours cannot be negative")
      .optional()
  ),

  assigneeId: z
    .string()
    .uuid("The assignee ID must be a valid UUID")
    .optional()
    .or(z.literal("")),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
