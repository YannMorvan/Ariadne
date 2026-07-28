import { apiClient } from "@/lib/api-client"
import { User } from "@/types/user"

export const userApi = {
  getProfile: async (): Promise<User> => {
    return apiClient<User>("/users/me", {
      method: "GET",
    })
  },
}
