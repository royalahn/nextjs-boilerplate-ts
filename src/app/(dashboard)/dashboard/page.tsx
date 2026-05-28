import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const stats = [
  { title: "Boards", value: "1" },
  { title: "Posts", value: "0" },
  { title: "Comments", value: "0" },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <Header title="Dashboard" />
      <div className="space-y-6 p-6">
        <Card className="border-black/10 bg-white shadow-[0_12px_32px_-4px_rgba(5,0,56,0.08)]">
          <CardHeader className="space-y-3">
            <Badge variant="secondary" className="w-fit">
              <i className="fa-solid fa-sparkles mr-2 text-[#f7d842]" />
              Workspace overview
            </Badge>
            <CardTitle className="text-3xl tracking-tight">
              Build the board, then let the conversation unfold.
            </CardTitle>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              The dashboard is now styled as a bright canvas with rounded,
              tactile surfaces and soft pastel accents inspired by Miro.
            </p>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/community">
                <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                Open community
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/boards">
                <i className="fa-solid fa-shield-halved" aria-hidden="true" />
                Manage boards
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className="border-black/10 bg-white shadow-[0_1px_2px_rgba(5,0,56,0.04)]"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  <i className="fa-regular fa-square-check mr-2" />
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-semibold tracking-tight">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-black/10 bg-[#fff9df]">
            <CardHeader>
              <CardTitle className="text-lg">
                <i className="fa-solid fa-bolt mr-2 text-[#f7d842]" />
                Board pulse
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-[24px] border border-black/10 bg-white p-4 shadow-[0_1px_2px_rgba(5,0,56,0.04)]">
                <p className="text-sm font-medium">
                  <i className="fa-solid fa-message mr-2 text-[#5dd8c7]" />
                  Community
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create posts, attach images later, and keep discussions
                  threaded.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[24px] border border-black/10 bg-[#f4ecff] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/60">
                    <i className="fa-solid fa-table-columns mr-2" />
                    boards
                  </p>
                  <p className="mt-2 text-xl font-semibold">1</p>
                </div>
                <div className="rounded-[24px] border border-black/10 bg-[#dff6f1] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/60">
                    <i className="fa-solid fa-layer-group mr-2" />
                    categories
                  </p>
                  <p className="mt-2 text-xl font-semibold">1+</p>
                </div>
                <div className="rounded-[24px] border border-black/10 bg-[#ffe5de] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/60">
                    <i className="fa-solid fa-user-shield mr-2" />
                    roles
                  </p>
                  <p className="mt-2 text-xl font-semibold">admin</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-black/10 bg-white">
            <CardHeader>
              <CardTitle className="text-lg">
                <i className="fa-solid fa-rocket mr-2 text-[#ff9f6e]" />
                Next steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <i className="fa-regular fa-pen-to-square mr-2 text-black/60" />
                Open the community board and write a post.
              </p>
              <p>
                <i className="fa-regular fa-comment-dots mr-2 text-black/60" />
                Add a comment thread and test likes/replies.
              </p>
              <p>
                <i className="fa-solid fa-folder-plus mr-2 text-black/60" />
                Use the board admin page to add more categories.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
