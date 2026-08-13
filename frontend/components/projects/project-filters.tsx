"use client"

import { Filter } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTranslations } from "next-intl"

interface ProjectFiltersProps {
  selectedPriority: string
  onPriorityChange: (value: string) => void
}

export function ProjectFilters({
  selectedPriority,
  onPriorityChange,
}: ProjectFiltersProps) {
  const tEnums = useTranslations("enums")

  const currentLabel = tEnums(`priority.${selectedPriority || "ALL"}`)

  return (
    <Select
      value={selectedPriority}
      onValueChange={(val) => onPriorityChange(val ?? "ALL")}
    >
      <SelectTrigger className="w-[180px] border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 truncate text-muted-foreground">
          <Filter className="size-3.5 shrink-0" />
          <SelectValue>{currentLabel}</SelectValue>
        </div>
      </SelectTrigger>

      <SelectContent className="rounded-xl border-border/50 bg-popover/95 backdrop-blur-sm">
        <SelectItem value="ALL">{tEnums("priority.ALL")}</SelectItem>
        <SelectItem value="LOW">{tEnums("priority.LOW")}</SelectItem>
        <SelectItem value="MEDIUM">{tEnums("priority.MEDIUM")}</SelectItem>
        <SelectItem value="HIGH">{tEnums("priority.HIGH")}</SelectItem>
        <SelectItem value="URGENT">{tEnums("priority.URGENT")}</SelectItem>
      </SelectContent>
    </Select>
  )
}
