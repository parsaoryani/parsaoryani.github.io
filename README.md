# Personal Website

Personal academic and engineering portfolio for Parsa Oryani. The site has a public research portfolio and a private, session-protected admin CMS for managing editorial content.

## Start here

```bash
npm install
npx prisma generate
npm run dev
```

Open `http://localhost:4321`. Database setup, seed data, admin usage, tunnels, and deployment are documented in [docs/guides/USAGE.md](docs/guides/USAGE.md) and [DEPLOY.md](DEPLOY.md).

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the local Next.js server on port 4321 |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm test -- --run` | Run the Vitest suite once |
| `npm run build` | Create a production build |
| `npm run db:generate` | Generate the Prisma client |
| `npm run db:push` | Push the Prisma schema to a development database |
| `npm run db:migrate` | Create/apply a development migration |
| `npm run db:seed` | Seed development content and the admin account |
| `npm run db:backup` / `db:restore` | Back up or restore database data |
| `npm run deploy:preview` / `deploy:prod` | Run the repository deployment scripts |

## Repository map

```text
src/
  app/                 Next.js routes, route groups, API handlers, metadata
    (public)/          Public website routes
    (admin)/           Admin route group and dynamic ADMIN_PATH segment
    api/               Server-side API route handlers
  components/          Reusable UI and feature presentation modules
    ui/                Design-system primitives
    layout/            Site shell: navigation, footer, container
    content/           Public content components
    admin/             Admin-only editors and management components
  lib/                 Deep domain modules and infrastructure adapters
    auth/              Sessions, passwords, TOTP, authorization helpers
    db/                Prisma client and read/query modules
    validation/        Shared Zod validation schemas
    content/           Profile/content adapters
    home/              Homepage view-model helpers
    utils/              Small general-purpose utilities
  styles/              Global CSS and design tokens
  types/               Shared application types
  test/                Vitest and Testing Library setup
prisma/                Schema and database migrations
scripts/               Seed, database, deployment, and setup scripts
public/                Static assets served as-is
docs/                  Guides, reviews, status notes, and implementation plans
```

## Organization rules

- Keep framework-owned route folders inside `src/app`; do not flatten route groups or rename dynamic segments for cosmetic reasons.
- Put reusable visual modules in `src/components`; keep route-specific helpers next to their route.
- Put domain behavior behind small, testable interfaces in `src/lib`; keep database and authentication access out of presentational components.
- Use kebab-case for file names and named exports for reusable modules.
- Keep operational scripts in `scripts/db`, `scripts/deploy`, or `scripts/setup.sh`.
- Put durable documentation in the taxonomy described by [docs/README.md](docs/README.md).

## Documentation

- [Documentation index](docs/README.md)
- [Architecture guide](docs/guides/ARCHITECTURE.md)
- [Usage and admin guide](docs/guides/USAGE.md)
- [Deployment guide](DEPLOY.md)
- [Public/admin UX review](docs/reviews/PERSONAL_SITE_UX_IA_REVIEW.md)
- [Project progress](docs/status/PROGRESS.md)

## Verification before handoff

Run the same checks used for changes to the repository:

```bash
npm run lint
npm run typecheck
npm test -- --run
npm run build
```

The build may require the configured database and environment variables described in `.env.example`.
