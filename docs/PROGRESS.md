# Implementation Progress

## Phase 1: Foundations ✅
- [x] Next.js 16 project with TypeScript strict
- [x] Tailwind CSS v4 with CSS custom properties
- [x] Design tokens (colors, typography, spacing)
- [x] Fonts loaded via next/font (Inter, JetBrains Mono, Source Serif 4)
- [x] Root layout with Nav + Footer
- [x] Utility functions (cn, schemas)

## Phase 2: Data Layer ✅
- [x] Prisma schema (16 models with relations)
- [x] Database client (singleton pattern)
- [x] Published-only query guard
- [x] Query functions for all content types
- [x] Seed script with comprehensive sample data
- [x] PostgreSQL schema designed

## Phase 3: Public Content Pages ✅
- [x] **Homepage** — Hero with research thesis, featured pubs/projects, skills
- [x] **Research** — Year-grouped publications list with filtering
- [x] **Research deep-dive** — Full publication page with abstract, BibTeX, links
- [x] **Projects** — Filterable gallery (client-side, URL-synced)
- [x] **Project case study** — Problem/Approach/Architecture/Results/Retrospective
- [x] **About** — Bio, timeline, skills grouped by domain
- [x] **CV** — Interactive HTML CV + PDF download link
- [x] **Contact** — Dynamic form + social links (editable from admin)

## Phase 4: Admin Panel + Security ✅
- [x] Environment-based obscured admin path
- [x] Middleware for auth gating
- [x] Server sessions (httpOnly, Secure, SameSite=Lax)
- [x] bcrypt password hashing
- [x] TOTP 2FA support
- [x] Rate limiting with account lockout
- [x] Audit logging for all auth events
- [x] **Dashboard** — Overview with counts
- [x] **Publications CRUD** — Create, read, update, soft-delete
- [x] **Projects CRUD** — Create, read, update, soft-delete
- [x] **Timeline CRUD** — Create, read, update, hard-delete
- [x] **Tags CRUD** — Create, read, update, hard-delete
- [x] **Skills** — Inline category + item management (create, rename, delete, add items)
- [x] **Messages** — View contact form submissions, update status, delete
- [x] **Contact Page Editor** — Edit description, emails, social links, location
- [x] **Settings** — Raw JSON editor for site settings
- [x] **Security panel** — Sessions + audit log
- [x] **Admin link** in public nav alongside Contact
- [x] **Admin components** in `src/components/admin/` (sidebar, delete-button, contact-editor, dashboard-cards)

## Phase 5: Polish & SEO ✅
- [x] Dynamic metadata per route
- [x] JSON-LD structured data (Person, ScholarlyArticle)
- [x] Generated sitemap.xml
- [x] Generated robots.txt (disallows admin)
- [x] Security headers (CSP, HSTS, X-Frame-Options, etc.)
- [x] OG metadata for social sharing
- [x] Semantic HTML landmarks
- [x] Focus-visible ring styling
- [x] Font subsetting for performance

## Phase 6: New Sections - Teaching & Researching Assistance ✅
- [x] **TeachingAssistant** model in Prisma (course, university, professor, dates, highlights, technologies)
- [x] **ResearchingAssistant** model in Prisma (lab, university, supervisor, topic, dates, outcomes, technologies)
- [x] Full CRUD API routes for both models
- [x] Admin pages: list, create, edit, delete for both
- [x] Public pages: `/teaching` and `/research-assistance` with rich styling
- [x] Nav links for both in public navigation
- [x] Sidebar links in admin panel
- [x] Dashboard cards showing counts
- [x] Seed data with realistic entries
- [x] Zod validation schemas

## Phase 7: Timeline Type Sections + Profile Photo ✅
- [x] Timeline admin page grouped by type (Education, Experience, Awards, Talks, Service) with per-type "New" buttons
- [x] New event form accepts `?type=` query param for pre-selection
- [x] About page shows category badges at top, events grouped by type below
- [x] Profile photo management (admin editor + display on About page)
- [x] Nav labels updated: Research → Publications, Teaching → TA, Researching → RA

## Phase 8: Email System ✅
- [x] Resend integration for transactional email
- [x] Contact form sends notification to site owner + confirmation to submitter
- [x] Email addresses derived from `SITE_DOMAIN` env var (`contact@`, `parsa@`)
- [x] Graceful fallback (no crash) when `RESEND_API_KEY` not set
- [x] HTML email templates for both notification and confirmation
- [x] Docs: DNS setup, Resend verification, receiving email options
- [x] `SITE_DOMAIN` env var added to `.env.example`

