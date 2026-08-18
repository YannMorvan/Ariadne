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
} from "@/components/ui/dialog"

import {
  UpdateProjectInput,
  updateProjectSchema,
} from "@/lib/validations/project"
import { projectApi } from "@/api/project"
import { ProjectFormFields } from "./project-form-fields"
import { Project } from "@/types"

interface EditProjectDialogProps {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditProjectDialog({
  project,
  open,
  onOpenChange,
  onSuccess,
}: EditProjectDialogProps) {
  const [apiError, setApiError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const tCommon = useTranslations("common")
  const tProjectsEdit = useTranslations("projects.edit")

  const methods = useForm({
    resolver: zodResolver(updateProjectSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    values: {
      name: project?.name ?? "",
      priority: project?.priority ?? "MEDIUM",
      description: project?.description ?? "",
    },
  })

  const onSubmit = async (payload: UpdateProjectInput) => {
    setIsLoading(true)
    setApiError(null)

    try {
      await projectApi.updateProject(project?.id ?? "", payload)
      onOpenChange(false)
      setTimeout(() => {
        onSuccess?.()
      }, 0)
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

  if (!project) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl border-border/50 bg-card/95 backdrop-blur-xl sm:max-w-md">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <input type="hidden" />
            <DialogHeader>
              <DialogTitle>{tProjectsEdit("title")}</DialogTitle>
              <DialogDescription>{tProjectsEdit("details")}</DialogDescription>
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
                onClick={() => onOpenChange(false)}
              >
                {tCommon("cancel")}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
                {isLoading ? tCommon("updating") : tCommon("update")}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
