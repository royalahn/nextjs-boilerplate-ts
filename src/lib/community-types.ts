export type CommunityBoardSummary = {
  id: string
  name: string
  slug: string
  description: string | null
}

export type CommunityCategorySummary = {
  id: string
  boardId: string
  name: string
  slug: string
  sortOrder: number
}

export type CommunityPostSummary = {
  id: string
  boardId: string
  categoryId: string
  authorId: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export type CommunityReplyTarget = {
  postId: string
  parentCommentPostId: string | null
}
