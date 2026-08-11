"use client"

import { useEffect, useState, useCallback } from "react"
import { projectApi } from "@/api/project"
import { ProjectGrid } from "@/components/projects/project-grid"
import type { Project } from "@/types"
import type { ProjectStatsDto } from "@/types/stats"
import { useProjectsMetrics } from "@/lib/metrics/projects-metrics"

export default function ProjectsClient() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<ProjectStatsDto | null>(null)

  const metrics = useProjectsMetrics(stats ?? undefined)

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true)
      const [data, statsData] = await Promise.all([
        projectApi.getProjects(),
        projectApi.getStats(),
      ])
      setProjects(data)
      setStats(statsData as ProjectStatsDto)
    } catch (error: unknown) {
      console.error("Error fetching projects:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isCancelled = false

    async function loadInitialData() {
      try {
        setIsLoading(true)
        const [data, statsData] = await Promise.all([
          projectApi.getProjects(),
          projectApi.getStats(),
        ])
        if (!isCancelled) {
          setProjects(data)
          setStats(statsData)
        }
      } catch (error: unknown) {
        if (!isCancelled) {
          console.error("Error fetching projects:", error)
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadInitialData()

    return () => {
      isCancelled = true
    }
  }, [])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8 lg:py-10">
        <div className="space-y-6">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-muted/40" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-2xl border border-border/50 bg-card/20"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8 lg:py-10">
      <ProjectGrid
        projects={projects}
        metrics={metrics}
        onProjectsUpdated={fetchProjects}
      />
    </div>
  )
}
