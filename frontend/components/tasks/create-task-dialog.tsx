"use client"

import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

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

import { createTaskSchema } from "@/lib/validations/task"
import { taskApi } from "@/api/task"
import { TaskFormFields } from "./task-form-fields"

interface CreateTaskDialogProps {
  projectId: string
  onSuccess?: () => void
}

export function CreateTaskDialog({
  projectId,
  onSuccess,
}: CreateTaskDialogProps) {
  const tCommon = useTranslations("common")
  const tTasks = useTranslations("tasks")
  const [open, setOpen] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const methods = useForm({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM" as const,
      status: "TODO" as const,
      projectId: projectId,
      dueDate: "",
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="gap-2 rounded-xl font-medium">
            {tTasks("createTasks")}
          </Button>
        }
      />

      <DialogContent className="rounded-2xl border-border/50 bg-card/95 backdrop-blur-xl sm:max-w-md">
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(async (data) => {
              setIsLoading(true)
              setApiError(null)

              try {
                const payload = {
                  ...data,
                  projectId,
                  dueDate: data.dueDate
                    ? new Date(data.dueDate).toISOString()
                    : undefined,
                  assigneeId: data.assigneeId || undefined,
                  estimatedHours:
                    data.estimatedHours && isNaN(Number(data.estimatedHours))
                      ? undefined
                      : data.estimatedHours,
                }

                await taskApi.createTask(payload)
                methods.reset()
                setOpen(false)
                onSuccess?.()
              } catch (error: unknown) {
                if (error instanceof Error) {
                  setApiError(
                    error.message ||
                      "An unexpected error occurred. Please try again."
                  )
                } else {
                  setApiError("An unexpected error occurred. Please try again.")
                }
              } finally {
                setIsLoading(false)
              }
            })}
          >
            <DialogHeader>
              <DialogTitle>{tTasks("create.title")}</DialogTitle>
              <DialogDescription>{tTasks("create.details")}</DialogDescription>
            </DialogHeader>

            {apiError && (
              <div className="my-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-500">
                {apiError}
              </div>
            )}

            <TaskFormFields />

            <DialogFooter className="mt-6 gap-2 sm:gap-0">
              <DialogClose
                render={
                  <Button type="button" variant="ghost" disabled={isLoading}>
                    {tCommon("cancel")}
                  </Button>
                }
              />
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
