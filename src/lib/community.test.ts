import { describe, expect, it } from "vitest"
import { normalizeBoardSlug, validateReplyTarget } from "./community-utils"

describe("normalizeBoardSlug", () => {
  it("normalizes slugs for safe routing", () => {
    expect(normalizeBoardSlug("  General Chat ")).toBe("general-chat")
  })
})

describe("validateReplyTarget", () => {
  it("rejects parent comments from another post", () => {
    expect(() =>
      validateReplyTarget({
        postId: "post-a",
        parentCommentPostId: "post-b",
      }),
    ).toThrow("Parent comment must belong to the same post")
  })
})
