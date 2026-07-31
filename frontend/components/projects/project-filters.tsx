"use client"

import { Filter } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ProjectFiltersProps {
  selectedPriority: string
  onPriorityChange: (value: string) => void
}

export function ProjectFilters({
  selectedPriority,
  onPriorityChange,
}: ProjectFiltersProps) {
  return (
    <Select
      value={selectedPriority}
      onValueChange={(val) => onPriorityChange(val ?? "ALL")}
    >
      <SelectTrigger className="w-[160px] border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Filter className="size-3.5" />
          <SelectValue placeholder="Priority" />
        </div>
      </SelectTrigger>
      <SelectContent className="rounded-xl border-border/50 bg-popover/95 backdrop-blur-sm">
        <SelectItem value="ALL">All Priorities</SelectItem>
        <SelectItem value="LOW">Low</SelectItem>
        <SelectItem value="MEDIUM">Medium</SelectItem>
        <SelectItem value="HIGH">High</SelectItem>
        <SelectItem value="URGENT">Urgent</SelectItem>
      </SelectContent>
    </Select>
  )
}
