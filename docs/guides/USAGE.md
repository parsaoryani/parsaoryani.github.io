# Usage and operations guide

## Quick start

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Open `http://localhost:4321`. Copy `.env.example` to `.env` first and set the database and secrets appropriate for the environment. The local server listens on port `4321`.

## Repository commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start development mode |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript checks |
| `npm test -- --run` | Run Vitest once |
| `npm run build` / `npm run start` | Build and serve production output |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema during local development |
| `npm run db:migrate` / `db:migrate:deploy` | Create or deploy migrations |
| `npm run db:seed` | Seed development content/admin data |
| `npm run db:backup` / `db:restore` | Database backup/restore scripts |
| `npm run deploy:preview` / `deploy:prod` | Deployment scripts |

## Environment

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `ADMIN_PATH` | Dynamic admin route segment |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata and links |
| `RESEND_API_KEY` | Resend email provider key; blank uses local mail capture |
| `SITE_DOMAIN` | Domain used for generated email addresses |
| `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_ENDPOINT` | Optional object storage for uploads |

Never commit `.env` or credentials. `.env.example` is the safe reference for required names.

## Admin access

The admin route is `/${ADMIN_PATH}` and the login page is `/${ADMIN_PATH}/login`. `ADMIN_PATH` obscures the URL but does not replace server-side authorization. Use the seeded credentials only for local development, then change or remove them before any shared environment.

Admin navigation is grouped as follows:

- **Content:** Homepage, Profile & Contact, About, Research, Projects, Experience, Skills & Tags, CV, Contact page.
- **Inbox:** Contact messages.
- **Media:** Profile and content media; course resources remain managed from education timeline records.
- **System:** Emergency settings, sessions/security, activity log, and development-only mail capture.

All admin routes and content types remain available. On the public site, Research/Teaching Assistantship content moved from standalone pages into `/experience` (see the route map below); every admin CRUD capability for that content is unchanged.

## Public route map

| Route | Purpose |
|---|---|
| `/` | Introduction, research interests, current research, skills, and contact action |
| `/experience` | Education, Research/Teaching Assistantships, Work Experience, Awards, Talks, Service — one page, pill nav into anchored sections |
| `/education/[slug]` | Per-university coursework/syllabus detail, linked from Education on `/experience` |
| `/research` and `/research/[slug]` | Publication index and details — unlinked from nav until `nav_research_visible` is on |
| `/projects` and `/projects/[slug]` | Project gallery and case studies |
| `/about` | Biography and skills |
| `/cv` | HTML CV and PDF action |
| `/contact` | Contact form and contact methods |

`/research-assistance` and `/teaching` redirect (308) to `/experience#research-assistance` and `/experience#teaching-assistance`.

## Content management

Public editorial content is managed through typed admin forms. Publications, projects, timeline/course records, teaching/research experience, tags, skills, profile/contact data, page copy, messages, and media retain their existing capabilities.

Editorial records use Draft, Published, and Archived status. Preview is an authenticated action. Unpublish returns content to Draft; Archive removes it from public output; Trash and Restore preserve recoverability. Public queries, sitemap, and structured data exclude drafts and archived records.

Editors should:

1. Save a draft while working.
2. Use Preview to inspect the public component.
3. Publish only after required fields and links are complete.
4. Use Archive/Trash for removal rather than destructive browser confirmations.
5. Review revision history before restoring an older version.

## Course homework assets

Coursework files shown on `/education/[slug]` are rendered from `CourseFile`
records attached to each seeded course, grouped under their `HW<n>` label in
the Exercises panel. `CourseFile.url` points at the file's location in
[github.com/parsaoryani/courses](https://github.com/parsaoryani/courses) —
`blob/main/...` for a single file, `tree/main/...` for a homework whose
assignment is its own subfolder — not at a local path under `public/`. This
site never hosts coursework files itself.

`CourseFile.description` is a one-line summary shown under the file name;
`course.exercises` is a flat per-course summary that
`parseHomeworkExplanations()` in `course-detail-card.tsx` splits into one
explanation per `HW<n>`, rendered above that homework's links.

To add or update coursework files:

1. Add the file to the `masters/<course-slug>/` tree in the
   [courses repo](https://github.com/parsaoryani/courses) and push.
2. Add or edit its entry in `scripts/data/sync-masters-coursework.ts`
   (`CourseUpdate.files`), with the exact GitHub URL and a short description.
3. Run it against the target database:

   ```bash
   npx tsx scripts/data/sync-masters-coursework.ts          # local
   DATABASE_URL="<neon-pooled-url>" npx tsx scripts/data/sync-masters-coursework.ts   # production
   ```

   The script is idempotent — it skips any `CourseFile` whose name already
   exists under that course, so it is safe to re-run.
4. Open `http://localhost:4321/education/sharif-university-of-technology` and
   confirm the file appears under the right `HW<n>` group with its
   description and a working GitHub link.

`scripts/data/link-coursework-to-github.ts` and
`scripts/data/sharif-course-syllabi.ts` are one-off scripts already applied
to both environments (URL migration and syllabus/topics/instructor content,
respectively) — kept for reference, not part of the normal edit flow.

## Database and migrations

`prisma/schema.prisma` is the source of truth. Apply committed migrations with `npm run db:migrate:deploy` in deployment environments. Do not edit an applied migration; create a new migration for schema changes. Back up before reset or restore operations.

## Email and local capture

With `RESEND_API_KEY` configured, contact submissions send the configured notification and confirmation messages. Without a real key in development, messages are captured under `.mail-dev/` and can be inspected through development-only Mail tools. Do not expose development mail capture in production.

## Sharing local development

Keep the local server running, then use a tunnel tool such as localtunnel or ngrok if external review is needed. The tunnel URL changes between sessions and the admin path must be appended manually. Use HTTPS tunnels when testing secure cookies.

## Verification and troubleshooting

Run the complete handoff checks:

```bash
npm run lint
npm run typecheck
npm test -- --run
npm run build
```

Common issues:

| Symptom | Check |
|---|---|
| Prisma startup failure | Confirm PostgreSQL and `DATABASE_URL`, then run `npx prisma generate` |
| Empty content | Distinguish a real empty state from a failed query in server logs |
| Admin returns to login | Confirm `ADMIN_PATH`, cookie security settings, and an unexpired session |
| Contact email not sent | Check `RESEND_API_KEY`; blank development keys intentionally use `.mail-dev/` |
| Stale public page | Confirm the mutation revalidation path and restart the production server if testing a static build |
| Migration conflict | Back up first, inspect migration state, and do not reset a shared database |

For deployment-specific steps, see [DEPLOY.md](../../DEPLOY.md). For architectural boundaries, see [ARCHITECTURE.md](ARCHITECTURE.md).
