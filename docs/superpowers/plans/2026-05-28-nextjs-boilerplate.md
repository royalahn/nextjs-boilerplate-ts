# Next.js Boilerplate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a production-ready Next.js 15 boilerplate with TailwindCSS v4, shadcn/ui, Google OAuth (Auth.js v5), PostgreSQL 16 + Prisma, and Docker Compose for self-hosted VPS deployment.

**Architecture:** Single Next.js 15 App Router app in `my-app/` under the project root. Route groups `(auth)` and `(dashboard)` separate public and protected areas. Auth.js v5 handles Google OAuth with `@auth/prisma-adapter` persisting sessions to PostgreSQL. Docker Compose dev config runs only the DB; prod config runs both app and DB via a multi-stage Dockerfile with `output: "standalone"`.

**Tech Stack:** Next.js 15, TailwindCSS v4, shadcn/ui (new-york style), Auth.js v5 (`next-auth@beta`), `@auth/prisma-adapter`, Prisma, PostgreSQL 16, Docker Compose, lucide-react

---

## File Map

```
my-app/
├── src/
│   ├── app/
│   │   ├── (auth)/login/page.tsx              ← Login page (Google button)
│   │   ├── (dashboard)/layout.tsx             ← Sidebar wrapper (server)
│   │   ├── (dashboard)/dashboard/page.tsx     ← Dashboard home (3 stat cards)
│   │   ├── api/auth/[...nextauth]/route.ts    ← Auth.js handler
│   │   ├── layout.tsx                         ← Modified: add Toaster
│   │   └── page.tsx                           ← Modified: redirect /dashboard
│   ├── components/
│   │   ├── ui/                                ← shadcn auto-generated
│   │   └── layout/
│   │       ├── sidebar.tsx                    ← Client: nav + user + logout
│   │       └── header.tsx                     ← Server: page title + user dropdown
│   ├── lib/
│   │   ├── auth.ts                            ← NextAuth config
│   │   ├── db.ts                              ← Prisma singleton
│   │   └── utils.ts                           ← cn() — created by shadcn init
│   └── middleware.ts                          ← Route protection
├── prisma/schema.prisma                       ← Auth.js v5 tables
├── Dockerfile                                 ← Multi-stage build
├── docker-compose.yml                         ← Dev: DB only
├── docker-compose.prod.yml                    ← Prod: app + DB
├── .dockerignore
├── .env                                       ← Local secrets (gitignored)
├── .env.example                               ← Committed template
└── next.config.ts                             ← Modified: output=standalone
```

---

### Task 1: Scaffold Next.js Project & Install Dependencies

**Files:**
- Create: `my-app/` (via create-next-app)

- [ ] **Step 1: Run create-next-app**

Run from `C:\Users\Hugh\Desktop\Claude`:

```bash
npx create-next-app@latest my-app --typescript --tailwind --app --src-dir --import-alias "@/*" --no-git --yes
```

Expected: `my-app/` created with Next.js 15, TailwindCSS v4, TypeScript, App Router, `src/` dir.

- [ ] **Step 2: Install auth, prisma, and icon dependencies**

```bash
cd my-app
npm install next-auth@beta @auth/prisma-adapter prisma @prisma/client lucide-react
```

Expected: packages added to `package.json` with no errors.

- [ ] **Step 3: Verify dev server starts**

```bash
npm run dev
```

Open http://localhost:3000 — default Next.js welcome page should appear. Stop the server (Ctrl+C).

- [ ] **Step 4: Initialize git and commit**

```bash
git init
git add .
git commit -m "feat: scaffold Next.js 15 with TailwindCSS v4"
```

---

### Task 2: shadcn Setup

**Files:**
- Create: `my-app/components.json`
- Create: `my-app/src/lib/utils.ts`
- Create: `my-app/src/components/ui/` (various)

- [ ] **Step 1: Initialize shadcn with defaults**

```bash
npx shadcn@latest init -d
```

Expected: `components.json` created, `src/lib/utils.ts` created with `cn()`, `src/app/globals.css` updated.

- [ ] **Step 2: Add all required components in one command**

```bash
npx shadcn@latest add button card input form dialog dropdown-menu avatar separator toast skeleton badge
```

Expected: files created in `src/components/ui/` with no errors.

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: add shadcn/ui components"
```

---

### Task 3: Docker & next.config.ts

**Files:**
- Modify: `my-app/next.config.ts`
- Create: `my-app/.dockerignore`
- Create: `my-app/Dockerfile`
- Create: `my-app/docker-compose.yml`
- Create: `my-app/docker-compose.prod.yml`

- [ ] **Step 1: Enable standalone output in next.config.ts**

Replace the contents of `my-app/next.config.ts` with:

```ts
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
}

