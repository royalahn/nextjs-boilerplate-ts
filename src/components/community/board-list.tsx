import Link from "next/link"
import { Button } from "@/components/ui/button"
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
  const tints = ["bg-[#fff6c7]", "bg-[#dff6f1]", "bg-[#ffe5de]", "bg-[#f4ecff]"]

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {boards.map((board, index) => (
        <Card
          key={board.id}
          className={`overflow-hidden border-black/10 ${tints[index % tints.length]}`}
        >
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
            <Button asChild variant="outline" size="sm">
              <Link href={`/community/${board.slug}`}>Open board</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
