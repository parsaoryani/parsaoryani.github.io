# Original Request (Source Prompt)

> The following is the original prompt used to generate this blueprint. Kept here so an agent (or future you) has the full intent and constraints in one place.

**Role:** Act as an Expert Full-Stack Software Architect and UI/UX Designer.

**Context:** I am a Master's student in Computer Science and Engineering at the Sharif University of Technology. I have a background in software engineering, advanced blockchain development, deep learning, and Agentic AI, and I am preparing to apply for competitive PhD programs in Blockchain and AI Security.

**Task:** I need a comprehensive, highly detailed Project Blueprint and Architecture Document for my personal portfolio website. This site must establish me as a top-tier researcher and engineer, showcasing my skills, academic publications/research, work experience, and complex projects. Provide a complete, step-by-step documentation guide covering:

1. **Project Overview & Strategy** — Target audience analysis (PhD admission committees, tech recruiters, researchers); core objectives and site map.
2. **UI/UX & Design System** — A premium, modern Dark Theme aesthetic (tech-forward but academically professional); specific color palette recommendations (primary, secondary, accent, background hex codes); typography choices (modern sans-serif suitable for code snippets and academic text); layout details for the homepage, research/projects gallery, and resume/about sections.
3. **Frontend Architecture** — Recommended modern tech stack (e.g., Next.js, React, Tailwind CSS) optimized for SEO and fast loading; component structure and state management.
4. **Backend & Database Architecture** — Recommended stack for a lightweight, secure backend (e.g., Node.js, Python/FastAPI, or a headless CMS); database schema design for storing project details, research papers, and timeline events.
5. **Secure Admin Panel** — Architecture for a dynamic backend to manage/update content without touching code; strict security measures — the admin login route must be completely obscured/hidden from public users and scrapers; authentication best practices (e.g., JWT, 2FA, rate limiting).
6. **Deployment & CI/CD Pipeline** — Hosting recommendations (e.g., Vercel, AWS, or Docker-based VPS deployment) and a clean CI/CD pipeline.

**Constraint:** Do not write the actual code yet. Provide the complete architectural blueprint, design system, and feature breakdown first. Detail every part of the project meticulously.

---

# Project Blueprint & Architecture Document
## Personal Portfolio Platform — Researcher / Engineer Edition

**Prepared for:** Parsa Oryani — M.Sc. Computer Engineering, Sharif University of Technology
**Domain focus:** Blockchain Development · Deep Learning · Agentic AI · AI Security
**Primary goal:** PhD admissions positioning + high-signal technical recruiting
**Document status:** Architecture & design specification (no implementation code)
**Version:** 1.0

---

## 0. How to Read This Document

This is a build-ready specification. It is deliberately opinionated: every recommendation names a default choice, states *why* it beats the alternatives for your specific situation, and gives you exact values (hex codes, font stacks, schema fields, security parameters) so you or a contractor can start building without re-deciding anything. Where a decision is genuinely a trade-off, both paths are laid out with a recommendation flagged.

The guiding principle throughout: **you are not building a "web developer portfolio." You are building an academic-research web presence that happens to be engineered impeccably.** The site itself is a proof-of-competence artifact. An admissions committee member who views source, checks your Lighthouse score, or notices your structured-data markup should come away thinking "this person builds real systems." That constraint shapes every choice below.

---

# 1. Project Overview & Strategy

## 1.1 The Core Strategic Insight

A portfolio for PhD applications is a fundamentally different product from a portfolio for a bootcamp graduate or a freelance developer. The failure mode you must avoid is the "template look" — the Awwwards-style agency site with big parallax hero animations and vague buzzwords. That aesthetic *reduces* your credibility with a research audience because it signals marketing over substance.

Your site has three jobs, in priority order:

1. **Establish research legitimacy** — publications, preprints, citations, research statements, and a clear intellectual through-line (why blockchain + AI security is a coherent agenda, not a grab-bag of skills).
2. **Demonstrate engineering depth** — projects with real architecture, not just "I made a to-do app." Each project should read like a mini system-design writeup.
3. **Reduce friction to action** — a committee member or recruiter should be able to find your CV, email, Google Scholar, and GitHub in under five seconds, from any page.

Everything in this document serves those three jobs.

## 1.2 Target Audience Analysis

You are designing for three distinct personas who use the site very differently. Design decisions should be validated against all three.

### Persona A — PhD Admissions Committee Member / Prospective Advisor
This is a professor or senior researcher, often reviewing 100+ applications in a compressed window, frequently on a laptop late at night. They are skeptical by default and pattern-match aggressively for signal.

- **What they want:** Evidence of research maturity — publications, a research statement, evidence you can carry a project to completion, and a sense of *fit* with their lab's agenda. They care whether you can read papers, form questions, and execute.
- **How they behave:** They skim. They open your CV PDF in a new tab within seconds. They may search your name and land on the site cold. They will click through to your Google Scholar and GitHub to verify claims.
- **What kills your chances:** Broken links, an out-of-date CV, unverifiable claims, typos, a site that feels like a startup landing page, or projects with no depth.
- **Design implications:** Publications and research must be the most prominent content. CV must be one click from everywhere and always current. Every claim ("built X," "achieved Y accuracy") should link to evidence (repo, paper, demo).

### Persona B — Technical Recruiter / Hiring Engineer (for internships, research-engineer roles, or fallback industry paths)
Splits into two sub-types: a non-technical recruiter scanning for keywords, and a senior engineer doing a deep technical read before an interview.

- **What they want:** Concrete tech stack, shipped systems, code quality signals, and a quick read on seniority. The engineer wants architecture and trade-off reasoning; the recruiter wants a skills list and a downloadable resume.
- **How they behave:** Recruiter keyword-scans (needs a scannable skills section and standard resume). Engineer reads your best project end-to-end and checks your GitHub commit history.
- **Design implications:** A skills/tech section that is both human-readable and keyword-dense for ATS-style scanning. Project pages that satisfy a deep technical read: problem → approach → architecture → results → what you'd do differently.

### Persona C — Fellow Researchers / Collaborators / Community
Peers who found you via a paper, a conference, a GitHub repo, or Twitter/X. They may cite you, invite you to collaborate, or evaluate you for a workshop.

- **What they want:** Fast access to your papers (with BibTeX), your code, and a way to contact you. They care about reproducibility and openness.
- **Design implications:** One-click BibTeX copy on every publication. Direct links to code and data. Clear, spam-resistant contact path.

### Cross-persona non-negotiables
- CV/resume reachable in **one click from every page**.
- Site loads fast and is fully readable **without JavaScript** (research audiences use locked-down browsers, screen readers, and slow international connections — your Iranian/international network reality matters here).
- No dark patterns, no forced interactions, no autoplay.
- Impeccable spelling, grammar, and factual accuracy.

## 1.3 Core Objectives (with success criteria)

