import type {
  ActivityDataPoint,
  ActivityItem,
  StatMetric,
} from "@/types/dashboard"
import type { Project } from "@/types/project"
import type { Task } from "@/types/task"

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
    priority: "HIGH",
    progress: 72,
    members: [
      { id: "m1", username: "Yann", avatarUrl: undefined },
      { id: "m2", username: "Léa", avatarUrl: undefined },
      { id: "m3", username: "Tom", avatarUrl: undefined },
    ],
  },
  {
    id: "2",
    name: "API NestJS Auth",
    priority: "HIGH",
    progress: 45,
    members: [
      { id: "m4", username: "Yann", avatarUrl: undefined },
      { id: "m5", username: "Sarah", avatarUrl: undefined },
    ],
  },
  {
    id: "3",
    name: "Design System",
    priority: "MEDIUM",
    progress: 88,
    members: [
      { id: "m6", username: "Léa", avatarUrl: undefined },
      { id: "m7", username: "Marc", avatarUrl: undefined },
      { id: "m8", username: "Inès", avatarUrl: undefined },
      { id: "m9", username: "Paul", avatarUrl: undefined },
    ],
  },
]

export const recentActivities: ActivityItem[] = [
  {
    id: "a1",
    type: "task",
    message: "Task « Setup NestJS JWT » completed",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "a2",
    type: "achievement",
    message: "New achievement « Bug Hunter » unlocked",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "a3",
    type: "project",
    message: "Project « Ariadne MVP » updated — 72% completed",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
  {
    id: "a4",
    type: "comment",
    message: "Comment added to « Dashboard Bento Grid »",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "a5",
    type: "task",
    message: "Task « Integration Recharts » completed",
    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
  },
]

export const priorityTasks: Task[] = [
  {
    id: "t1",
    title: "Finish the authentication middleware",
    project: "API NestJS Auth",
    dueTime: "Today, 6pm",
  },
  {
    id: "t2",
    title: "Review the ActivityChart component",
    project: "Ariadne MVP",
    dueTime: "Today, 8pm",
  },
  {
    id: "t3",
    title: "Document the design system tokens",
    project: "Design System",
    dueTime: "Tomorrow, 10am",
  },
  {
    id: "t4",
    title: "Prepare the investor presentation",
    project: "Ariadne MVP",
    dueTime: "Tomorrow, 2pm",
  },
]
