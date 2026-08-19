# Site IA redesign — unify experience, per-university course pages, leaner homepage

## Why

The site currently has no real publications yet, so the "Research" nav item and the
homepage's publication showcase point at content that doesn't exist. Separately,
Education / Research Assistantships / Teaching Assistantships live on three
different routes reached through a header dropdown, and per-course syllabus detail
is buried in nested `<details>` accordions on the About page. This plan
consolidates experience into one browsable page, gives each university its own
course-detail page, and trims the homepage to what the site actually has today —
while keeping the underlying data and every admin capability untouched.

## Decisions

1. **Research nav + homepage publications section become admin-toggleable, not
   deleted.** A new `nav_research_visible` site setting (boolean, default `false`)
   gates the "Research" link in the header and footer, and the homepage's
   publication showcase. This is a toggle (matching the `hidden_timeline_sections`
   pattern already shipped) because "no publications yet" is a temporary state —
   flip it on the day the first real paper is public. `/research` and
   `/research/[slug]` keep working at their URLs; they're just unlinked from nav
   while the flag is off.
2. **"Selected Experience" and "Featured Projects" homepage sections are removed
   outright**, not toggled — the user has projects/experience data already and
   asked for a leaner homepage regardless, so this is a permanent structural
   simplification, not a temporary-content toggle.
3. **New `/experience` page** consolidates Education, Research Assistantships,
   Teaching Assistantships, Work Experience, Awards, Talks, and Service into one
   page with a pill-style jump nav into anchored sections (the same
   nav-pills-into-anchors pattern already proven on the current About page). This
   replaces the header's "Experience" dropdown (3 links) with one link.
4. **`/research-assistance` and `/teaching` are retired as standalone pages** and
   308-redirect to `/experience#research-assistance` / `/experience#teaching`, so
   any bookmarked or indexed links keep working. Their content moves into
   `/experience`.
5. **About page keeps only the personal story**: photo, bio paragraphs, skills. The
   Timeline/Recognition sections move to `/experience`, with a link from About
   pointing there.
6. **New `/education/[slug]` pages**, one per university, hold that university's
   full coursework/syllabus detail (grade, focus, topics, full syllabus, files,
   links) — content that today is nested inside an accordion on About. The
   Education entries on `/experience` become concise (institution, degree, dates,
   entrance rank) with a "View courses & coursework →" link to the dedicated page
   when that education entry actually has courses. `slug` is derived from the
   organization name at request time (kebab-case) — **no schema change**, since
   `TimelineEvent.organization` is already a stable, unique-enough string for the
   two education entries this site has.
7. **Everything stays admin-editable.** No admin route, form, or API endpoint is
   removed or restructured — only public-facing navigation, homepage content, and
   page grouping change. The new `nav_research_visible` toggle is added to the
   existing admin Settings → Section Visibility panel.

## New information architecture

Header / footer: **About · Experience · Projects · Contact** (+ CV button).
"Research" reappears automatically once `nav_research_visible` is turned on.

```
/                     Hero, Skills, About preview, Contact CTA (trimmed)
/about                Bio, photo, skills — "who I am"
/experience           Education → Research Assistantships → Teaching Assistantships
                       → Work Experience → Awards → Talks → Service
                       (pill nav + anchors, one page, mirrors current About pattern)
/education/[slug]     Per-university coursework/syllabus detail, linked from the
                       Education section on /experience
/projects, /research  Unchanged
/cv                   Unchanged (already a self-contained resume view)
```

## Implementation steps

1. `src/lib/utils/slugify.ts` — small kebab-case helper, used for `/education/[slug]`.
2. `src/lib/site/visibility.ts` — `NAV_RESEARCH_SETTING_KEY`, default `false`,
   parse helper (mirrors `src/lib/timeline/sections.ts`).
3. `src/app/layout.tsx` reads the setting server-side and passes it down through
   `ClientLayout` to `Nav` and `Footer`.
4. `nav.tsx` / `footer.tsx`: accept `showResearch` prop; drop the Experience
   dropdown for a single `/experience` link; conditionally render Research.
5. `src/app/(public)/experience/page.tsx`: new page combining the About page's
   existing TimelineEvent-rendering code (moved, not duplicated) with the
   Research Assistantship and Teaching Assistantship listings (moved from their
   standalone pages). Education entries show a courses-summary link instead of
   inline accordions.
6. `src/app/(public)/education/[slug]/page.tsx`: new page rendering one
   education `TimelineEvent`'s full course/syllabus detail (the accordion markup
   moved out of About).
7. `src/app/(public)/about/page.tsx`: trimmed to bio/photo/skills; add a link to
   `/experience`.
8. Delete `src/app/(public)/research-assistance/` and `src/app/(public)/teaching/`
   page files; add redirects in `next.config.ts`.
9. `src/app/(public)/page.tsx`: remove the Featured Research, Selected Experience,
   and Featured Projects sections; gate anything publication-related on
   `nav_research_visible`.
10. Admin Settings editor: add the Research toggle next to the existing section
    checkboxes.
11. `scripts/seed.ts`: seed `nav_research_visible: false` by default.
12. Update `docs/guides/ARCHITECTURE.md` and `docs/guides/USAGE.md` route tables.
13. Verify: `npm run lint && npm run typecheck && npm test && npm run build`, plus
    a live check of `/`, `/about`, `/experience`, `/education/[slug]`, the two
    redirects, and the admin settings toggle.

## What does not change

- Prisma schema — no migration.
- Any admin route, form, or API endpoint.
- `/projects`, `/research`, `/research/[slug]`, `/cv`, `/contact` — unchanged.
- Publication/Project/TimelineEvent/TeachingAssistant/ResearchingAssistant data.
