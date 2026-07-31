"use client"

import { useState } from "react"
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

import {
  type CreateProjectInput,
  createProjectSchema,
} from "@/lib/validations/project"
import { projectApi } from "@/api/project"

interface CreateProjectDialogProps {
  onSuccess?: () => void
}

const PriorityItems = [
  { label: "Basse", value: "LOW" },
  { label: "Moyenne", value: "MEDIUM" },
  { label: "Haute", value: "HIGH" },
  { label: "Urgente", value: "URGENT" },
]

export function CreateProjectDialog({ onSuccess }: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false)
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
      name: "",
      priority: "MEDIUM",
      description: "",
    },
  })

  const onSubmit = async (data: CreateProjectInput) => {
    setIsLoading(true)
    setApiError(null)

    try {
      await projectApi.createProject(data)
      reset()
      setOpen(false)
      onSuccess?.()
    } catch (error: unknown) {
      if (error instanceof Error) {
        setApiError(
          error.message || "Une erreur est survenue lors de la création."
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
      <DialogTrigger
        render={
          <Button className="rounded-xl font-medium">+ Nouveau projet</Button>
        }
      />

      <DialogContent className="rounded-2xl border-border/50 bg-card/95 backdrop-blur-xl sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Créer un projet</DialogTitle>
            <DialogDescription>
              Renseigne les détails de ton nouveau projet.
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
              <Input
                id="name"
                placeholder="ex: Ariadne MVP"
                {...register("name")}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </Field>

            <Field>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Brève description du projet..."
                {...register("description")}
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
            <DialogClose>
              <Button type="button" variant="ghost" disabled={isLoading}>
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isLoading ? "Création..." : "Créer le projet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
