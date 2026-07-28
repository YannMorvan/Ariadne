import type { StatMetric } from "@/types/dashboard"

export const projectStatMetrics: StatMetric[] = [
  {
    id: "total-projects",
    label: "Total Projets",
    value: "6 Projets",
    subValue: "4 actifs, 2 archivés",
    trend: { value: "+1 ce mois", direction: "up" },
    iconName: "folder-kanban",
    iconClassName: "text-blue-500 bg-blue-500/10",
  },
  {
    id: "urgent-issues",
    label: "Urgences & Bloqueurs",
    value: "2 Urgents",
    subValue: "À traiter en priorité",
    trend: { value: "-1 depuis hier", direction: "down" },
    iconName: "flame",
    iconClassName: "text-red-500 bg-red-500/10",
  },
  {
    id: "completion-rate",
    label: "Taux de complétion",
    value: "68%",
    subValue: "Moyenne des projets",
    trend: { value: "+5% cette semaine", direction: "up" },
    iconName: "check-circle",
    iconClassName: "text-emerald-500 bg-emerald-500/10",
  },
  {
    id: "global-progress",
    label: "Progression Globale",
    value: "Q3 Roadmap",
    subValue: "18 / 25 étapes validées",
    iconName: "trophy",
    iconClassName: "text-violet-500 bg-violet-500/10",
    progress: { current: 18, max: 25 },
  },
]
