"use client"

import { MoreHorizontal, FolderKanban } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Project } from "@/types"
import { useEnumOptions } from "@/hooks/use-enums"
import { useTranslations } from "next-intl"

interface ProjectListItemProps {
  project: Project
  onEdit?: (project: Project) => void
  onDelete?: (id: string) => void
}

export function ProjectListItem({
  project,
  onEdit,
  onDelete,
}: ProjectListItemProps) {
  const { getPriorityInfo } = useEnumOptions()
  const priority = getPriorityInfo(project?.priority || "MEDIUM", "project")
  const tProjects = useTranslations("projects")
  const tCommon = useTranslations("common")

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border/40 bg-card/40 p-4 transition-all hover:border-border hover:bg-card/80">
      <div className="flex min-w-0 items-center gap-3.5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
          <FolderKanban className="size-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold tracking-tight">
              {project.name}
            </h3>
            <Badge
              variant="outline"
              className={cn("text-xs font-normal", priority.className)}
            >
              {priority.label}
            </Badge>
          </div>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {project.description || tProjects("noDescription")}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center justify-center rounded-lg p-1 text-muted-foreground transition-colors hover:bg-accent/50 hover:text-accent-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:pointer-events-none disabled:opacity-50">
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Actions</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="rounded-xl border-border/50 bg-popover/95 backdrop-blur-sm"
          >
            <DropdownMenuItem onClick={() => onEdit?.(project)}>
              {tCommon("edit")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete?.(project.id)}
              className="text-destructive focus:text-destructive"
            >
              {tCommon("delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
