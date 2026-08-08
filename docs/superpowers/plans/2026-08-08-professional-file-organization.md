# Professional File Organization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task with verification checkpoints.

**Goal:** Make the repository easier to navigate and maintain by organizing documentation by purpose, keeping Next.js runtime boundaries stable, and documenting the canonical code layout without breaking imports, routes, scripts, or deployment.

**Architecture:** Keep framework-owned Next.js route directories in `src/app` and domain modules in `src/lib`, `src/components`, `src/types`, and `src/styles`. Organize durable documentation into `docs/guides`, `docs/reviews`, `docs/status`, and `docs/superpowers/plans`; keep root files limited to repository entry points and tool configuration. Use an index and canonical links so contributors can find the right document without relying on filenames or stale paths.

**Tech Stack:** Next.js 16 App Router, TypeScript, Prisma, Vitest, ESLint, npm scripts, Markdown.

## Global Constraints

- Preserve all public routes, admin routes, API routes, scripts, imports, and deployment behavior.
- Do not rename dynamic route segments or route groups solely for aesthetics.
- Use `apply_patch` for file edits and `git mv` only for explicit documentation moves.
- Every moved document must have its inbound references updated in the same change.
- Documentation must distinguish current files from historical references to removed files.

---

### Task 1: Create the documentation taxonomy and index

**Files:**
- Create: `docs/README.md`
- Create: `docs/reviews/.gitkeep` only if the directory cannot otherwise be represented
- Create: `docs/status/.gitkeep` only if the directory cannot otherwise be represented

**Interfaces:**
- Produces canonical links for guides, reviews, status, and implementation plans.

- [x] Add a concise documentation map with purpose, audience, and canonical links.
- [x] State that `src/app` route folders are framework-owned and should not be flattened.

### Task 2: Move documents by purpose

**Files:**
- Move: `docs/guides/PERSONAL_SITE_UX_IA_REVIEW.md` → `docs/reviews/PERSONAL_SITE_UX_IA_REVIEW.md`
- Move: `docs/PROGRESS.md` → `docs/status/PROGRESS.md`
- Modify: every tracked Markdown reference to those paths.

**Interfaces:**
- Existing document contents remain unchanged except for path references.

- [x] Move only the two documents whose current locations conflict with their purpose.
- [x] Keep architecture, usage, and blueprint material under `docs/guides`.
- [x] Verify there are no stale references to the old paths.

### Task 3: Document the canonical source layout

**Files:**
- Modify: `README.md`
- Modify: `docs/guides/ARCHITECTURE.md`
- Modify: `docs/guides/USAGE.md` only where its tree is stale.

**Interfaces:**
- Contributors use `README.md` as the entry point and `docs/guides/ARCHITECTURE.md` for deeper structure.

- [x] Replace the generated Next.js README with project-specific setup, commands, route groups, domain modules, scripts, database, and documentation links.
- [x] Explain that `src/app/(public)` and `src/app/(admin)` are route groups, while `src/app/api` is the server API surface.
- [x] Explain naming conventions: kebab-case files, route-owned helpers next to routes, reusable UI in `components`, domain/query/auth modules in `lib`.
- [x] Remove references to deleted `dashboard-cards`, `skeleton`, `src/lib/env`, and `src/lib/seo` files from living documentation; preserve such mentions only in historical progress notes with an explicit historical label if needed.

### Task 4: Verify and record repository integrity

**Files:**
- Modify: none unless verification finds a stale reference.

**Interfaces:**
- The repository remains buildable with existing npm scripts.

- [ ] Run `git diff --check`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm test -- --run` or the repository's supported test command.
- [ ] Run `npm run build` if environment variables allow it; otherwise record the exact blocker.
- [ ] Verify `git status`, moved-file detection, and no references to removed documentation paths.
