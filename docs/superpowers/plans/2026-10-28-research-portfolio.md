# Research Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a first-class, editable research portfolio with a featured agenda, selected public proposal summaries, sanitized PDF links, proposal detail pages, and a separate publications section.

**Architecture:** Add dedicated Prisma records for the singleton agenda and proposal entries, then expose published records through the existing public-data provider and static snapshot. Reuse the current admin/API patterns for editing and the current public design system for landing/detail pages. Keep proposal data structurally separate from publications so labels and metadata remain academically honest.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Prisma 6, Zod 4, Tailwind CSS 4, Vitest, Testing Library.

## Global Constraints

- Read relevant guidance in `node_modules/next/dist/docs/` before changing App Router code.
- Only published, non-deleted proposal records can enter public or static data.
- Proposal PDFs are optional and must be labeled as sanitized public versions.
- Do not place proposals in the Publication model or publication UI.
- Preserve the current publication detail routes and year grouping.
- The final agenda text and real proposal documents are outside this implementation.

---

## File structure

- `prisma/schema.prisma` and a new migration own persistence and enums.
- `src/lib/validation/research-portfolio.ts` owns API validation and public label maps.
- `src/lib/db/queries.ts` owns published-record filtering.
- `src/lib/public-data/{contract,server,static,index}.ts` owns the runtime/static provider boundary.
- `src/content/site-data.schema.ts` and `src/lib/static-export/exporter.ts` own snapshot validation/export.
- `src/components/content/research-agenda-card.tsx` and `research-proposal-card.tsx` own reusable public presentation.
- `src/app/(public)/research/page.tsx` composes the landing page; `research/proposals/[slug]/page.tsx` owns proposal details.
- `src/app/api/research-agenda/route.ts` and `src/app/api/research-proposals/**/route.ts` own authenticated mutations.
- `src/app/(admin)/[adminPath]/(main)/research-portfolio/**` owns authoring UI.

