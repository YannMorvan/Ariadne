import { describe, it, expect } from "vitest"
import { filterAndSortTasks } from "./task-utils"
import type { Task } from "@/types/task"

const createMockTask = (overrides: Partial<Task>): Task =>
  ({
    id: "task-id",
    title: "Test Task",
    description: "Description",
    status: "TODO",
    priority: "MEDIUM",
    projectId: "proj-1",
    createdAt: "2026-08-01T10:00:00Z",
    updatedAt: "2026-08-01T10:00:00Z",
    ...overrides,
  }) as Task

describe("filterAndSortTasks", () => {
  describe("Sort logic (Tri)", () => {
    it("should sort primarily by status (IN_PROGRESS -> TODO -> DONE)", () => {
      const tasks = [
        createMockTask({ id: "1", status: "DONE" }),
        createMockTask({ id: "2", status: "IN_PROGRESS" }),
        createMockTask({ id: "3", status: "TODO" }),
      ]

      const result = filterAndSortTasks(tasks, {
        searchQuery: "",
        statusFilter: "ALL",
        priorityFilter: "ALL",
      })

      expect(result.map((t) => t.id)).toEqual(["2", "3", "1"])
    })

    it("should sort secondarily by priority when statuses are identical (URGENT -> HIGH -> MEDIUM -> LOW)", () => {
      const tasks = [
        createMockTask({ id: "low-todo", status: "TODO", priority: "LOW" }),
        createMockTask({
          id: "urgent-todo",
          status: "TODO",
          priority: "URGENT",
        }),
        createMockTask({ id: "high-todo", status: "TODO", priority: "HIGH" }),
        createMockTask({
          id: "medium-todo",
          status: "TODO",
          priority: "MEDIUM",
        }),
      ]

      const result = filterAndSortTasks(tasks, {
        searchQuery: "",
        statusFilter: "ALL",
        priorityFilter: "ALL",
      })

      expect(result.map((t) => t.id)).toEqual([
        "urgent-todo",
        "high-todo",
        "medium-todo",
        "low-todo",
      ])
    })

    it("should sort tertiarily by createdAt date (newest first) when status and priority match", () => {
      const tasks = [
        createMockTask({
          id: "old",
          status: "TODO",
          priority: "HIGH",
          createdAt: "2026-01-01",
        }),
        createMockTask({
          id: "newest",
          status: "TODO",
          priority: "HIGH",
          createdAt: "2026-08-10",
        }),
        createMockTask({
          id: "medium-date",
          status: "TODO",
          priority: "HIGH",
          createdAt: "2026-05-01",
        }),
      ]

      const result = filterAndSortTasks(tasks, {
        searchQuery: "",
        statusFilter: "ALL",
        priorityFilter: "ALL",
      })

      expect(result.map((t) => t.id)).toEqual(["newest", "medium-date", "old"])
    })

    it("should apply complex multi-level sorting correctly", () => {
      const tasks = [
        createMockTask({ id: "1", status: "DONE", priority: "URGENT" }),
        createMockTask({ id: "2", status: "IN_PROGRESS", priority: "LOW" }),
        createMockTask({ id: "3", status: "IN_PROGRESS", priority: "HIGH" }),
        createMockTask({ id: "4", status: "TODO", priority: "HIGH" }),
      ]

      const result = filterAndSortTasks(tasks, {
        searchQuery: "",
        statusFilter: "ALL",
        priorityFilter: "ALL",
      })

      // Expected: IN_PROGRESS (HIGH -> LOW), puis TODO (HIGH), puis DONE (URGENT)
      expect(result.map((t) => t.id)).toEqual(["3", "2", "4", "1"])
    })
  })

  describe("Filter logic (Filtrage)", () => {
    const sampleTasks = [
      createMockTask({
        id: "1",
        title: "Fix Auth Bug",
        status: "TODO",
        priority: "HIGH",
      }),
      createMockTask({
        id: "2",
        title: "Add Tests",
        description: "Use Vitest runner",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
      }),
      createMockTask({
        id: "3",
        title: "Design Landing Page",
        status: "DONE",
        priority: "LOW",
      }),
    ]

    it("should filter tasks by search query matching title or description", () => {
      const resultByTitle = filterAndSortTasks(sampleTasks, {
        searchQuery: "Auth",
        statusFilter: "ALL",
        priorityFilter: "ALL",
      })
      expect(resultByTitle.map((t) => t.id)).toEqual(["1"])

      const resultByDesc = filterAndSortTasks(sampleTasks, {
        searchQuery: "Vitest",
        statusFilter: "ALL",
        priorityFilter: "ALL",
      })
      expect(resultByDesc.map((t) => t.id)).toEqual(["2"])
    })

    it("should filter tasks by status", () => {
      const result = filterAndSortTasks(sampleTasks, {
        searchQuery: "",
        statusFilter: "IN_PROGRESS",
        priorityFilter: "ALL",
      })

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe("2")
    })

    it("should filter tasks by priority", () => {
      const result = filterAndSortTasks(sampleTasks, {
        searchQuery: "",
        statusFilter: "ALL",
        priorityFilter: "HIGH",
      })

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe("1")
    })

    it("should combine search, status and priority filters simultaneously", () => {
      const result = filterAndSortTasks(sampleTasks, {
        searchQuery: "Fix",
        statusFilter: "TODO",
        priorityFilter: "HIGH",
      })

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe("1")
    })

    it("should return empty array if no tasks match filters", () => {
      const result = filterAndSortTasks(sampleTasks, {
        searchQuery: "non-existing-query",
        statusFilter: "ALL",
        priorityFilter: "ALL",
      })

      expect(result).toHaveLength(0)
    })
  })
})
