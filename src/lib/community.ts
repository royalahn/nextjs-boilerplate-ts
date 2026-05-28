import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import {
  normalizeBoardSlug,
  normalizeCategorySlug,
} from "@/lib/community-utils"

export async function requireCommunityUser() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  return session.user
}

export async function listCommunityBoards() {
  return db.board.findMany({
    orderBy: [{ createdAt: "desc" }],
    include: {
      categories: {
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      },
      _count: {
        select: {
          posts: true,
        },
      },
    },
  })
}

export async function getCommunityBoard(boardSlug: string) {
  const slug = normalizeBoardSlug(boardSlug)
  return db.board.findUnique({
    where: { slug },
    include: {
      categories: {
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      },
      posts: {
        where: { deletedAt: null },
        orderBy: [{ createdAt: "desc" }],
        take: 6,
        include: {
          author: true,
          category: true,
          _count: {
            select: {
              comments: true,
              likes: true,
              media: true,
            },
          },
        },
      },
      _count: {
        select: {
          posts: true,
        },
      },
    },
  })
}

export async function getCommunityCategory(boardSlug: string, categorySlug: string) {
  const board = await getCommunityBoard(boardSlug)
  if (!board) return null

  const slug = normalizeCategorySlug(categorySlug)
  const category = board.categories.find((item) => item.slug === slug)
  if (!category) return null

  const posts = await db.post.findMany({
    where: {
      boardId: board.id,
      categoryId: category.id,
      deletedAt: null,
    },
    orderBy: [{ createdAt: "desc" }],
    include: {
      author: true,
      _count: {
        select: {
          comments: true,
          likes: true,
          media: true,
        },
      },
    },
  })

  return { board, category, posts }
}