| # | Objective | Measurable success criterion |
|---|-----------|------------------------------|
| O1 | Rank #1 for your name | "Parsa Oryani" search returns your site above social profiles within 60 days |
| O2 | Zero-friction credential access | CV, Scholar, GitHub reachable in ≤1 click from any page |
| O3 | Demonstrate engineering caliber | Lighthouse ≥ 95 across Performance/SEO/Best Practices/Accessibility |
| O4 | Effortless content updates | Add a new publication or project in <5 min with no code deploy |
| O5 | Research-first information hierarchy | Publications + research agenda are the dominant above-the-fold content |
| O6 | Bulletproof admin security | Admin surface undiscoverable by scrapers; no credential-based takeover path |
| O7 | Machine-readable for the web | Structured data (schema.org) for Person + ScholarlyArticle present and valid |

## 1.4 Site Map / Information Architecture

Keep the public surface small and deep rather than wide and shallow. Recommended top-level structure:

```
/                       Home (hero + research thesis + featured work + latest)
/research               Research agenda + publications list (the flagship page)
/research/[slug]        Individual paper / project deep-dive pages
/projects               Engineering projects gallery (filterable)
/projects/[slug]        Individual project case study
/about                  Bio, academic timeline, skills, awards, teaching
/cv                     Interactive CV + prominent PDF download
/blog                   (Optional) Technical writing / research notes
/blog/[slug]            Individual posts
/contact                Spam-resistant contact + social links
/now                    (Optional) "What I'm working on now" — signals momentum

Utility / hidden:
/[obscured-admin-path]  Admin login (see §5 — never linked, never indexed)
/api/*                  Backend API routes
/sitemap.xml            Generated
/robots.txt             Generated (disallows admin, allows content)
/rss.xml                Feed for blog + publications
```

**Navigation rule:** Primary nav = Home, Research, Projects, About, CV, Contact. Blog/Now are secondary. Six items maximum in the main bar; anything more dilutes hierarchy. The CV should be visually distinct (a filled accent button, not a text link) because it is the highest-value action.

**Content taxonomy.** Two first-class content types drive everything: **Publications** (papers, preprints, posters, talks) and **Projects** (engineering case studies). A single flexible **Tag** system spans both (`blockchain`, `zk`, `deep-learning`, `agentic-ai`, `ai-security`, `smart-contracts`, etc.) so the same intellectual threads are visible across research and code. The homepage and `/research` page both surface a "research thesis" — one paragraph articulating why blockchain + AI security is your coherent agenda. This single paragraph is the most important piece of copy on the site; it is what a prospective advisor pattern-matches against.

---

# 2. UI/UX & Design System

## 2.1 Design Philosophy

The aesthetic target is **"Quiet Confidence."** Think the visual language of a well-designed academic lab site (e.g., the cleaner MIT/Stanford lab pages), the typographic restraint of a serious documentation site, and the precision of a developer-tool landing page — minus the marketing gloss. Dark theme, generous whitespace, one restrained accent color, and typography doing most of the heavy lifting. Motion is present but subtle and functional (never decorative parallax).

Design tenets:
- **Content is the interface.** Chrome recedes; text and figures dominate.
- **One accent, used sparingly.** A single accent color earns attention *because* it is rare. Overusing it destroys hierarchy.
- **Monospace as identity.** As a systems/blockchain person, a monospaced accent font for labels, metadata, and code is both on-brand and functional.
- **Motion with meaning.** Transitions reveal structure (staggered fade-ins, focus states); nothing spins for decoration.
- **Accessibility is not optional.** WCAG AA contrast minimum on all text; AAA where feasible for body copy.

## 2.2 Color Palette

A dark theme's biggest risk is muddiness. The fix is a disciplined near-black-blue base, a small set of neutral grays for surfaces and text, and exactly one saturated accent (with a supporting secondary for links/interactive states). The palette below is tuned for contrast compliance and a "premium terminal" feel.

### Core palette (recommended default: "Deep Slate + Signal Cyan")

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| Background (base) | Void | `#0A0E14` | Page background — near-black with a faint blue cast (never pure `#000`; pure black is harsh and flattens depth) |
| Background (elevated) | Slate 900 | `#111722` | Cards, panels, nav bar |
| Background (raised) | Slate 800 | `#1A2130` | Hover surfaces, code blocks, inputs |
| Border / divider | Slate 700 | `#2A3446` | Hairline borders, separators (1px) |
| Text (primary) | Fog | `#E6EDF3` | Headings and body — ~15:1 contrast on Void, exceeds AAA |
| Text (secondary) | Mist | `#9BA7B4` | Metadata, captions, muted labels — AA on Void |
| Text (tertiary/disabled) | Ash | `#5C6675` | Timestamps, subtle hints |
| **Accent (primary)** | Signal Cyan | `#38E1C4` | THE accent — CTAs, active nav, key links, focus rings. Use sparingly |
| Accent (hover/pressed) | Cyan Deep | `#25B8A0` | Accent hover/active state |
| Secondary accent | Electric Indigo | `#7C6CFF` | Secondary interactive: tags, secondary links, data-viz second series |
| Success | Emerald | `#3FB950` | Success toasts, "published" status |
| Warning | Amber | `#D29922` | Warnings, "draft" status |
| Danger | Coral | `#F85149` | Destructive actions, errors (admin) |

**Semantic tokens (implement as CSS variables, not raw hex):**
```
--bg-base, --bg-elevated, --bg-raised, --border,
--text-primary, --text-secondary, --text-tertiary,
--accent, --accent-hover, --accent-secondary,
--success, --warning, --danger, --focus-ring
```
Never reference raw hex in components — always the token. This makes a future light-mode or re-theme a one-file change.

### Alternative palette (if cyan feels too "startup"): "Warm Academic"
Swap the accent to a restrained amber-gold `#E3B341` on the same `#0A0E14` base, with `#6E9FEF` as the secondary. This reads more "serious journal / old-world academic" and less "SaaS product." Cyan is the recommended default because it pairs better with a blockchain/crypto identity; gold is the safer choice if your target labs skew traditional-theory.

### Contrast & gradient discipline
- All body text must clear **WCAG AA (4.5:1)**; primary text/headings should clear AAA (7:1). The values above are chosen to comply — verify with a checker after implementation.
- Avoid large saturated gradients. If you use a gradient at all, keep it as a *very* subtle radial glow (accent at 4–8% opacity) behind the hero, and nowhere else.
- Accent color should occupy **<5% of any given viewport**. If more than a handful of things are cyan, hierarchy is broken.

## 2.3 Typography

Typography is where an academic-technical site wins or loses. You need three type roles: a **display/heading** face, a **body** face optimized for reading dense academic prose, and a **monospace** for code and technical metadata. Modern variable fonts keep the payload small.

### Recommended type system

| Role | Font | Why | Fallback stack |
|------|------|-----|----------------|
| Headings / display | **Inter** (variable) or **Geist** | Neutral, precise, excellent at large sizes; the "engineered" look. Geist (by Vercel) if you want something slightly more distinctive | `Inter, "Geist", system-ui, -apple-system, "Segoe UI", sans-serif` |
| Body / long-form | **Inter** at body weights, OR pair with a serif (**Newsreader** / **Source Serif 4**) for essay/blog reading | A serif body for long research prose signals "academic" and improves reading comfort; sans for UI | `"Source Serif 4", Georgia, serif` (essays) / `Inter, system-ui` (UI) |
| Monospace / code / metadata | **JetBrains Mono** or **Geist Mono** | Ligatures, clear glyph disambiguation (0 vs O, 1 vs l), on-brand for a systems person. Use for labels, tags, timestamps, and code | `"JetBrains Mono", "SF Mono", "Fira Code", ui-monospace, monospace` |

