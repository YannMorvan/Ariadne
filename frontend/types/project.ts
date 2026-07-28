import type { User } from "./user"

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
  createdAt?: string
  updatedAt?: string
}
