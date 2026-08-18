import { apiClient } from "@/lib/api-client"
import type { Project, Member, ProjectInvitation } from "@/types/project"
import type {
  CreateProjectInput,
  UpdateProjectInput,
  AddProjectMemberInput,
} from "@/lib/validations/project"
import type { ProjectStatsDto } from "@/types/stats"

export const projectApi = {
  createProject: async (payload: CreateProjectInput): Promise<Project> => {
    return apiClient<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },

  updateProject: async (
    id: string,
    payload: UpdateProjectInput
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
    })
  },

  // Members Management

  addMember: async (
    projectId: string,
    payload: AddProjectMemberInput
  ): Promise<Member> => {
    return apiClient<Member>(`/projects/${projectId}/members`, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },

  getMembers: async (projectId: string): Promise<Member[]> => {
    return apiClient<Member[]>(`/projects/${projectId}/members`, {
      method: "GET",
    })
  },

  removeMember: async (
    projectId: string,
    memberUserId: string
  ): Promise<void> => {
    return apiClient<void>(`/projects/${projectId}/members/${memberUserId}`, {
      method: "DELETE",
    })
  },

  getPendingInvitations: async (): Promise<ProjectInvitation[]> => {
    return apiClient<ProjectInvitation[]>("/projects/invitations/pending", {
      method: "GET",
    })
  },

  acceptInvitation: async (projectId: string): Promise<void> => {
    return apiClient<void>(`/projects/${projectId}/invitations/accept`, {
      method: "PATCH",
    })
  },

  declineInvitation: async (projectId: string): Promise<void> => {
    return apiClient<void>(`/projects/${projectId}/invitations/decline`, {
      method: "PATCH",
    })
  },
}
