"use client"

import { useState } from "react"
import { motion } from "framer-motion"

import { Checkbox } from "@/components/ui/checkbox"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { PriorityTask } from "@/types/dashboard"

interface PriorityTasksProps {
  tasks: PriorityTask[]
}

export function PriorityTasks({ tasks: initialTasks }: PriorityTasksProps) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())

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
    <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm transition-colors hover:bg-card/80">
      <CardHeader>
        <CardTitle>Tâches prioritaires</CardTitle>
        <CardDescription>Les 4 urgences du jour</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {initialTasks.map((task) => {
            const isCompleted = completedIds.has(task.id)

            return (
              <motion.li
                key={task.id}
                layout
                className={cn(
                  "flex items-start gap-3 rounded-xl border border-border/40 bg-background/40 p-3 transition-all",
                  isCompleted && "border-border/20 bg-muted/20 opacity-60"
                )}
              >
                <Checkbox
                  checked={isCompleted}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="mt-0.5"
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-sm font-medium leading-snug transition-all",
                      isCompleted && "text-muted-foreground line-through"
                    )}
                  >
                    {task.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {task.project}
                    {task.dueTime && (
                      <>
                        <span className="mx-1.5 text-border">·</span>
                        {task.dueTime}
                      </>
                    )}
                  </p>
                </div>
              </motion.li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
