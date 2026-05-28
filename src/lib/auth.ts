import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import { resolveAdminRole } from "@/lib/admin"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [Google],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      session.user.role = resolveAdminRole(user.email)
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isDashboard = nextUrl.pathname.startsWith("/dashboard")
      if (isDashboard) {
        if (isLoggedIn) return true
        return false
      }
      return true
    },
  },
  events: {
    async signIn({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { role: resolveAdminRole(user.email) },
      })
    },
  },
})
