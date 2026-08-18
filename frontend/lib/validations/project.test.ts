import { describe, it, expect } from "vitest"
import {
  createProjectSchema,
  updateProjectSchema,
  addProjectMemberSchema,
} from "./project"

describe("createProjectSchema", () => {
  it("validates a correct project payload with optional fields", () => {
    const validData = {
      name: "Ariadne Platform",
      description: "Fullstack project management app",
      priority: "HIGH",
    }

    const result = createProjectSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it("validates when optional description is omitted", () => {
    const minData = {
      name: "Minimal Project",
      priority: "LOW",
    }

    const result = createProjectSchema.safeParse(minData)
    expect(result.success).toBe(true)
  })

  it("fails when project name is missing or too short", () => {
    const invalidData = {
      name: "A",
      priority: "MEDIUM",
    }

    const result = createProjectSchema.safeParse(invalidData)
    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "The name must be at least 2 characters long"
      )
    }
  })

  it("fails when priority is an invalid value", () => {
    const invalidData = {
      name: "Valid Name",
      priority: "CRITICAL",
    }

    const result = createProjectSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})

describe("updateProjectSchema", () => {
  it("validates a full update payload without ID", () => {
    const validUpdate = {
      name: "Updated Project Name",
      description: "Updated description",
      priority: "URGENT",
    }

    const result = updateProjectSchema.safeParse(validUpdate)
    expect(result.success).toBe(true)
  })

  it("validates a partial update with only name", () => {
    const partialUpdate = {
      name: "New Name Only",
    }

    const result = updateProjectSchema.safeParse(partialUpdate)
    expect(result.success).toBe(true)
  })

  it("validates a partial update with only priority", () => {
    const partialUpdate = {
      priority: "LOW",
    }

    const result = updateProjectSchema.safeParse(partialUpdate)
    expect(result.success).toBe(true)
  })

  it("fails when updated name is too short", () => {
    const invalidUpdate = {
      name: "A",
    }

    const result = updateProjectSchema.safeParse(invalidUpdate)
    expect(result.success).toBe(false)
  })

  it("fails when updated priority is invalid", () => {
    const invalidUpdate = {
      priority: "INVALID_PRIORITY",
    }

    const result = updateProjectSchema.safeParse(invalidUpdate)
    expect(result.success).toBe(false)
  })
})

describe("addProjectMemberSchema", () => {
  it("validates a member invitation with email or username", () => {
    const validPayload = {
      identifier: "john.doe@example.com",
      role: "MEMBER",
    }

    const result = addProjectMemberSchema.safeParse(validPayload)
    expect(result.success).toBe(true)
  })

  it("validates when role is omitted", () => {
    const validPayload = {
      identifier: "johndoe",
    }

    const result = addProjectMemberSchema.safeParse(validPayload)
    expect(result.success).toBe(true)
  })

  it("fails when identifier is too short", () => {
    const invalidPayload = {
      identifier: "a",
    }

    const result = addProjectMemberSchema.safeParse(invalidPayload)
    expect(result.success).toBe(false)
  })
})
