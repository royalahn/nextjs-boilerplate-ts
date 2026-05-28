import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { PostPreview } from "@/components/community/post-preview"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
        <Card className="border-black/10 bg-[#fff9df]">
          <CardHeader className="space-y-3">
            <Badge variant="secondary" className="w-fit">
              {board.categories.length} categories
            </Badge>
            <CardTitle className="text-3xl tracking-tight">{board.name}</CardTitle>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              {board.description ?? "No description yet."}
            </p>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {board.categories.map((category) => (
              <Button asChild key={category.id} variant="outline" size="sm">
                <Link href={`/community/${board.slug}/${category.slug}`}>
                  {category.name}
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold tracking-tight">Recent Posts</h2>
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
            <Card className="border-black/10 bg-white">
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
