"use client"

import { useEffect, useState, useCallback } from "react"
import { projectApi } from "@/api/project"
import { ProjectGrid } from "@/components/projects/project-grid"
import type { Project } from "@/types"
import { projectStatMetrics } from "@/lib/mock/projects-data"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await projectApi.getProjects()
      setProjects(data)
    } catch (error: unknown) {
      console.error("Error fetching projects:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchProjects()
  }, [fetchProjects])

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
        metrics={projectStatMetrics}
        onProjectsUpdated={fetchProjects}
      />
    </div>
  )
}
