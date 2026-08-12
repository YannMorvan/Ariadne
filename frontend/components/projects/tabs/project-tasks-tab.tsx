"use client"

import { useState } from "react"
import { Circle } from "lucide-react"

import { CreateTaskDialog } from "../../tasks/create-task-dialog"
import { EditTaskDialog } from "../../tasks/edit-task-dialog"
import { taskApi } from "@/api/task"
import { TaskItem } from "../../tasks/task-item"
import type { Task, TaskStatus } from "@/types/task"
import { useTranslations } from "next-intl"

interface ProjectTasksTabProps {
  projectName?: string
  projectId: string
  tasks?: Task[]
  onTasksUpdated?: () => void
}

export function ProjectTasksTab({
  projectId,
  tasks = [],
  onTasksUpdated,
}: ProjectTasksTabProps) {
  const tTasks = useTranslations("tasks")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null)

  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)

  const getNextStatus = (current: TaskStatus): TaskStatus => {
    switch (current) {
      case "TODO":
        return "IN_PROGRESS"
      case "IN_PROGRESS":
        return "DONE"
      case "DONE":
        return "TODO"
      default:
        return "TODO"
    }
  }

  const handleToggleStatus = async (task: Task) => {
    try {
      setUpdatingStatusId(task.id)
      const nextStatus = getNextStatus(task.status)
      await taskApi.updateTask({ id: task.id, status: nextStatus })
      onTasksUpdated?.()
    } catch (error) {
      console.error("Error updating status :", error)
    } finally {
      setUpdatingStatusId(null)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      setDeletingId(taskId)
      await taskApi.deleteTask(taskId)
      onTasksUpdated?.()
    } catch (error) {
      console.error("Error deleting task :", error)
    } finally {
      setDeletingId(null)
    }
  }

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task)
  }

  const hasTasks = tasks && tasks.length > 0

  return (
    <div className="space-y-4 rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-base font-semibold tracking-tight">
            {tTasks("titleProjectsTasks")}
          </h3>
          <p className="truncate text-xs text-muted-foreground">
            {hasTasks
              ? ` ${tTasks("tasksCount", { count: tasks.length })}`
              : tTasks("noTasksDescription")}
          </p>
        </div>
        <CreateTaskDialog projectId={projectId} onSuccess={onTasksUpdated} />
      </div>

      {!hasTasks ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 bg-card/20 p-8 text-center">
          <Circle className="mb-2 size-8 text-muted-foreground/50" />
          <p className="text-sm font-medium">{tTasks("noTasks")}</p>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            {tTasks("noTasksDescription")}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isUpdating={updatingStatusId === task.id}
              isDeleting={deletingId === task.id}
              onToggleStatus={() => handleToggleStatus(task)}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
            />
          ))}
        </div>
      )}

      <EditTaskDialog
        task={taskToEdit}
        open={!!taskToEdit}
        onOpenChange={(open) => {
          if (!open) setTaskToEdit(null)
        }}
        onSuccess={() => {
          setTaskToEdit(null)
          onTasksUpdated?.()
        }}
      />
    </div>
  )
}
