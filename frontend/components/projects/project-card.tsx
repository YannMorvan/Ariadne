"use client"

import { MoreHorizontal, Calendar, CheckSquare } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Project } from "@/types"
import { useRouter } from "next/navigation"
import { useTranslations, useFormatter } from "next-intl"
import { useEnumOptions } from "@/hooks/use-enums"

interface ProjectCardProps {
  project: Project
  onEdit?: (project: Project) => void
  onDelete?: (id: string) => void
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const { getPriorityInfo } = useEnumOptions()
  const priority = getPriorityInfo(project?.priority || "MEDIUM", "project")
  const router = useRouter()

  const tCommon = useTranslations("common")
  const tProjects = useTranslations("projects")
  const format = useFormatter()

  const updatedDate = project.updatedAt
    ? new Date(project.updatedAt)
    : new Date()

  const relativeUpdate = format.relativeTime(updatedDate, new Date())

  return (
    <Card
      onClick={() => router.push(`/projects/${project.id}`)}
      className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm transition-colors hover:border-border hover:bg-card/80"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <CardTitle className="truncate text-base font-semibold tracking-tight">
              {project.name}
            </CardTitle>
            <Badge
              variant="outline"
              className={cn("text-xs font-normal", priority.className)}
            >
              {priority.label}
            </Badge>
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Actions</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="rounded-xl border-border/50 bg-popover/95 backdrop-blur-sm"
              >
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit?.(project)
                  }}
                >
                  {tCommon("edit")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete?.(project.id)
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  {tCommon("delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="line-clamp-2 text-sm text-muted-foreground">
          {project.description || tProjects("noDescription")}
        </CardDescription>

        <div className="flex items-center justify-between border-t border-border/30 pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            <span>{relativeUpdate}</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <CheckSquare className="size-3.5 text-muted-foreground" />
            <span>
              {tProjects("tasksCount", {
                count: project.tasksCount || 0,
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
