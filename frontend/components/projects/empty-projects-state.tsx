"use client"

import { FolderKanban, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyProjectsStateProps {
  hasFilters: boolean
  onCreateClick: () => void
}

export function EmptyProjectsState({
  hasFilters,
  onCreateClick,
}: EmptyProjectsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-card/20 p-12 text-center backdrop-blur-sm">
      <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <FolderKanban className="size-6" />
      </div>
      <h3 className="text-base font-semibold tracking-tight">
        {hasFilters ? "Aucun projet trouvé" : "Aucun projet pour le moment"}
      </h3>
      <p className="mt-1 mb-6 max-w-sm text-sm text-muted-foreground">
        {hasFilters
          ? "Modifie tes filtres ou ta recherche pour afficher d'autres résultats."
          : "Commence par créer ton premier projet pour suivre tes tâches et ton avancement."}
      </p>
      {!hasFilters && (
        <Button onClick={onCreateClick} className="gap-2">
          <Plus className="size-4" />
          Créer un projet
        </Button>
      )}
    </div>
  )
}
