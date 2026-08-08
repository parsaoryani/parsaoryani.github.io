# Architecture Document

## Overview

Personal portfolio website for Parsa Oryani — a PhD applicant in Blockchain & AI Security.
Built with Next.js 14+ App Router, TypeScript, Tailwind CSS, PostgreSQL via Prisma.

## Stack

- **Framework:** Next.js 16 (App Router, TypeScript strict)
- **Styling:** Tailwind CSS v4 + CSS custom properties for design tokens
- **Database:** PostgreSQL + Prisma 6 ORM
- **Auth:** Server sessions + Argon2id password hashing + TOTP 2FA
- **Deployment:** Vercel + Neon + Cloudflare (recommended)

## Directory Structure

```
src/
  app/
    (public)/           # Public route group — SSG + ISR
      page.tsx          # Homepage
      research/         # Publications list + deep-dives
      projects/         # Project gallery + case studies
      about/            # Bio, profile photo, timeline grouped by category, skills
      cv/               # Interactive CV + PDF download
      contact/          # Contact form
    (admin)/            # Admin route group — hidden, auth-gated
      [adminPath]/      # Dynamic segment matches ADMIN_PATH env var
        login/          # Login page with 2FA
        page.tsx        # Dashboard
        publications/   # CRUD
        projects/       # CRUD
        timeline/       # Timeline CRUD (grouped by type)
        teaching-assistance/  # TA CRUD
        researching-assistance/  # RA CRUD
        skills/         # Manage skills
        tags/           # Manage tags
        messages/       # View contact messages
        contact/        # Contact page editor
        photo/          # Profile photo editor
        settings/       # Site settings
        security/       # Audit log + sessions
    api/                # Route handlers
      auth/             # Login, logout, 2FA verification
      contact/          # Contact form submission
      revalidate/       # ISR webhook
    sitemap.ts          # Generated sitemap
    robots.ts           # Generated robots.txt
  components/
    ui/                 # Primitives (Button, Badge, Card, Input, Textarea, Label)
    layout/             # Nav, Footer, Container, Section
    content/            # PublicationCard, ProjectCard, SkillCluster, TagFilter, ContactForm
    admin/              # Admin-specific components
  lib/
    db/                 # Prisma client + query functions
    auth/               # Auth helpers (sessions, passwords, 2FA, JWT)
    validation/         # Zod schemas (shared frontend/backend)
    seo/                # Metadata + JSON-LD builders
    utils/              # cn() utility, etc.
prisma/
  schema.prisma         # Database schema (16 models)
scripts/
  seed.ts               # Database seed with sample data
```

## Rendering Strategy

| Route        | Strategy |
|-------------|----------|
| /, /research, /projects, /about, /cv, /blog | SSG + ISR |
| /contact submit, /api/*, admin pages | Dynamic/Server |
| [slug] pages | SSG + ISR (generateStaticParams) |

## Design System

- **Palette:** Deep Slate + Signal Cyan (`#0A0E14` / `#38E1C4`)
- **Fonts:** Inter (UI) + Source Serif 4 (long-form) + JetBrains Mono (code/metadata)
- **Tokens:** CSS custom properties (--bg-base, --accent, --text-primary, etc.)
- **Type scale:** Major third 1.25, 16px base

## Database (18 models + 1 enum)

Publication, Project, Tag, PublicationTag, ProjectTag, TimelineEvent,
SkillCategory, Skill, Media, User, Session, AuditLog, ContactMessage, SiteSetting,
TeachingAssistant, ResearchingAssistant, EntryStatus (draft | published)

## Security

- Obscured admin route via env var (ADMIN_PATH)
- Admin link shown in public nav only after auth (handled by middleware)
- Argon2id password hashing
- TOTP 2FA with backup codes
- Server-side sessions (httpOnly, Secure, SameSite=Strict)
- Rate limiting (5 attempts / 15 min with lockout)
- Audit logging for all auth events
- CSP, HSTS, X-Frame-Options security headers
- robots.txt disallows admin + /api
- Uniform 404 for unauthorized admin access

## Key Features

- Research publications with one-click BibTeX, PDF, arXiv, Code links
- Project case studies (Problem → Approach → Architecture → Results → Retrospective)
- Filterable project gallery with URL-synced tag filtering
- Interactive CV with PDF download
- TA & RA management with separate admin CRUD and public pages
- Profile photo management via admin panel
- Contact form with validation
- Full admin CRUD for all content types
- Timeline organized by event type with grouped sections
- JSON-LD structured data (Person, ScholarlyArticle)
- Dynamic OG metadata
- WCAG AA accessible
- Email sending via Resend (contact form notification + confirmation)
- Receiving email via Cloudflare Email Routing / ImprovMX (optional)
