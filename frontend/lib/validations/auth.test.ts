import { describe, it, expect } from "vitest"
import { registerSchema, loginSchema } from "./auth"

describe("registerSchema", () => {
  it("validates a correct registration payload", () => {
    const validData = {
      username: "yann_mrvn",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    }

    const result = registerSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it("fails when username is too short", () => {
    const invalidData = {
      username: "ab",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    }

    const result = registerSchema.safeParse(invalidData)
    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Username must be at least 3 characters long"
      )
    }
  })

  it("fails when email format is invalid", () => {
    const invalidData = {
      username: "yann_mrvn",
      email: "invalid-email-format",
      password: "password123",
      confirmPassword: "password123",
    }

    const result = registerSchema.safeParse(invalidData)
    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Invalid email format")
    }
  })

  it("fails when password is too short", () => {
    const invalidData = {
      username: "yann_mrvn",
      email: "test@example.com",
      password: "123",
      confirmPassword: "123",
    }

    const result = registerSchema.safeParse(invalidData)
    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Password must be at least 8 characters long"
      )
    }
  })

  it("fails when passwords do not match (refine assertion)", () => {
    const invalidData = {
      username: "yann_mrvn",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "differentPassword456",
    }

    const result = registerSchema.safeParse(invalidData)
    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["confirmPassword"])
      expect(result.error.issues[0].message).toBe("Passwords do not match")
    }
  })
})

describe("loginSchema", () => {
  it("validates a correct login payload", () => {
    const validData = {
      email: "user@example.com",
      password: "securePassword123",
    }

    const result = loginSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it("fails when email is missing or empty", () => {
    const invalidData = {
      email: "",
      password: "password123",
    }

    const result = loginSchema.safeParse(invalidData)
    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Email is required")
    }
  })

  it("fails when password is empty", () => {
    const invalidData = {
      email: "user@example.com",
      password: "",
    }

    const result = loginSchema.safeParse(invalidData)
    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Password is required")
    }
  })
})
