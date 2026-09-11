# Critical Site Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Repair the site's critical public technical issues and make its current Agent Security identity accurate, coherent, and consistently evidenced without inventing accomplishments.

**Architecture:** Keep the existing Next.js App Router and public-data boundary. Put reusable public wording and CV facts in focused content modules, update both seeded and generated data for static/server parity, and add behavior/content contract tests before changing production components.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Vitest, Testing Library, Playwright, Markdown, ReportLab/PDF validation tooling.

## Global Constraints

- Preserve the existing visual identity and route structure.
- Keep Agent Security as the current focus and blockchain as prior work/technical foundation.
- Do not invent publications, research outputs, benchmarks, roles, dates, or formal results.
- Keep all commits local; do not push or deploy.
- Use `parsa.oryani82@sharif.edu` as the single primary public email.
- Treat the thesis/current research as work in progress.
- Update source/seed and committed static content together.

---

### Task 1: Accessible Mobile Navigation

**Files:**
- Create: `src/components/layout/nav.test.tsx`
- Modify: `src/components/layout/nav.tsx`

**Interfaces:**
- Consumes: `Nav({ showResearch }: { showResearch: boolean })`
- Produces: accessible mobile dialog navigation with deterministic open/close and focus behavior

- [x] **Step 1: Write failing behavior tests**

Cover opening, opaque viewport surface, Escape close, body scroll lock, trigger focus return, link close, and active-page semantics using Testing Library.

- [x] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/components/layout/nav.test.tsx`

Expected: failures for dialog semantics, scroll locking, Escape handling, and focus restoration.

- [x] **Step 3: Implement the minimal navigation behavior**

Add a trigger ref and menu ref, close on Escape and pathname change, lock `document.body.style.overflow`, focus the first menu link, restore the trigger focus, and render the menu as an opaque fixed surface below the header.

- [x] **Step 4: Run the focused test and verify GREEN**

Run: `npm test -- src/components/layout/nav.test.tsx`

Expected: all navigation tests pass.

- [x] **Step 5: Commit**

Commit message: `fix: make mobile navigation accessible`

### Task 2: Coherent Home, About, Research, and Contact Narrative

**Files:**
- Create: `src/content/research-profile.ts`
- Create: `src/content/research-profile.test.ts`
- Modify: `src/app/(public)/page.tsx`
- Modify: `src/app/(public)/about/page.tsx`
- Modify: `src/app/(public)/research/page.tsx`
- Modify: `src/components/content/contact-surface/static.tsx`
- Modify: `src/components/layout/footer.tsx`

**Interfaces:**
- Produces: shared `PRIMARY_RESEARCH_STATEMENT`, `SHORT_TRANSITION`, `ABOUT_STORY_SECTIONS`, and `CURRENT_RESEARCH` content contracts

- [x] **Step 1: Write failing content-contract tests**

Assert that the current identity names Agent Security, the transition names both intellectual continuity and the local mentorship/collaboration constraint, no content claims AI is inherently easier, no unsupported “highest grade in both” wording exists, and current work is labeled in progress.

- [x] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/content/research-profile.test.ts`

Expected: module-not-found or missing-export failure.

- [x] **Step 3: Add the content module and update pages**

Render the hero statement immediately without `TypewriterText`; add Research as the primary CTA. Condense About into one story. Replace the Research empty state with a thesis/current-work card containing questions, threat model, method, status, advisor, limitations, and collaboration CTA. Use one email and remove duplicated positioning from contact/footer.

- [x] **Step 4: Run focused and related tests**

Run: `npm test -- src/content/research-profile.test.ts src/lib/home/hero.test.ts`

Expected: all selected tests pass.

- [x] **Step 5: Commit**

Commit message: `feat: clarify current research narrative`

### Task 3: Honest Project Framing and Bounded Claims

**Files:**
- Create: `src/content/project-claims.test.ts`
- Modify: `src/app/(public)/projects/page.tsx`
- Modify: `src/app/(public)/projects/[slug]/page.tsx`
- Modify: `src/content/generated/site-data.json`
- Modify: `scripts/seed.ts`

**Interfaces:**
- Consumes: current `PublicProject` fields
- Produces: previous-work framing and bounded prototype claims in both server-seeded and static content

- [x] **Step 1: Write a failing claim-safety test**

