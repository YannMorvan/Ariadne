import { describe, it, expect } from "vitest"
import { createTaskSchema, updateTaskSchema } from "./task"

const VALID_UUID = "123e4567-e89b-12d3-a456-426614174000"
const ANOTHER_VALID_UUID = "987fcdeb-51a2-43d7-9012-345678901234"

describe("createTaskSchema", () => {
  it("validates a correct task payload", () => {
    const validData = {
      title: "Fix Authentication Bug",
      projectId: VALID_UUID,
      status: "TODO",
      priority: "HIGH",
    }

    const result = createTaskSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it("applies default values for status and priority when omitted", () => {
    const minData = {
      title: "Minimal Task Title",
      projectId: VALID_UUID,
    }

    const result = createTaskSchema.safeParse(minData)
    expect(result.success).toBe(true)

    if (result.success) {
      expect(result.data.status).toBe("TODO")
      expect(result.data.priority).toBe("MEDIUM")
    }
  })

  it("fails when projectId is not a valid UUID", () => {
    const invalidData = {
      title: "Task with bad project ID",
      projectId: "invalid-id",
    }

    const result = createTaskSchema.safeParse(invalidData)
    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "The project ID must be a valid UUID"
      )
    }
  })

  it("fails when title is too short", () => {
    const invalidData = {
      title: "A",
      projectId: VALID_UUID,
    }

    const result = createTaskSchema.safeParse(invalidData)
    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "The title must contain at least 2 characters"
      )
    }
  })

  it("handles estimatedHours preprocessing correctly", () => {
    const validWithHours = {
      title: "Task with estimated hours",
      projectId: VALID_UUID,
      estimatedHours: "4",
    }

    const result = createTaskSchema.safeParse(validWithHours)
    expect(result.success).toBe(true)

    if (result.success) {
      expect(result.data.estimatedHours).toBe(4)
    }
  })

  describe("assigneeId validation", () => {
    it("accepts a valid UUID for assigneeId", () => {
      const validData = {
        title: "Assigned Task",
        projectId: VALID_UUID,
        assigneeId: ANOTHER_VALID_UUID,
      }

      const result = createTaskSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.assigneeId).toBe(ANOTHER_VALID_UUID)
      }
    })

    it("accepts an empty string for assigneeId (unassigning)", () => {
      const validData = {
        title: "Unassigned Task",
        projectId: VALID_UUID,
        assigneeId: "",
      }

      const result = createTaskSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("fails when assigneeId is not a valid UUID", () => {
      const invalidData = {
        title: "Task with bad assignee ID",
        projectId: VALID_UUID,
        assigneeId: "not-a-uuid",
      }

      const result = createTaskSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe("estimatedHours preprocessing edge cases", () => {
    it("converts empty string, null and NaN to undefined", () => {
      const resEmpty = createTaskSchema.safeParse({
        title: "Task",
        projectId: VALID_UUID,
        estimatedHours: "",
      })
      expect(resEmpty.success).toBe(true)
      if (resEmpty.success) expect(resEmpty.data.estimatedHours).toBeUndefined()

      const resNull = createTaskSchema.safeParse({
        title: "Task",
        projectId: VALID_UUID,
        estimatedHours: null,
      })
      expect(resNull.success).toBe(true)
      if (resNull.success) expect(resNull.data.estimatedHours).toBeUndefined()

      const resNaN = createTaskSchema.safeParse({
        title: "Task",
        projectId: VALID_UUID,
        estimatedHours: Number.NaN,
      })
      expect(resNaN.success).toBe(true)
      if (resNaN.success) expect(resNaN.data.estimatedHours).toBeUndefined()
    })

    it("fails when estimatedHours is negative", () => {
      const result = createTaskSchema.safeParse({
        title: "Task",
        projectId: VALID_UUID,
        estimatedHours: -5,
      })
      expect(result.success).toBe(false)
    })
  })
})

describe("updateTaskSchema", () => {
  it("validates a partial update payload without ID", () => {
    const validUpdate = {
      title: "Updated Title",
      status: "IN_PROGRESS",
      priority: "URGENT",
    }

    const result = updateTaskSchema.safeParse(validUpdate)
    expect(result.success).toBe(true)
  })

  it("validates updating only the status", () => {
    const statusUpdate = {
      status: "DONE",
    }

    const result = updateTaskSchema.safeParse(statusUpdate)
    expect(result.success).toBe(true)
  })

  it("validates updating only the assignee", () => {
    const assigneeUpdate = {
      assigneeId: ANOTHER_VALID_UUID,
    }

    const result = updateTaskSchema.safeParse(assigneeUpdate)
    expect(result.success).toBe(true)
  })

  it("validates unassigning a user with empty string", () => {
    const unassignUpdate = {
      assigneeId: "",
    }

    const result = updateTaskSchema.safeParse(unassignUpdate)
    expect(result.success).toBe(true)
  })

  it("fails when an invalid field value is passed in update", () => {
    const invalidUpdate = {
      status: "INVALID_STATUS",
    }

    const result = updateTaskSchema.safeParse(invalidUpdate)
    expect(result.success).toBe(false)
  })
})
