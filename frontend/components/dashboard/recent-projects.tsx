import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { Project, ProjectPriority } from "@/types"
import { useTranslations } from "next-intl"

interface RecentProjectsProps {
  projects: Project[]
}

const priorityStyles: Record<ProjectPriority, string> = {
  HIGH: "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
  MEDIUM:
    "border-yellow-500/20 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  LOW: "border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400",
  URGENT:
    "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
}

function getInitials(name?: string): string {
  if (!name || typeof name !== "string") return "?"

  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  const tDashboard = useTranslations("dashboard")

  function getProgressColorClass(percentage: number): string {
    if (percentage >= 80)
      return "[&_[data-slot=progress-indicator]]:bg-emerald-500"
    if (percentage >= 50)
      return "[&_[data-slot=progress-indicator]]:bg-amber-500"
    return "[&_[data-slot=progress-indicator]]:bg-red-500"
  }

  return (
    <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm transition-colors hover:bg-card/80">
      <CardHeader>
        <CardTitle>{tDashboard("recentProjects")}</CardTitle>
        <CardDescription>{tDashboard("lastActiveProjects")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group rounded-xl border border-border/40 bg-background/40 p-4 transition-colors hover:border-border/70 hover:bg-background/60"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium">{project.name}</p>
                <Badge
                  variant="outline"
                  className={cn("mt-1.5", priorityStyles[project.priority])}
                >
                  {project.priority}
                </Badge>
              </div>
              <span className="shrink-0 text-sm font-medium text-muted-foreground tabular-nums">
                {project.completedTasksCount && project.tasksCount
                  ? Math.round(
                      (project.completedTasksCount / project.tasksCount) * 100
                    )
                  : 0}
                %
              </span>
            </div>
            <Progress
              value={
                project.completedTasksCount && project.tasksCount
                  ? Math.round(
                      (project.completedTasksCount / project.tasksCount) * 100
                    )
                  : 0
              }
              className={cn(
                "mt-3 h-2 gap-0 [&_[data-slot=progress-track]]:h-1.5",
                getProgressColorClass(
                  project.completedTasksCount && project.tasksCount
                    ? Math.round(
                        (project.completedTasksCount / project.tasksCount) * 100
                      )
                    : 0
                )
              )}
            />
            {/* <AvatarGroup className="mt-3">
              {project.members.slice(0, 3).map((member) => (
                <Avatar key={member.id} size="sm">
                  {member.avatarUrl && (
                    <AvatarImage src={member.avatarUrl} alt={member.username} />
                  )}
                  <AvatarFallback>
                    {getInitials(member.username)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {project.members.length > 3 && (
                <AvatarGroupCount>
                  +{project.members.length - 3}
                </AvatarGroupCount>
              )}
            </AvatarGroup> */}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
