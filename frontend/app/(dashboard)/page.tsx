"use client"

import { projectApi } from "@/api/project"
import { DashboardGrid } from "@/components/dashboard/dashboard-grid"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useUser } from "@/context/user-context"
import {
  priorityTasks,
  recentActivities,
  recentProjects,
  statMetrics,
  weeklyActivity,
} from "@/lib/mock/dashboard-data"
import { Project } from "@/types"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const { user } = useUser()
  const [projectsData, setProjectsData] = useState<Project[]>([])
  const [recentProjectsData, setRecentProjectsData] = useState<Project[]>([])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await projectApi.getProjects()
        const recentProjects = await projectApi.getRecentProjects()
        setProjectsData(projects)
        setRecentProjectsData(recentProjects)
      } catch (error) {
        console.error("Error fetching projects:", error)
      }
    }

    fetchProjects()
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8 lg:py-10">
      <div className="space-y-8">
        <DashboardHeader username={user?.username || "JD"} />
        <DashboardGrid
          metrics={statMetrics}
          weeklyActivity={weeklyActivity}
          projects={recentProjectsData}
          activities={recentActivities}
          tasks={priorityTasks}
        />
      </div>
    </div>
  )
}
