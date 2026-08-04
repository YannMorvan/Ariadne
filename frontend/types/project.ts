import type { User, Task } from "./index"

export type ProjectPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT"

export interface Project {
  id: string
  name: string
  description?: string
  priority: ProjectPriority
  progress: number
  color?: string
  ownerId?: string
  members: User[]
  createdAt: string
  updatedAt: string
  isArchived?: boolean
  tasksCount?: number
  completedTasksCount?: number
}

export interface ProjectWithTasks extends Project {
  tasks: Task[]
}
