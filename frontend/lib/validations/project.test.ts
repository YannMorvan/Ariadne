import { describe, it, expect } from "vitest"
import { createProjectSchema, updateProjectSchema } from "./project"

const VALID_UUID = "123e4567-e89b-12d3-a456-426614174000"

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
      name: "A", // Moins de 2 caractères
      priority: "MEDIUM",
    }

    const result = createProjectSchema.safeParse(invalidData)
    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Le nom doit faire au moins 2 caractères"
      )
    }
  })

  it("fails when priority is an invalid value", () => {
    const invalidData = {
      name: "Valid Name",
      priority: "CRITICAL", // Pas dans l'enum LOW | MEDIUM | HIGH | URGENT
    }

    const result = createProjectSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})

describe("updateProjectSchema", () => {
  it("validates a correct update payload with a valid UUID", () => {
    const validUpdate = {
      id: VALID_UUID,
      name: "Updated Project Name",
      priority: "URGENT",
    }

    const result = updateProjectSchema.safeParse(validUpdate)
    expect(result.success).toBe(true)
  })

  it("fails when update payload is missing the project ID", () => {
    const invalidUpdate = {
      name: "Updated Name Without ID",
      priority: "MEDIUM",
    }

    const result = updateProjectSchema.safeParse(invalidUpdate)
    expect(result.success).toBe(false)
  })

  it("fails when project ID is not a valid UUID", () => {
    const invalidUpdate = {
      id: "invalid-uuid-format",
      name: "Updated Name",
      priority: "LOW",
    }

    const result = updateProjectSchema.safeParse(invalidUpdate)
    expect(result.success).toBe(false)
  })
})
