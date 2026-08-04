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
