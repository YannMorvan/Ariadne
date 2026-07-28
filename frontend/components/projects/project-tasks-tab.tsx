"use client"

import { useState } from "react"
import {
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  MoreHorizontal,
  User as UserIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CreateTaskDialog } from "../tasks/create-task-dialog"
import { taskApi } from "@/api/task"
import { cn } from "@/lib/utils"
import type { Task, Priority } from "@/types/task"

interface ProjectTasksTabProps {
  projectName?: string
  projectId: string
  tasks?: Task[]
  onTasksUpdated?: () => void
}

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  LOW: {
    label: "Basse",
    className: "text-muted-foreground bg-muted/40 border-border/40",
  },
  MEDIUM: {
    label: "Moyenne",
    className: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  },
  HIGH: {
    label: "Haute",
    className: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  },
  URGENT: {
    label: "Urgente",
    className: "text-red-500 bg-red-500/10 border-red-500/20",
  },
}

export function ProjectTasksTab({
  projectId,
  tasks = [],
  onTasksUpdated,
}: ProjectTasksTabProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDeleteTask = async (taskId: string) => {
    try {
      setDeletingId(taskId)
      await taskApi.deleteTask(taskId)
      onTasksUpdated?.()
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche :", error)
    } finally {
      setDeletingId(null)
    }
  }

  const hasTasks = tasks && tasks.length > 0

  return (
    <div className="space-y-4 rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold tracking-tight">
            Tâches du projet
          </h3>
          <p className="text-xs text-muted-foreground">
            {hasTasks
              ? `${tasks.length} tâche${tasks.length > 1 ? "s" : ""} au total`
              : "Gère la liste des tâches associées à ce projet."}
          </p>
        </div>
        <CreateTaskDialog projectId={projectId} onSuccess={onTasksUpdated} />
      </div>

      {!hasTasks ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 bg-card/20 p-8 text-center">
          <Circle className="mb-2 size-8 text-muted-foreground/50" />
          <p className="text-sm font-medium">Aucune tâche pour ce projet</p>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            Crée ta première tâche pour commencer à suivre l'avancement.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => {
            const priority =
              priorityConfig[task.priority] || priorityConfig.MEDIUM

            return (
              <div
                key={task.id}
                className="group relative flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-card/40 p-4 transition-all hover:border-border/80 hover:bg-card/80"
              >
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <div className="mt-0.5 flex shrink-0 items-center justify-center rounded-full border border-border/40 bg-card/40 p-1 transition-colors group-hover:border-border/80 group-hover:bg-card/80">
                    {task.status === "DONE" ? (
                      <CheckCircle2 className="size-5 text-emerald-500" />
                    ) : (
                      <Circle className="size-5 text-muted-foreground/60" />
                    )}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <p
                      className={cn(
                        "truncate text-sm leading-none font-medium tracking-tight",
                        task.status === "DONE" &&
                          "text-muted-foreground line-through"
                      )}
                    >
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  {task.estimatedHours ? (
                    <div className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
                      <Clock className="size-3.5" />
                      <span>{task.estimatedHours}h</span>
                    </div>
                  ) : null}

                  <Badge
                    variant="outline"
                    className={cn("text-xs font-normal", priority.className)}
                  >
                    {priority.label}
                  </Badge>

                  {task.assignee ? (
                    <Avatar className="size-6 border border-border/50">
                      <AvatarImage
                        src={task.assignee.avatarUrl || undefined}
                        alt={task.assignee.username}
                      />
                      <AvatarFallback className="text-[10px]">
                        {task.assignee.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ) : null}

                  <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none">
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Actions</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="rounded-xl border-border/50 bg-popover/95 backdrop-blur-sm"
                      >
                        <DropdownMenuItem
                          disabled={deletingId === task.id}
                          onClick={() => void handleDeleteTask(task.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 size-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
