import { useState, useRef, useLayoutEffect } from "react"
import {
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  MoreHorizontal,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Task, Priority } from "@/types/task"
import { useTranslations } from "next-intl"

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  LOW: {
    label: "Low",
    className: "text-muted-foreground bg-muted/40 border-border/40",
  },
  MEDIUM: {
    label: "Medium",
    className: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  },
  HIGH: {
    label: "High",
    className: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  },
  URGENT: {
    label: "Urgent",
    className: "text-red-500 bg-red-500/10 border-red-500/20",
  },
}

interface TaskItemProps {
  task: Task
  isUpdating: boolean
  isDeleting: boolean
  onToggleStatus: (task: Task) => Promise<void>
  onDeleteTask: (taskId: string) => Promise<void>
}

export const TaskItem = ({
  task,
  isUpdating,
  isDeleting,
  onToggleStatus,
  onDeleteTask,
}: TaskItemProps) => {
  const tCommon = useTranslations("common")
  const [isExpanded, setIsExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const descriptionRef = useRef<HTMLParagraphElement>(null)

  const priority = priorityConfig[task.priority] || priorityConfig.MEDIUM

  useLayoutEffect(() => {
    const checkOverflow = () => {
      const el = descriptionRef.current
      if (el) {
        setIsOverflowing(el.scrollHeight > el.clientHeight)
      }
    }

    checkOverflow()

    window.addEventListener("resize", checkOverflow)
    return () => window.removeEventListener("resize", checkOverflow)
  }, [task.description])

  return (
    <div
      className={cn(
        "group relative flex items-start justify-between gap-3 rounded-xl border border-border/40 bg-card/40 p-4 transition-all hover:border-border/80 hover:bg-card/80",
        isDeleting && "opacity-60"
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <button
          type="button"
          disabled={isUpdating}
          onClick={() => void onToggleStatus(task)}
          title={`Status: ${task.status}. Click to change.`}
          className="mt-0.5 flex shrink-0 items-center justify-center rounded-full border border-border/50 bg-card/60 p-1 transition-all hover:scale-105 hover:border-border/80 hover:bg-card/90 focus:outline-none disabled:opacity-50"
        >
          {isUpdating ? (
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          ) : task.status === "DONE" ? (
            <CheckCircle2 className="size-5 text-emerald-500" />
          ) : task.status === "IN_PROGRESS" ? (
            <Clock className="size-5 text-amber-500" />
          ) : (
            <Circle className="size-5 text-muted-foreground/60 group-hover:text-foreground" />
          )}
        </button>

        <div className="min-w-0 flex-1 space-y-1">
          <p
            className={cn(
              "text-sm leading-snug font-medium tracking-tight break-words transition-colors",
              task.status === "DONE" && "text-muted-foreground line-through"
            )}
          >
            {task.title}
          </p>

          {task.description && (
            <div className="relative max-w-full overflow-hidden">
              <p
                ref={descriptionRef}
                className={cn(
                  "text-xs [overflow-wrap:anywhere] text-muted-foreground transition-all duration-300",
                  isExpanded ? "line-clamp-none" : "line-clamp-1"
                )}
              >
                {task.description}
              </p>

              {(isOverflowing || isExpanded) && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-1 flex items-center gap-1 text-[10px] font-medium text-blue-500 hover:text-blue-600 focus:outline-none"
                >
                  {isExpanded ? (
                    <>
                      {tCommon("seeLess")} <ChevronUp className="size-3" />
                    </>
                  ) : (
                    <>
                      {tCommon("seeMore")} <ChevronDown className="size-3" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden w-12 justify-end sm:flex">
          {task.estimatedHours ? (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              <span>{task.estimatedHours}h</span>
            </div>
          ) : null}
        </div>

        <div className="flex w-20 justify-center">
          <Badge
            variant="outline"
            className={cn(
              "w-full justify-center text-xs font-normal",
              priority.className
            )}
          >
            {priority.label}
          </Badge>
        </div>

        <div className="flex size-6 items-center justify-center">
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

        <div
          onClick={(e) => e.stopPropagation()}
          className="flex size-7 items-center justify-center"
        >
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
                disabled={isDeleting}
                onClick={() => void onDeleteTask(task.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 size-4" />
                {tCommon("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
