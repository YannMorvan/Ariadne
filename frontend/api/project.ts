import { apiClient } from "@/lib/api-client"
import type { Project } from "@/types/project"
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "@/lib/validations/project"
import { ProjectStatsDto } from "@/types/stats"

export const projectApi = {
  createProject: async (payload: CreateProjectInput): Promise<Project> => {
    return apiClient<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },

  updateProject: async (
    payload: Partial<Project>,
    id: string
  ): Promise<Project> => {
    return apiClient<Project>(`/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })
  },

  getProjects: async (): Promise<Project[]> => {
    return apiClient<Project[]>("/projects", {
      method: "GET",
    })
  },

  getRecentProjects: async (): Promise<Project[]> => {
    return apiClient<Project[]>("/projects/recent", {
      method: "GET",
    })
  },

  getProjectById: async (id: string): Promise<Project> => {
    return apiClient<Project>(`/projects/${id}`, {
      method: "GET",
    })
  },

  getStats: async (): Promise<ProjectStatsDto> => {
    return apiClient<ProjectStatsDto>("/projects/stats", {
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
