"use client"

import { useFormContext, Controller } from "react-hook-form"
import { useTranslations } from "next-intl"

import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEnumOptions } from "@/hooks/use-enums"
import { CalendarIcon } from "lucide-react"

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
import { useState } from "react"
import { format, isValid, parse } from "date-fns"

export function TaskFormFields() {
  const tTasks = useTranslations("tasks")
  const [popoverOpen, setPopoverOpen] = useState(false)
  const { priorityItems, statusItems, getStatusLabel, getPriorityInfo } =
    useEnumOptions()

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext()

  return (
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
            {errors.title.message as string}
          </p>
        )}
      </Field>

      <Field>
        <Label htmlFor="description">{tTasks("create.description")}</Label>
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
                  <SelectValue placeholder={tTasks("create.statusPlaceholder")}>
                    {field.value ? getStatusLabel(field.value) : undefined}
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
                    <SelectLabel>{tTasks("create.priorities")}</SelectLabel>
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
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
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
                              selectedDate ? selectedDate.toISOString() : ""
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
              {errors.estimatedHours.message as string}
            </p>
          )}
        </Field>
      </div>
    </FieldGroup>
  )
}
