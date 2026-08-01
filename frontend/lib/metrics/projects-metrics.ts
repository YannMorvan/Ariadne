import { useTranslations } from "next-intl"
import type { ProjectStatsDto, StatMetric } from "@/types/stats"

export function useProjectsMetrics(stats?: ProjectStatsDto): StatMetric[] {
  const t = useTranslations("projects.metrics")

  if (!stats) return []

  return [
    {
      id: "total-projects",
      label: t("totalProjects.label"),
      value: t("totalProjects.value", { count: stats.totalProjects }),
      subValue: t("totalProjects.subValue", {
        active: stats.activeProjects,
        archived: stats.archivedProjects,
      }),
      iconName: "folder-kanban",
      iconClassName: "text-blue-500 bg-blue-500/10",
    },
    {
      id: "urgent-issues",
      label: t("urgentIssues.label"),
      value: t("urgentIssues.value", { count: stats.urgentTasks }),
      subValue: t("urgentIssues.subValue"),
      iconName: "flame",
      iconClassName: "text-red-500 bg-red-500/10",
    },
    {
      id: "completion-rate",
      label: t("completionRate.label"),
      value: `${stats.completionRate}%`,
      subValue: t("completionRate.subValue"),
      iconName: "check-circle",
      iconClassName: "text-emerald-500 bg-emerald-500/10",
    },
    {
      id: "global-progress",
      label: t("globalProgress.label"),
      value: "Q3 Roadmap",
      subValue: t("globalProgress.subValue", {
        current: stats.roadmapProgress.current,
        max: stats.roadmapProgress.max,
      }),
      iconName: "trophy",
      iconClassName: "text-violet-500 bg-violet-500/10",
      progress: {
        current: stats.roadmapProgress.current,
        max: stats.roadmapProgress.max,
      },
    },
  ]
}
