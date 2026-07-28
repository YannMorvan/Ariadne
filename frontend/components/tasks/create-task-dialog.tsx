"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

import { type CreateTaskInput, createTaskSchema } from "@/lib/validations/task"
import { taskApi } from "@/api/task"

interface CreateTaskDialogProps {
  projectId: string
  onSuccess?: () => void
}

const PriorityItems = [
  { label: "Basse", value: "LOW" },
  { label: "Moyenne", value: "MEDIUM" },
  { label: "Haute", value: "HIGH" },
  { label: "Urgente", value: "URGENT" },
]

const StatusItems = [
  { label: "À faire", value: "TODO" },
  { label: "En cours", value: "IN_PROGRESS" },
  { label: "Terminé", value: "DONE" },
]

export function CreateTaskDialog({
  projectId,
  onSuccess,
}: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      status: "TODO",
      projectId: projectId,
      estimatedHours: undefined,
    },
  })

  const onSubmit = async (data: CreateTaskInput) => {
    setIsLoading(true)
    setApiError(null)

    try {
      await taskApi.createTask({
        ...data,
        projectId,
      })
      reset()
      setOpen(false)
      onSuccess?.()
    } catch (error: unknown) {
      if (error instanceof Error) {
        setApiError(
          error.message ||
            "Une erreur est survenue lors de la création de la tâche."
        )
      } else {
        setApiError("Une erreur inattendue est survenue.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="gap-2 rounded-xl font-medium">
          <Plus className="size-4" />
          Nouvelle tâche
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-2xl border-border/50 bg-card/95 backdrop-blur-xl sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Créer une tâche</DialogTitle>
            <DialogDescription>
              Ajoute une nouvelle tâche à exécuter pour ce projet.
            </DialogDescription>
          </DialogHeader>

          {apiError && (
            <div className="my-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-500">
              {apiError}
            </div>
          )}

          <FieldGroup className="my-4 space-y-4">
            <Field>
              <Label htmlFor="title">Titre de la tâche</Label>
              <Input
                id="title"
                placeholder="ex: Sécuriser les endpoints JWT"
                {...register("title")}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.title.message}
                </p>
              )}
            </Field>

            <Field>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Détails ou instructions sur la tâche..."
                {...register("description")}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field>
                <Label htmlFor="status">Statut</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger id="status" className="w-full">
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-border/50 bg-popover/95 backdrop-blur-sm">
                        <SelectGroup>
                          <SelectLabel>Statuts</SelectLabel>
                          {StatusItems.map((item) => (
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

              <Field>
                <Label htmlFor="priority">Priorité</Label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger id="priority" className="w-full">
                        <SelectValue placeholder="Priorité" />
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
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field>
                <Label htmlFor="dueDate">Date d'échéance</Label>
                <Input id="dueDate" type="date" {...register("dueDate")} />
              </Field>

              <Field>
                <Label htmlFor="estimatedHours">Temps estimé (h)</Label>
                <Input
                  id="estimatedHours"
                  type="number"
                  step="0.5"
                  placeholder="ex: 2.5"
                  {...register("estimatedHours", { valueAsNumber: true })}
                />
                {errors.estimatedHours && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.estimatedHours.message}
                  </p>
                )}
              </Field>
            </div>
          </FieldGroup>

          <DialogFooter className="mt-6 gap-2 sm:gap-0">
            <DialogClose>
              <Button type="button" variant="ghost" disabled={isLoading}>
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isLoading ? "Création..." : "Créer la tâche"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
