import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BoardForm } from "@/components/admin/board-form"
import { CategoryForm } from "@/components/admin/category-form"
import {
  createBoard,
  createCategory,
  deleteBoard,
  deleteCategory,
  updateBoard,
  updateCategory,
} from "@/app/(dashboard)/admin/boards/actions"
import { canManageBoards } from "@/lib/board-admin"
import { requireCommunityUser } from "@/lib/community"
import { db } from "@/lib/db"

export default async function AdminBoardsPage() {
  const user = await requireCommunityUser()
  if (!canManageBoards(user)) redirect("/community")

  const boards = await db.board.findMany({
    orderBy: [{ createdAt: "desc" }],
    include: {
      categories: {
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      },
      _count: {
        select: {
          posts: true,
        },
      },
    },
  })

  return (
    <div className="flex flex-col">
      <Header title="Board Admin" />
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Create board</CardTitle>
          </CardHeader>
          <CardContent>
            <BoardForm
              action={createBoard}
              submitLabel="Create board"
              fieldPrefix="new-board"
            />
          </CardContent>
        </Card>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold">Existing boards</h2>
          {boards.length > 0 ? (
            <div className="space-y-4">
              {boards.map((board) => (
                <Card key={board.id}>
                  <CardHeader className="space-y-2">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-lg">{board.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {board.slug}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {board._count.posts} posts
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <BoardForm
                      action={updateBoard.bind(null, board.id)}
                      submitLabel="Update board"
                      defaultName={board.name}
                      defaultSlug={board.slug}
                      defaultDescription={board.description}
                      fieldPrefix={`board-${board.id}`}
                    />
                    <form action={deleteBoard.bind(null, board.id)}>
                      <Button type="submit" variant="destructive" size="sm">
                        Delete board
                      </Button>
                    </form>

                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold">Categories</h3>
                      <CategoryForm
                        action={createCategory.bind(null, board.id)}
                        submitLabel="Add category"
                        fieldPrefix={`new-category-${board.id}`}
                      />
                      {board.categories.length > 0 ? (
                        <div className="space-y-3">
                          {board.categories.map((category) => (
                            <Card key={category.id} className="border-dashed">
                              <CardContent className="space-y-4 pt-6">
                                <CategoryForm
                                  action={updateCategory.bind(
                                    null,
                                    board.id,
                                    category.id,
                                  )}
                                  submitLabel="Update category"
                                  defaultName={category.name}
                                  defaultSlug={category.slug}
                                  defaultSortOrder={category.sortOrder}
                                  fieldPrefix={`category-${category.id}`}
                                />
                                <form
                                  action={deleteCategory.bind(null, category.id)}
                                >
                                  <Button
                                    type="submit"
                                    variant="destructive"
                                    size="sm"
                                  >
                                    Delete category
                                  </Button>
                                </form>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No categories yet.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                No boards exist yet.
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  )
}
