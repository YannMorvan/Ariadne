"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle2, ListPlus } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Task, Priority } from "@/types/task"
import { useTranslations } from "next-intl"

interface TasksProps {
  tasks: Task[]
}

const priorityBadgeStyles: Record<Priority, string> = {
  URGENT: "border-red-500/20 bg-red-500/10 text-red-500",
  HIGH: "border-amber-500/20 bg-amber-500/10 text-amber-500",
  MEDIUM: "border-blue-500/20 bg-blue-500/10 text-blue-500",
  LOW: "border-muted/40 bg-muted/20 text-muted-foreground",
}

export function PriorityTasks({ tasks: initialTasks }: TasksProps) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const tDashboard = useTranslations("dashboard")

  function toggleTask(id: string) {
    setCompletedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
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
          <ul className="space-y-2">
            {initialTasks.map((task) => {
              const isCompleted = completedIds.has(task.id)

              return (
                <motion.li
                  key={task.id}
                  layout
                  className={cn(
                    "flex items-start gap-3 rounded-xl border border-border/40 bg-background/40 p-3 transition-all hover:border-border/70",
                    isCompleted && "border-border/20 bg-muted/20 opacity-60"
                  )}
                >
                  <Checkbox
                    checked={isCompleted}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={cn(
                          "truncate text-sm leading-snug font-medium transition-all",
                          isCompleted && "text-muted-foreground line-through"
                        )}
                      >
                        {task.title}
                      </p>
                      {task.priority && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "h-5 shrink-0 px-1.5 text-[10px] font-semibold tracking-wider uppercase",
                            priorityBadgeStyles[task.priority]
                          )}
                        >
                          {task.priority}
                        </Badge>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {task.project?.name}
                      {task.dueDate && (
                        <>
                          <span className="mx-1.5 text-border">·</span>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </>
                      )}
                    </p>
                  </div>
                </motion.li>
              )
            })}
          </ul>
        </CardContent>
      )}
    </Card>
  )
}
