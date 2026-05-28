# Miro-Style UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the Miro-inspired visual system from `DESIGN.md` across the app shell, auth flow, dashboard, and community surfaces.

**Architecture:** We will shift the app toward a bright white canvas with black pill CTAs, warmer rounded cards, and soft pastel accents. The implementation is centered on shared primitives first (`button`, `card`, `badge`, `input`, global layout/theme), then the visible pages that need the strongest visual treatment (`login`, `dashboard`, `community`, `admin`). This keeps the design coherent while minimizing duplicated styling.

**Tech Stack:** Next.js App Router, Tailwind CSS v4, shadcn/ui primitives, next/font/google, TypeScript.

---

### Task 1: Establish the Miro-style global theme

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update the root font and page chrome**

```tsx
import type { Metadata } from "next"
import { Manrope, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})
```

- [ ] **Step 2: Add the white-canvas theme tokens and subtle background texture**

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.16 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.16 0 0);
  --primary: oklch(0.16 0 0);
  --primary-foreground: oklch(0.985 0 0);
}

body {
  @apply bg-background text-foreground antialiased;
  background-image:
    radial-gradient(circle at top left, rgba(255, 214, 0, 0.12), transparent 28%),
    radial-gradient(circle at top right, rgba(68, 122, 255, 0.08), transparent 22%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 1));
}
```

- [ ] **Step 3: Run the build once to make sure the new font/token wiring compiles**

Run: `npm run build`
Expected: PASS

### Task 2: Restyle shared UI primitives

**Files:**
- Modify: `src/components/ui/button.tsx`
- Modify: `src/components/ui/card.tsx`
- Modify: `src/components/ui/badge.tsx`
- Modify: `src/components/ui/input.tsx`
- Modify: `src/components/layout/sidebar.tsx`
- Modify: `src/components/layout/header.tsx`

- [ ] **Step 1: Convert buttons to black pill CTAs and add the yellow/outline variants**

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full border border-transparent px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-black text-white",
        outline: "border-black/15 bg-transparent text-black",
        secondary: "bg-black/5 text-black",
        ghost: "bg-transparent text-black",
        destructive: "bg-red-500 text-white",
        link: "bg-transparent px-0 text-blue-600 underline-offset-4",
      },
      size: {
        default: "h-10",
        sm: "h-9 px-3",
        lg: "h-11 px-5",
        icon: "h-10 w-10 px-0",
        "icon-sm": "h-9 w-9 px-0",
      },
    },
  }
)
```

- [ ] **Step 2: Make cards feel like rounded Miro surfaces**

```tsx
className={cn(
  "group/card flex flex-col gap-4 overflow-hidden rounded-[28px] bg-card py-4 text-sm text-card-foreground ring-1 ring-black/10",
  className
)}
```

- [ ] **Step 3: Make badges fully pill-shaped and visually quieter**

```tsx
className={cn(
  "inline-flex h-5 w-fit items-center justify-center rounded-full px-2.5 text-xs font-medium",
  className
)}
```

- [ ] **Step 4: Give inputs the softer, more spacious field treatment**

```tsx
className={cn(
  "h-11 w-full min-w-0 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none placeholder:text-zinc-400 focus-visible:border-black/30",
  className
)}
```

- [ ] **Step 5: Update the sidebar and header to read like a white canvas app shell**

```tsx
<aside className="flex h-screen w-64 flex-col border-r border-black/10 bg-white/90 px-3 py-4 backdrop-blur">
```

### Task 3: Refresh the most visible app screens

**Files:**
- Modify: `src/app/(auth)/login/page.tsx`
- Modify: `src/app/(dashboard)/dashboard/page.tsx`
- Modify: `src/app/(dashboard)/community/page.tsx`
- Modify: `src/app/(dashboard)/community/[boardSlug]/page.tsx`
- Modify: `src/app/(dashboard)/community/[boardSlug]/[categorySlug]/page.tsx`
- Modify: `src/app/(dashboard)/community/[boardSlug]/[categorySlug]/new/page.tsx`
- Modify: `src/app/(dashboard)/community/[boardSlug]/[categorySlug]/[postId]/page.tsx`
- Modify: `src/app/(dashboard)/admin/boards/page.tsx`

- [ ] **Step 1: Turn the login page into a split hero with a Miro-like board illustration**

```tsx
<div className="grid min-h-screen gap-8 bg-white px-6 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
```

- [ ] **Step 2: Replace the dashboard placeholder with a polished overview**

```tsx
<div className="grid gap-4 md:grid-cols-3">
  <Card className="bg-white">
    ...
  </Card>
</div>
```

- [ ] **Step 3: Add Miro-style section spacing, pastel surfaces, and pill actions to community pages**

```tsx
<Button asChild className="rounded-full bg-black text-white">
  <Link href={`/community/${board.slug}/${category.slug}/new`}>Write a post</Link>
</Button>
```

- [ ] **Step 4: Make the admin boards screen feel like a curated control surface**

```tsx
<div className="grid gap-4 lg:grid-cols-2">
```

### Task 4: Verify the visual refactor

**Files:**
- None

- [ ] **Step 1: Run the type/build checks**

Run: `npm run build`
Expected: PASS

- [ ] **Step 2: Run the test suite**

Run: `npx vitest run`
Expected: PASS

- [ ] **Step 3: Inspect the app in the browser and commit the result**

Run: `npm run dev`
Expected: the login, dashboard, and community pages share the new white-canvas Miro-inspired visual system.
