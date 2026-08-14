"use client"

import { FolderKanban } from "lucide-react"
import { CreateProjectDialog } from "./dialogs/create-project-dialog"
import { useTranslations } from "next-intl"

interface EmptyProjectsStateProps {
  hasFilters: boolean
  onProjectsCreated?: () => void
}

export function EmptyProjectsState({
  hasFilters,
  onProjectsCreated,
}: EmptyProjectsStateProps) {
  const tProjects = useTranslations("projects")

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-card/20 p-12 text-center backdrop-blur-sm">
      <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <FolderKanban className="size-6" />
      </div>
      <h3 className="text-base font-semibold tracking-tight">
        {hasFilters ? tProjects("noResults") : tProjects("noProjects")}
      </h3>
      <p className="mt-1 mb-6 max-w-sm text-sm text-muted-foreground">
        {hasFilters
          ? tProjects("noResultsDescription")
          : tProjects("noProjectsDescription")}
      </p>
      {!hasFilters && <CreateProjectDialog onSuccess={onProjectsCreated} />}
    </div>
  )
}
