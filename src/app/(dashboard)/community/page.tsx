import { Header } from "@/components/layout/header"
import { BoardList } from "@/components/community/board-list"
import { Card, CardContent } from "@/components/ui/card"
import { listCommunityBoards, requireCommunityUser } from "@/lib/community"

export default async function CommunityPage() {
  await requireCommunityUser()
  const boards = await listCommunityBoards()

  return (
    <div className="flex flex-col">
      <Header title="Community" />
      <div className="p-6">
        {boards.length > 0 ? (
          <BoardList boards={boards} />
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              No boards yet. Ask an admin to create the first board.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
