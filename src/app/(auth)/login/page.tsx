import { auth, signIn } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function LoginPage() {
  const session = await auth()
  if (session?.user) redirect("/dashboard")

  return (
    <div className="min-h-screen bg-white px-6 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#f7d842] px-3 py-1 text-xs font-semibold text-black">
            <span className="h-2 w-2 rounded-full bg-black/70" />
            Whiteboard-ready workspace
          </div>
          <div className="space-y-4">
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-black md:text-6xl">
              See how teams get great work done.
            </h1>
            <p className="max-w-lg text-base leading-7 text-muted-foreground md:text-lg">
              Keep your community, comments, and board workflows in one
              polished, focused workspace.
            </p>
          </div>

          <Card className="max-w-lg border-black/10 bg-white/95 shadow-[0_12px_32px_-4px_rgba(5,0,56,0.08)]">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl tracking-tight">My App</CardTitle>
              <CardDescription>
                Sign in with Google to continue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                action={async () => {
                  "use server"
                  await signIn("google", { redirectTo: "/dashboard" })
                }}
              >
                <Button type="submit" className="w-full justify-center" size="lg">
                  <svg
                    className="mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </form>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                No account needed. We create one automatically on first sign in.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="relative">
          <div className="absolute -left-8 top-8 h-24 w-24 rounded-full bg-[#f7d842]/30 blur-2xl" />
          <div className="absolute right-0 top-32 h-32 w-32 rounded-full bg-[#5dd8c7]/20 blur-3xl" />
          <Card className="relative overflow-hidden border-black/10 bg-white shadow-[0_12px_32px_-4px_rgba(5,0,56,0.08)]">
            <CardHeader className="space-y-3 border-b border-black/5 bg-black/[0.02]">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Board snapshot</CardTitle>
                <span className="rounded-full bg-[#f7d842] px-3 py-1 text-xs font-semibold text-black">
                  Live
                </span>
              </div>
              <CardDescription>
                A quick preview of what the workspace feels like once you sign in.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[28px] border border-black/10 bg-[#fff6c7] p-4">
                  <p className="text-sm font-medium text-black">Sticky notes</p>
                  <p className="mt-2 text-sm text-black/70">
                    Quick ideas, lightweight comments, and board-level context.
                  </p>
                </div>
                <div className="rounded-[28px] border border-black/10 bg-[#dff6f1] p-4">
                  <p className="text-sm font-medium text-black">Threaded replies</p>
                  <p className="mt-2 text-sm text-black/70">
                    Keep conversations nested and easy to scan.
                  </p>
                </div>
              </div>

              <div className="rounded-[28px] border border-black/10 bg-white p-4 shadow-[0_1px_2px_rgba(5,0,56,0.04)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-black">Community board</p>
                    <p className="text-xs text-muted-foreground">
                      Product ideas · 12 posts
                    </p>
                  </div>
                  <Button variant="yellow" size="sm">
                    Ask a question
                  </Button>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-2xl bg-[#fff6c7] p-3 text-xs text-black/75">
                    Quick feedback
                  </div>
                  <div className="rounded-2xl bg-[#ffe5de] p-3 text-xs text-black/75">
                    Feature request
                  </div>
                  <div className="rounded-2xl bg-[#dff6f1] p-3 text-xs text-black/75">
                    Release notes
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
