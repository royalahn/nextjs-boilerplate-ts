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
