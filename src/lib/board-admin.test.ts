import { describe, expect, it } from "vitest"
import { canManageBoards } from "./board-admin"

describe("canManageBoards", () => {
  it("only allows admin users", () => {
    expect(canManageBoards({ role: "ADMIN" })).toBe(true)
    expect(canManageBoards({ role: "USER" })).toBe(false)
  })
})
