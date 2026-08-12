"use client"

import { useFormContext, Controller } from "react-hook-form"
import { useTranslations } from "next-intl"

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
import { useEnumOptions } from "@/hooks/use-enums"

export function ProjectFormFields() {
  const tProjects = useTranslations("projects")
  const { priorityItems, getPriorityInfo } = useEnumOptions()

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <FieldGroup className="my-4 space-y-2">
      <Field>
        <Label htmlFor="name">{tProjects("create.name")}</Label>
        <Input id="name" placeholder="ex: Ariadne MVP" {...register("name")} />
        {errors.name && (
          <p className="mt-1 text-xs text-destructive">
            {errors.name.message as string}
          </p>
        )}
      </Field>

      <Field>
        <Label htmlFor="description">{tProjects("create.description")}</Label>
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
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="priority" className="w-full">
                <SelectValue
                  placeholder={tProjects("create.priorityPlaceholder")}
                >
                  {field.value ? getPriorityInfo(field.value).label : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/50 bg-popover/95 backdrop-blur-sm">
                <SelectGroup>
                  <SelectLabel>{tProjects("create.priority")}</SelectLabel>
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
    </FieldGroup>
  )
}
