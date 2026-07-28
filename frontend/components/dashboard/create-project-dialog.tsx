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

export function CreateProjectDialog() {
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
    console.log("Submitting data:", data)
    setIsLoading(true)
    setApiError(null)

    try {
      await projectApi.createProject(data)
      reset()
      setOpen(false)
    } catch (error: any) {
      setApiError(
        error.message || "Une erreur est survenue lors de la création du projet"
      )
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
            + Nouveau projet
          </Button>
        }
      />

      <DialogContent className="sm:max-w-sm">
        <form
          onSubmit={handleSubmit(onSubmit, (err) =>
            console.log("Erreurs de validation Zod:", err)
          )}
        >
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              Fill in the details for your new project.
            </DialogDescription>
          </DialogHeader>

          {apiError && (
            <p className="my-2 text-sm text-destructive">{apiError}</p>
          )}

          <FieldGroup className="my-4 space-y-4">
            <Field>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter project name"
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
                placeholder="Enter project description"
                {...register("description")}
              />
            </Field>

            <Field>
              <Label htmlFor="priority">Priority</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger id="priority" className="w-full">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Priorities</SelectLabel>
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
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
