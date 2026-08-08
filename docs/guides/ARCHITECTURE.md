# Architecture guide

## Overview

This is a Next.js 16 App Router portfolio for Parsa Oryani. The public application renders research, projects, experience, biography, CV, and contact content. The private admin application edits that content through server-validated routes and Prisma-backed records.

## Stack

- **Framework:** Next.js 16 App Router with TypeScript strict mode
- **UI:** React 19, Tailwind CSS v4, CSS custom properties, Framer Motion
- **Database:** PostgreSQL through Prisma 6
- **Authentication:** bcryptjs password hashing, server sessions, optional TOTP 2FA
- **Validation:** Zod schemas shared by API and form boundaries
- **Testing:** Vitest, Testing Library, jsdom
- **Deployment:** Vercel or the repository Docker/deployment scripts

## Runtime boundaries

```text
src/app/
  (public)/                 Public route group; page composition and metadata
  (admin)/[adminPath]/      Admin route group; owner-only management screens
  api/                      Server route handlers and mutation boundaries
  layout.tsx                Root metadata, fonts, and global shell
  sitemap.ts / robots.ts    Search-engine output

src/components/
  ui/                       Reusable design-system primitives
  layout/                   Header, footer, container, client shell
  content/                  Public content cards, filters, and forms
  admin/                    Admin editors, lists, and management controls

src/lib/
  auth/                     Session, password, TOTP, and authorization helpers
  db/                       Prisma client, query functions, and result helpers
  validation/               Input schemas at API/form seams
  content/                  Profile and editorial content adapters
  home/                     Homepage-specific view-model logic
  utils/                    Small shared utilities

prisma/                     Schema and migrations
scripts/                    Seed, database, deployment, and setup commands
docs/                       Guides, reviews, status notes, and plans
```

Next.js route directories are framework-owned. Keep route groups such as `(public)` and `(admin)`, and keep the obscured `[adminPath]` segment aligned with `ADMIN_PATH`. Do not move reusable code into route folders merely to shorten an import; route-specific code belongs beside the route, while shared behavior belongs behind a `src/lib` or `src/components` interface.

## Public route families

| Route family | Responsibility |
|---|---|
| `/` | Research-first introduction, selected publications/projects/experience, and primary actions |
| `/research` and `/research/[slug]` | Publication index and scholarly detail pages |
| `/projects` and `/projects/[slug]` | Filterable project index and case studies |
| `/research-assistance` | Research assistantship experience |
| `/teaching` | Teaching assistantship experience |
| `/about` | Biography, education, timeline, recognition, courses, and skills |
| `/cv` | HTML CV and PDF action |
| `/contact` | Contact form and contact methods |

## Admin and API

Admin screens live below `src/app/(admin)/[adminPath]`. They preserve the existing public/admin capability set while grouping navigation by Content, Inbox, Media, and System. API handlers live under `src/app/api/<domain>` and are the mutation seam: they validate input, authorize the session, update Prisma records, and revalidate affected public paths.

The current domain API families are auth, contact, courses, messages, photo/profile, preview, projects, publications, research/teaching experience, settings, skills, tags, timeline, upload, and revalidation. Keep API route names stable unless a versioned migration is intentionally planned.

## Data model

The Prisma schema currently defines 18 models and 9 enums, including publications, projects, tags and join records, timeline/courses/resources, skills, media, users/sessions/audit logs, pending 2FA challenges, revisions, contact messages, site settings, and teaching/research experience. `prisma/schema.prisma` is the source of truth; migrations under `prisma/migrations` are append-only deployment history.

## Rendering and caching

- Public index/detail pages use Next.js server rendering with route-level revalidation where declared.
- Publication and project detail pages provide `generateStaticParams` for known slugs.
- Admin pages and mutation APIs remain dynamic and session-protected.
- `/api/revalidate` is the explicit cache-invalidation seam after content mutations.
- Draft/private records must never enter public queries, sitemap output, or structured data.

## Security

- `ADMIN_PATH` obscures the admin URL but is not an authorization mechanism.
- Server-side session validation is required for admin pages and mutations.
- Cookies are httpOnly and use secure production settings.
- Password attempts and sensitive mutations are rate-limited/audited where configured.
- `robots.ts` disallows the admin path and `/api` from crawlers.
- Security claims and accessibility conformance must be verified against the running application; this document does not substitute for an audit.

## Change discipline

1. Find the existing module and its callers before moving it.
2. Preserve route/API names and public URLs unless the change includes redirects and migration tests.
3. Prefer a deep domain module with a small interface over duplicating query/auth logic in pages.
4. Add or update focused tests at the changed interface.
5. Run lint, typecheck, tests, and build before claiming the change is complete.
