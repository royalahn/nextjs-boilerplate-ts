export function normalizeBoardSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function normalizeCategorySlug(value: string) {
  return normalizeBoardSlug(value)
}

export function validateReplyTarget({
  postId,
  parentCommentPostId,
}: {
  postId: string
  parentCommentPostId: string | null
}) {
  if (!parentCommentPostId) {
    throw new Error("Parent comment is required for replies")
  }

  if (parentCommentPostId !== postId) {
    throw new Error("Parent comment must belong to the same post")
  }
}
