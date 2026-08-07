"use client"

import { motion } from "framer-motion"

import { ActivityChart } from "@/components/dashboard/activity-chart"
import { PriorityTasks } from "@/components/dashboard/priority-tasks"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { RecentProjects } from "@/components/dashboard/recent-projects"
import { StatCards } from "@/components/dashboard/stat-cards"
import type {
  ActivityDataPoint,
  ActivityItem,
  Task,
  Project,
  StatMetric,
} from "@/types"

interface DashboardGridProps {
  metrics: StatMetric[]
  weeklyActivity: ActivityDataPoint[]
  projects: Project[]
  activities: ActivityItem[]
  tasks: Task[]
  onTasksUpdated?: () => void
}

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 + i * 0.1,
      duration: 0.45,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
}

export function DashboardGrid({
  metrics,
  weeklyActivity,
  projects,
  activities,
  tasks,
  onTasksUpdated,
}: DashboardGridProps) {
  return (
    <div className="space-y-6">
      <motion.div
        custom={0}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <StatCards metrics={metrics} />
      </motion.div>

      <motion.div
        custom={1}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        <div className="lg:col-span-2">
          <ActivityChart data={weeklyActivity} />
        </div>
        <RecentProjects projects={projects} />
      </motion.div>

      <motion.div
        custom={2}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        <RecentActivity activities={activities} />
        <PriorityTasks tasks={tasks} onTasksUpdated={onTasksUpdated} />
      </motion.div>
    </div>
  )
}
