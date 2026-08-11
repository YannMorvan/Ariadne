"use client"

import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  type CreateProjectInput,
  createProjectSchema,
} from "@/lib/validations/project"
import { projectApi } from "@/api/project"
import { ProjectFormFields } from "./project-form-fields"

interface CreateProjectDialogProps {
  onSuccess?: () => void
}

export function CreateProjectDialog({ onSuccess }: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const tCommon = useTranslations("common")
  const tProjects = useTranslations("projects")

  const methods = useForm({
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
      methods.reset()
      setOpen(false)
      onSuccess?.()
    } catch (error: unknown) {
      if (error instanceof Error) {
        setApiError(error.message || "An unexpected error occurred.")
      } else {
        setApiError("An unexpected error occurred.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="rounded-xl font-medium">
            {tProjects("createProject")}
          </Button>
        }
      />

      <DialogContent className="rounded-2xl border-border/50 bg-card/95 backdrop-blur-xl sm:max-w-md">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{tProjects("create.title")}</DialogTitle>
              <DialogDescription>
                {tProjects("create.details")}
              </DialogDescription>
            </DialogHeader>

            {apiError && (
              <div className="my-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-500">
                {apiError}
              </div>
            )}

            <ProjectFormFields />

            <DialogFooter className="mt-6 gap-2">
              <Button
                type="button"
                variant="ghost"
                disabled={isLoading}
                onClick={() => setOpen(false)}
              >
                {tCommon("cancel")}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
                {isLoading ? tCommon("creating") : tCommon("create")}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
