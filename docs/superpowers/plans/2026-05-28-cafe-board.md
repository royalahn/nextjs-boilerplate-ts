# Cafe Board Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a login-only cafe-style community area with multiple boards, categories, posts, comments, replies, likes, and placeholder media attachment support, while keeping board management admin-only.

**Architecture:** Keep the feature inside the existing Next.js App Router app and reuse Auth.js sessions plus Prisma for all data access. Model the community as a small domain layer with explicit helpers for authorization and query composition, then expose it through authenticated server-rendered routes and server actions. Treat media attachments as a schema-first capability for now so the upload pipeline can be added later without changing the core data model.

**Tech Stack:** Next.js 16 App Router, Auth.js v5, Prisma 7, PostgreSQL, TypeScript, React server actions, Vitest for focused unit tests.

---

### Task 1: Add admin role plumbing and test harness

**Files:**
- Modify: `package.json`
- Modify: `prisma/schema.prisma`
- Modify: `src/lib/auth.ts`
- Modify: `src/types/next-auth.d.ts`
- Create: `src/lib/admin.ts`
- Create: `src/lib/admin.test.ts`
- Modify: `.env.example`
- Modify: `README.md`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest"
import { isAdminEmailList } from "./admin"

describe("isAdminEmailList", () => {
  it("matches emails case-insensitively", () => {
    expect(isAdminEmailList("Hugh@example.com", "hugh@example.com,admin@example.com")).toBe(true)
  })

  it("returns false for missing or unrelated emails", () => {
    expect(isAdminEmailList(null, "admin@example.com")).toBe(false)
    expect(isAdminEmailList("user@example.com", "admin@example.com")).toBe(false)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/admin.test.ts`
Expected: fail because `src/lib/admin.ts` does not exist yet.

- [ ] **Step 3: Implement the minimal auth/admin plumbing**

```ts
// src/lib/admin.ts
export function isAdminEmailList(email: string | null | undefined, csv: string | undefined) {
  if (!email || !csv) return false
  const allowed = csv.split(",").map((value) => value.trim().toLowerCase()).filter(Boolean)
  return allowed.includes(email.toLowerCase())
}
```

Update `src/lib/auth.ts` to map the authenticated user's email to `role = "ADMIN"` when it matches `process.env.ADMIN_EMAILS`, and include `role` in the session callback so the UI can read it without another DB round-trip.

Add `ADMIN_EMAILS` to `.env.example` and document that it is a comma-separated list of email addresses allowed to manage boards.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/admin.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json prisma/schema.prisma src/lib/auth.ts src/types/next-auth.d.ts src/lib/admin.ts src/lib/admin.test.ts vitest.config.ts vitest.setup.ts .env.example README.md
git commit -m "feat: add admin role plumbing"
```

---

### Task 2: Add community database schema

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `src/lib/db.ts` if schema naming changes require it
- Create: `src/lib/community-types.ts`

- [ ] **Step 1: Write the failing schema validation check**

Run: `npx prisma validate`
Expected: fail until the new community models and relations are added.

- [ ] **Step 2: Implement the Prisma models**

Add models for:

```prisma
model Board {
  id          String          @id @default(cuid())
  name        String
  slug        String          @unique
  description String?
  createdById String
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  createdBy   User            @relation(fields: [createdById], references: [id], onDelete: Restrict)
  categories  BoardCategory[]
  posts       Post[]
}

model BoardCategory {
  id        String   @id @default(cuid())
  boardId   String
  name      String
  slug      String
  sortOrder Int      @default(0)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  board     Board    @relation(fields: [boardId], references: [id], onDelete: Cascade)
  posts     Post[]

  @@unique([boardId, slug])
}

model Post {
  id          String    @id @default(cuid())
  boardId     String
  categoryId  String
  authorId    String
  title       String
  content     String
  deletedAt   DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  board       Board          @relation(fields: [boardId], references: [id], onDelete: Cascade)
  category    BoardCategory  @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  author      User           @relation(fields: [authorId], references: [id], onDelete: Restrict)
  comments    Comment[]
  likes       PostLike[]
  media       MediaAsset[]
}

model Comment {
  id         String    @id @default(cuid())
  postId     String
  authorId   String
  parentId   String?
  content    String
  deletedAt  DateTime?
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt

  post       Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  author     User      @relation(fields: [authorId], references: [id], onDelete: Restrict)
  parent     Comment?  @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  replies    Comment[] @relation("CommentReplies")
  likes      CommentLike[]
  media      MediaAsset[]
}

model PostLike {
  id        String   @id @default(cuid())
  postId    String
  userId    String
  createdAt DateTime @default(now())

  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([postId, userId])
}

model CommentLike {
  id        String   @id @default(cuid())
  commentId String
  userId    String
  createdAt DateTime @default(now())

  comment   Comment  @relation(fields: [commentId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([commentId, userId])
}

model MediaAsset {
  id         String   @id @default(cuid())
  ownerId    String
  postId     String?
  commentId  String?
  kind       String
  storageKey String?
  url        String?
  mimeType   String?
  width      Int?
  height     Int?
  createdAt  DateTime @default(now())

  owner      User     @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  post       Post?    @relation(fields: [postId], references: [id], onDelete: Cascade)
  comment    Comment? @relation(fields: [commentId], references: [id], onDelete: Cascade)
}
```

Use these rules:
- `Board.slug` unique
- `BoardCategory` unique per board by `boardId + slug`
- `Post` belongs to one board and one category
- `Comment.parentId` is optional for replies
- `PostLike` unique per `postId + userId`
- `CommentLike` unique per `commentId + userId`
- `MediaAsset` can optionally link to either a post or a comment

- [ ] **Step 3: Run schema validation and client generation**

Run:

```bash
npx prisma validate
npx prisma generate
```

Expected: both commands pass.

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma src/lib/community-types.ts
git commit -m "feat: add community schema"
```

---

### Task 3: Build authenticated community read routes

**Files:**
- Create: `src/lib/community.ts`
- Create: `src/app/(dashboard)/community/page.tsx`
- Create: `src/app/(dashboard)/community/[boardSlug]/page.tsx`
- Create: `src/app/(dashboard)/community/[boardSlug]/[categorySlug]/page.tsx`
- Create: `src/components/community/board-list.tsx`
- Create: `src/components/community/post-preview.tsx`
- Create: `src/lib/community.test.ts`

- [ ] **Step 1: Write the failing route rendering check**

Add a helper test for the query shape:

```ts
import { describe, expect, it } from "vitest"
import { normalizeBoardSlug } from "./community"

describe("normalizeBoardSlug", () => {
  it("normalizes slugs for safe routing", () => {
    expect(normalizeBoardSlug("  General Chat ")).toBe("general-chat")
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/community.test.ts`
Expected: fail until the helper exists.

- [ ] **Step 3: Implement the community read layer**

Create `src/lib/community.ts` with:
- slug normalization
- board/category/post listing queries
- server-side 404 helpers for missing board/category/post
- authenticated access checks that reuse `auth()`

Build the pages so they render:
- community board list
- board detail with category list and recent posts
- category-filtered post list

- [ ] **Step 4: Run the app build**

Run: `npm run build`
Expected: pass, with the new authenticated routes included.

- [ ] **Step 5: Commit**

```bash
git add src/lib/community.ts src/app/(dashboard)/community src/components/community
git commit -m "feat: add community read routes"
```

---

### Task 4: Add posts, comments, replies, and likes

**Files:**
- Create: `src/app/(dashboard)/community/[boardSlug]/[categorySlug]/new/page.tsx`
- Create: `src/app/(dashboard)/community/[boardSlug]/[categorySlug]/[postId]/page.tsx`
- Create: `src/app/(dashboard)/community/actions.ts`
- Create: `src/components/community/post-form.tsx`
- Create: `src/components/community/comment-form.tsx`
- Create: `src/components/community/like-button.tsx`
- Create: `src/lib/community.test.ts`

- [ ] **Step 1: Write the failing validation test**

```ts
import { describe, expect, it } from "vitest"
import { validateReplyTarget } from "./community"

describe("validateReplyTarget", () => {
  it("rejects parent comments from another post", () => {
    expect(() =>
      validateReplyTarget({ postId: "post-a", parentCommentPostId: "post-b" }),
    ).toThrow()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/community.test.ts`
Expected: fail until the helper exists.

- [ ] **Step 3: Implement server actions**

Add actions for:
- create post
- create comment
- create reply
- toggle post like
- toggle comment like

Enforce:
- authenticated user required
- non-empty content
- parent comment must belong to the same post
- duplicate likes are rejected or ignored consistently

- [ ] **Step 4: Run the build and targeted checks**

Run:

```bash
npm run build
npx vitest run src/lib/community.test.ts src/lib/admin.test.ts
```

Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git add src/app/(dashboard)/community src/components/community src/lib/community.ts
git commit -m "feat: add posts comments and likes"
```

---

### Task 5: Add admin board management

**Files:**
- Create: `src/app/(dashboard)/admin/boards/page.tsx`
- Create: `src/app/(dashboard)/admin/boards/actions.ts`
- Create: `src/components/admin/board-form.tsx`
- Create: `src/components/admin/category-form.tsx`
- Create: `src/lib/board-admin.ts`
- Create: `src/lib/board-admin.test.ts`

- [ ] **Step 1: Write the failing admin access test**

```ts
import { describe, expect, it } from "vitest"
import { canManageBoards } from "./board-admin"

describe("canManageBoards", () => {
  it("only allows admin users", () => {
    expect(canManageBoards({ role: "ADMIN" })).toBe(true)
    expect(canManageBoards({ role: "USER" })).toBe(false)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/board-admin.test.ts`
Expected: fail until the helper exists.

- [ ] **Step 3: Implement admin-only board CRUD**

Add create/update/delete flows for:
- boards
- categories inside a board

Gate every action on the admin helper and keep the UI server-rendered to avoid leaking admin controls to regular users.

- [ ] **Step 4: Run the build and targeted checks**

Run: `npm run build`
Expected: pass.

- [ ] **Step 5: Commit**

```bash
git add src/app/(dashboard)/admin src/components/admin src/lib/board-admin.ts
git commit -m "feat: add board administration"
```

---

### Task 6: Verification and release cleanup

**Files:**
- Modify: `README.md`
- Modify: `.env.example`
- Modify: `docs/superpowers/specs/2026-05-28-cafe-board-design.md` if implementation diverges

- [ ] **Step 1: Verify the full workflow**

Run:

```bash
npm run build
npx vitest run
```

Expected: both pass.

- [ ] **Step 2: Confirm runtime behavior**

Manually verify:
- unauthenticated users are redirected to `/login`
- authenticated users can read community pages
- non-admin users cannot access board management
- likes, comments, and replies persist correctly

- [ ] **Step 3: Update docs**

Document:
- `ADMIN_EMAILS`
- any new route paths
- the fact that media uploads are schema-only for now

- [ ] **Step 4: Commit**

```bash
git add README.md .env.example docs/superpowers/specs/2026-05-28-cafe-board-design.md
git commit -m "docs: finalize cafe board implementation notes"
```

---

### Scope Check

This feature is intentionally kept as one implementation plan because the board/category/post/comment system shares a single authorization model and a single data model. If the media upload UI turns out to require a separate storage integration, split that into a follow-up plan after the core community area is working.
