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
import type { Project, ProjectPriority } from "@/types/dashboard"

interface RecentProjectsProps {
  projects: Project[]
}

const priorityStyles: Record<ProjectPriority, string> = {
  Haute: "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
  Moyenne: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Basse: "border-border bg-muted text-muted-foreground",
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  return (
    <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm transition-colors hover:bg-card/80">
      <CardHeader>
        <CardTitle>Projets récents</CardTitle>
        <CardDescription>Tes 3 derniers projets actifs</CardDescription>
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
              <span className="shrink-0 text-sm font-medium tabular-nums text-muted-foreground">
                {project.progress}%
              </span>
            </div>

            <Progress
              value={project.progress}
              className="mt-3 gap-0 [&_[data-slot=progress-track]]:h-1.5"
            />

            <AvatarGroup className="mt-3">
              {project.members.slice(0, 3).map((member) => (
                <Avatar key={member.id} size="sm">
                  {member.avatarUrl && (
                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                  )}
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
              ))}
              {project.members.length > 3 && (
                <AvatarGroupCount>+{project.members.length - 3}</AvatarGroupCount>
              )}
            </AvatarGroup>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
