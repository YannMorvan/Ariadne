"use client"

import { FolderKanban, Flame, Clock, CheckCircle2 } from "lucide-react"
import { StatCards } from "@/components/dashboard/stat-cards"
import type { StatMetric, Project } from "@/types"

interface ProjectStatsProps {
  metrics?: StatMetric[]
  projects?: Project[]
}

export function ProjectStats({ metrics, projects }: ProjectStatsProps) {
  // Si des métriques personnalisées sont passées, on les utilise directement
  if (metrics && metrics.length > 0) {
    return <StatCards metrics={metrics} />
  }

  // Sinon, on calcule dynamiquement les statistiques à partir du tableau de projets
  const totalProjects = projects?.length || 0
  const urgentProjects =
    projects?.filter((p) => p.priority === "URGENT").length || 0
  const highProjects =
    projects?.filter((p) => p.priority === "HIGH").length || 0
  const normalProjects =
    projects?.filter((p) => p.priority === "MEDIUM" || p.priority === "LOW")
      .length || 0

  const computedMetrics: StatMetric[] = [
    {
      id: "total-projects",
      label: "Total Projets",
      value: totalProjects.toString(),
      subValue: "Projets actifs",
      iconName: "folder-kanban",
      iconClassName: "bg-blue-500/10 text-blue-500",
    },
    {
      id: "urgent-projects",
      label: "Urgences",
      value: urgentProjects.toString(),
      subValue: "Nécessitent une action",
      iconName: "flame",
      iconClassName: "bg-red-500/10 text-red-500",
    },
    {
      id: "high-projects",
      label: "Priorité Haute",
      value: highProjects.toString(),
      subValue: "À traiter rapidement",
      iconName: "trophy",
      iconClassName: "bg-amber-500/10 text-amber-500",
    },
    {
      id: "normal-projects",
      label: "Priorité Standard",
      value: normalProjects.toString(),
      subValue: "Moyenne & Basse",
      iconName: "check-circle",
      iconClassName: "bg-emerald-500/10 text-emerald-500",
    },
  ]

  return <StatCards metrics={computedMetrics} />
}
