"use client"

import { Plus, CheckCircle2, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProjectTasksTabProps {
  projectId: string
}

export function ProjectTasksTab({ projectId }: ProjectTasksTabProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold tracking-tight">
            Tâches du projet
          </h3>
          <p className="text-xs text-muted-foreground">
            Gère la liste des tâches associées à ce projet.
          </p>
        </div>
        <Button size="sm" className="gap-2 rounded-xl">
          <Plus className="size-4" />
          Ajouter une tâche
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 bg-card/20 p-8 text-center">
        <Circle className="mb-2 size-8 text-muted-foreground/50" />
        <p className="text-sm font-medium">Aucune tâche pour ce projet</p>
        <p className="mt-1 max-w-xs text-xs text-muted-foreground">
          Crée ta première tâche pour commencer à suivre l'avancement.
        </p>
      </div>
    </div>
  )
}
