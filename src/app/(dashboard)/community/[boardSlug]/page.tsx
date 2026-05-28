import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { PostPreview } from "@/components/community/post-preview"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCommunityBoard, requireCommunityUser } from "@/lib/community"

interface BoardPageProps {
  params: Promise<{
    boardSlug: string
  }>
}

export default async function BoardPage({ params }: BoardPageProps) {
  await requireCommunityUser()
  const { boardSlug } = await params
  const board = await getCommunityBoard(boardSlug)

  if (!board) notFound()

  return (
    <div className="flex flex-col">
      <Header title={board.name} />
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{board.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {board.description ?? "No description yet."}
            </p>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {board.categories.map((category) => (
              <Link
                key={category.id}
                href={`/community/${board.slug}/${category.slug}`}
              >
                <Badge variant="outline">{category.name}</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold">Recent Posts</h2>
          {board.posts.length > 0 ? (
            <div className="grid gap-4">
              {board.posts.map((post) => (
                <PostPreview
                  key={post.id}
                  post={post}
                  href={`/community/${board.slug}/${post.category.slug}/${post.id}`}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                No posts yet in this board.
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  )
}
