import { apiClient } from "@/lib/api-client"
import { RegisterPayload, AuthResponse, LoginPayload } from "@/types/auth"

export const authApi = {
  register: (payload: RegisterPayload) => {
    return apiClient<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },

  login: (payload: LoginPayload) => {
    return apiClient<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },

  logout: () => {
    return apiClient("/auth/logout", {
      method: "POST",
    })
  },
}
