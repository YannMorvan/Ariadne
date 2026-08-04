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
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import {
  CreateProjectInput,
  createProjectSchema,
} from "@/lib/validations/project"
import { projectApi } from "@/api/project"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTranslations } from "next-intl"

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const tProjects = useTranslations("projects")
  const tCommon = useTranslations("common")

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
    } catch (error: unknown) {
      if (error instanceof Error) {
        setApiError(
          error.message || "Unexpected error occurred. Please try again."
        )
      } else {
        console.error("Unexpected error:", error)
        setApiError("Unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const PriorityItems = [
    { label: "Low", value: "LOW" },
    { label: "Medium", value: "MEDIUM" },
    { label: "High", value: "HIGH" },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            className="!bg-primary text-primary-foreground hover:!bg-primary/90"
            variant="outline"
          >
            {tProjects("createProject")}
          </Button>
        }
      />

      <DialogContent className="sm:max-w-sm">
        <form
          onSubmit={handleSubmit(onSubmit, (err) =>
            console.log("Validation errors:", err)
          )}
        >
          <DialogHeader>
            <DialogTitle>{tProjects("create.title")}</DialogTitle>
            <DialogDescription>{tProjects("create.details")}</DialogDescription>
          </DialogHeader>

          {apiError && (
            <p className="my-2 text-sm text-destructive">{apiError}</p>
          )}

          <FieldGroup className="my-4 space-y-4">
            <Field>
              <Label htmlFor="name">{tProjects("create.name")}</Label>
              <Input
                id="name"
                placeholder={tProjects("create.namePlaceholder")}
                {...register("name")}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </Field>

            <Field>
              <Label htmlFor="description">
                {tProjects("create.description")}
              </Label>
              <Input
                id="description"
                placeholder={tProjects("create.descriptionPlaceholder")}
                {...register("description")}
              />
            </Field>

            <Field>
              <Label htmlFor="priority">{tProjects("create.priority")}</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger id="priority" className="w-full">
                      <SelectValue
                        placeholder={tProjects("create.priorityPlaceholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>
                          {tProjects("create.priorities")}
                        </SelectLabel>
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

          <DialogFooter className="mt-6">
            <DialogClose
              render={<Button variant="outline">{tCommon("cancel")}</Button>}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : tCommon("create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
