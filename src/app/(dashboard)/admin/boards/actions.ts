"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { requireCommunityUser } from "@/lib/community"
import { assertBoardAdmin } from "@/lib/board-admin"
import {
  normalizeBoardSlug,
  normalizeCategorySlug,
} from "@/lib/community-utils"

function readField(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim()
}

function readOptionalField(formData: FormData, key: string) {
  const value = readField(formData, key)
  return value.length > 0 ? value : null
}

export async function createBoard(formData: FormData) {
  const user = await requireCommunityUser()
  assertBoardAdmin(user)

  const name = readField(formData, "name")
  const slug = normalizeBoardSlug(readField(formData, "slug"))
  const description = readOptionalField(formData, "description")

  if (!name || !slug) {
    throw new Error("Board name and slug are required")
  }

  await db.board.create({
    data: {
      name,
      slug,
      description,
      createdById: user.id,
    },
  })

  revalidatePath("/admin/boards")
  redirect("/admin/boards")
}

export async function updateBoard(boardId: string, formData: FormData) {
  const user = await requireCommunityUser()
  assertBoardAdmin(user)

  const name = readField(formData, "name")
  const slug = normalizeBoardSlug(readField(formData, "slug"))
  const description = readOptionalField(formData, "description")

  if (!name || !slug) {
    throw new Error("Board name and slug are required")
  }

  await db.board.update({
    where: { id: boardId },
    data: {
      name,
      slug,
      description,
    },
  })

  revalidatePath("/admin/boards")
  redirect("/admin/boards")
}

export async function deleteBoard(boardId: string) {
  const user = await requireCommunityUser()
  assertBoardAdmin(user)

  await db.board.delete({ where: { id: boardId } })
  revalidatePath("/admin/boards")
  redirect("/admin/boards")
}

export async function createCategory(boardId: string, formData: FormData) {
  const user = await requireCommunityUser()
  assertBoardAdmin(user)

  const name = readField(formData, "name")
  const slug = normalizeCategorySlug(readField(formData, "slug"))
  const sortOrder = Number(formData.get("sortOrder") ?? 0)

  if (!name || !slug) {
    throw new Error("Category name and slug are required")
  }

  await db.boardCategory.create({
    data: {
      boardId,
      name,
      slug,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    },
  })

  revalidatePath("/admin/boards")
  redirect("/admin/boards")
}

export async function updateCategory(
  boardId: string,
  categoryId: string,
  formData: FormData,
) {
  const user = await requireCommunityUser()
  assertBoardAdmin(user)

  const name = readField(formData, "name")
  const slug = normalizeCategorySlug(readField(formData, "slug"))
  const sortOrder = Number(formData.get("sortOrder") ?? 0)

  if (!name || !slug) {
    throw new Error("Category name and slug are required")
  }

  await db.boardCategory.update({
    where: { id: categoryId },
    data: {
      boardId,
      name,
      slug,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    },
  })

  revalidatePath("/admin/boards")
  redirect("/admin/boards")
}

export async function deleteCategory(categoryId: string) {
  const user = await requireCommunityUser()
  assertBoardAdmin(user)

  await db.boardCategory.delete({ where: { id: categoryId } })
  revalidatePath("/admin/boards")
  redirect("/admin/boards")
}
