"use client"

import {
  CheckCircle2,
  Flame,
  FolderKanban,
  TrendingDown,
  TrendingUp,
  Trophy,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { StatIconName, StatMetric } from "@/types/dashboard"

interface StatCardsProps {
  metrics: StatMetric[]
}

const iconMap: Record<StatIconName, LucideIcon> = {
  flame: Flame,
  "folder-kanban": FolderKanban,
  "check-circle": CheckCircle2,
  trophy: Trophy,
}

function TrendBadge({ trend }: { trend: NonNullable<StatMetric["trend"]> }) {
  const isPositive = trend.direction === "up"
  const isNegative = trend.direction === "down"

  return (
    <Badge
      variant="outline"
      className={cn(
        "mt-2 font-normal",
        isPositive && "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        isNegative && "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
        !isPositive && !isNegative && "text-muted-foreground"
      )}
    >
      {isPositive && <TrendingUp data-icon="inline-start" />}
      {isNegative && <TrendingDown data-icon="inline-start" />}
      {trend.value}
    </Badge>
  )
}

export function StatCards({ metrics }: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = iconMap[metric.iconName]
        const progressPercent = metric.progress
          ? Math.round((metric.progress.current / metric.progress.max) * 100)
          : null

        return (
          <div
            key={metric.id}
            className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm transition-colors hover:border-border hover:bg-card/80"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">
                  {metric.value}
                </p>
                {metric.subValue && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {metric.subValue}
                  </p>
                )}
                {metric.trend && <TrendBadge trend={metric.trend} />}
              </div>
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl",
                  metric.iconClassName
                )}
              >
                <Icon className="size-5" />
              </div>
            </div>

            {metric.progress && progressPercent !== null && (
              <Progress
                value={progressPercent}
                className="mt-4 gap-0 [&_[data-slot=progress-indicator]]:bg-violet-500 [&_[data-slot=progress-track]]:h-1.5"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
