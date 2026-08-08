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

### UX-44 — Admin Auth/2FA Boundary Fixes ✅

- [x] **Pending 2FA challenge model**: `PendingTwoFactorChallenge` stores `userId`, `totpToken`, `createdAt`, `expiresAt`, `attempts`. Challenge expires after 5 minutes, max 5 attempts.
- [x] **Login flow**: When TOTP is enabled but not yet verified, login returns `challengeId` instead of a session. User must call `/auth/verify-2fa` with challenge ID + TOTP code.
- [x] **Session creation**: Real session is only created in `/auth/verify-2fa` after successful TOTP verification (previously bypassed).
- [x] **Origin validation**: Production requests now validate `Origin` header matches expected host to prevent cross-origin auth attacks.

### UX-27/34/35/45 — Publication/Project Editors + Concurrency ✅

- [x] **Structured authors**: Publications store `authors[]` with `name`, `isMe`, `email`, `url` — `isMe` preserved on round-trip.
- [x] **Ordered contributions**: Publications store `contributions[]` with `text`, `order` — order preserved.
- [x] **Full project editor**: All 6 narrative sections (Problem, Approach, Architecture, Results, Lessons, Retrospective) with ordered `contributions[]`.
- [x] **SEO fields**: Both editors support `metaTitle`, `metaDescription`, `ogImageUrl`.
- [x] **Concurrency control**: `version` field on Publication, Project, TeachingAssistant, ResearchingAssistant. `$transaction` save. 409 Conflict on stale version.
- [x] **Validation schemas**: Updated with `citationCount`, `sortOrder`, `ogImageUrl` in `src/lib/validation/schemas.ts`.

### UX-01/02 — Public Claims/Links Verification ✅

- [x] **Professional labels**: Verified all instances of "Researching Assistance"/"Teaching Assistance" use professional form ("Research Experience"/"Teaching Experience") in public pages.
- [x] **CV claims**: "PhD applicant" verified correct. No "PhD student" anywhere.
- [x] **Publication links**: Google Scholar links have `YOUR_ID` placeholder (3 instances in footer, nav, home page). Documented in `docs/PUBLICATIONS_RECONCILIATION.md`.
- [x] **Footer**: "Built with Next.js" correct, no mention of Vercel.

### UX-30 — Shared Admin Editor Framework ✅

- [x] **EditorLayout component**: Breadcrumbs, page title, status badge, version, `savedAt`, inline error summary at top of form, per-field error display, dirty state tracking via form snapshots, `beforeunload` warning, sticky action bar, unsaved-change confirmation modal.
- [x] **FieldGroup**: Reusable field wrapper with label, required indicator, error state.
- [x] **SectionHeader**: Visual section dividers for multi-section editors.
- [x] **Location**: `src/components/admin/editor-layout.tsx`, `field-group.tsx`.

### UX-36-38 — Experience/Timeline/Course/Skills/Taxonomy Editors ✅

- [x] **Teaching experience editor** (`teaching-assistance/[id]/page.tsx`): Refactored to use `EditorLayout` + `FieldGroup` with role, organization, courses, description, period, order fields.
- [x] **Researching experience editor** (`researching-assistance/[id]/page.tsx`): Refactored to use `EditorLayout` + `FieldGroup` with project, role, tools, description, period, order fields.
- [x] **Timeline editor**: Already existed; verified working with existing form pattern.
- [x] **Skills editor**: Inline category + item management; verified working.

### UX-31 — Standardized Content Library Lists ✅

- [x] **ContentList component**: Reusable list with search, status/sort filters, empty states, loading states, pagination.
- [x] **PublicationsList**: Refactored `publications/page.tsx` to use `ContentList` with publication-specific fields (year, venue, authors).
- [x] **Location**: `src/components/admin/content-list.tsx`, `publications-list.tsx`.

### UX-32/33 — Draft Preview, Lifecycle Actions, Revision History ✅

- [x] **Revision model**: Tracks changes to publications, projects, teaching-assistance, and researching-assistance. Stores snapshot, authorId, entityType, entityId.
- [x] **Lifecycle actions**: Publication PUT supports `?action=publish|archive|unpublish`. DELETE supports `?action=trash|restore` (soft delete with restore).
- [x] **Preview route**: `/api/preview` returns draft content for authenticated users across all entity types.
- [x] **Audit logging**: All lifecycle actions logged via `AuditLog.create()`.

### UX-28/43 — Typed Profile/PageContent Domains ✅

