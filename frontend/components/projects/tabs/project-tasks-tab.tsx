"use client"

import { useState, useMemo } from "react"
import { Circle, Search, RotateCcw } from "lucide-react"

import { CreateTaskDialog } from "../../tasks/create-task-dialog"
import { EditTaskDialog } from "../../tasks/edit-task-dialog"
import { taskApi } from "@/api/task"
import { TaskItem } from "../../tasks/task-item"
import type { Task, TaskStatus } from "@/types/task"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DataPagination } from "@/components/ui/data-pagination"
import { Field, FieldLabel } from "@/components/ui/field"
import { filterAndSortTasks } from "@/lib/utils/task-utils"

interface ProjectTasksTabProps {
  projectName?: string
  projectId: string
  tasks?: Task[]
  onTasksUpdated?: () => void
}

export function ProjectTasksTab({
  projectId,
  tasks = [],
  onTasksUpdated,
}: ProjectTasksTabProps) {
  const tTasks = useTranslations("tasks")
  const tEnums = useTranslations("enums")
  const tCommon = useTranslations("common")

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null)
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(5)

  const currentPriorityLabel = tEnums(`priority.${priorityFilter || "ALL"}`)
  const currentStatusLabel = tEnums(`status.${statusFilter || "ALL"}`)

  const getNextStatus = (current: TaskStatus): TaskStatus => {
    switch (current) {
      case "TODO":
        return "IN_PROGRESS"
      case "IN_PROGRESS":
        return "DONE"
      case "DONE":
        return "TODO"
      default:
        return "TODO"
    }
  }

  const STATUS_ORDER: Record<TaskStatus, number> = {
    IN_PROGRESS: 1,
    TODO: 2,
    DONE: 3,
  }

  const filteredTasks = useMemo(() => {
    return filterAndSortTasks(tasks, {
      searchQuery,
      statusFilter,
      priorityFilter,
    })
  }, [tasks, searchQuery, statusFilter, priorityFilter])

  const totalPages = Math.ceil(filteredTasks.length / pageSize)

  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredTasks.slice(startIndex, startIndex + pageSize)
  }, [filteredTasks, currentPage, pageSize])

  const isFiltered =
    searchQuery !== "" || statusFilter !== "ALL" || priorityFilter !== "ALL"

  const handleResetFilters = () => {
    setSearchQuery("")
    setStatusFilter("ALL")
    setPriorityFilter("ALL")
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleStatusChange = (value: string | null) => {
    setStatusFilter(value ?? "ALL")
    setCurrentPage(1)
  }

  const handlePriorityChange = (value: string | null) => {
    setPriorityFilter(value ?? "ALL")
    setCurrentPage(1)
  }

  const handleToggleStatus = async (task: Task) => {
    try {
      setUpdatingStatusId(task.id)
      const nextStatus = getNextStatus(task.status)
      await taskApi.updateTask({ id: task.id, status: nextStatus })
      onTasksUpdated?.()
    } catch (error) {
      console.error("Error updating status :", error)
    } finally {
      setUpdatingStatusId(null)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      setDeletingId(taskId)
      await taskApi.deleteTask(taskId)
      onTasksUpdated?.()
    } catch (error) {
      console.error("Error deleting task :", error)
    } finally {
      setDeletingId(null)
    }
  }

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task)
  }

  const hasTasks = tasks && tasks.length > 0

  return (
    <div className="space-y-6 rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-base font-semibold tracking-tight">
            {tTasks("titleProjectsTasks")}
          </h3>
          <p className="truncate text-xs text-muted-foreground">
            {hasTasks
              ? ` ${tTasks("tasksCount", { count: tasks.length })}`
              : tTasks("noTasksDescription")}
          </p>
        </div>
        <CreateTaskDialog projectId={projectId} onSuccess={onTasksUpdated} />
      </div>

      {!hasTasks ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 bg-card/20 p-8 text-center">
          <Circle className="mb-2 size-8 text-muted-foreground/50" />
          <p className="text-sm font-medium">{tTasks("noTasks")}</p>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            {tTasks("noTasksDescription")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <Field className="w-full gap-1 lg:max-w-md">
              <FieldLabel className="text-[11px] font-medium text-muted-foreground">
                {tCommon("search")}
              </FieldLabel>
              <div className="relative">
                <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
                <Input
                  placeholder={tCommon("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="h-9 rounded-xl border-border/50 bg-card/40 pl-9 text-xs focus:bg-card/80"
                />
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:flex lg:items-end">
              <Field className="gap-1">
                <FieldLabel className="text-[11px] font-medium text-muted-foreground">
                  {tCommon("status")}
                </FieldLabel>
                <Select value={statusFilter} onValueChange={handleStatusChange}>
                  <SelectTrigger className="h-9 w-full rounded-xl border-border/50 bg-card/40 text-xs lg:w-[120px]">
                    <SelectValue>{currentStatusLabel}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">{tEnums("status.ALL")}</SelectItem>
                    <SelectItem value="TODO">
                      {tEnums("status.TODO")}
                    </SelectItem>
                    <SelectItem value="IN_PROGRESS">
                      {tEnums("status.IN_PROGRESS")}
                    </SelectItem>
                    <SelectItem value="DONE">
                      {tEnums("status.DONE")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field className="gap-1">
                <FieldLabel className="text-[11px] font-medium text-muted-foreground">
                  {tCommon("priority")}
                </FieldLabel>
                <Select
                  value={priorityFilter}
                  onValueChange={handlePriorityChange}
                >
                  <SelectTrigger className="h-9 w-full rounded-xl border-border/50 bg-card/40 text-xs lg:w-[120px]">
                    <SelectValue>{currentPriorityLabel}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">
                      {tEnums("priority.ALL")}
                    </SelectItem>
                    <SelectItem value="LOW">
                      {tEnums("priority.LOW")}
                    </SelectItem>
                    <SelectItem value="MEDIUM">
                      {tEnums("priority.MEDIUM")}
                    </SelectItem>
                    <SelectItem value="HIGH">
                      {tEnums("priority.HIGH")}
                    </SelectItem>
                    <SelectItem value="URGENT">
                      {tEnums("priority.URGENT")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <div className="lg:col-span-auto col-span-2 flex items-end gap-2 sm:col-span-1">
                <Field className="flex-1 gap-1">
                  <FieldLabel className="text-[11px] font-medium text-muted-foreground">
                    {tCommon("display")}
                  </FieldLabel>
                  <Select
                    value={String(pageSize)}
                    onValueChange={(val) => {
                      if (val) {
                        setPageSize(Number(val))
                        setCurrentPage(1)
                      }
                    }}
                  >
                    <SelectTrigger className="h-9 w-full rounded-xl border-border/50 bg-card/40 text-xs lg:w-[90px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  disabled={!isFiltered}
                  className="h-9 shrink-0 gap-1.5 rounded-xl px-2.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <RotateCcw className="size-3.5" />
                  <span>{tCommon("reset")}</span>
                </Button>
              </div>
            </div>
          </div>

          {paginatedTasks.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              {tTasks("noResults")}
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              {paginatedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isUpdating={updatingStatusId === task.id}
                  isDeleting={deletingId === task.id}
                  onToggleStatus={() => handleToggleStatus(task)}
                  onDeleteTask={(id) => handleDeleteTask(id)}
                  onEditTask={handleEditTask}
                />
              ))}
            </div>
          )}

          <DataPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <EditTaskDialog
        task={taskToEdit}
        open={!!taskToEdit}
        onOpenChange={(open) => {
          if (!open) setTaskToEdit(null)
        }}
        onSuccess={() => {
          setTaskToEdit(null)
          onTasksUpdated?.()
        }}
      />
    </div>
  )
}
