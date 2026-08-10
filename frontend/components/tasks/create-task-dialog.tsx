"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format, isValid, parse } from "date-fns"
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
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

import { createTaskSchema } from "@/lib/validations/task"
import { taskApi } from "@/api/task"
import { useEnumOptions } from "@/hooks/use-enums"

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
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { priorityItems, statusItems, getStatusLabel, getPriorityInfo } =
    useEnumOptions()
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
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
        <form
          onSubmit={handleSubmit(async (data) => {
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
              reset()
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

          <FieldGroup className="my-4 gap-2 space-y-4">
            <Field>
              <Label htmlFor="title">{tTasks("create.name")}</Label>
              <Input
                id="title"
                placeholder={tTasks("create.namePlaceholder")}
                {...register("title")}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.title.message}
                </p>
              )}
            </Field>

            <Field>
              <Label htmlFor="description">
                {tTasks("create.description")}
              </Label>
              <Textarea
                id="description"
                placeholder={tTasks("create.descriptionPlaceholder")}
                {...register("description")}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field>
                <Label htmlFor="status">{tTasks("create.status")}</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(val) => field.onChange(val ?? "TODO")}
                      value={field.value}
                    >
                      <SelectTrigger id="status" className="w-full">
                        <SelectValue
                          placeholder={tTasks("create.statusPlaceholder")}
                        >
                          {field.value
                            ? getStatusLabel(field.value)
                            : undefined}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-border/50 bg-popover/95 backdrop-blur-sm">
                        <SelectGroup>
                          <SelectLabel>{tTasks("create.status")}</SelectLabel>
                          {statusItems.map((item) => (
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
                <Label htmlFor="priority">{tTasks("create.priority")}</Label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(val) => field.onChange(val ?? "MEDIUM")}
                      value={field.value}
                    >
                      <SelectTrigger id="priority" className="w-full">
                        <SelectValue
                          placeholder={tTasks("create.priorityPlaceholder")}
                        >
                          {field.value
                            ? getPriorityInfo(field.value).label
                            : undefined}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-border/50 bg-popover/95 backdrop-blur-sm">
                        <SelectGroup>
                          <SelectLabel>
                            {tTasks("create.priorities")}
                          </SelectLabel>
                          {priorityItems.map((item) => (
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
                <Label htmlFor="dueDate">{tTasks("create.dueDate")}</Label>
                <Controller
                  name="dueDate"
                  control={control}
                  render={({ field }) => {
                    const currentDate = field.value
                      ? new Date(field.value)
                      : undefined
                    const displayValue =
                      currentDate && isValid(currentDate)
                        ? format(currentDate, "yyyy-MM-dd")
                        : field.value || ""

                    return (
                      <InputGroup>
                        <InputGroupInput
                          id="dueDate"
                          value={displayValue}
                          placeholder="YYYY-MM-DD"
                          onChange={(e: any) => {
                            const val = e.target.value
                            field.onChange(val)
                            const parsed = parse(val, "yyyy-MM-dd", new Date())
                            if (isValid(parsed)) {
                              field.onChange(parsed.toISOString())
                            }
                          }}
                          onKeyDown={(e: any) => {
                            if (e.key === "ArrowDown") {
                              e.preventDefault()
                              setPopoverOpen(true)
                            }
                          }}
                        />
                        <InputGroupAddon align="inline-end">
                          <Popover
                            open={popoverOpen}
                            onOpenChange={setPopoverOpen}
                          >
                            <PopoverTrigger
                              render={
                                <InputGroupButton
                                  id="date-picker-trigger"
                                  variant="ghost"
                                  size="icon-xs"
                                  aria-label="Select date"
                                >
                                  <CalendarIcon />
                                  <span className="sr-only">
                                    {tTasks("create.dueDate")}
                                  </span>
                                </InputGroupButton>
                              }
                            />
                            <PopoverContent
                              className="w-auto overflow-hidden p-0"
                              align="end"
                              alignOffset={-8}
                              sideOffset={10}
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  currentDate && isValid(currentDate)
                                    ? currentDate
                                    : undefined
                                }
                                onSelect={(selectedDate) => {
                                  field.onChange(
                                    selectedDate
                                      ? selectedDate.toISOString()
                                      : ""
                                  )
                                  setPopoverOpen(false)
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </InputGroupAddon>
                      </InputGroup>
                    )
                  }}
                />
              </Field>

              <Field>
                <Label htmlFor="estimatedHours">
                  {tTasks("create.estimatedTime")}
                </Label>
                <Input
                  id="estimatedHours"
                  type="number"
                  step="0.5"
                  placeholder={tTasks("create.estimatedTimePlaceholder")}
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
      </DialogContent>
    </Dialog>
  )
}