### Task 1: Persistence and validation contract

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/<timestamp>_add_research_portfolio/migration.sql`
- Create: `src/lib/validation/research-portfolio.ts`
- Create: `src/lib/validation/research-portfolio.test.ts`

**Interfaces:**
- Produces: `researchAgendaSchema`, `researchProposalSchema`, `proposalKindLabels`, `proposalStageLabels`.
- Produces Prisma models `ResearchAgenda` and `ResearchProposal`, with enums `ResearchContentStatus`, `ResearchProposalKind`, and `ResearchProposalStage`.

- [ ] Write failing validation tests covering required title/summary/year/version, URL validation, empty optional detail fields, and all enum values.
- [ ] Run `npm test -- src/lib/validation/research-portfolio.test.ts`; expect failures because the module does not exist.
- [ ] Add strict Zod schemas. Use `z.enum(["thesis_proposal", "research_proposal", "concept_note"])`, `z.enum(["in_preparation", "active", "archived"])`, and `z.enum(["draft", "published"])`; trim strings and convert empty optional URLs to `null`.
- [ ] Add the agenda singleton and proposal models with `version Int @default(1)`, `deletedAt DateTime?`, `sortOrder Int @default(0)`, `themes Json`, timestamps, and indexes on public filter/order fields.
- [ ] Generate and inspect the migration with `npx prisma migrate dev --name add_research_portfolio --create-only`; expect a migration containing only new enums/tables/indexes.
- [ ] Run `npm run db:generate` and the focused test; expect PASS.
- [ ] Commit with `feat: add research portfolio data model`.

### Task 2: Public queries and snapshot pipeline

**Files:**
- Modify: `src/lib/db/queries.ts`
- Modify: `src/lib/public-data/contract.ts`
- Modify: `src/lib/public-data/server.ts`
- Modify: `src/lib/public-data/static.ts`
- Modify: `src/lib/public-data/index.ts`
- Modify: `src/content/site-data.schema.ts`
- Modify: `src/content/site-data.schema.test.ts`
- Modify: `src/lib/static-export/exporter.ts`
- Modify: `scripts/static/prepare-workspace.ts`

**Interfaces:**
- Produces: `getPublishedResearchAgenda(): Promise<PublicResearchAgenda | null>`.
- Produces: `getAllResearchProposals(): Promise<PublicResearchProposal[]>` and `getResearchProposalBySlug(slug: string)`.
- Extends `PublicDataProvider` and `StaticSiteData` with `researchAgenda` and `researchProposals`.

- [ ] Add failing snapshot-schema tests with one valid agenda/proposal and cases containing a draft status, invalid URL, and missing version label.
- [ ] Run `npm test -- src/content/site-data.schema.test.ts`; expect the new assertions to fail.
- [ ] Add public query functions whose `where` clause is exactly `{ status: "published", deletedAt: null }`; order proposals by featured descending, sort order ascending, and year descending.
- [ ] Define public contract types that omit admin status, soft-delete, optimistic-lock version, and any private metadata.
- [ ] Map server records into those types and add static-provider getters with the same signatures.
- [ ] Extend the Zod snapshot schema and exporter; ensure JSON dates are serialized as ISO strings.
- [ ] Update the generated static workspace provider exports and remove `research/proposals/[slug]` when the snapshot has no proposal records.
- [ ] Run focused schema tests, `npm run typecheck`, and `npm run static:export:check`; expect PASS.
- [ ] Commit with `feat: publish research portfolio data`.

### Task 3: Public agenda and proposal components

**Files:**
- Create: `src/components/content/research-agenda-card.tsx`
- Create: `src/components/content/research-proposal-card.tsx`
- Create: `src/components/content/research-proposal-card.test.tsx`

**Interfaces:**
- Consumes: `PublicResearchAgenda`, `PublicResearchProposal`, and label maps.
- Produces: `ResearchAgendaCard({ agenda })` and `ResearchProposalCard({ proposal })`.

- [ ] Write component tests asserting visible kind/stage/version labels, descriptive details link, and `Sanitized public PDF` action only when `pdfUrl` exists.
- [ ] Run `npm test -- src/components/content/research-proposal-card.test.tsx`; expect module-not-found failure.
- [ ] Implement focused server components using existing `Badge`, `Button`, and `Link` patterns. Add `aria-hidden="true"` to decorative icons and visible text to all status signals.
- [ ] Keep the agenda component capable of rendering a fallback agenda with no document link.
- [ ] Run the component tests; expect PASS.
- [ ] Commit with `feat: add research portfolio cards`.

### Task 4: Research landing and proposal detail routes

**Files:**
- Modify: `src/app/(public)/research/page.tsx`
- Create: `src/app/(public)/research/proposals/[slug]/page.tsx`
- Modify: `src/app/sitemap.ts`

**Interfaces:**
- Consumes public-data getters from Task 2 and components from Task 3.
- Produces static proposal routes through `generateStaticParams()` and per-proposal metadata.

- [ ] Add a page test or extracted view test that renders agenda, proposals, and publications as separately headed regions and hides Selected Proposals for an empty array.
- [ ] Run the focused test; expect failure against the publication-only layout.
- [ ] Refactor `/research` into the ordered sections Research Agenda, Selected Proposals, and Publications. Keep each query inside its own `safeQuery` call so one failure does not hide other sections.
- [ ] Add collaboration/research-visit/PhD availability copy without claiming a current formal opening.
- [ ] Add proposal details with motivation, research question, approach, expected contributions, limitations, and the non-peer-reviewed disclosure.
- [ ] Add published proposal URLs to the sitemap and generate static params from published proposals only.
- [ ] Run focused tests and `npm run typecheck`; expect PASS.
- [ ] Commit with `feat: redesign research portfolio pages`.

### Task 5: Authenticated portfolio APIs

**Files:**
- Create: `src/app/api/research-agenda/route.ts`
- Create: `src/app/api/research-proposals/route.ts`
- Create: `src/app/api/research-proposals/[id]/route.ts`
- Create: `src/app/api/research-proposals/route.test.ts`

**Interfaces:**
- Consumes the Zod schemas from Task 1, `getSession()`, Prisma, audit log, revisions, and optimistic locking.
- Produces GET/POST/PUT/DELETE endpoints matching existing publication semantics.

- [ ] Write route tests for 401 unauthenticated, 400 invalid input, 201 creation, 409 stale version, and soft delete.
- [ ] Run the focused route test; expect module-not-found failure.
- [ ] Implement agenda upsert and proposal CRUD with validation, audit actions prefixed `research_agenda.` and `research_proposal.`, revision records before updates, and version increments.
- [ ] Never accept or store professor, institution, lab, application, or private-note fields.
- [ ] Run focused tests; expect PASS.
- [ ] Commit with `feat: add research portfolio admin APIs`.

### Task 6: Admin authoring experience

**Files:**
- Modify: `src/components/admin/sidebar.tsx`
- Create: `src/app/(admin)/[adminPath]/(main)/research-portfolio/page.tsx`
- Create: `src/app/(admin)/[adminPath]/(main)/research-portfolio/agenda-form.tsx`
- Create: `src/app/(admin)/[adminPath]/(main)/research-portfolio/proposals/new/page.tsx`
- Create: `src/app/(admin)/[adminPath]/(main)/research-portfolio/proposals/[id]/page.tsx`
- Create: `src/components/admin/research-proposals-list.tsx`

**Interfaces:**
- Consumes API endpoints from Task 5.
- Produces agenda editing plus proposal create/edit/publish/order/delete workflows.

- [ ] Add a navigation assertion test for a single `Research Portfolio` item in the Content group.
- [ ] Run the focused test; expect failure.
- [ ] Build the overview with agenda state, proposal table, `New proposal` action, and explicit Draft/Published badges.
- [ ] Build shared field controls for title, slug, kind, stage, year, version label, summary, themes, optional detail sections, sanitized PDF URL, featured, sort order, and status.
- [ ] Surface field-level validation, 409 conflict text, save success, and delete confirmation using existing admin interaction patterns.
- [ ] Run focused tests, lint, and typecheck; expect PASS.
- [ ] Commit with `feat: add research portfolio editor`.

### Task 7: Initial fallback content and end-to-end verification

**Files:**
- Modify: `scripts/seed.ts`
- Modify: `src/content/generated/site-data.json` only through the existing export command.
- Modify: `README.md` if the content workflow is undocumented.

**Interfaces:**
- Seeds one published fallback agenda based on the existing research-page positioning; seeds no fake proposal.

- [ ] Add an idempotent agenda upsert to the seed with the headline `Secure and Trustworthy Agentic AI` and the existing public research summary; do not add proposal fixtures to production seed data.
- [ ] Run `npm run db:seed` twice; expect both runs to succeed without duplicates.
- [ ] Run `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build`; expect all to pass.
- [ ] Run `npm run static:export` followed by `npm run static:verify`; expect the Research page to exist and no proposal detail route when the proposal list is empty.
- [ ] Start the site and inspect `/research` at mobile and desktop widths; verify heading order, focus states, no horizontal overflow, and clear distinction between proposals and publications.
- [ ] Run `git diff --check` and inspect `git status --short`; expect no whitespace errors or generated files outside the intended snapshot.
- [ ] Commit with `feat: complete research portfolio foundation`.

## Self-review

- Spec coverage: data, admin, public presentation, static publishing, disclosure, errors, accessibility, and verification are each assigned to a task.
- Placeholder scan: no deferred implementation placeholders remain; real agenda/proposal writing is explicitly excluded by the approved spec.
- Type consistency: agenda/proposal getter and component names are consistent across Tasks 2–4; API field names match Task 1 and the admin fields in Task 6.
