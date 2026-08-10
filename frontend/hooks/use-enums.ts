import { useTranslations } from "next-intl"
import type { Priority, TaskStatus } from "@/types/task"
import { PRIORITY_CONFIG } from "@/constants/style"

export function useEnumOptions() {
  const tPriority = useTranslations("enums.priority")
  const tStatus = useTranslations("enums.status")

  const priorities: Priority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"]
  const statuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"]

  const priorityItems = priorities.map((value) => ({
    value,
    label: tPriority(value),
    className: PRIORITY_CONFIG[value]?.badgeClass,
  }))

  const statusItems = statuses.map((value) => ({
    value,
    label: tStatus(value),
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

  return {
    priorityItems,
    statusItems,
    getPriorityInfo,
    getStatusLabel,
  }
}
