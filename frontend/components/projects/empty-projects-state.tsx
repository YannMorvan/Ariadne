"use client"

import { FolderKanban } from "lucide-react"
import { CreateProjectDialog } from "./create-project-dialog"

interface EmptyProjectsStateProps {
  hasFilters: boolean
}

export function EmptyProjectsState({ hasFilters }: EmptyProjectsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-card/20 p-12 text-center backdrop-blur-sm">
      <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <FolderKanban className="size-6" />
      </div>
      <h3 className="text-base font-semibold tracking-tight">
        {hasFilters ? "No projects found" : "No projects at the moment"}
      </h3>
      <p className="mt-1 mb-6 max-w-sm text-sm text-muted-foreground">
        {hasFilters
          ? "Modify your filters or search to display other results."
          : "Start by creating your first project to track your tasks and progress."}
      </p>
      {!hasFilters && <CreateProjectDialog />}
    </div>
  )
}
