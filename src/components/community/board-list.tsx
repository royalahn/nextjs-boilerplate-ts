import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type BoardListItem = {
  id: string
  name: string
  slug: string
  description: string | null
  _count: {
    posts: number
  }
  categories: Array<{
    id: string
    name: string
    slug: string
  }>
}

interface BoardListProps {
  boards: BoardListItem[]
}

export function BoardList({ boards }: BoardListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {boards.map((board) => (
        <Card key={board.id} className="overflow-hidden">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <CardTitle className="text-lg">{board.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {board.description ?? "No description yet."}
                </p>
              </div>
              <Badge variant="secondary">{board._count.posts}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {board.categories.map((category) => (
                <Badge key={category.id} variant="outline">
                  {category.name}
                </Badge>
              ))}
            </div>
            <Link
              href={`/community/${board.slug}`}
              className="inline-flex text-sm font-medium text-primary hover:underline"
            >
              Open board
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
