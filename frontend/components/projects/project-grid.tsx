"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { LayoutGrid, List, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProjectCard } from "@/components/projects/project-card"
import { ProjectListItem } from "@/components/projects/project-list-item"
import { ProjectStats } from "@/components/projects/project-stats"
import { ProjectFilters } from "@/components/projects/project-filters"
import { CreateProjectDialog } from "@/components/projects/dialogs/create-project-dialog"
import { DeleteProjectDialog } from "@/components/projects/dialogs/delete-project-dialog"
import { EmptyProjectsState } from "@/components/projects/empty-projects-state"

import type { Project, StatMetric } from "@/types"
import { useTranslations } from "next-intl"
import { EditProjectDialog } from "./dialogs/edit-project-dialog"
import { ProjectInvitationsDialog } from "./dialogs/project-invitations-dialog"

interface ProjectGridProps {
  projects: Project[]
  metrics?: StatMetric[]
  onProjectsUpdated?: () => void
}

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 + i * 0.1,
      duration: 0.45,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
}

export function ProjectGrid({
  projects: initialProjects,
  metrics,
  onProjectsUpdated,
}: ProjectGridProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPriority, setSelectedPriority] = useState<string>("ALL")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null)

  const tProjects = useTranslations("projects")
  const tCommon = useTranslations("common")

  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesPriority =
        selectedPriority === "ALL" || project.priority === selectedPriority

      return matchesSearch && matchesPriority
    })
  }, [initialProjects, searchQuery, selectedPriority])

  function handleProjectDeleted() {
    setProjectToDelete(null)
    onProjectsUpdated?.()
  }

  function handleProjectEdited() {
    setProjectToEdit(null)
    onProjectsUpdated?.()
  }

  function handleProjectCreated() {
    onProjectsUpdated?.()
  }

  return (
    <div className="space-y-6">
      <motion.div
        custom={0}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {tProjects("title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {tProjects("description")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ProjectInvitationsDialog />
          <CreateProjectDialog onSuccess={handleProjectCreated} />
        </div>
      </motion.div>

      {metrics && metrics.length > 0 && (
        <motion.div
          custom={1}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <ProjectStats metrics={metrics} />
        </motion.div>
      )}

      <motion.div
        custom={2}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex flex-1 items-center gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={tProjects("searchPlaceholder")}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <ProjectFilters
            selectedPriority={selectedPriority}
            onPriorityChange={setSelectedPriority}
          />
        </div>

        <div className="flex items-center rounded-lg border bg-background p-1 shadow-sm">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="h-8 w-8 p-0"
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="sr-only">{tCommon("gridView")}</span>
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
            <span className="sr-only">{tCommon("listView")}</span>
          </Button>
        </div>
      </motion.div>

      <motion.div
        custom={3}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredProjects.length === 0 ? (
          <EmptyProjectsState
            hasFilters={searchQuery !== "" || selectedPriority !== "ALL"}
            onProjectsCreated={handleProjectCreated}
          />
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={() => setProjectToEdit(project)}
                onDelete={() => setProjectToDelete(project)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredProjects.map((project) => (
              <ProjectListItem
                key={project.id}
                project={project}
                onDelete={() => setProjectToDelete(project)}
              />
            ))}
          </div>
        )}
      </motion.div>

      <EditProjectDialog
        project={projectToEdit}
        open={!!projectToEdit}
        onOpenChange={(open) => !open && setProjectToEdit(null)}
        onSuccess={handleProjectEdited}
      />
      <DeleteProjectDialog
        projectId={projectToDelete?.id || null}
        projectName={projectToDelete?.name}
        open={!!projectToDelete}
        onOpenChange={(open) => !open && setProjectToDelete(null)}
        onSuccess={handleProjectDeleted}
      />
    </div>
  )
}
