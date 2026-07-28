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
