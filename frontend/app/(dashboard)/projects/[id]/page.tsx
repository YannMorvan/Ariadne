"use client"

import { use, useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Calendar,
  CheckSquare,
  Plus,
  Loader2,
} from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DeleteProjectDialog } from "@/components/projects/delete-project-dialog"
import { ProjectTasksTab } from "@/components/projects/project-tasks-tab"
import { ProjectNotesTab } from "@/components/projects/project-notes-tab"
import { projectApi } from "@/api/project"
import { taskApi } from "@/api/task"
import { cn } from "@/lib/utils"
import type { ProjectWithTasks } from "@/types"

interface ProjectPageProps {
  params: Promise<{ id: string }>
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

export default function SingleProjectPage({ params }: ProjectPageProps) {
  const { id } = use(params)
  const router = useRouter()

  const [project, setProject] = useState<ProjectWithTasks | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const fetchProject = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const [projectData, tasksData] = await Promise.all([
        projectApi.getProjectById(id),
        taskApi.getTasksByProjectId(id).catch(() => []),
      ])
      setProject({ ...projectData, tasks: tasksData })
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Impossible de charger le projet")
      } else {
        setError("Erreur lors du chargement du projet")
      }
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    void fetchProject()
  }, [fetchProject])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6 md:py-8 lg:py-10">
        <div className="h-6 w-32 animate-pulse rounded-lg bg-muted/40" />
        <div className="h-48 animate-pulse rounded-2xl border border-border/50 bg-card/20" />
        <div className="h-96 animate-pulse rounded-2xl border border-border/50 bg-card/20" />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-12 text-center">
        <h2 className="text-xl font-semibold">Projet introuvable</h2>
        <p className="text-sm text-muted-foreground">
          {error || "Ce projet n'existe pas ou a été supprimé."}
        </p>
        <Link href="/projects">
          <Button variant="outline" className="gap-2 rounded-xl">
            <ArrowLeft className="size-4" />
            Retour aux projets
          </Button>
        </Link>
      </div>
    )
  }

  const priority = priorityConfig[project.priority] || priorityConfig.MEDIUM

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6 md:py-8 lg:py-10">
      {/* 1. Fil d'Ariane & Bouton retour */}
      <div className="flex items-center justify-between">
        <Link href="/projects">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Retour aux projets
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditOpen(true)}
            className="gap-2 rounded-xl border-border/50 bg-card/50 backdrop-blur-sm"
          >
            <Edit2 className="size-3.5" />
            Modifier
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDeleteOpen(true)}
            className="gap-2 rounded-xl border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-500"
          >
            <Trash2 className="size-3.5" />
            Supprimer
          </Button>
        </div>
      </div>

      {/* 2. Hero Card du Projet */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {project.name}
              </h1>
              <Badge
                variant="outline"
                className={cn("text-xs font-normal", priority.className)}
              >
                {priority.label}
              </Badge>
            </div>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {project.description ||
                "Aucune description fournie pour ce projet."}
            </p>
          </div>
        </div>

        {/* Barre de progression & Métriques de bas de carte */}
        <div className="space-y-2 border-t border-border/30 pt-4">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Progression du projet</span>
            <span className="text-foreground">{project.progress || 0}%</span>
          </div>
          <Progress
            value={project.progress || 0}
            className="[&_[data-slot=progress-indicator]]:bg-violet-500 [&_[data-slot=progress-track]]:h-2"
          />
        </div>
      </motion.div>

      {/* 3. Contenu par Onglets (Tâches / Notes) */}
      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList className="rounded-xl border border-border/50 bg-card/50 p-1 backdrop-blur-sm">
          <TabsTrigger value="tasks" className="gap-2 rounded-lg text-xs">
            <CheckSquare className="size-3.5" />
            Tâches
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-2 rounded-lg text-xs">
            <Calendar className="size-3.5" />
            Notes & Spécifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="mt-0">
          <ProjectTasksTab
            projectId={project.id}
            tasks={project.tasks}
            onTasksUpdated={fetchProject}
          />
        </TabsContent>

        <TabsContent value="notes" className="mt-0">
          <ProjectNotesTab projectId={project.id} />
        </TabsContent>
      </Tabs>

      <DeleteProjectDialog
        projectId={project.id}
        projectName={project.name}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onSuccess={() => router.push("/projects")}
      />
    </div>
  )
}
