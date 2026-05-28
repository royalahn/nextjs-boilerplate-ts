import { Header } from "@/components/layout/header"
import { BoardList } from "@/components/community/board-list"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { listCommunityBoards, requireCommunityUser } from "@/lib/community"

export default async function CommunityPage() {
  await requireCommunityUser()
  const boards = await listCommunityBoards()

  return (
    <div className="flex flex-col">
      <Header title="Community" />
      <div className="mx-auto w-full max-w-5xl space-y-6 p-6">
        <Card className="border-black/10 bg-white shadow-[0_12px_32px_-4px_rgba(5,0,56,0.08)]">
          <CardContent className="space-y-3 py-6">
            <Badge variant="secondary" className="w-fit">
              <i className="fa-solid fa-comment-dots mr-2 text-[#5dd8c7]" />
              Community board
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight">
              Find the right board, then jump into the thread.
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Boards are the big containers, categories keep things tidy, and
              posts start the conversation.
            </p>
          </CardContent>
        </Card>

        {boards.length > 0 ? (
          <BoardList boards={boards} />
        ) : (
          <Card className="border-black/10 bg-[#fff9df]">
            <CardContent className="space-y-4 py-12 text-center text-sm text-muted-foreground">
              <i className="fa-solid fa-table-columns text-2xl text-black/40" />
              No boards yet. Ask an admin to create the first board.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
