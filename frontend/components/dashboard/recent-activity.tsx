import {
  CheckCircle2,
  FolderKanban,
  MessageSquare,
  Trophy,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatRelativeTime } from "@/lib/format-relative-time"
import { cn } from "@/lib/utils"
import type { ActivityItem, ActivityType } from "@/types/dashboard"

interface RecentActivityProps {
  activities: ActivityItem[]
}

const activityConfig: Record<
  ActivityType,
  { icon: typeof CheckCircle2; className: string }
> = {
  task: { icon: CheckCircle2, className: "text-emerald-500 bg-emerald-500/10" },
  achievement: { icon: Trophy, className: "text-violet-500 bg-violet-500/10" },
  project: { icon: FolderKanban, className: "text-blue-500 bg-blue-500/10" },
  comment: { icon: MessageSquare, className: "text-amber-500 bg-amber-500/10" },
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm transition-colors hover:bg-card/80">
      <CardHeader>
        <CardTitle>Fil d&apos;activité</CardTitle>
        <CardDescription>Tes dernières actions et succès</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          {activities.map((activity, index) => {
            const config = activityConfig[activity.type]
            const Icon = config.icon

            return (
              <li key={activity.id}>
                <div
                  className={cn(
                    "flex gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-muted/40",
                    index !== activities.length - 1 && "border-b border-border/30"
                  )}
                >
                  <div
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-lg",
                      config.className
                    )}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug">{activity.message}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatRelativeTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
