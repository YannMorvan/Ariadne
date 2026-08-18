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

import { UpdateTaskInput, updateTaskSchema } from "@/lib/validations/task"
import { taskApi } from "@/api/task"
import { TaskFormFields } from "./task-form-fields"
import { Task } from "@/types/task"

interface EditTaskDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditTaskDialog({
  task,
  open,
  onOpenChange,
  onSuccess,
}: EditTaskDialogProps) {
  const [apiError, setApiError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const tCommon = useTranslations("common")
  const tTasksEdit = useTranslations("tasks.edit")

  const methods = useForm({
    resolver: zodResolver(updateTaskSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    values: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      status: task?.status ?? "TODO",
      priority: task?.priority ?? "MEDIUM",
      assigneeId: task?.assigneeId ?? undefined,
      dueDate: task?.dueDate ?? undefined,
    },
  })

  const onSubmit = async (payload: UpdateTaskInput) => {
    setIsLoading(true)
    setApiError(null)

    try {
      await taskApi.updateTask(task?.id || "", payload)
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

  if (!task) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl border-border/50 bg-card/95 backdrop-blur-xl sm:max-w-md">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{tTasksEdit("title")}</DialogTitle>
              <DialogDescription>{tTasksEdit("details")}</DialogDescription>
            </DialogHeader>

            {apiError && (
              <div className="my-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-500">
                {apiError}
              </div>
            )}

            <TaskFormFields />

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
