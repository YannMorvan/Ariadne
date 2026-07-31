import { apiClient } from "@/lib/api-client"
import type { Task } from "@/types/task"
import type { CreateTaskInput } from "@/lib/validations/task"

export const taskApi = {
  createTask: async (payload: CreateTaskInput): Promise<Task> => {
    return apiClient<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },

  getTasksByProjectId: async (projectId: string): Promise<Task[]> => {
    return apiClient<Task[]>(`/projects/${projectId}/tasks`, {
      method: "GET",
    })
  },

  updateTask: async (taskId: string, payload: Partial<Task>): Promise<Task> => {
    return apiClient<Task>(`/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })
  },

  deleteTask: async (id: string): Promise<void> => {
    return apiClient<void>(`/tasks/${id}`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
    })
  },
}
