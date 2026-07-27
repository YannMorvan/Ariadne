import { apiClient } from "@/lib/api-client"
import type { Project } from "@/types/project"
import { User } from "@/types/user"

export const userApi = {
  getProfile: async (): Promise<User> => {
    return apiClient<User>("/users/me", {
      method: "GET",
    })
  },
}