export default nextConfig
```

- [ ] **Step 2: Create .dockerignore**

Create `my-app/.dockerignore`:

```
.git
.next
node_modules
npm-debug.log
.env
.env.*
!.env.example
```

- [ ] **Step 3: Create Dockerfile (multi-stage)**

Create `my-app/Dockerfile`:

```dockerfile
FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
```

- [ ] **Step 4: Create docker-compose.yml (dev — DB only)**

Create `my-app/docker-compose.yml`:

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

- [ ] **Step 5: Create docker-compose.prod.yml**

Create `my-app/docker-compose.prod.yml`:

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file: .env
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-myapp}
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  postgres_data:
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: add Dockerfile and Docker Compose for dev and prod"
```

---

### Task 4: Prisma Schema & DB Client

**Files:**
- Create: `my-app/prisma/schema.prisma`
- Create: `my-app/src/lib/db.ts`
- Create: `my-app/.env`
- Create: `my-app/.env.example`

- [ ] **Step 1: Initialize Prisma**

```bash
npx prisma init --datasource-provider postgresql
```

Expected: `prisma/schema.prisma` and `.env` created.

- [ ] **Step 2: Write Auth.js v5 compatible schema**

Replace the contents of `my-app/prisma/schema.prisma` with:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Account {
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([provider, providerAccountId])
}

model Session {
  sessionToken String   @unique
  userId       String
  expires      DateTime
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String
  expires    DateTime

  @@id([identifier, token])
}
```

- [ ] **Step 3: Set up .env**

Replace the contents of `my-app/.env` with:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/myapp"
AUTH_SECRET="change-me-run-openssl-rand-base64-32"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
NEXTAUTH_URL="http://localhost:3000"
```

- [ ] **Step 4: Create .env.example**

Create `my-app/.env.example`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/myapp"
AUTH_SECRET=""
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
NEXTAUTH_URL="http://localhost:3000"
```

- [ ] **Step 5: Verify .env is gitignored**

Check `my-app/.gitignore` contains `.env` (create-next-app adds this). If it only has `.env*.local`, add `.env` on its own line.

- [ ] **Step 6: Create Prisma singleton**

Create `my-app/src/lib/db.ts`:

```ts
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
```

- [ ] **Step 7: Start DB and push schema**

```bash
docker compose up -d
npx prisma db push
```

Expected: DB starts healthy, then: `Your database is now in sync with your Prisma schema.`

- [ ] **Step 8: Generate Prisma client**

```bash
npx prisma generate
```

Expected: `Generated Prisma Client (v5.x.x) to ./node_modules/@prisma/client`

- [ ] **Step 9: Commit**

```bash
git add .
git commit -m "feat: add Prisma schema with Auth.js v5 tables and db singleton"
```

---

### Task 5: Auth.js v5 Configuration

**Files:**
- Create: `my-app/src/lib/auth.ts`
- Create: `my-app/src/app/api/auth/[...nextauth]/route.ts`
- Create: `my-app/src/middleware.ts`

- [ ] **Step 1: Create auth.ts**

Create `my-app/src/lib/auth.ts`:

```ts
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [Google],
  pages: {
    signIn: "/login",
  },
  callbacks: {
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
})
```

- [ ] **Step 2: Create Auth.js API route handler**

Create `my-app/src/app/api/auth/[...nextauth]/route.ts`:

```ts
import { handlers } from "@/lib/auth"

export const { GET, POST } = handlers
```

- [ ] **Step 3: Create middleware.ts**

Create `my-app/src/middleware.ts`:

```ts
export { auth as middleware } from "@/lib/auth"

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors. If there are type errors from `next-auth@beta`, they are typically safe to ignore at this stage — the types stabilize once all files are wired together.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: configure Auth.js v5 with Google OAuth and route protection middleware"
```

---

### Task 6: Login Page

**Files:**
- Create: `my-app/src/app/(auth)/login/page.tsx`

- [ ] **Step 1: Create login page**

Create `my-app/src/app/(auth)/login/page.tsx`:

```tsx
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
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">My App</CardTitle>
          <CardDescription>Sign in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async () => {
              "use server"
              await signIn("google", { redirectTo: "/dashboard" })
            }}
          >
            <Button type="submit" className="w-full" size="lg">
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
            No account needed — one is created automatically on first sign in.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Verify login page renders**

