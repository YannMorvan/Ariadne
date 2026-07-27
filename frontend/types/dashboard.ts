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

export type ProjectPriority = "Haute" | "Moyenne" | "Basse"

export interface ProjectMember {
  id: string
  name: string
  avatarUrl?: string
}

export interface Project {
  id: string
  name: string
  priority: ProjectPriority
  progress: number
  members: ProjectMember[]
}

export interface ActivityDataPoint {
  day: string
  hours: number
  tasks: number
}

export type ActivityType = "task" | "achievement" | "project" | "comment"

export interface ActivityItem {
  id: string
  type: ActivityType
  message: string
  timestamp: Date
}

export interface PriorityTask {
  id: string
  title: string
  project: string
  dueTime?: string
}
