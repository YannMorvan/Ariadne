import type {
  ActivityDataPoint,
  ActivityItem,
  PriorityTask,
  Project,
  StatMetric,
} from "@/types/dashboard"

export const DASHBOARD_USERNAME = "Yann"

export const statMetrics: StatMetric[] = [
  {
    id: "streak",
    label: "Série en cours",
    value: "12 Jours",
    trend: { value: "+2 cette semaine", direction: "up" },
    iconName: "flame",
    iconClassName: "text-orange-500 bg-orange-500/10",
  },
  {
    id: "projects",
    label: "Projets actifs",
    value: "4 Projets",
    subValue: "1 en attente",
    iconName: "folder-kanban",
    iconClassName: "text-blue-500 bg-blue-500/10",
  },
  {
    id: "tasks",
    label: "Tâches complétées",
    value: "84%",
    trend: { value: "+12% vs semaine passée", direction: "up" },
    iconName: "check-circle",
    iconClassName: "text-emerald-500 bg-emerald-500/10",
  },
  {
    id: "level",
    label: "Niveau & XP",
    value: "Niveau 8",
    subValue: "2,450 / 3,000 XP",
    iconName: "trophy",
    iconClassName: "text-violet-500 bg-violet-500/10",
    progress: { current: 2450, max: 3000 },
  },
]

export const weeklyActivity: ActivityDataPoint[] = [
  { day: "Lun", hours: 4.2, tasks: 6 },
  { day: "Mar", hours: 5.8, tasks: 9 },
  { day: "Mer", hours: 3.5, tasks: 5 },
  { day: "Jeu", hours: 6.1, tasks: 11 },
  { day: "Ven", hours: 4.9, tasks: 7 },
  { day: "Sam", hours: 2.3, tasks: 3 },
  { day: "Dim", hours: 1.8, tasks: 2 },
]

export const recentProjects: Project[] = [
  {
    id: "1",
    name: "Ariadne MVP",
    priority: "Haute",
    progress: 72,
    members: [
      { id: "m1", name: "Yann", avatarUrl: undefined },
      { id: "m2", name: "Léa", avatarUrl: undefined },
      { id: "m3", name: "Tom", avatarUrl: undefined },
    ],
  },
  {
    id: "2",
    name: "API NestJS Auth",
    priority: "Haute",
    progress: 45,
    members: [
      { id: "m4", name: "Yann", avatarUrl: undefined },
      { id: "m5", name: "Sarah", avatarUrl: undefined },
    ],
  },
  {
    id: "3",
    name: "Design System",
    priority: "Moyenne",
    progress: 88,
    members: [
      { id: "m6", name: "Léa", avatarUrl: undefined },
      { id: "m7", name: "Marc", avatarUrl: undefined },
      { id: "m8", name: "Inès", avatarUrl: undefined },
      { id: "m9", name: "Paul", avatarUrl: undefined },
    ],
  },
]

export const recentActivities: ActivityItem[] = [
  {
    id: "a1",
    type: "task",
    message: "Tâche « Setup NestJS JWT » terminée",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "a2",
    type: "achievement",
    message: "Nouveau succès « Bug Hunter » débloqué",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "a3",
    type: "project",
    message: "Projet « Ariadne MVP » mis à jour — 72% complété",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
  {
    id: "a4",
    type: "comment",
    message: "Commentaire ajouté sur « Dashboard Bento Grid »",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "a5",
    type: "task",
    message: "Tâche « Intégration Recharts » terminée",
    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
  },
]

export const priorityTasks: PriorityTask[] = [
  {
    id: "t1",
    title: "Finaliser le middleware d'authentification",
    project: "API NestJS Auth",
    dueTime: "Aujourd'hui, 18h",
  },
  {
    id: "t2",
    title: "Revue du composant ActivityChart",
    project: "Ariadne MVP",
    dueTime: "Aujourd'hui, 20h",
  },
  {
    id: "t3",
    title: "Documenter les tokens du design system",
    project: "Design System",
    dueTime: "Demain, 10h",
  },
  {
    id: "t4",
    title: "Préparer la démo investisseurs",
    project: "Ariadne MVP",
    dueTime: "Demain, 14h",
  },
]