```bash
npm run dev
```

Open http://localhost:3000/login — should show a centered card with "Continue with Google" button. Stop the server.

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: add login page with Google OAuth button"
```

---

### Task 7: Sidebar & Header Components

**Files:**
- Create: `my-app/src/components/layout/sidebar.tsx`
- Create: `my-app/src/components/layout/header.tsx`

- [ ] **Step 1: Create sidebar.tsx (client component)**

Create `my-app/src/components/layout/sidebar.tsx`:

```tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { LayoutDashboard, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
]

interface SidebarProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-60 flex-col border-r bg-card px-3 py-4">
      <div className="mb-6 px-2">
        <span className="text-lg font-semibold">My App</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <Separator className="my-3" />

      <div className="flex items-center gap-3 px-2">
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
          className="h-8 w-8 shrink-0"
          onClick={() => signOut({ callbackUrl: "/login" })}
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Create header.tsx (server component)**

Create `my-app/src/components/layout/header.tsx`:

```tsx
import { auth, signOut } from "@/lib/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  title: string
}

export async function Header({ title }: HeaderProps) {
  const session = await auth()
  const user = session?.user

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-6">
      <h1 className="text-sm font-semibold">{title}</h1>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user?.image ?? undefined}
                alt={user?.name ?? "User"}
              />
              <AvatarFallback>
                {user?.name?.charAt(0).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-0">
            <form
              action={async () => {
                "use server"
                await signOut({ redirectTo: "/login" })
              }}
              className="w-full"
            >
              <button
                type="submit"
                className="w-full cursor-pointer px-2 py-1.5 text-left text-sm"
              >
                Sign out
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: add Sidebar and Header layout components"
```

---

### Task 8: Dashboard Layout

**Files:**
- Create: `my-app/src/app/(dashboard)/layout.tsx`

- [ ] **Step 1: Create dashboard layout**

Create `my-app/src/app/(dashboard)/layout.tsx`:

```tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar user={session.user} />
      <main className="flex flex-1 flex-col overflow-auto">{children}</main>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: add dashboard layout with sidebar"
```

---

### Task 9: Dashboard Home Page & Root Wiring

**Files:**
- Create: `my-app/src/app/(dashboard)/dashboard/page.tsx`
- Modify: `my-app/src/app/page.tsx`
- Modify: `my-app/src/app/layout.tsx`

- [ ] **Step 1: Create dashboard home page**

Create `my-app/src/app/(dashboard)/dashboard/page.tsx`:

```tsx
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
  { title: "Total Users", value: "0" },
  { title: "Active Sessions", value: "0" },
  { title: "Revenue", value: "$0" },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <Header title="Dashboard" />
      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          Your content goes here
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Replace root page with redirect**

Replace the full contents of `my-app/src/app/page.tsx` with:

```tsx
import { redirect } from "next/navigation"

export default function RootPage() {
  redirect("/dashboard")
}
```

- [ ] **Step 3: Add Toaster to root layout**

Open `my-app/src/app/layout.tsx`. The file was scaffolded by create-next-app. Add the `Toaster` import and component. The final file should look like this (font variable names may differ slightly — keep whatever create-next-app generated):

```tsx
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "My App",
  description: "My App",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add dashboard home, root redirect, and Toaster to root layout"
```

---

### Task 10: Final Verification

- [ ] **Step 1: Ensure DB is running**

```bash
docker compose up -d
docker compose ps
```

Expected: `db` service shows `running (healthy)`.

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Start dev server and smoke test**

```bash
npm run dev
```

Verify these three behaviors:

1. http://localhost:3000 → redirects to `/login` (unauthenticated)
2. http://localhost:3000/dashboard → redirects to `/login` (unauthenticated)
3. http://localhost:3000/login → renders card with "Continue with Google" button

> **To test full OAuth flow:** Set real `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, and `AUTH_SECRET` in `.env`. Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI in Google Cloud Console. Then click "Continue with Google" — after OAuth, you should land on `/dashboard` with sidebar and stat cards.

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "feat: complete Next.js boilerplate — auth, DB, dashboard UI, Docker"
```

---

## Quick-Start Reference

```bash
# 1. Copy env and fill in secrets
cp .env.example .env

# 2. Start DB
docker compose up -d

# 3. Push schema (first time only)
npx prisma db push

# 4. Start dev server
npm run dev

# Production deploy on VPS
# docker compose -f docker-compose.prod.yml up -d
```
