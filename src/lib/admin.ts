export type AdminRole = "USER" | "ADMIN"

export function isAdminEmailList(
  email: string | null | undefined,
  csv: string | undefined,
) {
  if (!email || !csv) return false
  const allowed = csv
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
  return allowed.includes(email.toLowerCase())
}

export function resolveAdminRole(email: string | null | undefined): AdminRole {
  return isAdminEmailList(email, process.env.ADMIN_EMAILS) ? "ADMIN" : "USER"
}