**Recommended default pairing:** Inter (UI + headings) + Source Serif 4 (long-form article body) + JetBrains Mono (code/metadata). This trio is the sweet spot: the serif body on `/blog` and research writeups instantly reads "scholarly," while Inter keeps the UI crisp and JetBrains Mono ties the whole thing to your engineering identity.

### Type scale (modular, 1.25 "major third" ratio, 16px base)

| Token | Size (rem / px) | Weight | Line height | Use |
|-------|-----------------|--------|-------------|-----|
| `text-display` | 3.815 / 61 | 700 | 1.05 | Hero headline only |
| `text-h1` | 3.052 / 49 | 700 | 1.1 | Page titles |
| `text-h2` | 2.441 / 39 | 600 | 1.15 | Section headers |
| `text-h3` | 1.953 / 31 | 600 | 1.2 | Card titles, subsections |
| `text-h4` | 1.563 / 25 | 600 | 1.3 | Minor headings |
| `text-lg` | 1.25 / 20 | 400 | 1.6 | Lead paragraphs |
| `text-base` | 1.0 / 16 | 400 | 1.7 | Body (1.7 line-height for dense academic prose) |
| `text-sm` | 0.8 / 13 | 400/500 | 1.5 | Metadata, captions |
| `text-mono` | 0.875 / 14 | 400 | 1.5 | Code, tags, timestamps (JetBrains Mono) |

Typographic rules: max body measure **~68–72 characters** per line (`max-w-[68ch]`); letter-spacing slightly negative on large headings (`-0.02em`) and slightly positive on all-caps mono labels (`+0.08em`); load fonts via `next/font` with `font-display: swap` and subset to Latin to keep payload minimal.

## 2.4 Spacing, Grid, Radius, Elevation

- **Spacing scale (8px base):** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px. Use these tokens exclusively; no arbitrary values.
- **Layout grid:** 12-column, max content width **1200px** (`max-w-6xl`), gutters 24px, generous vertical rhythm (sections separated by 96–128px on desktop).
- **Border radius:** 8px for cards/inputs, 6px for buttons, 4px for tags, full for avatars. Consistency matters more than the specific number.
- **Elevation:** In dark mode, elevation is communicated by **lighter surface color + subtle border**, not heavy shadows. Use `--bg-elevated`/`--bg-raised` plus a 1px `--border`. Shadows, if any, are very soft and low-opacity (`0 1px 3px rgba(0,0,0,0.4)`). A faint accent-colored glow on hover for interactive cards is the one permitted flourish.

## 2.5 Motion & Interaction

- **Entrance:** Staggered fade-up (translateY 8–12px, opacity 0→1, 400ms, ease-out) on scroll-into-view via IntersectionObserver. Stagger children by ~60ms.
- **Hover:** Cards lift subtly (border brightens to accent at low opacity, 150ms). Links get an animated underline that draws in from left.
- **Focus:** Always a visible 2px `--accent` focus ring (never remove outlines — accessibility + keyboard users). 
- **Respect `prefers-reduced-motion`:** disable all non-essential animation when set. This is both an accessibility requirement and a signal of engineering care.
- **Page transitions:** Keep them near-instant. A subtle top progress bar is fine; avoid full-screen transition curtains that add perceived latency.

## 2.6 Key Page Layouts

### Homepage (`/`)
The homepage is a curated index, not a landing page. Structure, top to bottom:

1. **Minimal top nav** — left: your name / wordmark in mono; right: Research, Projects, About, Contact, and a filled accent **CV** button. Sticky, translucent-on-scroll (`--bg-elevated` at ~80% opacity with backdrop blur).
2. **Hero (single viewport, text-forward).** Left-aligned, not centered. A one-line identity statement ("PhD applicant researching the security of decentralized and AI systems"), followed by your **research thesis paragraph** (the most important copy on the site — 2–3 sentences on your intellectual agenda). Below: a row of primary links (Google Scholar, GitHub, CV, Email) as mono-labeled buttons. Optional: a very subtle animated background (a faint node-graph or grid at low opacity) — but only if it stays out of the reader's way. No giant hero image.
3. **Featured research (3 items).** Your strongest publications/preprints as clean cards: title, venue + year (mono), one-line contribution, and links (PDF · Code · BibTeX). This section is above the fold's fold — committee members must hit it fast.
4. **Featured projects (2–3 items).** Engineering case studies with a one-line problem statement and stack chips.
5. **Selected skills / tech, compactly.** Grouped (Blockchain, ML/DL, Systems, Security) as mono tag clusters — scannable for recruiters, not a childish "skill bar" chart.
6. **Latest writing / activity (optional).** 2–3 recent blog posts or a "now" line.
7. **Footer.** Contact, all social links, copyright, "built with" line (a tasteful place to signal the stack), and RSS.

### Research / Publications page (`/research`)
The flagship. Structure:
- **Research statement** at top (expanded version of the thesis — 2–4 short paragraphs describing your questions, methods, and why they matter).
- **Publications list** in reverse-chronological order, grouped by year, formatted like a real academic CV entry: authors (you bolded), title, venue, year, and an action row (**PDF · arXiv · Code · BibTeX-copy · DOI**). Support a "selected / all" toggle and filtering by tag.
- Each publication links to a **deep-dive page** (`/research/[slug]`) with abstract, figures, TL;DR, contributions, and citation block.
- A quiet **citation/metrics** line if you have them (or omit until you do — never fake metrics).

### Projects gallery (`/projects`)
- **Filterable grid** (filter by tag: blockchain, zk, deep-learning, agentic-ai, ai-security). Filtering is client-side and URL-synced (`/projects?tag=zk`) so filters are shareable and SEO-visible.
- Each card: title, one-line problem statement, stack chips (mono), a small status/role label, and links (Repo · Demo · Writeup).
- Cards link to **case-study pages** (`/projects/[slug]`) structured as: Context/Problem → Approach → Architecture (with a diagram) → Key technical challenges & decisions → Results/Impact → Retrospective. This structure is what makes a project read like a systems writeup rather than a resume bullet.

### About / CV (`/about`, `/cv`)
- **About:** Bio (2–3 paragraphs, first person, warm but precise), an **academic + professional timeline** (vertical, reverse-chronological, with degrees, positions, and milestones), skills grouped by domain, awards/honors, teaching/mentoring, and talks. 
- **CV page:** An **interactive HTML CV** (accessible, indexable, always in sync with the DB) plus a prominent **"Download PDF"** button. The PDF should be generated from the same source data (see §4/§6) so it never drifts from the site. Keep an `/cv.pdf` stable URL that always points to the latest — committee members bookmark and re-download.

