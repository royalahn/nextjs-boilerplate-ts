"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface SidebarProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: "USER" | "ADMIN"
  }
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: "fa-solid fa-table-columns" },
    { label: "Community", href: "/community", icon: "fa-solid fa-message" },
    ...(user.role === "ADMIN"
      ? [{ label: "Board Admin", href: "/admin/boards", icon: "fa-solid fa-shield-halved" }]
      : []),
  ]

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-black/10 bg-white/90 px-4 py-5 backdrop-blur">
      <div className="mb-6 flex items-center gap-3 px-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#f7d842] text-sm font-semibold text-black">
          M
        </span>
        <div className="leading-tight">
          <span className="block text-sm font-semibold tracking-tight">
            My App
          </span>
          <span className="text-xs text-muted-foreground">Workspace</span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition-colors",
              pathname === href
                ? "bg-black text-white shadow-sm"
                : "text-muted-foreground hover:bg-black/5 hover:text-black"
            )}
          >
            <i className={`${Icon} text-[0.9rem]`} aria-hidden="true" />
            {label}
          </Link>
        ))}
      </nav>

      <Separator className="my-4 bg-black/10" />

      <div className="flex items-center gap-3 rounded-[20px] border border-black/10 bg-white px-3 py-3 shadow-[0_1px_2px_rgba(5,0,56,0.04)]">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
          <AvatarFallback>
            {user.name?.charAt(0).toUpperCase() ?? "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col overflow-hidden">
          <span className="truncate text-sm font-medium">{user.name}</span>
          <span className="truncate text-xs text-muted-foreground">
            {user.email}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 rounded-full"
          onClick={() => signOut({ callbackUrl: "/login" })}
          title="Sign out"
        >
          <i className="fa-solid fa-right-from-bracket text-[0.9rem]" aria-hidden="true" />
        </Button>
      </div>
    </aside>
  )
}
