"use client"

import { FileText } from "lucide-react"
import { useTranslations } from "next-intl"

interface ProjectNotesTabProps {
  projectId: string
}

export function ProjectNotesTab({ projectId }: ProjectNotesTabProps) {
  const tProjects = useTranslations("projects")
  return (
    <div className="space-y-4 rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
      <div>
        <h3 className="text-base font-semibold tracking-tight">
          {tProjects("notes.title")}
        </h3>
        <p className="text-xs text-muted-foreground">
          {tProjects("notes.description")}
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 bg-card/20 p-8 text-center">
        <FileText className="mb-2 size-8 text-muted-foreground/50" />
        <p className="text-sm font-medium">{tProjects("notes.noNotes")}</p>
        <p className="mt-1 max-w-xs text-xs text-muted-foreground">
          {tProjects("notes.noNotesDescription")}
        </p>
      </div>
    </div>
  )
}
