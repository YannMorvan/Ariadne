"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Circle, Clock, Loader2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Task, Priority, TaskStatus } from "@/types/task"
import { useTranslations } from "next-intl"
import { taskApi } from "@/api/task"
import { useEnumOptions } from "@/hooks/use-enums"

interface PriorityTasksProps {
  tasks: Task[]
  onTasksUpdated?: () => Promise<void> | void
}

export function PriorityTasks({
  tasks: initialTasks,
  onTasksUpdated,
}: PriorityTasksProps) {
  const tDashboard = useTranslations("dashboard")
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null)
  const [optimisticStatuses, setOptimisticStatuses] = useState<
    Record<string, TaskStatus>
  >({})
  const { getPriorityInfo, getStatusLabel } = useEnumOptions()

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
      await taskApi.updateTask({ status: nextStatus }, task.id)
      onTasksUpdated?.()
    } catch (error) {
      console.error("Error updating status :", error)
    } finally {
      setUpdatingStatusId(null)
    }
  }

  return (
    <Card className="flex h-full flex-col border-border/50 bg-card/50 backdrop-blur-sm transition-colors hover:bg-card/80">
      <CardHeader>
        <CardTitle>{tDashboard("priorityTasks")}</CardTitle>
        <CardDescription>{tDashboard("urgenciesOfDay")}</CardDescription>
      </CardHeader>

      {!initialTasks || initialTasks.length === 0 ? (
        <CardContent className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 shadow-inner">
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          </div>

          <h4 className="text-base font-semibold text-foreground">
            {tDashboard("noPriorityTasks")}
          </h4>

          <p className="mt-1 max-w-[240px] text-xs text-muted-foreground">
            {tDashboard("noPriorityTasksDescription")}
          </p>
        </CardContent>
      ) : (
        <CardContent>
          <div className="space-y-2">
            {initialTasks.map((task) => {
              const currentStatus = optimisticStatuses[task.id] ?? task.status
              const isDone = currentStatus === "DONE"
              const isUpdating = updatingStatusId === task.id
              const priority = getPriorityInfo(task.priority as Priority)

              return (
                <motion.div
                  key={task.id}
                  layout
                  className={cn(
                    "group relative flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-card/40 p-3 transition-all hover:border-border/80 hover:bg-card/80",
                    isDone && "border-border/20 bg-muted/20 opacity-60"
                  )}
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => void handleToggleStatus(task)}
                      title={`Actual status: ${currentStatus}. Click to change.`}
                      className="mt-0.5 flex shrink-0 items-center justify-center rounded-full border border-border/50 bg-card/60 p-1 transition-all hover:scale-105 hover:border-border/80 hover:bg-card/90 focus:outline-none disabled:opacity-50"
                    >
                      {isUpdating ? (
                        <Loader2 className="size-4 animate-spin text-muted-foreground" />
                      ) : isDone ? (
                        <CheckCircle2 className="size-4 text-emerald-500" />
                      ) : currentStatus === "IN_PROGRESS" ? (
                        <Clock className="size-4 text-amber-500" />
                      ) : (
                        <Circle className="size-4 text-muted-foreground/60 group-hover:text-foreground" />
                      )}
                    </button>

                    <div className="min-w-0 space-y-1">
                      <p
                        className={cn(
                          "truncate text-sm leading-none font-medium tracking-tight transition-colors",
                          isDone && "text-muted-foreground line-through"
                        )}
                      >
                        {task.title}
                      </p>

                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {task.project?.name}
                        {task.dueDate && (
                          <>
                            <span className="mx-1 text-border">·</span>
                            {new Date(task.dueDate).toLocaleDateString()}
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "h-5 px-1.5 text-[10px] font-normal",
                        priority.className
                      )}
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
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
