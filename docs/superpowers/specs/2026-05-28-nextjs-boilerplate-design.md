# Next.js Boilerplate Design

**Date:** 2026-05-28  
**Status:** Approved

---

## Overview

A production-ready Next.js boilerplate for self-hosted VPS deployment. Includes TailwindCSS, shadcn/ui, Google OAuth via Auth.js v5, PostgreSQL with Prisma ORM, and pre-built UI pages (login, dashboard with sidebar).

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) |
| Styling | TailwindCSS v4 |
| UI Components | shadcn/ui |
| Authentication | Auth.js v5 (NextAuth) — Google OAuth |
| ORM | Prisma |
| Database | PostgreSQL 16 |
| Containerization | Docker Compose |

---

## Project Structure

```
my-app/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/           # Login page
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx       # Sidebar layout wrapper
│   │   │   └── dashboard/       # Dashboard home page
│   │   └── api/
│   │       └── auth/[...nextauth]/  # Auth.js route handler
│   ├── components/
│   │   ├── ui/                  # shadcn components
│   │   └── layout/              # Sidebar, Header
│   ├── lib/
│   │   ├── auth.ts              # NextAuth config
│   │   ├── db.ts                # Prisma singleton
│   │   └── utils.ts             # cn() and helpers
│   └── middleware.ts            # Route protection
├── prisma/
│   └── schema.prisma
├── docker-compose.yml           # Development
├── docker-compose.prod.yml      # Production
├── Dockerfile                   # Multi-stage build
└── .env.example
```

---

## Docker Compose

### Development (`docker-compose.yml`)

- **app** service: Next.js dev server with hot reload via volume mounts
- **db** service: PostgreSQL 16 Alpine, data persisted via named volume
- App connects to DB via internal Docker network (`db:5432`)

### Production (`docker-compose.prod.yml`)

- **app** service: runs built image, no volume mounts
- **db** service: same PostgreSQL image, same named volume
- Dockerfile uses multi-stage build: `builder` stage runs `next build`, `runner` stage copies output for minimal image size

### Environment Variables (`.env`)

```env
DATABASE_URL="postgresql://postgres:password@db:5432/myapp"
AUTH_SECRET="..."           # openssl rand -base64 32
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
```

---

## Database Schema (Prisma)

Auth.js v5 requires specific tables managed via `@auth/prisma-adapter`:

- **User** — `id`, `name`, `email`, `emailVerified`, `image`, `createdAt`
- **Account** — OAuth account links per user
- **Session** — active sessions
- **VerificationToken** — email verification tokens

All schemas follow the Auth.js Prisma Adapter spec exactly to ensure compatibility.

---

## Authentication

**Provider:** Google OAuth only  
**Adapter:** `@auth/prisma-adapter` — stores users/sessions in PostgreSQL  
**Session strategy:** Database sessions (default for adapter-based setup)

**Flow:**
1. Unauthenticated user visits `/dashboard/*` → middleware redirects to `/login`
2. User clicks "Continue with Google" → Google OAuth flow
3. On callback, Prisma Adapter auto-creates User + Account records
4. Session issued, user redirected to `/dashboard`
5. Server components use `auth()` to read session; client components use `useSession()`

**Route protection (`middleware.ts`):**
```ts
export { auth as middleware } from "@/lib/auth"
export const config = { matcher: ["/dashboard/:path*"] }
```

---

## UI Pages & Components

### Pre-installed shadcn Components

`button`, `card`, `input`, `form`, `dialog`, `dropdown-menu`, `avatar`, `separator`, `toast`, `skeleton`, `badge`

### Login Page (`/login`)

- Centered card layout
- App name / logo
- Single "Continue with Google" button
- Note: account auto-created on first login

### Dashboard Layout (`/(dashboard)/layout.tsx`)

- Fixed sidebar (left): app logo, nav links, bottom user avatar + name + logout
- Header (top): page title/breadcrumb, right-side user dropdown (profile info, logout)
- `{children}` rendered in main content area

### Dashboard Home (`/dashboard`)

- 3 stat cards (placeholder data, ready to wire up)
- Empty content area below cards

---

## Error Handling

- Auth errors (OAuth failure, session expired) handled by Auth.js built-in error page, overridable via `pages.error` config
- DB connection errors surface as 500 at the Next.js level; Prisma client singleton prevents connection pool exhaustion
- Missing env vars: app fails fast at startup with a clear Prisma/Auth.js error

---

## Testing

No test setup included in the boilerplate — intentionally omitted to keep it minimal. Projects built on top can add Vitest + Testing Library or Playwright as needed.

---

## Out of Scope

- Email/password auth (Google OAuth only)
- Role-based access control (RBAC)
- Redis / caching layer
- CI/CD pipeline
- Turborepo / monorepo structure
