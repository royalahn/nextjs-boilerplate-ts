import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PostForm } from "@/components/community/post-form"
import { createPost } from "@/app/(dashboard)/community/actions"
import { getCommunityCategory, requireCommunityUser } from "@/lib/community"

interface NewPostPageProps {
  params: Promise<{
    boardSlug: string
    categorySlug: string
  }>
}

export default async function NewPostPage({ params }: NewPostPageProps) {
  await requireCommunityUser()
  const { boardSlug, categorySlug } = await params
  const data = await getCommunityCategory(boardSlug, categorySlug)

  if (!data) notFound()

  return (
    <div className="flex flex-col">
      <Header title={`New post · ${data.board.name}`} />
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Write a new post</CardTitle>
          </CardHeader>
          <CardContent>
            <PostForm
              action={createPost.bind(null, data.board.slug, data.category.slug)}
              submitLabel="Publish post"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
