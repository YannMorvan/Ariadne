export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE"
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT"

export interface TaskAssignee {
  id: string
  username: string
  avatarUrl?: string | null
}

export interface Task {
  id: string
  title: string
  description?: string | null
  status: TaskStatus
  priority: Priority
  dueDate?: string | null

  estimatedHours?: number | null
  loggedHours?: number | null

  projectId: string
  assigneeId?: string | null
  assignee?: TaskAssignee | null

  createdAt: string
  updatedAt: string
}
