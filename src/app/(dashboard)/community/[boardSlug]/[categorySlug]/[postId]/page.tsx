import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { CommentForm } from "@/components/community/comment-form"
import { CommentThread } from "@/components/community/comment-thread"
import { LikeButton } from "@/components/community/like-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  createComment,
  togglePostLike,
} from "@/app/(dashboard)/community/actions"
import { getCommunityPost, requireCommunityUser } from "@/lib/community"

interface PostPageProps {
  params: Promise<{
    boardSlug: string
    categorySlug: string
    postId: string
  }>
}

export default async function PostPage({ params }: PostPageProps) {
  const user = await requireCommunityUser()
  const { boardSlug, categorySlug, postId } = await params
  const data = await getCommunityPost(boardSlug, categorySlug, postId)

  if (!data) notFound()

  const { board, category, post, comments } = data
  const postLikeAction = togglePostLike.bind(
    null,
    board.slug,
    category.slug,
    post.id,
  )

  return (
    <div className="flex flex-col">
      <Header title={post.title} />
      <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link href={`/community/${board.slug}`}>
            <i className="fa-solid fa-table-columns mr-2" aria-hidden="true" />
            {board.name}
          </Link>
          <span>/</span>
          <Link href={`/community/${board.slug}/${category.slug}`}>
            {category.name}
          </Link>
        </div>

        <Card className="border-black/10 bg-white shadow-[0_12px_32px_-4px_rgba(5,0,56,0.08)]">
          <CardHeader className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className="border border-black/10 bg-[#f4ecff] text-black"
                  >
                    <i className="fa-regular fa-folder mr-2" />
                    {category.name}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-black/10 bg-white text-black"
                  >
                    <i className="fa-solid fa-table-columns mr-2" />
                    {board.name}
                  </Badge>
                </div>
                <CardTitle className="text-2xl tracking-tight">{post.title}</CardTitle>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  <i className="fa-regular fa-comment-dots mr-2" />
                  {post._count.comments} comments
                </Badge>
                <Badge variant="outline">
                  <i className="fa-regular fa-heart mr-2" />
                  {post._count.likes} likes
                </Badge>
                <Badge variant="outline">
                  <i className="fa-regular fa-image mr-2" />
                  {post._count.media} attachments
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              By {post.author.name ?? "Anonymous"} ·{" "}
              {new Intl.DateTimeFormat("en", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(post.createdAt)}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">
              {post.content}
            </p>
            <LikeButton
              action={postLikeAction}
              liked={post.likes.some((like) => like.userId === user.id)}
              count={post.likes.length}
              label="post"
            />
          </CardContent>
        </Card>

        <Card className="border-black/10 bg-[#fff9df]">
          <CardHeader>
            <CardTitle className="text-lg tracking-tight">
              <i className="fa-regular fa-comment-dots mr-2 text-[#5dd8c7]" />
              Leave a comment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CommentForm
              action={createComment.bind(
                null,
                board.slug,
                category.slug,
                post.id,
              )}
              submitLabel="Comment"
              placeholder="Share your thoughts"
              fieldId={`comment-${post.id}`}
            />
          </CardContent>
        </Card>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold tracking-tight">Comments</h2>
            <Button asChild variant="outline" size="sm">
              <Link href={`/community/${board.slug}/${category.slug}`}>
                <i className="fa-solid fa-arrow-left" aria-hidden="true" />
                Back to category
              </Link>
            </Button>
          </div>
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentThread
                  key={comment.id}
                  boardSlug={board.slug}
                  categorySlug={category.slug}
                  postId={post.id}
                  comment={comment}
                  currentUserId={user.id}
                />
              ))}
            </div>
          ) : (
            <Card className="border-black/10 bg-white">
              <CardContent className="space-y-4 py-12 text-center text-sm text-muted-foreground">
                <i className="fa-regular fa-comment-dots text-2xl text-black/40" />
                No comments yet. Be the first to join the conversation.
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  )
}
