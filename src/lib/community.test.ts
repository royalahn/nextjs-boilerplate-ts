import { describe, expect, it } from "vitest"
import { normalizeBoardSlug } from "./community-utils"

describe("normalizeBoardSlug", () => {
  it("normalizes slugs for safe routing", () => {
    expect(normalizeBoardSlug("  General Chat ")).toBe("general-chat")
  })
})
