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
  _count: {
    comments: number
    likes: number
    media: number
  }
}

interface PostPreviewProps {
  post: PostPreviewItem
  href?: string
}

export function PostPreview({ post, href }: PostPreviewProps) {
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
          <CardTitle className="text-base">{title}</CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary">{post._count.comments}</Badge>
            <Badge variant="outline">{post._count.likes}</Badge>
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
