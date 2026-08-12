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

  updateTask: async (
    payload: Partial<Task> & { id: string }
  ): Promise<Task> => {
    return apiClient<Task>(`/tasks/${payload.id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })
  },

  getTasksByProjectId: async (projectId: string): Promise<Task[]> => {
    return apiClient<Task[]>(`/projects/${projectId}/tasks`, {
      method: "GET",
    })
  },

  getPriorityTasks: async (limit?: number): Promise<Task[]> => {
    const queryParams = limit ? `?limit=${limit}` : ""
    return apiClient<Task[]>(`/tasks/priority${queryParams}`, {
      method: "GET",
    })
  },

  deleteTask: async (id: string): Promise<void> => {
    return apiClient<void>(`/tasks/${id}`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
    })
  },
}
