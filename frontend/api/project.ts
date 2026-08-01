import { apiClient } from "@/lib/api-client"
import type { Project } from "@/types/project"
import type { CreateProjectInput } from "@/lib/validations/project"

export const projectApi = {
  createProject: async (payload: CreateProjectInput): Promise<Project> => {
    return apiClient<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },

  getProjects: async (): Promise<Project[]> => {
    return apiClient<Project[]>("/projects", {
      method: "GET",
    })
  },

  getProjectById: async (id: string): Promise<Project> => {
    return apiClient<Project>(`/projects/${id}`, {
      method: "GET",
    })
  },

  getStats: async (): Promise<any> => {
    return apiClient<any>("/projects/stats", {
      method: "GET",
    })
  },

  deleteProject: async (id: string): Promise<void> => {
    return apiClient<void>(`/projects/${id}`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
    })
  },
}
