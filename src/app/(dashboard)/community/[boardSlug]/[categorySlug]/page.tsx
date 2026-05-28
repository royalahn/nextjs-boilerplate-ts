import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { PostPreview } from "@/components/community/post-preview"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCommunityCategory, requireCommunityUser } from "@/lib/community"

interface CategoryPageProps {
  params: Promise<{
    boardSlug: string
    categorySlug: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  await requireCommunityUser()
  const { boardSlug, categorySlug } = await params
  const data = await getCommunityCategory(boardSlug, categorySlug)

  if (!data) notFound()

  const { board, category, posts } = data

  return (
    <div className="flex flex-col">
      <Header title={`${board.name} / ${category.name}`} />
      <div className="space-y-6 p-6">
        <Card className="border-black/10 bg-[#fff9df]">
          <CardHeader className="space-y-3">
            <Badge variant="secondary" className="w-fit">
              Category view
            </Badge>
            <CardTitle className="text-2xl tracking-tight">
              {category.name}
            </CardTitle>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              {board.description ?? "No description yet."}
            </p>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link href={`/community/${board.slug}`}>
              <Badge variant="secondary">{board.name}</Badge>
            </Link>
          </CardContent>
        </Card>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold tracking-tight">Posts</h2>
            <Button asChild size="sm">
              <Link href={`/community/${board.slug}/${category.slug}/new`}>
                Write a post
              </Link>
            </Button>
          </div>
          {posts.length > 0 ? (
            <div className="grid gap-4">
              {posts.map((post) => (
                <PostPreview
                  key={post.id}
                  post={post}
                  href={`/community/${board.slug}/${category.slug}/${post.id}`}
                />
              ))}
            </div>
          ) : (
            <Card className="border-black/10 bg-white">
              <CardContent className="space-y-4 py-12 text-center text-sm text-muted-foreground">
                <p>No posts in this category yet.</p>
                <Button asChild>
                  <Link href={`/community/${board.slug}/${category.slug}/new`}>
                    Write the first post
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  )
}