## 2.7 Accessibility & Responsive Baseline
- Mobile-first; breakpoints at 640 / 768 / 1024 / 1280px. Nav collapses to a slide-over menu below 768px.
- All interactive elements keyboard-reachable with visible focus; semantic HTML landmarks (`<nav>`, `<main>`, `<article>`); alt text on all figures; `aria-label`s on icon-only buttons.
- Color is never the sole information carrier (status also has an icon/text).
- Test with a screen reader and keyboard-only pass before launch — and mention this in your "built with" note; it signals engineering maturity to the exact audience you're courting.

---

# 3. Frontend Architecture

## 3.1 Recommended Stack (and why)

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | **Next.js 14+ (App Router)** | Hybrid SSG/SSR/ISR is exactly right: static-generate content pages for speed + SEO, server-render dynamic bits, incrementally revalidate when you publish. Best-in-class SEO primitives (Metadata API), image optimization, and first-class Vercel deploy. The industry-standard "serious" React framework — the right signal to send |
| Language | **TypeScript (strict)** | Type safety is a competence signal and prevents whole bug classes. `strict: true`, `noUncheckedIndexedAccess: true` |
| Styling | **Tailwind CSS** + CSS variables for tokens | Fast, consistent, tokens map cleanly to §2's design system. Tailwind for layout/spacing, CSS custom properties for the semantic color/type tokens so theming stays centralized |
| UI primitives | **shadcn/ui** (Radix under the hood) | Unstyled, accessible primitives you own and restyle to the design system. Accessibility handled correctly out of the box (focus traps, ARIA) without a heavy component-library aesthetic |
| Content rendering | **MDX** for blog/writeups | Lets you mix prose with interactive React (live diagrams, math via KaTeX, syntax-highlighted code) — perfect for technical writing |
| Animation | **Framer Motion** (selectively) | Declarative, respects reduced-motion easily. Use only for the subtle entrance/hover motion in §2.5 |
| Icons | **Lucide** | Clean, consistent, tree-shakeable |
| Math | **KaTeX** (via rehype-katex) | Render LaTeX in research writeups — essential for an ML/crypto audience |
| Code highlighting | **Shiki** | VS Code-grade syntax highlighting at build time (no client JS cost) |
| Data fetching | **Server Components + `fetch` with revalidation** | Most data is fetched server-side at build/revalidate time; minimal client-side fetching |
| Forms/validation | **React Hook Form + Zod** | Contact form + admin forms; Zod schemas shared with the backend for end-to-end type safety |

**Why not a plain static-site generator (Astro/Hugo)?** Astro is genuinely excellent and *lighter* — a fair alternative if you want the absolute minimum JS. But Next.js gives you a unified full-stack model (the admin panel and API live in the same app), a richer interactive-writeup story via MDX+React, and it's the more recognized signal. Recommendation: **Next.js**, unless you're certain the site will stay purely static with no admin panel — in which case Astro + a Git-based CMS is a leaner path (noted again in §4).

## 3.2 Rendering Strategy (per route)

Match the rendering mode to each route's data volatility:

- **`/`, `/research`, `/projects`, `/about`, `/blog`, all `[slug]` pages → SSG + ISR.** Statically generated at build for maximum speed and SEO; **Incremental Static Regeneration** revalidates on demand when you publish new content (triggered by a webhook from the CMS/admin — see §4). Committee members hit pre-rendered HTML: instant, indexable, works without JS.
- **`/cv` → SSG + ISR**, with the PDF generated in the same pipeline.
- **`/contact` submit, admin pages, API → SSR / server actions / route handlers.** Dynamic, auth-gated, never cached.

The result: **public content is effectively a static site** (fast, cheap, resilient, indexable) while the admin/API layer is dynamic. This is the ideal shape for your goals.

## 3.3 Component Architecture

Organize by responsibility, not by page. Suggested structure:

```
/app
  /(public)              # public route group
    /page.tsx            # home
    /research/...
    /projects/...
    /about/page.tsx
    /cv/page.tsx
    /blog/...
    /contact/page.tsx
  /(admin)               # admin route group (obscured segment, auth-gated) — see §5
    /[obscured]/...
  /api                   # route handlers (contact, revalidation webhook, auth)
  /layout.tsx            # root layout: fonts, theme tokens, providers
/components
  /ui                    # shadcn primitives (Button, Card, Dialog, Input...)
  /layout                # Nav, Footer, Container, Section
  /content               # PublicationCard, ProjectCard, Timeline, TagFilter,
                         # CitationBlock, BibtexCopy, SkillCluster, ProseMDX
  /admin                 # admin-only components (forms, tables, editor)
/lib
  /db                    # DB client + query functions (server-only)
  /auth                  # session/JWT helpers (server-only)
  /validation            # shared Zod schemas
  /seo                   # metadata + JSON-LD builders
  /utils
/content                 # (if using MDX-on-disk) .mdx files + frontmatter
/styles                  # globals.css with CSS-variable token definitions
/public                  # static assets, cv.pdf, og-images
```

**Component design principles:**
- **Server Components by default**; add `"use client"` only where interactivity truly requires it (tag filter, mobile menu, admin forms, BibTeX copy button). This keeps the client JS bundle tiny — a direct Lighthouse win.
- **Presentational vs. data-bound split:** `PublicationCard` is a pure presentational component; a server component fetches data and maps it in. Keeps components testable and reusable.
- **Design tokens flow through CSS variables**, so no component hardcodes color.

## 3.4 State Management

Deliberately minimal — this is a content site, not an app. Over-engineering state here is a red flag, not a green one.

- **Server state / content:** lives on the server (RSC + DB queries); no client store needed. This is the bulk of the site.
- **URL as state:** filters and tabs live in the URL (`useSearchParams`) so they're shareable and SSR-friendly. No global store for UI filters.
- **Local UI state:** `useState` for menus, dialogs, copy-to-clipboard feedback.
- **Forms:** React Hook Form local state; server actions for submission.
- **Admin state:** **TanStack Query (React Query)** *only inside the admin panel* for cache/mutation management of the CRUD interface. The public site needs no such layer.
- **Theme:** CSS variables + a single `data-theme` attribute; if you add light mode later, `next-themes` handles it with no flash.

**No Redux, no Zustand, no global store on the public site.** State discipline here is itself a competence signal.

## 3.5 SEO & Performance Architecture

This section directly serves objectives O1 and O3.

**SEO:**
- **Metadata API** (`generateMetadata`) per route: unique title, description, canonical URL, and Open Graph / Twitter cards. Generate **per-publication and per-project OG images** dynamically (`@vercel/og`/`next/og`) — a title-card image makes shared links look professional.
- **Structured data (JSON-LD):** `Person` schema on the home/about pages (with `sameAs` linking Scholar, GitHub, LinkedIn, ORCID); `ScholarlyArticle` on each publication; `BreadcrumbList` on deep pages; `WebSite` with search. This is what makes you machine-readable and directly supports ranking #1 for your name.
- **Sitemap + robots** generated programmatically (`sitemap.ts`, `robots.ts`). robots.txt **disallows the admin segment and `/api`**, allows all content, and points to the sitemap.
- **Semantic HTML + heading hierarchy** (one `<h1>` per page, logical `<h2>`/`<h3>`).
- **RSS/Atom feed** for blog + publications — researchers subscribe.
- Register the domain with **Google Search Console**; submit the sitemap; verify via DNS.

