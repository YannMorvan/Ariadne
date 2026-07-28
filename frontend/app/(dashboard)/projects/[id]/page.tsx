"use client"

import { use } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export default function SingleProjectPage({ params }: ProjectPageProps) {
  const { id } = use(params)

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6 md:py-8">
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

      <div className="space-y-4 rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
        <h1 className="text-2xl font-bold tracking-tight">
          Détails du projet #{id}
        </h1>
        <p className="text-sm text-muted-foreground">
          Espace de travail et suivi des tâches du projet.
        </p>
      </div>
    </div>
  )
}
