import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CommentForm } from "@/components/community/comment-form"
import { LikeButton } from "@/components/community/like-button"
import { toggleCommentLike, createReply } from "@/app/(dashboard)/community/actions"

type CommentReply = {
  id: string
  content: string
  createdAt: Date
  author: {
    name: string | null
  }
  likes: Array<{
    userId: string
  }>
}

export type CommentThreadItem = {
  id: string
  content: string
  createdAt: Date
  author: {
    name: string | null
  }
  likes: Array<{
    userId: string
  }>
  replies: CommentReply[]
}

interface CommentThreadProps {
  boardSlug: string
  categorySlug: string
  postId: string
  comment: CommentThreadItem
  currentUserId: string
}

export function CommentThread({
  boardSlug,
  categorySlug,
  postId,
  comment,
  currentUserId,
}: CommentThreadProps) {
  const commentLikeAction = toggleCommentLike.bind(
    null,
    boardSlug,
    categorySlug,
    postId,
    comment.id,
  )

  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium">{comment.author.name ?? "Anonymous"}</p>
          <p className="text-xs text-muted-foreground">
            {new Intl.DateTimeFormat("en", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(comment.createdAt)}
          </p>
        </div>
        <p className="text-sm text-foreground">{comment.content}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <LikeButton
          action={commentLikeAction}
          liked={comment.likes.some((like) => like.userId === currentUserId)}
          count={comment.likes.length}
          label="comment"
        />

        <div className="ml-4 border-l pl-4">
          <CommentForm
            action={createReply.bind(
              null,
              boardSlug,
              categorySlug,
              postId,
              comment.id,
            )}
            submitLabel="Reply"
            placeholder="Write a reply"
            fieldId={`reply-${comment.id}`}
          />
        </div>

        {comment.replies.length > 0 ? (
          <div className="space-y-3 border-l pl-4">
            {comment.replies.map((reply) => (
              <Card key={reply.id} className="border-muted">
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">
                      {reply.author.name ?? "Anonymous"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat("en", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(reply.createdAt)}
                    </p>
                  </div>
                  <p className="text-sm text-foreground">{reply.content}</p>
                </CardHeader>
                <CardContent>
                  <LikeButton
                    action={toggleCommentLike.bind(
                      null,
                      boardSlug,
                      categorySlug,
                      postId,
                      reply.id,
                    )}
                    liked={reply.likes.some((like) => like.userId === currentUserId)}
                    count={reply.likes.length}
                    label="reply"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