**Performance (target Lighthouse ≥ 95):**
- SSG/ISR means HTML is pre-rendered — near-instant TTFB from the edge CDN.
- **`next/font`** self-hosts and subsets fonts (no render-blocking Google Fonts request, no layout shift).
- **`next/image`** for all images: AVIF/WebP, responsive `srcset`, lazy loading, explicit dimensions (zero CLS).
- **Minimal client JS**: RSC-first, `"use client"` islands only. Code-split the admin bundle so it never ships to public visitors.
- Syntax highlighting (Shiki) and math (KaTeX) rendered **at build time** → no client cost.
- Preconnect only to origins you actually use; defer non-critical scripts (analytics).
- **Privacy-respecting analytics** (Plausible or Vercel Analytics) — lightweight, no cookie banner needed, and signals taste.
- Core Web Vitals budget: **LCP < 1.8s, CLS < 0.05, INP < 200ms** on a mid-tier mobile over 4G.

---

# 4. Backend & Database Architecture

## 4.1 The Central Decision: Headless CMS vs. Custom Backend

Before schemas, choose the backend *shape*. There are three viable paths; pick based on how much you value control vs. speed-to-launch.

| Path | What it is | Best when | Trade-off |
|------|-----------|-----------|-----------|
| **A. Headless CMS** (Sanity / Payload / Strapi) | A ready-made content backend + admin UI; your Next.js app reads from it | You want a polished editing UI in days, not weeks, and to focus energy on the frontend | Less "I built the backend" signal; some vendor lock-in (mitigated by self-hostable options) |
| **B. Custom backend in the Next.js app** (route handlers/server actions + Postgres via Prisma) | You build the API and a bespoke admin panel | You want to *demonstrate* full-stack + security engineering (relevant to your AI-security PhD angle) and want total control of the obscured-admin design in §5 | More work; you own auth, validation, and the admin UI |
| **C. Git-based / flat-file** (MDX in the repo, edited via PRs) | Content is Markdown files; "publishing" = a git commit | You're comfortable editing in an editor and want zero database/attack surface | No non-technical editing UI; the "hidden admin panel" requirement (§5) doesn't apply — there's nothing to secure |

**Recommendation for your goals: Path B — a custom backend inside the same Next.js app, backed by PostgreSQL via Prisma, with a bespoke obscured admin panel.** Reasoning: your PhD target is **AI/blockchain security**. A site where *you personally designed the auth, the obscured admin route, the rate limiting, and the threat model* is itself a portfolio piece that speaks directly to that agenda. The §5 security requirements only make sense under Path B. Path A (specifically **Payload CMS**, which is TypeScript-native and can run *inside* your Next.js app with Postgres) is the strong pragmatic alternative if you'd rather not hand-roll auth — Payload gives you a real admin UI and access control while still being self-hosted and code-owned. Path C is the "minimum attack surface" purist option and is entirely respectable, but it forfeits the admin-panel showcase.

The schema below is written for **Path B (Postgres + Prisma)** but maps cleanly onto Payload collections if you choose Path A.

## 4.2 Backend Stack (Path B)

| Concern | Choice | Why |
|---------|--------|-----|
| Runtime / API | **Next.js Route Handlers + Server Actions** (Node runtime) | Co-located with the frontend; one deploy, one language, shared Zod types end-to-end |
| Language | **TypeScript (strict)** | Shared types across DB ↔ API ↔ UI |
| ORM | **Prisma** | Type-safe queries, painless migrations, great DX; schema-as-code is self-documenting |
| Database | **PostgreSQL** (managed: Neon / Supabase / RDS) | Relational fits the publication↔tag↔project↔media relationships; JSONB columns cover flexible fields; mature, portable, no lock-in. Neon's serverless Postgres + branching is ideal for a Vercel deploy |
| File/media storage | **S3-compatible object store** (Cloudflare R2 / AWS S3 / Supabase Storage) | PDFs (papers, CV), figures, OG images. R2 has no egress fees — good for a public site |
| Validation | **Zod** at every boundary | One schema validates the form, the API body, and types the DB write |
| Auth | **Custom session/JWT layer** (see §5) or **Auth.js/Lucia** | See §5 for the full security design |
| Email | **Resend** (transactional) | Contact-form delivery + admin 2FA / login-alert emails |
| Search (optional) | **Postgres full-text** first; **Meilisearch** later if needed | Site is small; Postgres FTS is plenty initially |

**Alternative if you prefer Python** (you have a DL background): a **FastAPI** service is a perfectly good backend and lets you showcase Python. The cost is running a *second* service (Python API + Next.js frontend) instead of one unified app — more infra, more CORS, two deploy targets. Recommendation: keep it **unified in Next.js/TypeScript** for a personal site; reserve FastAPI for when a project genuinely needs Python (e.g., serving an ML demo — which you can add later as an isolated microservice).

## 4.3 Database Schema Design

Relational core with a shared tagging system. Below is the logical schema (Prisma-style described in prose/tables — no code, per your request). Every table has `id` (UUID/cuid), `createdAt`, `updatedAt`. Soft-delete via `deletedAt` (nullable) so nothing is ever hard-lost.

### Entity overview
```
User (1) ─────────── (∞) AuditLog
Publication (∞) ──── (∞) Tag        via PublicationTag
Project     (∞) ──── (∞) Tag        via ProjectTag
Publication (1) ──── (∞) Media
Project     (1) ──── (∞) Media
TimelineEvent (standalone)
Skill ──── SkillCategory
Page/Setting (singleton-ish config)
ContactMessage (standalone)
```

### Table: `Publication`
The flagship content type. Model it to cover papers, preprints, posters, and talks.

| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid | PK |
| `slug` | string, unique | URL segment (`/research/[slug]`) |
| `title` | string | Full paper title |
| `authors` | string[] / JSONB | Ordered list; store a flag or index marking which author is *you* so the UI can bold it |
| `venue` | string | Conference/journal/workshop name |
| `venueType` | enum | `conference` \| `journal` \| `workshop` \| `preprint` \| `poster` \| `talk` \| `thesis` |
| `year` | int | For grouping/sorting |
| `publishedAt` | date | Precise date |
| `status` | enum | `draft` \| `published` (controls public visibility) |
| `abstract` | text | |
| `tldr` | text | One-paragraph plain-language summary |
| `contributions` | JSONB / text[] | Bullet list of your specific contributions |
| `doi` | string, nullable | |
| `arxivId` | string, nullable | |
| `pdfUrl` | string, nullable | Link to object storage |
| `codeUrl` | string, nullable | Repo link |
| `projectUrl` | string, nullable | Live demo/project page |
| `bibtex` | text | Stored raw for one-click copy |
| `citationCount` | int, nullable | Optional; only if you choose to display and can keep current |
| `featured` | boolean | Surface on homepage |
| `sortOrder` | int | Manual override for "selected" ordering |
| `ogImageUrl` | string, nullable | Pre-generated share card |

### Table: `Project`
Engineering case studies.

| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid | PK |
| `slug` | string, unique | |
| `title` | string | |
| `summary` | string | One-line problem statement (card) |
| `role` | string | e.g., "Solo", "Lead", "Research assistant" |
| `status` | enum | `draft` \| `published` |
| `year` | int | |
| `problem` | text | Case-study: context/problem |
| `approach` | text | |
| `architecture` | text (MDX) | Rich body incl. diagram references |
| `challenges` | text (MDX) | Key technical decisions & trade-offs |
| `results` | text | Outcomes/impact/metrics |
| `retrospective` | text | "What I'd do differently" |
| `techStack` | string[] / JSONB | For stack chips + filtering |
| `repoUrl` | string, nullable | |
| `demoUrl` | string, nullable | |
| `featured` | boolean | |
| `sortOrder` | int | |
| `ogImageUrl` | string, nullable | |

### Table: `Tag`
Shared across publications and projects — the mechanism that makes your intellectual threads visible everywhere.

| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid | PK |
| `slug` | string, unique | `zk`, `ai-security`, `agentic-ai`… |
| `label` | string | Display name |
| `description` | string, nullable | Optional tag landing-page blurb |
| `color` | string, nullable | Optional per-tag accent (kept within palette) |

### Join tables: `PublicationTag`, `ProjectTag`
Composite PK `(publicationId, tagId)` / `(projectId, tagId)`. Many-to-many.

### Table: `TimelineEvent`
Powers the academic/professional timeline on `/about` and the CV.

| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid | PK |
| `type` | enum | `education` \| `experience` \| `award` \| `talk` \| `service` \| `publication-milestone` |
| `title` | string | e.g., "M.Sc. Computer Engineering" |
| `organization` | string | e.g., "Sharif University of Technology" |
| `location` | string, nullable | |
| `startDate` | date | |
| `endDate` | date, nullable | Null = ongoing/"Present" |
| `description` | text, nullable | |
| `highlights` | JSONB / text[] | Bullet points |
| `url` | string, nullable | |
| `sortOrder` | int | |
| `visible` | boolean | Toggle without deleting |

### Table: `Skill` + `SkillCategory`
For the grouped, scannable skills section.

- `SkillCategory`: `id`, `name` (Blockchain / ML & DL / Systems / Security / Languages), `sortOrder`.
- `Skill`: `id`, `categoryId` (FK), `name`, `proficiency` (enum: `expert`\|`advanced`\|`proficient`, optional — used for grouping/emphasis, **not** a childish percentage bar), `sortOrder`.

### Table: `Media`
Files attached to publications/projects.

| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid | PK |
| `ownerType` | enum | `publication` \| `project` \| `page` |
| `ownerId` | uuid | Polymorphic reference |
| `url` | string | Object-storage URL |
| `kind` | enum | `pdf` \| `image` \| `figure` \| `poster` |
| `alt` | string | Accessibility |
| `caption` | string, nullable | |
| `sortOrder` | int | |

### Table: `User` (admin accounts — kept tiny)
Even if it's just you, model it properly.

| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid | PK |
| `email` | string, unique | |
| `passwordHash` | string | **Argon2id** hash (never plaintext) |
| `role` | enum | `owner` \| `editor` (future-proofing) |
| `totpSecret` | string, encrypted | For 2FA (§5) |
| `totpEnabled` | boolean | |
| `backupCodes` | JSONB (hashed) | 2FA recovery |
| `failedAttempts` | int | For lockout logic |
| `lockedUntil` | datetime, nullable | Account lockout timestamp |
| `lastLoginAt` | datetime, nullable | |
| `lastLoginIp` | string, nullable | For login-alert emails |

### Table: `Session` (if using server-side sessions)
`id`, `userId` (FK), `tokenHash`, `expiresAt`, `createdAt`, `userAgent`, `ip`. Enables server-side revocation (log-out-everywhere).

### Table: `AuditLog`
Security-relevant and content-change events — both a security control and a signal of engineering maturity.

| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid | PK |
| `userId` | uuid, nullable | Null for anonymous/failed attempts |
| `action` | string | `login.success`, `login.fail`, `publication.update`, `2fa.enabled`… |
| `entityType` | string, nullable | |
| `entityId` | string, nullable | |
| `ip` | string | |
| `userAgent` | string | |
| `metadata` | JSONB | Diff/details |
| `createdAt` | datetime | |

### Table: `ContactMessage`
| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid | PK |
| `name` | string | |
| `email` | string | Validated |
| `subject` | string, nullable | |
| `body` | text | |
| `status` | enum | `new` \| `read` \| `archived` \| `spam` |
| `ip` | string | For abuse handling |
| `createdAt` | datetime | |

### Table: `SiteSetting`
Key/value (JSONB) singleton for global config: hero thesis text, social links, featured ordering overrides, SEO defaults, feature flags (e.g., blog on/off). Editable from the admin panel so the homepage copy never requires a deploy.

### Schema notes & indexing
- Index `slug` (unique), `status`, `year`, `featured`, and the join-table FKs for fast filtered queries.
- Use Postgres **full-text search** columns (generated `tsvector`) on `Publication.title/abstract` and `Project.title/summary` for on-site search.
- `status = draft` content is **never** returned by public queries — enforce this at the query layer (a `publishedOnly()` helper), not just the UI.
- Keep a **generated CV data view** that assembles `TimelineEvent` + `Publication` + `Skill` into the CV page and the PDF export, so the PDF and the site share one source of truth (supports §2.6 and §6).

## 4.4 API Surface (logical, not code)

- `GET` content is **not** a public REST API you expose — public pages read the DB directly via server components at build/revalidate. This shrinks attack surface (no public data API to abuse).
- **Route handlers you do expose:**
  - `POST /api/contact` — public, heavily rate-limited + spam-protected (honeypot + Turnstile), writes `ContactMessage`, sends you an email.
  - `POST /api/revalidate` — secured webhook (secret header) that triggers ISR revalidation when you publish.
  - `POST /api/auth/*` — login, logout, 2FA verify (admin only, see §5).
  - Admin CRUD via **server actions** (not public endpoints), auth-gated in middleware.
- All inputs validated with Zod; all mutations audit-logged; all admin actions require an authenticated session **and** CSRF protection.

---

# 5. Secure Admin Panel

This section is where you can most directly demonstrate security engineering — treat the design itself as a portfolio artifact. Two goals: (1) make the admin surface **undiscoverable** to the public and scrapers, and (2) make it **uncompromisable** even if discovered. Obscurity is a *speed bump*, never the lock — the real security is the auth stack. Both matter.

## 5.1 Threat Model (state it explicitly — this is what impresses reviewers)

- **Adversaries:** opportunistic bots/scanners probing common admin paths; credential-stuffing bots; scrapers harvesting links; a targeted attacker who found the route.
- **Assets:** admin credentials, session tokens, content integrity, contact-message data.
- **Attack surfaces:** the login route, the auth API, the session mechanism, the contact form, dependency supply chain.
- **Out of scope (documented):** physical access, a fully compromised host, nation-state zero-days — noted so reviewers see you scoped deliberately.

## 5.2 Obscuring the Admin Route (defense-in-depth layer 1)

The requirement "nobody can see the admin login" decomposes into: not linked, not indexed, not guessable, and not observable.

