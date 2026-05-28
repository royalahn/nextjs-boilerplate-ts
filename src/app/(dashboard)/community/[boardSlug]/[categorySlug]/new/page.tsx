import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
      <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
        <Card className="border-black/10 bg-[#fff9df]">
          <CardHeader className="space-y-3">
            <Badge variant="secondary" className="w-fit">
              <i className="fa-solid fa-pen-nib mr-2 text-[#ff9f6e]" />
              New post
            </Badge>
            <CardTitle className="text-2xl tracking-tight">
              Write a new post
            </CardTitle>
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
