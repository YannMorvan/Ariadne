"use client"

import { useState } from "react"
import { Loader2, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { projectApi } from "@/api/project"
import { useTranslations } from "next-intl"

interface DeleteProjectDialogProps {
  projectId: string | null
  projectName?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteProjectDialog({
  projectId,
  projectName,
  open,
  onOpenChange,
  onSuccess,
}: DeleteProjectDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const tProjectsDelete = useTranslations("projects.delete")
  const tCommon = useTranslations("common")

  const handleDelete = async () => {
    if (!projectId) return

    try {
      setIsLoading(true)
      setApiError(null)
      await projectApi.deleteProject(projectId)
      onSuccess()
      onOpenChange(false)
    } catch (error: unknown) {
      if (error instanceof Error) {
        setApiError(
          error.message || "An unexpected error occurred. Please try again."
        )
      } else {
        setApiError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl border-border/50 bg-card/95 backdrop-blur-xl sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex flex-row items-center justify-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
              <AlertTriangle className="size-5" />
            </div>
            <DialogTitle>{tProjectsDelete("title")}</DialogTitle>
          </div>
          <DialogDescription>
            {tProjectsDelete("description", { projectName: projectName || "" })}
          </DialogDescription>
        </DialogHeader>

        {apiError && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
            {apiError}
          </div>
        )}

        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="rounded-xl"
          >
            {tCommon("cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => void handleDelete()}
            disabled={isLoading}
            className="rounded-xl"
          >
            {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isLoading ? tCommon("deleting") : tCommon("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