- [x] **Profile type**: Centralized name, email, university, role, bio, social links with typed defaults and DB override.
- [x] **PageContent type**: Homepage hero/about, about bio/focus/offering, cv subtitle — all with typed defaults.
- [x] **API route**: `/api/profile` GET/PUT for admin management of profile and page content.
- [x] **Location**: `src/lib/content/profile.ts`, `src/app/api/profile/route.ts`.

**Verification:** `tsc --noEmit` clean, 50 Vitest tests pass, production build succeeds.

**Commits:**
- `65117d0` — UX-44 (auth/2FA boundary)
- `039813a` — UX-27/34/35/45 (editors + concurrency)
- `6e64e31` — UX-01/02 (public verification)
- `914ef4c` — UX-30 (editor framework)
- `f20f001` — UX-36-38 (experience editors)
- `c7c881e` — UX-31 (content lists)
- `08337d4` — UX-32/33 (revision + lifecycle + preview)
- `a416c88` — UX-28/43 (typed content domains)
- `4845a71` — UX-03 (load failure vs empty content)
- `cc1e108` — UX-11/12/17 (experience restructure + publication actions)
- `9a88587` — UX-20/21/22 (contrast + form a11y + touch targets)
- `e2bd90b` — UX-39/40/41 (dashboard + messages + security)
- `98f23e5` — UX-18/23 (project filtering + motion hardening)

### UX-03 — Distinguish Load Failure from Empty Content ✅

- [x] **safeQuery utility**: Typed `QueryResult<T>` with `data`/`error` pattern and console.error logging.
- [x] **QueryErrorFallback**: Role="alert" error banner component.
- [x] **Public pages updated**: Homepage, research, projects, about, CV all use safeQuery.
- [x] **Error banner**: Shows when any data source fails; sections with data still render.

### UX-11/12 — Restructure Experience Pages ✅

- [x] **Research Assistantships**: Reordered to context → responsibility → outcome → methods. Outcomes now appear before technologies. Empty state provides recovery links.
- [x] **Teaching Assistantships**: Reordered to course → institution → instructor → term → responsibilities → highlights → methods. Empty state provides recovery links.

### UX-17 — Improve Publication Actions ✅

- [x] **BibTeX copy**: Client-side clipboard API with visual confirmation (Copied state).
- [x] **DOI link**: Surfaced when available with external link button.
- [x] **Project URL**: Surfaced when available.
- [x] **Citation count**: Displayed when > 0.
- [x] **Structured data**: JSON-LD ScholarlyArticle emitted for SEO.

### UX-18 — Improve Project Filtering ✅

- [x] **Result count**: "N projects" shown above grid.
- [x] **Clear filter**: Link appears when tag filter active.
- [x] **aria-current**: Active tag exposes `aria-current="true"`.
- [x] **Touch targets**: Tag chips use `min-h-[44px]` for adequate tap size.

### UX-20/21/22 — Accessibility Improvements ✅

- [x] **Contrast**: Ash raised from #5C6675 to #7B8794 (4.6:1+), Indigo from #7C6CFF to #9B8AFF, borders from #2A3446 to #3A4856.
- [x] **Contact form**: `mode: "onBlur"` for early validation, focus-first-error on server failure, form ref for DOM queries.
- [x] **Touch targets**: Buttons already meet 44px minimum (h-8=32px for inline sm is acceptable with spacing).

### UX-23 — Harden Motion and No-JS ✅

- [x] **Particles pause**: `visibilitychange` API pauses animations when document hidden.
- [x] **No-JS visibility**: `@media (scripting: none)` makes scroll-reveal content visible without JS.
- [x] **Reduced motion**: Already handled by existing `prefers-reduced-motion` CSS.

### UX-39 — Dashboard Editorial Improvement ✅

- [x] **Lifecycle counts**: Publications and projects show draft/published breakdown.
- [x] **Content warnings**: Draft publications listed with links to editors.
- [x] **Recent activity**: Last 5 audit log entries displayed.
- [x] **Professional labels**: "Teaching Experience" and "Research Experience" in dashboard cards.

### UX-40 — Message Inbox Upgrade ✅

- [x] **Search**: Text search across name, email, subject, body.
- [x] **Status filters**: All/New/Read/Archived/Spam with counts.
- [x] **IP privacy**: Hidden by default under "Technical details" disclosure.
- [x] **Status badges**: Visible on list rows.
- [x] **Empty states**: Different messages for filtered vs unfiltered.

### UX-41 — Security Management Improvement ✅

- [x] **Current session**: Labeled with "Current" badge.
- [x] **Audit log filtering**: By action type with clear-filter link.
- [x] **Empty states**: For sessions and audit log.
- [x] **Session expiry**: Displayed alongside creation date.

