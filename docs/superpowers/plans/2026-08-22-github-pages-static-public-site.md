# GitHub Pages Static Public Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Track progress with the checkboxes in this document.

**Status:** Deployed to GitHub Pages. The public static site is live at `https://parsaoryani.github.io/`; remaining unchecked tasks below are post-launch hardening items, not blockers for the current deployment.

**Goal:** Keep the complete Prisma-backed admin and public website available locally, while adding a second build mode that produces a public-only, fully static copy for GitHub Pages.

**Architecture:** The local application remains the editing source of truth. An explicit local export operation converts the public portion of the database and all public media into committed repository files. GitHub Actions builds only from those committed files in an isolated static workspace and deploys the resulting `out/` directory; it never receives database credentials and never builds admin, API, auth, upload, or middleware code.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, Prisma/PostgreSQL for local/admin mode only, Zod for snapshot validation, GitHub Actions and GitHub Pages for static hosting.

## 1. Locked Decisions

These decisions are final for the first implementation. An implementer must not choose a different interpretation without updating this document first.

| Topic | Decision |
|---|---|
| Initial public URL | `https://parsaoryani.github.io/` |
| Repository | Existing repository has been renamed on GitHub to `parsaoryani/parsaoryani.github.io` |
| Repository strategy | Do not create a second repository; keep source, local admin, generated data, media, workflow, and Pages deployment together |
| GitHub Pages mode | User site at domain root; base path is the empty string |
| Admin location | Local machine only; admin is never present in the Pages artifact |
| Database location | Local/admin mode only; PostgreSQL is never contacted by GitHub Actions or the deployed site |
| Public source of truth | Local database before export; committed snapshot and media after export |
| Publish trigger | Push/merge to `main` after reviewing and committing the exported snapshot and media |
| Admin export behavior | A local-only authenticated admin action writes snapshot/media files; it does not commit, push, or deploy |
| Contact behavior on Pages | Show email/social contact methods; do not render the database-backed message form |
| Images | Stored in normal Git under `public/`; `next/image` runs with `images.unoptimized: true` in static mode |
| Videos/PDFs/downloads | Stored in normal Git under `public/`; Git LFS is forbidden because GitHub Pages does not support it |
| Remote media | Post-launch hardening item; current export supports committed root-relative assets and `/uploads/**` mirroring |
| External links | GitHub, LinkedIn, DOI, arXiv, demo, supervisor, and other navigation links remain external URLs |
| Dynamic public routes | Every published slug is generated at build time with `generateStaticParams()` |
| Project filtering | Client-side on the generated `/projects/` page; `?tag=` is optional UI state only |
| Redirects | Legacy redirect URLs become real static compatibility pages; static mode does not use `redirects()` |
| Static build inputs | Committed source, `site-data.json`, and committed `public/` files only |
| CI database access | Forbidden; absence of `DATABASE_URL` in CI is expected and must not break the build |
| Rollback | Revert the content/media commit or redeploy an earlier successful Pages artifact |
| Repository visibility | Public, required for GitHub Pages on the current account plan |

### Repository rename status

GitHub requires a personal user-site repository to be named exactly `<username>.github.io`. The existing repository was renamed in GitHub from `parsaoryani/personalWebsite` to `parsaoryani/parsaoryani.github.io`; the user confirmed completion on 2026-08-22. No second repository is required or permitted by this plan.

| Setup item | Status | Required value/action |
|---|---|---|
| GitHub repository rename | Completed | `parsaoryani/parsaoryani.github.io` |
| Final repository URL | Completed | `https://github.com/parsaoryani/parsaoryani.github.io` |
| Final website URL | Locked | `https://parsaoryani.github.io/` |
| Local Git remote | Completed | Verified on 2026-08-22: fetch and push point to `git@github.com:parsaoryani/parsaoryani.github.io.git` |
| GitHub Pages publishing source | Completed | Verified with GitHub API on 2026-08-22: build type is `workflow` |
| Repository visibility | Completed | Changed to public on 2026-08-22 so GitHub Pages could be enabled |
| First successful deployment | Completed | GitHub Actions run `32590089711` deployed commit `2ae5c88` |
| Latest verified deployment | Completed | GitHub Actions run `32590189995` deployed commit `72d26dd`; live URL returned HTTP 200 |

Update and verify the local remote before the first push after the rename:

```bash
git remote set-url origin git@github.com:parsaoryani/parsaoryani.github.io.git
git remote -v
```

