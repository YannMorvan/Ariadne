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

interface ProjectListItemProps {
  project: Project
  onEdit?: (project: Project) => void
  onDelete?: (id: string) => void
}

const priorityConfig: Record<string, { label: string; className: string }> = {
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

export function ProjectListItem({
  project,
  onEdit,
  onDelete,
}: ProjectListItemProps) {
  const priority = priorityConfig[project.priority] || priorityConfig.MEDIUM

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
            {project.description || "Aucune description"}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="rounded-xl border-border/50 bg-popover/95 backdrop-blur-sm"
          >
            <DropdownMenuItem onClick={() => onEdit?.(project)}>
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete?.(project.id)}
              className="text-destructive focus:text-destructive"
            >
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
