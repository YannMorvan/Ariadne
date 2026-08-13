import type { Task, Priority, TaskStatus } from "@/types/task"

export const STATUS_ORDER: Record<TaskStatus, number> = {
  IN_PROGRESS: 1,
  TODO: 2,
  DONE: 3,
}

export const PRIORITY_ORDER: Record<Priority, number> = {
  URGENT: 1,
  HIGH: 2,
  MEDIUM: 3,
  LOW: 4,
}

export interface FilterTasksOptions {
  searchQuery: string
  statusFilter: string
  priorityFilter: string
}

export function filterAndSortTasks(
  tasks: Task[],
  { searchQuery, statusFilter, priorityFilter }: FilterTasksOptions
): Task[] {
  const query = searchQuery.toLowerCase().trim()

  return tasks
    .filter((task) => {
      const matchesSearch =
        !query ||
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)

      const matchesStatus =
        statusFilter === "ALL" || task.status === statusFilter

      const matchesPriority =
        priorityFilter === "ALL" || task.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesPriority
    })
    .sort((a, b) => {
      const statusDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
      if (statusDiff !== 0) return statusDiff

      const priorityDiff =
        PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      if (priorityDiff !== 0) return priorityDiff

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
}