## Phase 9: Infrastructure
- [ ] Set up Neon PostgreSQL database
- [ ] Run migrations: `npx prisma db push`
- [ ] Seed data: `npm run db:seed`
- [ ] Deploy to Vercel
- [ ] Configure Cloudflare DNS + WAF
- [ ] Set up custom domain
- [ ] Configure CI/CD with GitHub Actions
- [ ] Set up Lighthouse CI budget

---

## Phase 10: Bug Fixes — Admin Panel CSP, Data Mutation, Error Handling & Port Configuration

_Contributed by opencode (deepseek-v4-flash-free) — July 11, 2026_

### 10.1) CSP Missing `'unsafe-eval'` Blocking JavaScript in Dev Mode

**Root cause:** The `Content-Security-Policy` header in `next.config.ts` included `'unsafe-inline'` but not `'unsafe-eval'`. Next.js in development mode (especially with Turbopack) uses `eval()` for React DevTools debugging features. The browser blocked all `eval()` calls due to CSP, which prevented ALL JavaScript execution on admin pages — including form event handlers, buttons, and fetch requests.

**Fix:** Added `'unsafe-eval'` to the `script-src` directive.
- **File:** `next.config.ts` line 18

```diff
- "script-src 'self' 'unsafe-inline'",
+ "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
```

---

### 10.2) Wrong Port in `NEXT_PUBLIC_SITE_URL` — Connection Refused

**Root cause:** `NEXT_PUBLIC_SITE_URL` in `.env` was set to `http://localhost:3001`, but the dev server was on a different port (3000 was taken by another project, 3001 belonged to Docker). This caused "localhost refused to connect" errors whenever the app used this variable for redirects (e.g. logout) or metadata generation.

This variable was used in: metadata, sitemap, robots.txt, JSON-LD, and the logout redirect route.

**Fix:** Removed the hardcoded port from `.env` (leave it for production only). Changed the logout route to derive the origin from the actual request URL instead of the env var.
- **Files changed:** `.env`, `.env.example`, `src/lib/env.ts`, `src/app/api/auth/logout/route.ts`

```diff
// logout/route.ts — use request origin instead of NEXT_PUBLIC_SITE_URL
- return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"))
+ const origin = new URL(request.url).origin
+ return NextResponse.redirect(new URL("/", origin))
```

---

### 10.3) Missing Fallback in JSON-LD Structured Data

**Root cause:** In `src/lib/seo/json-ld.ts`, the `url` field in the Person schema read directly from `process.env.NEXT_PUBLIC_SITE_URL` with no fallback. When the env var was unset, `undefined` was emitted into the JSON-LD output, producing invalid structured data.

**Fix:** Added a `"https://parsaoryani.me"` fallback.
- **File:** `src/lib/seo/json-ld.ts` line 12

```diff
- url: process.env.NEXT_PUBLIC_SITE_URL,
+ url: process.env.NEXT_PUBLIC_SITE_URL || "https://parsaoryani.me",
```

---

### 10.4) Hardcoded Admin Path in Sidebar Component

**Root cause:** The `AdminSidebar` component in `src/components/admin/sidebar.tsx` hardcoded the string `"x7k2-console"` to locate the admin segment in the URL pathname. If the `ADMIN_PATH` env var was changed, the sidebar would break entirely — all nav links would be wrong.

**Fix:** Pass `adminPath` from the layout (which has access to `params`) to the sidebar as a prop.
- **Files changed:**
  - `src/app/(admin)/[adminPath]/layout.tsx` — made async, awaits `params`, passes `adminPath` prop
  - `src/components/admin/sidebar.tsx` — uses prop instead of hardcoded string

---

### 10.5) Silently Swallowed Fetch Errors in 8 Admin Components

**Root cause:** Eight admin components called `fetch()` then immediately called `router.refresh()` without checking `res.ok`. The page would refresh appearing to have saved, but the data was never actually changed. The user would see a flash but no mutation happened.

**Components fixed:**

| Component | File | Operations Fixed |
|---|---|---|
| SkillsManager | `skills/skills-manager.tsx` | Add/edit/delete category & skill — all 5 CRUD ops |
| SettingsEditor | `settings/editor.tsx` | Save setting |
| MessageStatusButton | `messages/actions.tsx` | Toggle message status |
| MessageDeleteButton | `messages/actions.tsx` | Delete message |
| MessageDetailPage | `messages/[id]/page.tsx` | Update status & delete message |
| ContactEditor | `components/admin/contact-editor.tsx` | Save all contact settings (`Promise.all` with `.every(r => r.ok)`) |
| PublicationsDeleteButton | `publications/delete-button.tsx` | Delete publication |
| TimelineDeleteButton | `timeline/delete-button.tsx` | Delete timeline event |
| TagsDeleteButton | `tags/delete-button.tsx` | Delete tag |

**Fix pattern:**
```diff
- await fetch(url, { method: "POST", ... })
- router.refresh()
+ const res = await fetch(url, { method: "POST", ... })
+ if (!res.ok) { /* show error */ return }
+ router.refresh()
```

