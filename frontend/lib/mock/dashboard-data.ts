import type { ActivityItem } from "@/types"

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