The remote step is complete only when both fetch and push lines from `git remote -v` show `parsaoryani/parsaoryani.github.io.git`. Pages setup is complete only when GitHub repository settings show **GitHub Actions** as the source and the first deployment succeeds.

The local working directory has been moved to `/Users/parsaoryani/Documents/parsaoryani.github.io`. GitHub may redirect the old repository URL, but relying on that redirect is not accepted; the explicit remote verification above remains required.

This naming rule is documented by [GitHub Pages: Creating a site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

If a custom domain is added later, keep `NEXT_PUBLIC_BASE_PATH=""`, set `NEXT_PUBLIC_SITE_URL` to the custom origin, rebuild, and add the Pages `CNAME`. `GITHUB_PAGES_BASE_PATH` is not used anywhere in this design.

## 2. Why the Current Application Cannot Be Published Directly

The current server build works with a supported Node version, but its full route tree requires a server:

- `src/app/(admin)/[adminPath]/**` contains authenticated admin pages.
- `src/app/api/**/route.ts` contains CMS, contact, upload, auth, and content APIs.
- `src/middleware.ts` reads cookies and protects the admin path.
- `src/lib/db/queries.ts` imports `server-only` and Prisma.
- Home, about, contact, experience, and root layout read Prisma directly or indirectly.
- The contact form posts to `/api/contact`.
- `/projects` awaits server `searchParams`, making the route dynamic.
- `next.config.ts` uses server redirects and response headers.
- Default `next/image` optimization requires a runtime image service.

A real test with `output: "export"` failed first at:

```text
Page "/api/courses/[courseId]/links/[linkId]" is missing "generateStaticParams()" so it cannot be used with "output: export" config.
```

Fixing only that route would expose the next server-only route. Static mode therefore needs a route tree in which admin, API, middleware, and server-data modules do not exist.

See [Next.js Static Exports](https://nextjs.org/docs/pages/guides/static-exports) and [Next.js basePath](https://nextjs.org/docs/pages/api-reference/config/next-config-js/basePath).

## 3. Two Operating Modes

### Local/Admin Mode

`npm run dev` retains PostgreSQL/Prisma, authentication and 2FA, admin CRUD, local/R2 uploads, contact storage/email, and public pages rendered from live data. The existing server build remains `npm run build`.

### GitHub Pages Static Mode

```bash
npm run static:export
npm run static:verify
```

This mode contains public pages, committed JSON, committed media/downloads, and static HTML/CSS/browser JavaScript. It contains no Prisma, database, admin, API, auth, cookies, middleware, server actions, runtime redirects/headers, or image service.

## 4. Exact Publishing Flow

1. Start the local database and site.
2. Sign in to local admin.
3. Edit content/media; mark only intended content as `published` or `visible`.
4. Open **Static Publish** and select **Export public snapshot**.
5. Export validates records, verifies committed root-relative assets, mirrors `/uploads/**` assets into `public/generated/media/**`, rewrites mirrored asset URLs, and writes both generated JSON files.
6. Review the export summary and Git diff. Draft/private data must not appear.
7. Run `npm run static:verify` with the database deliberately unavailable.
8. Review static preview at the domain root `/`.
9. Commit source, generated JSON, and generated media together.
10. Push/merge to `main`; GitHub Actions publishes Pages.

Saving in admin updates only the local database. Exporting updates repository files. Committing and pushing publishes them.

## 5. Public Data Contract

### Generated files

Create and commit:

- `src/content/generated/site-data.json`
- `src/content/generated/asset-manifest.json`

Do not add either to `.gitignore`.

```ts
interface StaticSiteData {
  schemaVersion: 1
  settings: {
    home_title: string | null
    home_description: string | null
    research_directions: ResearchDirection[]
    hidden_timeline_sections: TimelineSectionType[]
    nav_research_visible: boolean
    profile_photo: { url: string; alt: string | null } | null
    contact_description: { text: string } | null
    contact_emails: Array<{ label: string; address: string }>
    contact_links: Array<{ label: string; url: string; desc: string; icon: string | null }>
    contact_location: { city: string; note: string | null } | null
  }
  publications: StaticPublication[]
  projects: StaticProject[]
  tags: StaticTag[]
  timelineEvents: StaticTimelineEvent[]
  skillCategories: StaticSkillCategory[]
  teachingAssistants: StaticTeachingAssistant[]
  researchingAssistants: StaticResearchingAssistant[]
  media: StaticMedia[]
}
```

`ResearchDirection` is the existing `{ title, description, tags, href?, linkLabel? }` shape. `TimelineSectionType` is exactly `education | experience | award | talk | service | publication_milestone`. Invalid optional settings fail export rather than being silently copied; a missing setting becomes the typed fallback above.

The nested schemas contain these exact selected fields:

- `StaticPublication`: `id, slug, title, authors, venue, venueType, year, publishedAt, abstract, tldr, contributions, doi, arxivId, pdfUrl, codeUrl, projectUrl, bibtex, citationCount, featured, sortOrder, ogImageUrl, tags`.
- `StaticProject`: `id, slug, title, summary, role, year, problem, approach, architecture, challenges, results, retrospective, techStack, repoUrl, demoUrl, featured, sortOrder, ogImageUrl, tags`.
- `StaticTag`: `id, slug, label, description, color`.
- `StaticTimelineEvent`: `id, type, title, organization, location, startDate, endDate, description, highlights, url, sortOrder, courses`.
- `StaticCourse`: `id, name, grade, highlight, instructor, focus, topics, syllabus, exercises, projects, discussions, sortOrder, files, links`.
- `StaticCourseFile`: `id, name, url, description, kind, size, mimeType, sortOrder`.
- `StaticCourseLink`: `id, type, name, url, sortOrder`.
- `StaticSkillCategory`: `id, name, sortOrder, skills`; each skill has `id, name, proficiency, sortOrder`.
- `StaticTeachingAssistant`: `id, slug, course, level, university, professor, startDate, endDate, description, highlights, technologies, sortOrder`.
- `StaticResearchingAssistant`: `id, slug, lab, university, supervisor, supervisorUrl, collaborator, topic, startDate, endDate, description, outcomes, technologies, repoUrl, sortOrder`.
- `StaticMedia`: `id, ownerType, ownerId, url, kind, alt, caption, sortOrder`.

`authors` validates as `Array<{ name: string; isMe?: boolean }>`; `contributions` validates as `Array<string | { text: string }>`; `techStack` and all `highlights/outcomes` fields get explicit schemas matching their current renderers before implementation. No unvalidated Prisma `Json` value crosses the boundary.

`site-data.schema.ts` defines the Zod schemas and inferred types. The exporter includes only these ten setting keys and selected fields. Arbitrary `SiteSetting` keys are never exported.

### Inclusion and ordering

| Model | Inclusion rule | Ordering |
|---|---|---|
| `Publication` | `status=published`, `deletedAt=null` | `year desc`, `sortOrder asc`, `slug asc` |
| `Project` | `status=published`, `deletedAt=null` | `year desc`, `sortOrder asc`, `slug asc` |
| `Tag` | Attached to included publication/project | `label asc`, `slug asc` |
| `TimelineEvent` | `visible=true`, type not hidden by settings | `startDate desc`, `sortOrder asc`, `id asc` |
| `Course` | Parent included and event type `education` | `sortOrder asc`, `name asc` |
| `CourseFile`/`CourseLink` | Parent course included | `sortOrder asc`, `name asc`, `id asc` |
| `SkillCategory`/`Skill` | All current records | `sortOrder asc`, `name asc`, `id asc` |
| `TeachingAssistant` | `status=published`, `deletedAt=null` | `startDate desc`, `sortOrder asc`, `slug asc` |
| `ResearchingAssistant` | `status=published`, `deletedAt=null` | `startDate desc`, `sortOrder asc`, `slug asc` |
| `Media` | `publication`: ownerId is an included publication ID; `project`: ownerId is an included project ID; `page`: ownerId is one of `home,about,contact,cv,experience,research,projects` | `ownerType asc`, `ownerId asc`, `sortOrder asc`, `id asc` |

Dates are ISO UTC strings in JSON. Static provider converts them back to `Date` objects. Opaque content IDs may remain for stable UI keys but never grant access.

### Always excluded

- `User`, `Session`, `AuditLog`, `PendingTwoFactorChallenge`
- `Revision`, `ContactMessage`
- drafts, soft-deleted records, hidden timeline records
- credentials, IPs, user agents, hashes, tokens, backup codes, operational metadata

Every query uses explicit field-level `select`. Broad `include: true` and object spreading are forbidden so future schema fields cannot become public accidentally.

### Determinism

- Sort every array using the table.
- Two-space JSON indentation and one final newline.
- No `generatedAt`, local path, random export ID, DB URL, or environment value.
- ISO UTC dates and SHA-256 media names.
- JSON asset paths start at site root and never contain the old repository name `/personalWebsite`.

Unchanged inputs must produce byte-identical output.

## 6. Exact Asset Policy

Hand-managed assets remain in `public/about/**`, `public/coursework/**`, `public/cv.pdf`, and other intentional folders.

Admin/remote assets are written to:

```text
public/generated/media/<first-two-sha256-chars>/<sha256>.<extension>
```

```ts
interface StaticAssetManifest {
  schemaVersion: 1
  assets: Array<{
    sourceKey: string
    publicPath: string
    sha256: string
    bytes: number
    mimeType: string
  }>
}
```

`sourceKey` is a stable non-URL identifier such as `Publication:<id>:pdfUrl` or `CourseFile:<id>:url`. The actual source URL exists only in process memory and is never written to generated files. This keeps signed URLs and host credentials out of Git while preserving deterministic output.

### URL handling

| URL kind | Action |
|---|---|
| Root-relative committed asset | Verify matching `public/` file; keep path |
| `/uploads/...` | Read from `${UPLOAD_DIR}` (default `./uploads`), hash/copy, rewrite |
| HTTPS URL in asset field | Current implementation fails for publication/project/media asset fields until remote mirroring is implemented; coursework file URLs to GitHub remain external navigation links |
| localhost, `file://`, absolute disk path | Fail |
| `data:` or `blob:` | Fail |
| External navigation URL | Keep external; do not download |

Implemented asset fields: `profile_photo.url`, `Media.url`, `Publication.pdfUrl`, `Publication.ogImageUrl`, `Project.ogImageUrl`; root-relative values are verified and `/uploads/**` values are mirrored. Current coursework `CourseFile.url` values that point to GitHub are treated as external navigation links. GitHub, DOI, arXiv, demo, social, supervisor, repository, and course navigation links remain external.

### Mirroring rules

- Remote HTTPS downloads are a post-launch hardening item. When implemented, downloads remain disabled unless the hostname appears in the comma-separated `STATIC_ASSET_ALLOWED_HOSTS` environment variable. The list contains exact lowercase hostnames; wildcards are forbidden.
- Require HTTPS for the initial URL and every redirect. Reject URL credentials, IP-literal hosts, non-default ports, and more than three redirects.
- Resolve DNS before each request/redirect and reject loopback, private, link-local, multicast, carrier-grade NAT, documentation, reserved, and IPv6 local/private ranges. Connect only to the validated addresses and revalidate every redirect to prevent DNS rebinding and SSRF.
- Require HTTP 200 and a 30-second total timeout. Stream with a 50 MiB hard byte limit; abort as soon as the limit is reached, regardless of `Content-Length`.
- Validate MIME; use MIME for extension with safe URL extension fallback.
- Permit only these extension/MIME families for mirrored/admin assets: `png:image/png`, `jpg|jpeg:image/jpeg`, `gif:image/gif`, `webp:image/webp`, `mp4:video/mp4`, `mov:video/quicktime`, `pdf:application/pdf`, `txt:text/plain`, `md:text/markdown|text/plain`, `ipynb:application/json`, `zip:application/zip|application/x-zip-compressed`, and `doc,docx,ppt,pptx,xls,xlsx,csv` with their standard Microsoft/OpenXML/CSV MIME types. MIME and extension must be an allowed pair.
- Reject HTML, JavaScript, executables, SVG, MIME/extension mismatch, and unknown MIME. SVG is always rejected for mirrored/admin assets; only already-committed, manually reviewed source SVG files may remain in `public/`.
- SHA-256 deduplication.
- Export never deletes old generated assets. Separate prune command prints exact deletion list first.

### Export transaction

- Create a unique staging directory under `.static-export-staging/<run-id>/` on the same filesystem as the repository.
- Generate both JSON files and every new media file inside staging; validate the entire staged result before touching tracked targets.
- Copy new content-addressed media first. Existing same-hash files must be byte-identical; otherwise fail.
- Back up the two current JSON files, then rename both staged JSON files into place. If either rename fails, restore both backups and remove copied media that did not exist before the run.
- Remove staging after success or handled failure. A sudden machine/process crash may leave staging or unreferenced content-addressed media, but cannot make validation pass with a partial snapshot; the next run reports and cleans only that staging directory.
- The admin/API response is successful only after promotion and a final validation pass.

### Size rules

- Fail for individual asset `>= 50 MiB`.
- Fail for final `out/` `>= 900 MiB`.
- Warn when `public/` exceeds 750 MiB.
- Oversized video is a blocking manual correction. The exporter does not transcode. It reports the file and measured size; the operator must replace it with a smaller web-ready file and rerun export. Never use Git LFS.

See [GitHub large-file limits](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github), [Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits), and [Git LFS limitations](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-git-large-file-storage).

## 7. Public Data Provider Boundary

```text
src/lib/public-data/
  contract.ts
  index.ts
  server.ts
  static.ts
```

- `contract.ts`: stable public types/interface.
- `server.ts`: Prisma behavior.
- `static.ts`: validate JSON, reconstruct dates, same interface.
- source `index.ts`: server provider.
- static-workspace `index.ts`: static provider.

Every public page/root layout imports only `@/lib/public-data`.

```ts
interface PublicDataProvider {
  getFeaturedPublications(): Promise<PublicPublication[]>
  getAllPublications(): Promise<PublicPublication[]>
  getPublicationBySlug(slug: string): Promise<PublicPublication | null>
  getFeaturedProjects(): Promise<PublicProject[]>
  getAllProjects(): Promise<PublicProject[]>
  getProjectBySlug(slug: string): Promise<PublicProject | null>
  getAllTags(): Promise<PublicTag[]>
  getMediaForOwner(ownerType: "publication" | "project" | "page", ownerId: string): Promise<PublicMedia[]>
  getTimelineEvents(): Promise<PublicTimelineEvent[]>
  getEducationEvents(): Promise<PublicTimelineEvent[]>
  getEducationEventBySlug(slug: string): Promise<PublicTimelineEvent | null>
  getSkillCategories(): Promise<PublicSkillCategory[]>
  getLatestResearchExperience(): Promise<PublicResearchAssistant | null>
  getLatestTeachingExperience(): Promise<PublicTeachingAssistant | null>
  getAllResearchExperience(): Promise<PublicResearchAssistant[]>
  getAllTeachingExperience(): Promise<PublicTeachingAssistant[]>
  getSiteSetting<K extends PublicSettingKey>(key: K): Promise<PublicSettingMap[K]>
  getSiteSettings(): Promise<PublicSettingMap>
}
```

`PublicSettingMap` is exactly the typed `settings` object from `StaticSiteData`; `PublicSettingKey = keyof PublicSettingMap`. Both providers run the same contract tests.

## 8. Base Path and URLs

```text
NEXT_PUBLIC_BASE_PATH=
NEXT_PUBLIC_SITE_URL=https://parsaoryani.github.io
```

- `next/link` receives root paths such as `/projects`.
- Raw media/downloads use `withBasePath("/about/photo.jpg")`; with an empty base path the result remains `/about/photo.jpg`.
- JSON stores root-relative paths such as `/about/photo.jpg`.
- Absolute metadata/sitemap/robots/JSON-LD use `NEXT_PUBLIC_SITE_URL`.
- External, mail, phone, and hash-only URLs remain unchanged.
- Helper rejects invalid local paths and avoids double-prefixing.

Create `src/lib/site/base-path.ts` and apply it to `next/image`, video/poster, raw image, PDF/notebook/ZIP, and snapshot asset URLs.

## 9. Route Contract

| Route | Static behavior |
|---|---|
| `/` | Provider home settings and research directions |
| `/about/` | Provider photo; prefixed photo/video/poster |
| `/contact/` | Provider settings; contact links only |
| `/cv/` | Prefix `/cv.pdf` |
| `/experience/` | Provider timeline/research/teaching |
| `/education/[slug]/` | One per included education event |
| `/projects/` | All once; client tag filter |
| `/projects/[slug]/` | One per published project |
| `/research/` | Published publications |
| `/research/[slug]/` | One per published publication |
| `/research-assistance/` | Compatibility page to experience anchor |
| `/teaching/` | Compatibility page to experience anchor |
| Unknown | Custom `404.html` |

Dynamic routes use provider in `generateStaticParams()`, export `dynamicParams = false`, call `notFound()` for missing entries, and derive metadata from the same record. Education routes use `getEducationEvents()` and `getEducationEventBySlug()`; the slug remains `slugify(event.organization)`. Export fails when two included education events produce the same slug.

The two compatibility pages target exactly `/experience/#research-assistance` and `/experience/#teaching-assistance`. Each contains a canonical/noindex metadata entry for its target, a visible explanation/link, and `<meta httpEquiv="refresh" content="0;url=<base-prefixed-target>">`. The visible link works without JavaScript; meta refresh preserves old bookmarks. No client router/history replacement is used.

Project filtering no longer uses server `searchParams`. A client component reads `tag` from `window.location.search`, filters in memory, updates URL with `history.replaceState`, performs no request, and shows all for absent/unknown tags.

## 10. Contact Decision

Local mode keeps `<ContactForm />` and `/api/contact`. Static mode uses `StaticContactPanel`:

- admin-managed description/emails/social/location;
- primary `mailto:` action;
- no inputs, submit button, API call, or stored-message claim.

No third-party form provider is added.

The primary address is the first validated item in `contact_emails`, preserving admin array order. If the array is empty, use the existing public fallback `parsa.oryani82@sharif.edu`. The remaining addresses render in their stored order.

The page must not branch on an environment variable. Create a build-swapped component boundary:

```text
src/components/content/contact-surface/
  index.tsx
  server.tsx
  static.tsx
```

The source `index.tsx` exports `server.tsx`, which renders the existing form. Static workspace preparation replaces only its copied `index.tsx` so it exports `static.tsx`. The contact page imports `ContactSurface` only from this boundary. Consequently the static import graph never reaches `contact-form.tsx` or `/api/contact`.

## 11. Local Admin Export

Add `/[adminPath]/static-publish` showing snapshot state, public record counts, asset count/size, changed files, blocking errors, **Export public snapshot**, and next command.

`POST /api/admin/static-export` requires owner session and returns 404 unless:

```text
NODE_ENV=development
ALLOW_LOCAL_STATIC_EXPORT=1
```

Its only tracked/persistent write targets are generated JSON and `public/generated/media/**`. It may create transaction staging/backups only under ignored `.static-export-staging/<run-id>/`; those are removed after handled success/failure. It must not run Git, commit, push, deploy, mutate DB, expose secrets, or delete tracked content.

The CLI is intentionally not session-authenticated because local shell access is its authority boundary, but it enforces the same exact gates: `NODE_ENV === "development"` and `ALLOW_LOCAL_STATIC_EXPORT=1`. Both CLI and API fail closed otherwise.

## 12. Static Workspace

Temporary directory is `.static-export-workspace/`, ignored by Git and the only recursively recreated target.

Allowlist:

- public route group, root layout, static metadata/not-found
- static-safe content/layout/UI components
- generated content
- public-data contract/static provider and public-safe helpers
- styles, `public/**`, `tsconfig.json`, `postcss.config.mjs`, `next-env.d.ts`
- a generated minimal workspace `package.json` containing only `{ "name": "personal-website-static", "private": true }`

Never copy admin/API/middleware, auth/DB/email/rate-limit, Prisma, env files, uploads, backups, logs, build output, Vercel state, or node_modules.

Preparation swaps the copied public-data entrypoint to the static provider and the copied contact-surface entrypoint to the static contact implementation. It then writes static config, scans the copied workspace source for forbidden backend paths/imports/references, and fails on a forbidden dependency. It does not copy the lockfile or install dependencies a second time.

`scripts/static/build.ts` resolves the absolute root binary `<repo>/node_modules/.bin/next` and spawns `next build` with `cwd=<repo>/.static-export-workspace`. Node module resolution then uses the root installation created by `npm ci`. Missing root dependencies are a hard error. The generated config uses `turbopack.root: path.resolve(process.cwd(), "..")` so the symlinked root `node_modules` is inside Turbopack's allowed root.

`static:build` creates only `.static-export-workspace/out/`; it never touches root `out/`. `static:validate` validates the workspace output and, only after every check passes, atomically replaces root `out/`. Any build or validation failure preserves the previous valid root output.

## 13. Static Next Config

```ts
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  turbopack: { root: path.resolve(process.cwd(), "..") },
}
```

No `assetPrefix`, redirects, headers, rewrites, standalone output, or runtime image optimization. The initial user-site build uses an empty `basePath`; output validation fails if the old `/personalWebsite` prefix appears anywhere.

## 14. Commands

```json
{
  "static:export": "tsx scripts/static/export-content.ts",
  "static:export:check": "tsx scripts/static/check-export-clean.ts",
  "static:prepare": "tsx scripts/static/prepare-workspace.ts",
  "static:build": "tsx scripts/static/build.ts",
  "static:validate": "tsx scripts/static/validate-output.ts",
  "static:preview": "tsx scripts/static/preview.ts",
  "static:verify": "npm run static:prepare && npm run static:build && npm run static:validate",
  "static:publish-check": "npm run static:export:check && npm run static:verify"
}
```

`static:export` requires the local DB and export flag. `static:export:check` performs a full export into a temporary staging directory without promoting it, then byte-compares staged `site-data.json`, `asset-manifest.json`, and every referenced `public/generated/media/**` file to tracked working-tree files. Exit codes are `0` identical, `1` stale/missing generated files, and `2` export/configuration failure.

All other static commands require no DB. `static:verify` is exact CI behavior. `static:preview` listens on `127.0.0.1:4173`, prints `Ready: http://127.0.0.1:4173/` only after that URL returns HTTP 200, and serves until interrupted. This split is mandatory because CI cannot regenerate DB content.

## 15. Validation Contract

Fail and report all issues for:

- admin/API/middleware or forbidden imports in workspace;
- `/api/` fetch/form action or server action;
- invalid schema/version, duplicate slugs, private path/credential/signed URL;
- missing/hash-mismatched/remote asset;
- file `>=50 MiB`, output `>=900 MiB`, Git LFS pointer;
- missing core/detail HTML, broken internal link, non-empty base path, or any emitted `/personalWebsite` prefix;
- localhost/wrong sitemap, robots, canonical, or JSON-LD;
- contact form/API in static output.

Source errors use `file:line: message` when possible.

The validator generates `.static-export-workspace/route-inventory.json` from the snapshot and fixed routes. It contains every expected route and manifest asset. Current validation asserts:

- every expected route has generated HTML;
- `404.html` contains the custom 404 marker;
- every internal HTML link resolves to a generated route or emitted asset and contains no `/personalWebsite` segment;
- contact HTML contains `mailto:` and contains neither `<form` nor `/api/contact`;
- sitemap contains every canonical public route;
- manifest assets exist and match recorded byte count and SHA-256;
- emitted files are below 50 MiB and final `out/` is below 900 MiB.

Temporary preview-server HTTP checks and mobile/desktop browser overflow checks remain post-launch hardening items.

## 16. GitHub Actions

Create `.github/workflows/pages.yml`:

- push to `main` and manual dispatch;
- `contents: read`, `pages: write`, `id-token: write`;
- `pages` concurrency, cancel older run;
- checkout without LFS; Node 22; `npm ci`;
- no DB/admin/R2/Resend secret;
- set section 8 URL values;
- run exactly `npm run typecheck`, `npm test`, and `npm run static:verify`;
- upload root `out/` and deploy with official Pages actions.

CI validates committed snapshot but cannot compare it to local DB. Local `static:export:check` does that.

## 17. File Map

### Create

- generated schema/data/asset manifest
- `src/lib/public-data/{contract,index,server,static}.ts`
- `src/lib/site/base-path.ts`
- static contact, contact-surface provider boundary, and client project browser components
- compatibility route pages
- admin static-publish page/API
- export service, mapper, asset module
- six `scripts/static/*.ts` commands
- Pages workflow and operator guide
- `public/cv.pdf` and `public/coursework/secure-software-systems/ce815-041-project.pdf`
- custom `src/app/not-found.tsx`
- root `CV.md`

### Modify

- `package.json`, `.gitignore`
- `eslint.config.mjs`
- root layout and every public DB/Prisma consumer
- root-relative media/download components
- project filtering, sitemap, robots, README

### Tests

- schema/privacy tests
- base-path tests
- projects/static-contact tests
- admin export guard tests remain pending
- static validator tests remain pending

## 18. Implementation Tasks

### Task 1: Freeze contract

- [x] Explicit Zod schemas and complete fixtures.
- [x] Cover every public model, null, hidden/draft/deleted record, URL class.
- [x] Prove private models/unknown settings cannot enter output.

### Task 2: Providers

- [x] Move current public Prisma behavior to server provider.
- [x] Implement static provider and shared contract tests.
- [x] Point public routes/layout only at provider boundary.
- [x] Verify normal local behavior/build.

### Task 3: Export

- [x] Explicit Prisma selects and exact filter/order rules.
- [x] Schema-valid local CLI snapshot export.
- [x] Generated snapshot cleanliness/schema check.
- [x] Stable byte-identical JSON check for unchanged local inputs.
- [x] Root-relative asset verification and asset manifest population.
- [x] `/uploads/**` media mirroring into `public/generated/media/**`.
- [x] Atomic JSON writes; preserve old generated output on failure.
- [x] Full clean-export byte comparison against a temporary DB export.
- [ ] Remote HTTPS asset downloading with SSRF hardening.

### Task 4: Admin export

- [x] Owner/development/env-gated endpoint.
- [x] Counts, changed files, and exact export errors.
- [x] Admin page/navigation/action.
- [ ] Test unauthenticated, non-owner, production, disabled, success, failure.

### Task 5: Public routes

- [x] Static contact, client project filter, dynamic params.
- [x] Compatibility routes.
- [ ] Complete base paths for every image/video/PDF/download/snapshot asset.
- [x] Sitemap and robots use `https://parsaoryani.github.io`.
- [ ] Complete metadata/canonical/Open Graph/JSON-LD audit.

### Task 6: Workspace

- [x] Provider/contact entrypoint swap.
- [x] Static config generation.
- [x] Forbidden source/import safety scan in copied static workspace.
- [x] Full copied-workspace source/reference scan for forbidden backend dependencies.
- [x] Recreation confined to temp path.

### Task 7: Build/validate

- [x] Node 22, `DATABASE_URL` unset.
- [x] Validate static output for forbidden `/personalWebsite`, contact form, and `/api/contact` patterns.
- [x] Validate source/data/assets/routes/links/size for the generated static output.
- [x] Atomic `out/` and base-path preview.
- [ ] Smoke-test all routes mobile/desktop against local public mode.

### Task 8: Deploy/docs

- [x] Workflow and Pages source.
- [x] GitHub Pages configured for workflow deployment.
- [x] Final URL verification after first Actions deployment completes.
- [x] Initial local publish/operator guide.
- [x] Troubleshooting, rollback, and custom-domain guide.
- [ ] Rollback drill: deploy fixture/content commit A, deploy B, revert B, and confirm Pages content/hash matches A.

## 19. Acceptance Criteria

- Normal server build and local admin still work.
- Export is explicitly enabled development-only.
- No private/draft/deleted/hidden data; unchanged export has no diff.
- All public assets resolve to committed files.
- `static:verify` passes without DB.
- Static workspace has no backend/admin dependencies.
- Every generated route and manifest asset in `route-inventory.json` resolves in the static output; the deployed home page returns HTTP 200 from `https://parsaoryani.github.io/`; no URL contains `/personalWebsite`; `404.html` contains the marked 404.
- All photos/video/CV/course downloads load.
- Tag filtering needs no server; contact has no form.
- Sitemap contains every canonical inventory route; root canonical/Open Graph/JSON-LD origins equal `NEXT_PUBLIC_SITE_URL`; compatibility routes are noindex; 404 marker assertion passes.
- No file reaches 50 MiB; output below 900 MiB.
- The A -> B -> revert-to-A rollback drill reproduces A's snapshot hash and public page marker.

## 20. Failure and Recovery

- DB unavailable: stop before writes and report setup action.
- Invalid record: report model, ID/slug, field, error; write nothing.
- Missing/unavailable asset: report record/field/path; retain old generated output.
- Build/validation failure: retain prior `out/`; deploy nothing.
- Bad content: revert content/media commit and push.

## 21. Explicit Non-Goals

- Admin or DB writes on Pages
- Public-side editing or contact storage
- Git commit/push/deploy from admin
- Draft preview, ISR, server regeneration, runtime image optimization
- Git LFS, files at/over 50 MiB, publishing database

## 22. Security Checklist

- [x] CI has no app secrets.
- [x] Field/setting allowlists are enforced.
- [x] Only intended public contact addresses appear.
- [x] No private model data in snapshot/artifact.
- [x] Export API owner-authenticated, development-only, env-enabled.
- [x] Artifact has no admin path or `/api/`.
- [ ] Signed URLs/credentials sanitized for future remote HTTPS asset mirroring.
- [ ] Unsafe upload MIME/type rejection beyond size/path checks.
- [ ] New-tab external links use `noopener noreferrer` everywhere.

## 23. Final Handoff

Deployment has completed. Database-free `npm run static:verify` passed locally and in GitHub Actions before deployment, generated data was committed, and the live site returned HTTP 200.

The plan is unambiguous when another engineer can follow sections 4 and 14 without additional decisions about database, admin, media, CI, base path, or publishing.
