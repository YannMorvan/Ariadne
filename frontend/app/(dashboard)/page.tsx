"use client"

import { dashboardApi } from "@/api/dashboard"
import { projectApi } from "@/api/project"
import { taskApi } from "@/api/task"
import { DashboardGrid } from "@/components/dashboard/dashboard-grid"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useUser } from "@/context/user-context"
import { useDashboardMetrics } from "@/lib/metrics/dashboard-metrics"
import { recentActivities } from "@/lib/mock/dashboard-data"
import { Project, Task, DashboardStatsDto, ActivityDataPoint } from "@/types"
import { useCallback, useEffect, useState } from "react"

export default function DashboardPage() {
  const { user } = useUser()
  const [projectsData, setProjectsData] = useState<Project[]>([])
  const [recentProjectsData, setRecentProjectsData] = useState<Project[]>([])
  const [priorityTasksData, setPriorityTasksData] = useState<Task[]>([])
  const [stats, setStats] = useState<DashboardStatsDto | null>(null)
  const [weeklyActivity, setWeeklyActivity] = useState<ActivityDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const metrics = useDashboardMetrics(stats ?? undefined) ?? []

  const fetchDashboardData = useCallback(async () => {
    try {
      const [projects, recentProjects, tasks, statsData, weeklyActivityData] =
        await Promise.allSettled([
          projectApi.getProjects(),
          projectApi.getRecentProjects(),
          taskApi.getPriorityTasks(4),
          dashboardApi.getStats(),
          dashboardApi.getWeeklyActivity(),
        ])

      if (projects.status === "fulfilled") setProjectsData(projects.value)
      if (recentProjects.status === "fulfilled")
        setRecentProjectsData(recentProjects.value)
      if (tasks.status === "fulfilled") setPriorityTasksData(tasks.value)
      if (statsData.status === "fulfilled") {
        setStats(statsData.value as DashboardStatsDto)
      }
      if (weeklyActivityData.status === "fulfilled") {
        setWeeklyActivity(weeklyActivityData.value)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isSubscribed = true

    const loadData = async () => {
      await fetchDashboardData()
    }

    void loadData()

    return () => {
      isSubscribed = false
    }
  }, [fetchDashboardData])

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center">
        <div className="animate-pulse text-sm font-medium text-muted-foreground">
          Loading dashboard data...
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8 lg:py-10">
      <div className="space-y-8">
        <DashboardHeader username={user?.username || "JD"} />
        <DashboardGrid
          metrics={metrics}
          weeklyActivity={weeklyActivity}
          projects={recentProjectsData}
          activities={recentActivities}
          tasks={priorityTasksData}
          onTasksUpdated={fetchDashboardData}
        />
      </div>
    </div>
  )
}
