export type StatIconName = "flame" | "folder-kanban" | "check-circle" | "trophy"
export type TrendDirection = "up" | "down" | "neutral"

export interface StatTrend {
  value: string
  direction: TrendDirection
}

export interface StatProgress {
  current: number
  max: number
}

// Le type unique consommé par ton composant <StatCards />
export interface StatMetric {
  id: string
  label: string
  value: string
  subValue?: string
  trend?: StatTrend
  iconName: StatIconName
  iconClassName: string
  progress?: StatProgress
}

// ----------------------------------------------------
// 2. DTOs API (Ce que te renvoie le Backend NestJS)
// ----------------------------------------------------

export interface ProjectStatsDto {
  totalProjects: number
  activeProjects: number
  archivedProjects: number
  urgentTasks: number
  completionRate: number
  roadmapProgress: {
    current: number
    max: number
  }
}

export interface DashboardStatsDto {
  streak: number
  activeProjects: number
  pendingProjects: number
  completedTasksPercentage: number
  level: number
  currentXp: number
  nextLevelXp: number
}
