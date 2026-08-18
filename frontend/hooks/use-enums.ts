import { useTranslations } from "next-intl"
import type { Priority, TaskStatus } from "@/types/task"
import { PRIORITY_CONFIG } from "@/constants/style"
import { ProjectRole } from "@/types/project"

export function useEnumOptions() {
  const tPriority = useTranslations("enums.priority")
  const tStatus = useTranslations("enums.status")
  const tRoles = useTranslations("enums.roles")

  const priorities: Priority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"]
  const statuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"]
  const roles: ProjectRole[] = ["OWNER", "ADMIN", "MEMBER", "VIEWER"]

  const priorityItems = priorities.map((value) => ({
    value,
    label: tPriority(value),
    className: PRIORITY_CONFIG[value]?.badgeClass,
  }))

  const statusItems = statuses.map((value) => ({
    value,
    label: tStatus(value),
  }))

  const roleItems = roles.map((value) => ({
    value,
    label: tRoles(value),
  }))

  const getPriorityInfo = (key: string, type: "task" | "project" = "task") => {
    const config =
      PRIORITY_CONFIG[key as keyof typeof PRIORITY_CONFIG] ||
      PRIORITY_CONFIG.MEDIUM

    return {
      label: tPriority.has(key) ? tPriority(key) : key,
      className: type === "project" ? config.projectClass : config.badgeClass,
    }
  }

  const getStatusLabel = (key: string) =>
    tStatus.has(key) ? tStatus(key) : key

  const getRoleLabel = (key: string) => (tStatus.has(key) ? tRoles(key) : key)

  return {
    priorityItems,
    statusItems,
    roleItems,
    getPriorityInfo,
    getStatusLabel,
    getRoleLabel,
  }
}
