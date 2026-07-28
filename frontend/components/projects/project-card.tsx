"use client"

import { MoreHorizontal, Calendar, CheckSquare } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
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
import { useRouter } from "next/navigation"
import { DeleteProjectDialog } from "./delete-project-dialog"

interface ProjectCardProps {
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

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const priority = priorityConfig[project.priority] || priorityConfig.MEDIUM
  const router = useRouter()

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

          {/* On stoppe la propagation du clic sur l'ensemble de la zone du menu */}
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
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete?.(project.id)
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="line-clamp-2 text-sm text-muted-foreground">
          {project.description || "Aucune description fournie pour ce projet."}
        </CardDescription>

        <div className="flex items-center justify-between border-t border-border/30 pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            <span>Récemment mis à jour</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <CheckSquare className="size-3.5 text-muted-foreground" />
            <span>0 tâches</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
