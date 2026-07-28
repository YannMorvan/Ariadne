"use client"

import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  type CreateProjectInput,
  createProjectSchema,
} from "@/lib/validations/project"
import { projectApi } from "@/api/project"
import type { Project } from "@/types"

interface EditProjectDialogProps {
  project: Project
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const PriorityItems = [
  { label: "Basse", value: "LOW" },
  { label: "Moyenne", value: "MEDIUM" },
  { label: "Haute", value: "HIGH" },
  { label: "Urgente", value: "URGENT" },
]

export function EditProjectDialog({
  project,
  open,
  onOpenChange,
  onSuccess,
}: EditProjectDialogProps) {
  const [apiError, setApiError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: project.name,
      priority: project.priority,
      description: project.description || "",
    },
  })

  useEffect(() => {
    reset({
      name: project.name,
      priority: project.priority,
      description: project.description || "",
    })
  }, [project, reset])

  const onSubmit = async (data: CreateProjectInput) => {
    setIsLoading(true)
    setApiError(null)

    try {
      await projectApi.updateProject(project.id, data)
      onOpenChange(false)
      onSuccess?.()
    } catch (error: unknown) {
      if (error instanceof Error) {
        setApiError(error.message || "Erreur lors de la modification")
      } else {
        setApiError("Une erreur inattendue est survenue")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl border-border/50 bg-card/95 backdrop-blur-xl sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Modifier le projet</DialogTitle>
            <DialogDescription>
              Ajuste les détails de ton projet.
            </DialogDescription>
          </DialogHeader>

          {apiError && (
            <div className="my-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-500">
              {apiError}
            </div>
          )}

          <FieldGroup className="my-4 space-y-4">
            <Field>
              <Label htmlFor="name">Nom du projet</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </Field>

            <Field>
              <Label htmlFor="description">Description</Label>
              <Input id="description" {...register("description")} />
            </Field>

            <Field>
              <Label htmlFor="priority">Priorité</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="priority" className="w-full">
                      <SelectValue placeholder="Sélectionner une priorité" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/50 bg-popover/95 backdrop-blur-sm">
                      <SelectGroup>
                        <SelectLabel>Priorités</SelectLabel>
                        {PriorityItems.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6 gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={isLoading}>
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
