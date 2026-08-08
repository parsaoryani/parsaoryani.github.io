# Documentation index

This directory separates durable guidance from project history and design reviews.

| Area | Purpose | Entry point |
|---|---|---|
| `guides/` | Current architecture, setup, usage, and design blueprint | [Architecture](guides/ARCHITECTURE.md), [Usage](guides/USAGE.md) |
| `reviews/` | UX, IA, accessibility, and product-design reviews | [Personal site UX review](reviews/PERSONAL_SITE_UX_IA_REVIEW.md) |
| `status/` | Progress notes and historical implementation records | [Progress](status/PROGRESS.md) |
| `superpowers/plans/` | Task-level implementation plans for multi-step changes | [File organization plan](superpowers/plans/2026-08-08-professional-file-organization.md) |

## Where code belongs

The application source remains under `src/` because Next.js owns the route hierarchy. Public and admin route groups stay in `src/app`; reusable UI stays in `src/components`; domain and infrastructure modules stay in `src/lib`; database schema/migrations stay in `prisma`; operational commands stay in `scripts`.

## Documentation rules

- Link to the current canonical path, not an old location.
- Keep current instructions in guides; label historical notes in status documents.
- Put review findings in `reviews/` so they do not look like runtime instructions.
- Add a plan under `superpowers/plans/` before a multi-step structural change.
