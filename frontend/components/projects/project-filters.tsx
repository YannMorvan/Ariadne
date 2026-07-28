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
    <Select value={selectedPriority} onValueChange={onPriorityChange}>
      <SelectTrigger className="w-[160px] border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Filter className="size-3.5" />
          <SelectValue placeholder="Priorité" />
        </div>
      </SelectTrigger>
      <SelectContent className="rounded-xl border-border/50 bg-popover/95 backdrop-blur-sm">
        <SelectItem value="ALL">Toutes les priorités</SelectItem>
        <SelectItem value="LOW">Basse</SelectItem>
        <SelectItem value="MEDIUM">Moyenne</SelectItem>
        <SelectItem value="HIGH">Haute</SelectItem>
        <SelectItem value="URGENT">Urgente</SelectItem>
      </SelectContent>
    </Select>
  )
}