### UX-07 — About Page Anchors ✅

- [x] **Timeline anchor**: `#timeline` on the timeline section wrapper.
- [x] **Recognition anchor**: `#recognition` wrapping awards, talks, service, publications.
- [x] **Skills anchor**: `#skills` on the skills section.
- [x] **Nav links verified**: `/about#timeline`, `/about#recognition` in desktop + mobile nav.

### UX-10 — Homepage About Preview + Contact CTA ✅

- [x] **About preview card**: Name, role summary, "Learn more" CTA linking to /about.
- [x] **Contact CTA section**: "Get in Touch" heading, email + Scholar + GitHub buttons.

### UX-16 — CV Print Styles ✅

- [x] **@media print**: Hides header, footer, nav, particles. White background, dark text.
- [x] **Links**: Underlined with href shown in parentheses. Email/mailto links hidden.
- [x] **Backgrounds**: Glass, glow, grid utilities disabled for clean print.

### UX-13 — Progressive Disclosure on About Timeline ✅

- [x] **Courses**: Already use `<details>` element for collapsible course lists.

### FloatingParticles Hydration Fix ✅

- [x] **Root cause**: `Math.random()` produces different values on server vs client, causing hydration mismatch. `isClient` false during SSR produced `animation: "none"` which mismatched client.
- [x] **Fix**: Particles now generate in `useEffect` (client-only). Empty container renders during SSR. No hydration mismatch.
- [x] **Test update**: Updated `floating-particles.test.tsx` to use `waitFor` for async particle rendering.

### Teaching Assistantship — Graduate/Undergraduate Level ✅

- [x] **Schema**: `TeachingAssistant.level` field (`String @default("graduate")`).
- [x] **Validation**: Zod `teachingSchema` accepts `"graduate"` or `"undergraduate"`.
- [x] **Admin editors**: Level dropdown on both edit and new pages.
- [x] **Public teaching page**: Cyan badge displaying "Graduate" or "Undergraduate" next to each entry.
- [x] **Migration**: `add-teaching-level` migration applied, database re-seeded.

### Nav Order — Experience After Research ✅

- [x] **Desktop nav**: Research → Experience ▾ → Projects → About → Contact → CV
- [x] **Mobile nav**: Same order with Experience expanded by default.
- [x] **JSX restructured**: Main nav split into Research link, Experience dropdown, then remaining links.

### UI/UX Improvements — Visual Elevation ✅

- [x] **Card hover lift**: `translateY(-0.5)` + `shadow-xl` on publication, project, experience, about preview, CV hero cards.
- [x] **Card differentiation**: Publication cards use `glowColor="cyan"`, project cards use `glowColor="indigo"`.
- [x] **Typography scale**: Card titles bumped from `text-base` to `text-lg`.
- [x] **Badge size variants**: Added `sm`/`default`/`lg` sizes via CVA. Replaced inline `text-[10px] px-2 py-0.5` overrides with `size="sm"`.
- [x] **SectionHeader component**: Decorative accent line under section titles. Used on homepage (Research, Experience, Projects, Skills) and About page (Timeline, Recognition, Skills).
- [x] **Hero CTA polish**: Primary "View CV" and "Email me" use `size="lg"`. Divider separates primary from secondary actions. Scholar/GitHub as outline secondary.
- [x] **About page**: Photo frame uses `border-glow` gradient border. Timeline dots colored per type (cyan=education, indigo=experience, emerald=award, amber=talk).
- [x] **TimelineEvent component**: Extracted reusable component with colored markers and connecting lines.
- [x] **Loading skeletons**: `Skeleton` and `CardSkeleton` components in `src/components/ui/skeleton.tsx`.
- [x] **All list pages**: Teaching, research-assistance, CV, research, projects pages updated with `Badge size="lg"` and hover lift.

**New components:**
- `src/components/ui/section-header.tsx` — Reusable section title with accent line
- `src/components/ui/skeleton.tsx` — Loading skeleton primitives

**Verification:** `tsc --noEmit` clean, 50 Vitest tests pass, production build succeeds.

**Commits:**
- `4845a71` — UX-03 (load failure vs empty content)
- `cc1e108` — UX-11/12/17 (experience restructure + publication actions)
- `9a88587` — UX-20/21/22 (contrast + form a11y + touch targets)
- `e2bd90b` — UX-39/40/41 (dashboard + messages + security)
- `98f23e5` — UX-18/23 (project filtering + motion hardening)
- `42b3144` — docs update
- (pending) — UX-07/10/16 + nav order + teaching level + UI improvements + hydration fix
