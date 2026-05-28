type BoardAdminUser = {
  role?: "USER" | "ADMIN" | null
}

export function canManageBoards(user: BoardAdminUser) {
  return user.role === "ADMIN"
}

export function assertBoardAdmin(user: BoardAdminUser) {
  if (!canManageBoards(user)) {
    throw new Error("Admin access required")
  }
}
