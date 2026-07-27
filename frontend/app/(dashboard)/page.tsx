import { DashboardGrid } from "@/components/dashboard/dashboard-grid"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import {
  DASHBOARD_USERNAME,
  priorityTasks,
  recentActivities,
  recentProjects,
  statMetrics,
  weeklyActivity,
} from "@/lib/mock/dashboard-data"

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8 lg:py-10">
      <div className="space-y-8">
        <DashboardHeader username={DASHBOARD_USERNAME} />
        <DashboardGrid
          metrics={statMetrics}
          weeklyActivity={weeklyActivity}
          projects={recentProjects}
          activities={recentActivities}
          tasks={priorityTasks}
        />
      </div>
    </div>
  )
}
