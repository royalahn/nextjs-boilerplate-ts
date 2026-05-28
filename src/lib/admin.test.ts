import { describe, expect, it } from "vitest"
import { isAdminEmailList } from "./admin"

describe("isAdminEmailList", () => {
  it("matches emails case-insensitively", () => {
    expect(
      isAdminEmailList(
        "Hugh@example.com",
        "hugh@example.com,admin@example.com",
      ),
    ).toBe(true)
  })

  it("returns false for missing or unrelated emails", () => {
    expect(isAdminEmailList(null, "admin@example.com")).toBe(false)
    expect(isAdminEmailList("user@example.com", "admin@example.com")).toBe(false)
  })
})
