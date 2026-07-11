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
