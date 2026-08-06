export interface ActivityDataPoint {
  day?: string
  date?: string
  tasks: number
}

export type ActivityType = "task" | "achievement" | "project" | "comment"

export interface ActivityItem {
  id: string
  type: ActivityType
  message: string
  timestamp: Date
}
