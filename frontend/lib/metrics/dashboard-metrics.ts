import { useTranslations } from "next-intl"
import type { DashboardStatsDto, StatMetric } from "@/types"

export function useDashboardMetrics(stats?: DashboardStatsDto): StatMetric[] {
  const t = useTranslations("dashboard.metrics")

  if (!stats) return []

  return [
    {
      id: "streak",
      label: t("streak.label"),
      value: t("streak.value", { days: stats.streak }),
      iconName: "flame",
      iconClassName: "text-orange-500 bg-orange-500/10",
    },
    {
      id: "projects",
      label: t("projects.label"),
      value: t("projects.value", { count: stats.activeProjects }),
      subValue: t("projects.subValue", { count: stats.pendingProjects }),
      iconName: "folder-kanban",
      iconClassName: "text-blue-500 bg-blue-500/10",
    },
    {
      id: "tasks",
      label: t("tasks.label"),
      value: `${stats.completedTasksPercentage}%`,
      iconName: "check-circle",
      iconClassName: "text-emerald-500 bg-emerald-500/10",
    },
    {
      id: "level",
      label: t("level.label"),
      value: t("level.value", { level: stats.level }),
      subValue: t("level.subValue", {
        current: stats.currentXp.toLocaleString(),
        max: stats.nextLevelXp.toLocaleString(),
      }),
      iconName: "trophy",
      iconClassName: "text-violet-500 bg-violet-500/10",
      progress: {
        current: stats.currentXp,
        max: stats.nextLevelXp,
      },
    },
  ]
}