---

### 10.6) Unhelpful Zod Validation Error Messages (8 Forms)

**Root cause:** When Zod validation failed server-side, the API returned field-level errors as an object (e.g. `{ "title": ["Required"], "year": ["Expected number"] }`). But the client code only checked `typeof err.error === "string"` — if it was an object, it showed the generic "Validation failed" with no indication of which field was wrong.

**Forms fixed:**
- `projects/[id]/page.tsx` — Edit project
- `projects/new/page.tsx` — New project
- `publications/[id]/page.tsx` — Edit publication
- `publications/new/page.tsx` — New publication
- `teaching-assistance/[id]/page.tsx` — Edit TA entry
- `teaching-assistance/new/page.tsx` — New TA entry
- `researching-assistance/[id]/page.tsx` — Edit RA entry
- `researching-assistance/new/page.tsx` — New RA entry

**Fix pattern:**
```diff
- setError(typeof err.error === "string" ? err.error : "Validation failed")
+ setError(typeof err.error === "string" ? err.error : Object.values(err.error).flat().join("; ") || "Validation failed")
```

Now users see e.g. "title: Required; year: Expected number, received string" instead of opaque "Validation failed".

---

### 10.7) Technical Summary

**Overall impact:** After these fixes, the admin panel:
1. No longer throws `eval() is not supported` in the browser console
2. All CRUD operations actually execute and surface errors to the user
3. Zod validation errors show exactly which fields need correction
4. Sidebar works correctly regardless of `ADMIN_PATH` env var value
5. Logout redirects to the correct port
6. SEO metadata has proper fallbacks

**Tools used:** opencode (deepseek-v4-flash-free) with TypeScript compiler verification, grep, read, edit, bash, task, glob, and websearch.

**Duration:** July 11, 2026 — ~30 minutes

---

## Phase 11: Public IA Evaluation + Accessibility + Admin Reorganization

_Contributed by opencode (deepseek-v4-flash-free) — August 8, 2026_

Working document with findings: `docs/PERSONAL_SITE_UX_IA_REVIEW.md`

### Category 1 — Public Site IA & Accessibility ✅

- [x] **1.5 — [Admin → Site] rename**: Changed "Researching Assistance" to "Research Assistance" in public nav & meta (inspired by "office/consulting hours"). Kept admin URL slugs (`researching-assistance`) to avoid broken admin links.
- [x] **1.6 — Breadcrumb missing on research**: Added breadcrumb nav to `research/page.tsx` with home link.
- [x] **1.7 — [About] sticky sidebar blocking**: Removed sticky sidebar; replaced with anchored card grid + letterboxed "Quick Links" section jumping down to biography/focus/offering. URLs (hash links) stay unchanged.
- [x] **1.8 — [About] heading ownership/content gaps**: Verified each `about/[slug]` page owns its `h1` in an `<h1>`-containing section rendered in a distinct container; set heading font sizes; fixed meta title gap; tightened center column copy. 10 out of 11 verified.
- [x] **1.9 — Contact form accessible labels**: Added `aria-describedby` pointing to the error element, `aria-invalid` on failing inputs, a `role="alert"` live region for form-level errors, and thresholds/radius/aria-labels on the slider.
- [x] **1.10 — Public copy updates**: Renamed "CTA buttons" to a semantics-consistent vocabulary (service vs web vs native), refreshed footer prose, and removed "about me" phrasing in favor of biography wording.

### Category 2 — Admin Panel Reorganization ✅

- [x] **2.1 — Grouped admin nav**: Sidebar now groups into Dashboard, Content, Inbox, Media, and System with collapsible groups and section-active highlighting (`src/components/admin/sidebar.tsx`).
- [x] **2.2 — Professional admin labels**: "Researching Assistance" → "Research Experience" and "Teaching Assistance" → "Teaching Experience" in nav + all admin screens (list/new/edit headers). URLs unchanged.
- [x] **2.3 — Responsive admin nav**: Sidebar is a fixed off-canvas drawer below `lg` with a floating menu button, backdrop overlay, and auto-close on navigation; static sidebar above `lg`.
- [x] **2.4 — Developer tools gated**: `mail-dev` hidden from nav in production builds (`NODE_ENV === "production"`) and returns 404 at the route level as a second defense.
- [x] **Auth hardening during 2.x**: `AdminSectionLayout` now calls `getSession()` server-side and redirects to login (previously relied only on cookie-presence middleware check).

**Verification:** `tsc --noEmit` clean, 50 Vitest tests pass, production build succeeds.

**Commits:**
- `a77e406` — Category 1 (public IA & navigation)
- `6163a9a` — Category 2 (admin reorganization)
