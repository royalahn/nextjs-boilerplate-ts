import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type PostPreviewItem = {
  id: string
  title: string
  content: string
  createdAt: Date
  author: {
    name: string | null
  }
  category?: {
    name: string
    slug: string
  }
  _count: {
    comments: number
    likes: number
    media: number
  }
}

interface PostPreviewProps {
  post: PostPreviewItem
  category?: PostPreviewItem["category"]
  href?: string
}

export function PostPreview({ post, category, href }: PostPreviewProps) {
  const resolvedCategory = category ?? post.category
  const title = href ? (
    <Link href={href} className="hover:underline">
      {post.title}
    </Link>
  ) : (
    post.title
  )

  return (
    <Card className="border-black/10 bg-white">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            {resolvedCategory ? (
              <Badge
                variant="secondary"
                className="w-fit border border-black/10 bg-[#f4ecff] text-black"
              >
                <i className="fa-regular fa-folder mr-1" />
                {resolvedCategory.name}
              </Badge>
            ) : null}
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">
              <i className="fa-regular fa-comment-dots mr-1" />
              {post._count.comments}
            </Badge>
            <Badge variant="outline">
              <i className="fa-regular fa-heart mr-1" />
              {post._count.likes}
            </Badge>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {post.author.name ?? "Anonymous"} ·{" "}
          {new Intl.DateTimeFormat("en", {
            dateStyle: "medium",
          }).format(post.createdAt)}
        </p>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {post.content}
        </p>
      </CardContent>
    </Card>
  )
}
