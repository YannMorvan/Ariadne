import { apiClient } from "@/lib/api-client"
import { ActivityDataPoint } from "@/types/dashboard"
import { DashboardStatsDto } from "@/types/stats"

export const dashboardApi = {
  getStats: async (): Promise<DashboardStatsDto> => {
    return apiClient<DashboardStatsDto>("/dashboard/stats", {
      method: "GET",
    })
  },
  getWeeklyActivity: async (): Promise<ActivityDataPoint[]> => {
    return apiClient<ActivityDataPoint[]>("/dashboard/activity", {
      method: "GET",
    })
  },
}