Load the generated site data and reject categorical/high-risk phrases such as `Bulletproof-style zk-SNARK`, `complete POUR protocol`, `all 18 threat vectors`, `proved the privacy-compliance trade-off`, `keeps private keys safe`, `full experiment reproducibility metadata`, and unqualified complete-page claims.

- [x] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/content/project-claims.test.ts`

Expected: failures naming the current unsafe phrases.

- [x] **Step 3: Bound the wording and separate past/current work**

Describe ZK-Mixer as an educational/research prototype using its implemented construction without conflating proof-system families. Retain raw metrics only when scoped as repository-reported and direct readers to the repository for methodology. State concrete Ethereum CLI controls instead of absolute safety. Separate implemented BRCC baseline support from planned workloads. Add a concise transfer-to-Agent-Security note on listing/detail pages.

- [x] **Step 4: Run focused project tests**

Run: `npm test -- src/content/project-claims.test.ts src/components/content/project-card.test.tsx`

Expected: all selected tests pass.

- [x] **Step 5: Commit**

Commit message: `fix: bound project security claims`

### Task 4: Consistent Web, Markdown, and PDF CV

**Files:**
- Create: `src/content/cv-profile.ts`
- Create: `src/content/cv-profile.test.ts`
- Create: `scripts/cv/build-pdf.py`
- Modify: `src/app/(public)/cv/page.tsx`
- Modify: `CV.md`
- Modify: `public/cv.pdf`

**Interfaces:**
- Produces: canonical critical CV facts, selected-project list, readable PDF, and cross-surface validation

- [x] **Step 1: Write failing CV contract tests**

Assert one primary email, Sep 2025-present M.Sc. dates, Feb 2025 B.Sc. completion, Agent Security focus, exact cryptography-grade distinction, and all three selected project titles. Check the web CV source and Markdown source for those facts.

- [x] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/content/cv-profile.test.ts`

Expected: failure because selected projects/canonical facts are incomplete.

- [x] **Step 3: Align web and Markdown CV**

Use the canonical content constants for the web header/profile, render semantic outcome/highlight lists, suppress empty sections, and add Selected Projects. Update `CV.md` to match the same critical facts and avoid unsupported comparative or categorical claims.

- [x] **Step 4: Generate and validate the PDF**

Generate a readable two-page `public/cv.pdf` with title/author metadata, logical headings, working links, and the same critical facts. Extract PDF text and compare required facts/titles.

- [x] **Step 5: Run focused tests and PDF checks**

Run: `npm test -- src/content/cv-profile.test.ts && python3 scripts/cv/build-pdf.py --check`

Expected: tests pass and the PDF check reports matching critical facts.

- [x] **Step 6: Commit**

Commit message: `feat: synchronize cv surfaces`

### Task 5: Canonical Metadata, Link Safety, and Final Verification

**Files:**
- Create: `src/lib/site/metadata.ts`
- Create: `src/lib/site/metadata.test.ts`
- Modify: `src/app/layout.tsx`
- Modify: public page metadata exports under `src/app/(public)/**/page.tsx`
- Modify: public components containing new-tab links

**Interfaces:**
- Produces: `canonicalPath(pathname: string)` metadata helper and safe external links

- [x] **Step 1: Write failing metadata tests**

Assert `/` canonical resolution, normalized nested paths, and compatibility with the configured metadata base.

- [x] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/lib/site/metadata.test.ts`

Expected: module-not-found or missing-export failure.

- [x] **Step 3: Implement canonical metadata and link safety**

Add canonical alternates to every indexable public page and dynamic detail page. Keep compatibility pages noindex. Add `rel="noopener noreferrer"` to external new-tab links.

- [x] **Step 4: Run all automated verification**

Run: `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, and `npm run static:verify`.

Expected: every command exits 0 with no test failures, type errors, lint errors, build failures, or static validation failures.

- [x] **Step 5: Run browser verification**

Use Playwright against the local site. Check all primary routes, the mobile menu at 320/375/390/430 pixels, Escape/focus behavior, overflow, desktop layouts, both color themes, hero immediate content, Research status, project framing, CV download, canonicals, and console errors.

- [x] **Step 6: Review the final diff and commit**

Run: `git diff --check` and review `git diff --stat` plus all changed files.

Commit message: `fix: complete critical public site remediation`
