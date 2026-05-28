"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { getCommunityCategory, getCommunityPost, requireCommunityUser } from "@/lib/community"
import { validateReplyTarget } from "@/lib/community-utils"

function readField(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim()
}

async function requireCommunityPostContext(
  boardSlug: string,
  categorySlug: string,
  postId: string,
) {
  const post = await getCommunityPost(boardSlug, categorySlug, postId)
  if (!post) throw new Error("Post not found")
  return post
}

export async function createPost(
  boardSlug: string,
  categorySlug: string,
  formData: FormData,
) {
  const user = await requireCommunityUser()
  const title = readField(formData, "title")
  const content = readField(formData, "content")

  if (!title || !content) {
    throw new Error("Title and content are required")
  }

  const data = await getCommunityCategory(boardSlug, categorySlug)
  if (!data) throw new Error("Board or category not found")

  const post = await db.post.create({
    data: {
      boardId: data.board.id,
      categoryId: data.category.id,
      authorId: user.id,
      title,
      content,
    },
  })

  revalidatePath(`/community/${data.board.slug}`)
  revalidatePath(`/community/${data.board.slug}/${data.category.slug}`)
  redirect(`/community/${data.board.slug}/${data.category.slug}/${post.id}`)
}

export async function createComment(
  boardSlug: string,
  categorySlug: string,
  postId: string,
  formData: FormData,
) {
  const user = await requireCommunityUser()
  const post = await requireCommunityPostContext(boardSlug, categorySlug, postId)
  const content = readField(formData, "content")

  if (!content) {
    throw new Error("Comment content is required")
  }

  await db.comment.create({
    data: {
      postId: post.post.id,
      authorId: user.id,
      content,
    },
  })

  revalidatePath(`/community/${post.board.slug}/${post.category.slug}/${post.post.id}`)
  redirect(`/community/${post.board.slug}/${post.category.slug}/${post.post.id}`)
}

export async function createReply(
  boardSlug: string,
  categorySlug: string,
  postId: string,
  parentCommentId: string,
  formData: FormData,
) {
  const user = await requireCommunityUser()
  const post = await requireCommunityPostContext(boardSlug, categorySlug, postId)
  const content = readField(formData, "content")

  if (!content) {
    throw new Error("Reply content is required")
  }

  const parentComment = await db.comment.findUnique({
    where: { id: parentCommentId },
    select: { postId: true },
  })

  validateReplyTarget({
    postId: post.post.id,
    parentCommentPostId: parentComment?.postId ?? null,
  })

  await db.comment.create({
    data: {
      postId: post.post.id,
      authorId: user.id,
      parentId: parentCommentId,
      content,
    },
  })

  revalidatePath(`/community/${post.board.slug}/${post.category.slug}/${post.post.id}`)
  redirect(`/community/${post.board.slug}/${post.category.slug}/${post.post.id}`)
}

export async function togglePostLike(
  boardSlug: string,
  categorySlug: string,
  postId: string,
) {
  const user = await requireCommunityUser()
  const post = await requireCommunityPostContext(boardSlug, categorySlug, postId)
  const existing = await db.postLike.findUnique({
    where: {
      postId_userId: {
        postId: post.post.id,
        userId: user.id,
      },
    },
  })

  if (existing) {
    await db.postLike.delete({
      where: {
        postId_userId: {
          postId: post.post.id,
          userId: user.id,
        },
      },
    })
  } else {
    await db.postLike.create({
      data: {
        postId: post.post.id,
        userId: user.id,
      },
    })
  }

  revalidatePath(`/community/${post.board.slug}/${post.category.slug}/${post.post.id}`)
  redirect(`/community/${post.board.slug}/${post.category.slug}/${post.post.id}`)
}

export async function toggleCommentLike(
  boardSlug: string,
  categorySlug: string,
  postId: string,
  commentId: string,
) {
  const user = await requireCommunityUser()
  const post = await requireCommunityPostContext(boardSlug, categorySlug, postId)
  const comment = await db.comment.findUnique({
    where: { id: commentId },
    select: { postId: true },
  })

  if (!comment || comment.postId !== post.post.id) {
    throw new Error("Comment not found")
  }

  const existing = await db.commentLike.findUnique({
    where: {
      commentId_userId: {
        commentId,
        userId: user.id,
      },
    },
  })

  if (existing) {
    await db.commentLike.delete({
      where: {
        commentId_userId: {
          commentId,
          userId: user.id,
        },
      },
    })
  } else {
    await db.commentLike.create({
      data: {
        commentId,
        userId: user.id,
      },
    })
  }

  revalidatePath(`/community/${post.board.slug}/${post.category.slug}/${post.post.id}`)
  redirect(`/community/${post.board.slug}/${post.category.slug}/${post.post.id}`)
}
