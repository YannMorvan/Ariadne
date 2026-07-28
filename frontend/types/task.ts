export interface Task {
  id: string
  title: string
  description?: string
  project: string
  dueTime?: string
  status?: "todo" | "in-progress" | "done"
  assignedTo?: string
  createdAt?: string
  updatedAt?: string
}
