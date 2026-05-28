# Cafe Board Feature Design

**Date:** 2026-05-28  
**Status:** Draft

---

## Overview

Add a cafe-style community area to the existing Next.js app. The feature includes multiple boards, categories per board, posts, comments, nested replies, and likes on both posts and comments. Access is restricted to authenticated users for both reading and writing, while board management is restricted to administrators.

The initial implementation will define the database and application structure needed for image attachments, but it will not ship a full upload pipeline yet. That keeps the first release focused while preserving a clean path for later media support.

---

## Goals

- Provide a login-only community area that feels like a traditional cafe forum.
- Allow admins to create and manage boards and categories.
- Allow authenticated users to create posts, comments, replies, and likes.
- Support post and comment image attachment data in the schema without building upload infrastructure yet.
- Keep the implementation aligned with the current Next.js App Router, Auth.js, and Prisma setup.

## Non-Goals

- Public read access.
- Guest posting or guest commenting.
- Real image upload storage and processing.
- Email notifications, search, moderation queues, or reporting tools.
- Rich text editor requirements beyond basic text content and optional attachment references.

---

## Product Rules

- Users must be authenticated to view community content.
- Users must be authenticated to create, edit, delete, or like content.
- Only administrators can create, update, or delete boards and categories.
- A post belongs to exactly one board and one category.
- A comment belongs to exactly one post.
- Replies are represented as comments with an optional parent comment.
- A user can like a post or comment at most once.
- Posts and comments can have zero or more attached media references.

---

## Recommended Approach

Use a single in-app community module backed by Prisma tables and server-rendered routes.

Why this approach:
- It matches the current stack and avoids introducing a separate service.
- It keeps authorization simple because all read/write access already flows through Auth.js sessions.
- It makes the future upload implementation easy because attachments can be modeled now and wired up later.

Alternative approaches considered:
- A separate forum service would add unnecessary operational overhead for this codebase.
- A minimal flat comment system would be faster, but it would not fit the requested cafe-style structure.

---

## Information Architecture

The feature should be organized around these concepts:

- Board: top-level forum space managed by admins.
- Category: a board sub-division used to group posts.
- Post: the main content item created by authenticated users.
- Comment: responses on a post, including replies to other comments.
- Like: a user reaction on a post or comment.
- Media attachment: a future-friendly reference record for images or other media.

The UI should feel like a private community space rather than a public blog. Users should land on a board list after login, then drill into categories, posts, and post detail pages.

---

## Data Model

Extend `prisma/schema.prisma` with these models:

- `Board`
  - `id`, `name`, `slug`, `description`, `createdAt`, `updatedAt`
  - `createdById` for auditability
  - relation to `BoardCategory` and `Post`
- `BoardCategory`
  - `id`, `boardId`, `name`, `slug`, `sortOrder`, `createdAt`, `updatedAt`
  - unique per board by slug
- `Post`
  - `id`, `boardId`, `categoryId`, `authorId`, `title`, `content`, `createdAt`, `updatedAt`, `deletedAt?`
  - counts and relations for comments, likes, and media
- `Comment`
  - `id`, `postId`, `authorId`, `parentId?`, `content`, `createdAt`, `updatedAt`, `deletedAt?`
  - self-relation for replies
- `PostLike`
  - `id` or composite unique key on `(postId, userId)`
  - prevents duplicate likes
- `CommentLike`
  - `id` or composite unique key on `(commentId, userId)`
  - prevents duplicate likes
- `MediaAsset`
  - `id`, `ownerId`, `kind`, `storageKey?`, `url?`, `mimeType?`, `width?`, `height?`, `createdAt`
  - nullable links to either `postId` or `commentId`

Implementation note:
- Keep attachment fields generic so the system can later support real uploads without changing the relationship model.
- Use soft delete for posts and comments if moderation or recovery becomes necessary later.

---

## Routes And Pages

Add community routes under the App Router, following the existing authenticated layout pattern:

- Community board list page
- Board detail page with categories and recent posts
- Category-filtered post list page
- Post detail page with comments and replies
- Admin board management pages

Suggested route shape:

- `/community`
- `/community/[boardSlug]`
- `/community/[boardSlug]/[categorySlug]`
- `/community/[boardSlug]/[categorySlug]/new`
- `/community/[boardSlug]/[categorySlug]/[postId]`
- `/admin/boards`

All of these routes should enforce authentication.

---

## Authorization

Reuse the existing Auth.js session flow and add a clear admin check:

- Logged-in users can read and write community content.
- Admins can manage boards and categories.
- Non-admins can never reach board management actions, even if they guess the route.

Recommended implementation detail:
- Add a small role flag to `User` such as `role` with values like `USER` and `ADMIN`, or use a dedicated admin allowlist if role support is not already desired elsewhere in the app.
- Prefer a role field if the feature may expand later, because it keeps admin checks explicit and easy to test.

---

## Upload Strategy

Image attachments are included in the data model only for now.

Planned future upload behavior:
- Store uploaded files in external object storage later.
- Save the returned storage metadata in `MediaAsset`.
- Associate attachments with a post or comment after upload succeeds.

For this first release:
- Do not build the upload UI, upload endpoint, or image processing pipeline.
- Keep the attachment table ready so the next iteration can wire in storage without a schema redesign.

---

## Error Handling

The user experience should handle these cases cleanly:

- Unauthenticated access: redirect to `/login`.
- Non-admin board management attempt: return forbidden or redirect away from admin pages.
- Duplicate like: no-op or return a friendly “already liked” response.
- Reply to missing parent comment: reject with a validation error.
- Empty post or comment content: reject before persistence.
- Missing board/category/post slug or ID: show a not-found state rather than a generic crash.

Errors should be handled on the server wherever possible so the UI stays simple and the failure modes remain deterministic.

---

## Testing Strategy

Add tests around the highest-risk rules:

- Auth-only access to community routes.
- Admin-only access to board management routes.
- Post creation requires a valid board and category.
- Comment replies require an existing parent comment that belongs to the same post.
- Duplicate likes are rejected or ignored consistently.
- Attachment records can be linked to posts or comments without breaking validation.

Recommended test coverage:
- Unit tests for permission helpers and validation helpers.
- Integration tests for Prisma model constraints if the test harness supports a real or test database.
- Route-level tests for unauthorized redirects and forbidden admin access.

---

## Implementation Notes

- Follow the existing App Router structure and keep page responsibilities narrow.
- Keep server actions or route handlers close to the feature they serve.
- Avoid introducing a separate board service layer unless the code starts to repeat.
- Preserve the current Auth.js setup and Prisma adapter approach.

---

## Out Of Scope

- Public boards.
- Anonymous likes.
- Real-time chat.
- Nested reply threads beyond one parent level.
- Full media upload implementation.
- Moderation tools, reports, or search indexing.