1. **Non-obvious path.** Do **not** use `/admin`, `/login`, `/wp-admin`, `/dashboard`. Use an unguessable segment, e.g. `/x7k2-console` or a UUID-like slug, stored in an env var (`ADMIN_PATH`) so it's not hardcoded in the repo. This defeats automated path scanners that hammer common names.
2. **Never linked.** No nav link, no sitemap entry, no reference in any public page or client bundle. The path lives only in server-side config and your memory/password manager.
3. **Explicitly de-indexed.** `robots.txt` `Disallow`s the segment; every admin page emits `X-Robots-Tag: noindex, nofollow` **and** a `<meta name="robots" content="noindex">`. (robots.txt alone doesn't guarantee non-indexing — the header is the real control.)
4. **Not observable in bundles.** Because admin code is a separate route group and code-split, the public JS bundle contains **zero** references to the admin path or admin components. Verify this by grepping the production bundle.
5. **Optional network-layer gate.** For maximum obscurity, put the admin path behind **Cloudflare Access** (Zero Trust) or a **WAF rule** that only serves the route to your identity/IP — so unauthenticated requests to the path get a 404 at the edge, never reaching your app. This is the strongest "invisible to the public" measure and is free-tier viable.
6. **Uniform 404s.** Requests to the admin path from unauthorized contexts return an indistinguishable **404** (not 401/403), so a scanner can't tell the path exists. No timing or response-shape tell.

**Reiterate to yourself:** these six measures reduce *noise and casual discovery*. They are not the security boundary. The next subsection is.

## 5.3 Authentication (defense-in-depth layer 2 — the real lock)

- **Password hashing:** **Argon2id** (memory-hard) with sensible params (e.g., 19 MiB, iterations tuned to ~250ms). Never MD5/SHA/bcrypt-without-reason. Passwords never stored or logged in plaintext.
- **Strong single-owner credential:** a long unique passphrase from a password manager. Since it's just you, there's no self-serve signup — **account creation is a seed script / one-off**, and the public site has **no registration endpoint at all** (removes a whole attack class).
- **Two-factor authentication (mandatory):** **TOTP** (Authenticator app) via the `totpSecret` field, enforced on every login. Provide hashed **backup codes**. Optionally step up to **WebAuthn/passkeys** (hardware-key / platform biometric) — phishing-resistant and the strongest option; a great thing to have built for an AI-security applicant.
- **Session strategy:** prefer **server-side sessions** with an opaque token in an **httpOnly, Secure, SameSite=Strict** cookie over a stateless JWT-in-cookie, because sessions are **server-revocable** (instant "log out everywhere," kill on suspicious activity). If you use JWTs, keep them **short-lived (≤15 min) access + rotating refresh**, store refresh server-side, and still keep them in httpOnly cookies — **never in localStorage** (XSS-exfiltratable). Sign with a strong secret from env/secret manager, rotate periodically.
- **CSRF protection:** double-submit token or the framework's built-in CSRF for all state-changing admin actions (SameSite=Strict already blocks most cross-site POSTs; defense in depth).
- **Login alerts:** email you (via Resend) on every successful login with IP/device, and on lockouts — you'll know immediately if someone's in.

## 5.4 Rate Limiting & Abuse Controls (layer 3)

- **Login rate limiting:** strict per-IP and per-account limits (e.g., 5 attempts / 15 min) with **exponential backoff** and temporary **account lockout** (`lockedUntil`). Back it with **Upstash Redis** (serverless, works on the edge) or the DB.
- **Global edge rate limiting** via Cloudflare on the admin path and `/api/auth/*`.
- **Generic error messages:** "Invalid credentials" — never reveal whether the email exists (no user enumeration). Constant-time comparison to avoid timing leaks.
- **Contact form:** honeypot field + **Cloudflare Turnstile** (privacy-friendly CAPTCHA) + rate limit + server-side validation; store IP for abuse response.
- **Bot management:** Cloudflare bot-fight mode for the whole site.

## 5.5 Application & Transport Hardening (layer 4)

- **Security headers** (via `next.config` / middleware): a strict **Content-Security-Policy** (nonce-based, no `unsafe-inline`), `Strict-Transport-Security` (HSTS, preload), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` (or CSP `frame-ancestors 'none'`), `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` locking down camera/mic/geo. Grade target: **A+ on securityheaders.com and SSL Labs**.
- **HTTPS everywhere**, TLS 1.2+ only, auto-renewed certs (Vercel/Cloudflare handle this).
- **Input validation & output encoding** everywhere (Zod in, React auto-escaping out) → XSS/SQLi defense. Prisma's parameterized queries prevent SQL injection by default.
- **Secrets management:** all secrets in env/secret manager (Vercel/Doppler), **never** in the repo; `.env` git-ignored; rotate on any suspicion. Separate secrets per environment.
- **Dependency hygiene:** Dependabot/Renovate + `npm audit` in CI; pin versions; minimal dependencies (each one is supply-chain risk — relevant to your field).
- **Principle of least privilege:** the DB user the app connects with has only the grants it needs; admin routes gated in **middleware** (auth checked before the page renders, not just client-side).
- **Audit logging:** every admin action + auth event to `AuditLog` (§4.3). Review periodically.

## 5.6 Admin Panel UX (what you actually use day-to-day)

- Clean CRUD dashboard (its own design, reusing the token system) with: list/table views for Publications, Projects, Timeline, Skills, Tags, Media, Contact messages; create/edit forms with **Zod-validated** fields; a **draft → publish** workflow (drafts never public); markdown/MDX editor with live preview for rich bodies; drag-to-reorder for `sortOrder`; media uploader to object storage; and a "publish" action that triggers ISR revalidation so the public site updates within seconds.
- **Optimistic UI** via TanStack Query for a snappy editing feel.
- A small **"security" panel**: recent logins, active sessions (with revoke), and the audit log — useful and, again, a nice thing to show off.

**Net security posture:** obscurity (5.2) filters out the noise; strong auth + 2FA + Argon2id + server-revocable sessions (5.3) stops credential attacks; rate limiting + lockout (5.4) stops brute force; headers + validation + least privilege (5.5) close the app-level gaps. Any single layer failing does not compromise the system.

---

# 6. Deployment & CI/CD Pipeline

## 6.1 Hosting Recommendation

| Option | Fit for you | Verdict |
|--------|-------------|---------|
| **Vercel** (frontend + serverless) + **Neon** (Postgres) + **Cloudflare** (DNS/WAF/CDN) + **R2** (storage) | Zero-config Next.js deploys, global edge CDN, automatic HTTPS/preview deploys, generous free tier, ISR + `next/og` work out of the box | **Recommended default.** Least ops overhead, best performance, lets you focus on content and the security build rather than server-babysitting |
| **Docker on a VPS** (Hetzner/DigitalOcean) behind **Nginx/Caddy** + **Cloudflare** | Full control; you run Postgres, the app container, backups yourself. A meaningful DevOps signal | Choose **only if** you want to *demonstrate* infra/DevOps skill or need data residency control. More maintenance, patching, and uptime responsibility |
| **AWS** (Amplify/ECS/RDS) | Enterprise-grade, most powerful, most complex | Overkill for a portfolio; the ops tax isn't worth it unless you specifically want AWS on your resume |

**Recommendation:** **Vercel + Neon + Cloudflare + R2.** It gives committee members an edge-fast, always-up site with near-zero maintenance, while Cloudflare in front provides the WAF/Access/rate-limiting that §5 relies on. Keep the whole thing **containerizable** (a `Dockerfile` in the repo) so the "I can self-host this anywhere" story is true and you're not locked in — the best of both worlds. If you want the DevOps showcase, do the **Docker-on-Hetzner** variant as a documented alternative in your project writeup.

**Domain:** buy a clean `parsaoryani.com` (or `.dev`/`.ai`); put Cloudflare in front for DNS, CDN, WAF, and Access. Configure DKIM/SPF/DMARC if sending mail from the domain.

## 6.2 Environments

- **Production** — `main` branch → live site.
- **Preview** — every PR gets an automatic Vercel preview URL (great for reviewing content/design changes safely). Use a **Neon branch** DB per preview so previews never touch prod data.
- **Local** — Docker Compose (Postgres + app) or a Neon dev branch; `.env.local` with dev secrets.

Strict secret separation per environment; production secrets only in Vercel/secret manager.

## 6.3 CI/CD Pipeline (GitHub Actions + Vercel)

Pipeline stages on every push/PR:

1. **Install & cache** dependencies (pnpm, lockfile-frozen).
2. **Static checks:** TypeScript `tsc --noEmit`, ESLint, Prettier check.
3. **Unit/component tests:** Vitest + React Testing Library (test the security-critical helpers: auth, `publishedOnly` query guard, rate limiter).
4. **Build:** `next build` (fails the pipeline on any type/build error).
5. **E2E (on PRs):** Playwright smoke tests — home renders, nav works, contact form validates, admin route returns 404 unauthenticated, a published item appears / a draft does not.
6. **Security checks:** `npm audit` / Dependabot, secret-scanning (Gitleaks), and optionally a lightweight SAST (CodeQL). Fail on high-severity.
7. **DB migrations:** `prisma migrate deploy` runs against the target DB in a controlled step (never auto-destructive; migrations reviewed).
8. **Deploy:** Vercel deploys previews on PRs and production on merge to `main`. Post-deploy, hit the `/api/revalidate` webhook if needed.
9. **Post-deploy verification:** a Lighthouse CI run asserting the **≥95 budget** (fails the build if performance/SEO/a11y regress) and an uptime/synthetic check.

**Branch protection:** `main` requires green CI + (self-)review; no direct pushes. Conventional Commits + an auto-generated changelog is a nice touch.

**Observability:** Vercel Analytics or Plausible for traffic; Sentry (free tier) for error tracking; Cloudflare analytics for edge/WAF events; UptimeRobot/Better Stack for uptime alerts. Log-based alerting on repeated `login.fail` audit events.

**Backups & DR:** Neon provides point-in-time restore; additionally schedule a periodic `pg_dump` to R2. Object storage (R2) is durable; keep the CV PDF and paper PDFs also mirrored in the repo/backups. Document a one-page restore runbook.

## 6.4 Launch Checklist (pre-flight)

- [ ] All content proofread; **CV PDF current** and reachable at a stable `/cv.pdf`.
- [ ] Lighthouse ≥ 95 on all four categories (verified in CI).
- [ ] JSON-LD (`Person`, `ScholarlyArticle`) validates in Google Rich Results Test.
- [ ] `sitemap.xml` submitted to Google Search Console; site verified.
- [ ] `robots.txt` disallows admin + `/api`; admin returns 404 unauthenticated; admin headers `noindex`.
- [ ] securityheaders.com **A+**; SSL Labs **A+**.
- [ ] 2FA enrolled; backup codes stored; login-alert email tested.
- [ ] Rate limiting verified (login lockout + contact-form abuse).
- [ ] Works with **JavaScript disabled** (content readable) and passes a keyboard-only + screen-reader pass.
- [ ] OG images render correctly when links are shared (test on X/LinkedIn/Slack).
- [ ] `prefers-reduced-motion` respected.
- [ ] All external links (Scholar, GitHub, ORCID, LinkedIn) correct and open appropriately.

---

# 7. Build Sequence (suggested order of operations)

A recommended phase order so you always have a shippable increment:

1. **Foundations** — repo, TypeScript strict, Tailwind + token system (§2.2–2.4), fonts, layout shell (nav/footer), CI skeleton.
2. **Data layer** — Prisma schema (§4.3), Neon DB, seed script, `publishedOnly` query guard, object storage wiring.
3. **Public content pages** — Home, Research, Projects, About, CV, Contact with SSG/ISR + SEO/JSON-LD (§3.5). Ship this first; it's what the audience sees.
4. **Admin panel + security** — obscured route, Argon2id + 2FA auth, sessions, rate limiting, CRUD, audit log (§5). Turn the site dynamic.
5. **Polish** — motion, OG image generation, RSS, MDX writeups, KaTeX/Shiki, accessibility pass.
6. **Hardening & launch** — security headers, Lighthouse CI budget, Playwright E2E, backups, launch checklist (§6.4).

Ship phase 3 publicly early (even with content managed via seed/MDX) so you have a live URL for applications; layer in the admin panel (phases 4+) without blocking your launch.

---

## Appendix A — Decision Summary (defaults at a glance)

| Domain | Recommended default | Strong alternative |
|--------|--------------------|--------------------|
| Framework | Next.js 14+ (App Router, TS strict) | Astro (if purely static, no admin) |
| Styling | Tailwind + CSS-variable tokens | — |
| UI primitives | shadcn/ui (Radix) | — |
| Backend shape | Custom in-app API (Path B) | Payload CMS (Path A) / MDX-in-repo (Path C) |
| ORM / DB | Prisma + PostgreSQL (Neon) | Supabase |
| Storage | Cloudflare R2 | AWS S3 / Supabase Storage |
| Auth | Server sessions + TOTP 2FA, Argon2id | Auth.js/Lucia; WebAuthn/passkeys upgrade |
| Rate limiting | Upstash Redis + Cloudflare | DB-backed |
| Hosting | Vercel + Cloudflare front | Docker on Hetzner VPS (DevOps showcase) |
| CI/CD | GitHub Actions + Vercel + Lighthouse CI | — |
| Analytics | Plausible / Vercel Analytics | — |
| Accent palette | Deep Slate + Signal Cyan (`#0A0E14` / `#38E1C4`) | Warm Academic (gold `#E3B341`) |
| Type system | Inter + Source Serif 4 + JetBrains Mono | Geist + Geist Mono |

## Appendix B — What Makes This Site Read as "Top-Tier Researcher"

The details that separate you from a generic portfolio: a crisp one-paragraph research thesis above the fold; publications formatted like a real academic CV with one-click BibTeX; project pages structured as systems writeups (problem→architecture→retrospective) rather than resume bullets; valid schema.org markup; a self-designed, documented security model (directly on-topic for AI/blockchain security); a 95+ Lighthouse score; and a site that works with JS disabled and passes a screen-reader test. Every one of these is a signal your target audience is specifically trained to notice.
