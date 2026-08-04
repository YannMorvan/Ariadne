import type { ActivityDataPoint, ActivityItem, StatMetric } from "@/types"
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
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    members: [
      {
        id: "m1",
        username: "Yann",
        avatarUrl: undefined,
        email: "yann@example.com",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "m2",
        username: "Léa",
        avatarUrl: undefined,
        email: "lea@example.com",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "m3",
        username: "Tom",
        avatarUrl: undefined,
        email: "tom@example.com",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
    ],
  },
  {
    id: "2",
    name: "API NestJS Auth",
    priority: "HIGH",
    progress: 45,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    members: [
      {
        id: "m4",
        username: "Yann",
        avatarUrl: undefined,
        email: "yann@example.com",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "m5",
        username: "Sarah",
        avatarUrl: undefined,
        email: "sarah@example.com",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
    ],
  },
  {
    id: "3",
    name: "Design System",
    priority: "MEDIUM",
    progress: 88,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    members: [
      {
        id: "m6",
        username: "Léa",
        avatarUrl: undefined,
        email: "lea@example.com",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "m7",
        username: "Marc",
        avatarUrl: undefined,
        email: "marc@example.com",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "m8",
        username: "Inès",
        avatarUrl: undefined,
        email: "ines@example.com",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T₀₀:₀₀:₀₀Z",
      },
      {
        id: "m9",
        username: "Paul",
        avatarUrl: undefined,
        email: "paul@example.com",
        createdAt: "2024-₀₁-₀₁T₀₀:₀₀:₀₀Z",
        updatedAt: "2０２４-０１-０１T００:００:００Z",
      },
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
    projectId: "API NestJS Auth",
    dueDate: "Today, 6pm",
    status: "TODO",
    priority: "URGENT",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "t2",
    title: "Review the ActivityChart component",
    projectId: "Ariadne MVP",
    dueDate: "Today, 8pm",
    status: "IN_PROGRESS",
    priority: "HIGH",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "t3",
    title: "Document the design system tokens",
    projectId: "Design System",
    dueDate: "Tomorrow, 10am",
    status: "TODO",
    priority: "MEDIUM",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "t4",
    title: "Prepare the investor presentation",
    projectId: "Ariadne MVP",
    dueDate: "Tomorrow, 2pm",
    status: "TODO",
    priority: "HIGH",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]
