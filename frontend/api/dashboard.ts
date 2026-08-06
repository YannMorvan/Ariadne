import { apiClient } from "@/lib/api-client"
import { DashboardStatsDto } from "@/types/stats"

export const dashboardApi = {
  getStats: async (): Promise<DashboardStatsDto> => {
    return apiClient<DashboardStatsDto>("/dashboard/stats", {
      method: "GET",
    })
  },
}
