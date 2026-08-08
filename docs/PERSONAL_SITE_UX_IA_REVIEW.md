# Personal Site and Admin UX, Information Architecture, and Content Management Review

**Prepared for:** Parsa Oryani  
**Date:** 2026-08-08  
**Status:** Implementation-ready recommendation  
**Scope:** Public website and private admin; no content, public route, or existing management capability is to be removed

## 1. Executive recommendation

The site already contains the right material for a strong academic and engineering profile. Its main public problem is not missing content; it is that the navigation and page responsibilities expose the content model too literally. “TA” and “RA” are separate top-level links, About contains several different kinds of information, CV does not surface all of the experience represented elsewhere, and the homepage does not introduce the experience material at all.

The admin already manages publications, projects, timeline entries, courses, tags, skills, teaching/research experience, messages, contact data, profile photo, homepage title/description, sessions, and audit logs. However, it is not yet a complete professional content-management system. Several important public statements remain hardcoded, some model fields displayed publicly cannot be edited in the admin, publication editing can overwrite structured authors/contributions, project editing omits four public case-study sections, and the generic JSON settings editor exposes internal storage instead of safe content forms.

The recommended structure is:

```text
Home
├── Research
│   ├── Research agenda
│   ├── Publications
│   └── Publication detail pages
├── Projects
│   ├── Project gallery
│   └── Project case studies
├── Experience
│   ├── Research Experience (current RA route)
│   ├── Teaching Experience (current TA route)
│   └── Background Timeline (existing About timeline)
├── About
├── Contact
└── CV (persistent primary action)
```

This reduces the desktop header from six equal text links plus CV to five clear categories plus CV:

```text
Parsa Oryani | Research | Projects | Experience ▾ | About | Contact | [CV ↗]
```

Nothing is deleted. The existing `/research-assistance` and `/teaching` pages remain public, indexable destinations. They are grouped under a professional “Experience” category in the navigation and renamed in user-facing copy.

The most important changes are:

1. Replace the top-level “TA” and “RA” labels with an “Experience” menu.
2. Rename “Researching Assistance” to “Research Experience” or “Research Assistantships.”
3. Rename “Teaching Assistance” to “Teaching Experience” or “Teaching Assistantships.”
4. Give every page one clear responsibility and one primary next action.
5. Add a compact Selected Experience section to the homepage so RA and TA work is not hidden.
6. Expand the HTML CV to include publications, research experience, teaching, service, and contact links already represented elsewhere.
7. Rebuild the footer as the complete secondary navigation so no preserved destination becomes harder to find.
8. Make every public **editorial** value editable through one typed admin owner while keeping interface copy, layout, and visual design code-owned.
9. Standardize editorial state as Draft, Published, Archived, and Trash; treat Preview as an action, not a stored state.
10. Repair data-loss risks before expanding the UI: preserve structured publication authors/contributions and expose every project case-study field.
11. Reorganize the admin into Content, Inbox, Media, and System groups with responsive navigation.
12. Add field validation, unsaved-change protection, revision history, audit coverage, safe deletion, and authenticated previews.

## 2. Scope, method, and evidence limits

This review is based on the current public and admin routes, page components, shared components, database schema, validation schemas, design tokens, and interaction code. The local application responds successfully, but this workspace has no connected browser surface. Therefore:

- Information architecture, copy, semantic structure, component behavior, content ownership, CRUD coverage, source-level accessibility risks, and data placement were reviewed directly.
- Visual claims that require screenshots—actual reflow, perceived density, clipping, rendered contrast, focus visibility, animation behavior, and touch behavior—are listed as verification tasks.
- This document does not claim WCAG compliance or a completed visual audit.

## 3. Current content inventory

### 3.1 Global shell

| Surface | Current contents | Assessment |
|---|---|---|
| Header | Name; Publications; Projects; TA; RA; About; Contact; CV button | Too many peer-level choices. Abbreviations make sense to the owner but are less clear to first-time visitors and international audiences. |
| Mobile menu | Same six links plus CV | Clearer vertically, but lacks an explicit menu relationship and needs keyboard/escape/focus verification. |
| Footer | Short bio; Research, Projects, About, Contact; GitHub, LinkedIn, Scholar; copyright and positioning line | Useful, but incomplete compared with the public site. Teaching, research experience, and CV disappear from the footer. |

### 3.2 Public routes and sections

| Route | Existing sections/content | Current role and issue |
|---|---|---|
| `/` | Hero; degree badge; identity statement; research description; Scholar/GitHub/CV/Email actions; availability and venue claims; featured publications; featured projects; skills | Strong research-first opening, but experience, personal context, and a closing contact action are absent. “Download CV” links to the HTML CV rather than a file. |
| `/research` | Research agenda; publications grouped by year; publication cards; empty state | Correct flagship destination. It needs stronger research-theme scanning and clearer paper actions. |
| `/research/[slug]` | Back link; venue/year; title; authors; venue; PDF/arXiv/code/BibTeX controls; tags; TL;DR; abstract; contributions; citation | Good deep-page structure. The BibTeX button does not expose an obvious implemented action, and DOI/project URL data is not surfaced. |
| `/projects` | Introduction; tag filters; project grid; empty state | Correct location. Improve the filter semantics, card scanning, and result feedback. |
| `/projects/[slug]` | Back link; year/role; title; summary; stack; repository/demo; Problem; Approach; Architecture; Challenges & Decisions; Results; Retrospective | Strong case-study skeleton. Needs richer evidence and optional navigation for long cases. |
| `/research-assistance` | Intro; research-assistant cards; lab; university; supervisor; dates; description; technologies; outcomes | Valuable content, but the naming is grammatically awkward and the route is over-promoted in the global header. |
| `/teaching` | Intro; teaching-assistant cards; university; professor; dates; description; technologies; highlights | Valuable content, but a two-letter top-level label undersells it and separates it from the broader experience story. |
| `/about` | Profile photo; three-paragraph bio; timeline category shortcuts; Education; Experience; Awards; Talks; Service; courses and related resources; skills | Overloaded. It combines biography, résumé, academic history, course archive, and skills. The material should remain, but the page needs stronger internal hierarchy and progressive disclosure. |
| `/cv` | Identity/contact header; PDF action; Education; Experience; Skills; Awards; optional Talks | Useful and indexable, but incomplete relative to the rest of the site: publications, RA, TA, service, and primary external profiles are missing. |
| `/contact` | Intro; contact form; email and profile methods; location | Correct destination and sensible two-column structure. Form state announcements and error associations need source-level accessibility work. |

### 3.3 Existing content models that must be preserved

- Publications: title, authors, venue/type/year, abstract, TL;DR, contributions, DOI, arXiv, PDF, code, project URL, BibTeX, citation count, tags, featured state.
- Projects: title, summary, role, year, problem, approach, architecture, challenges, results, retrospective, stack, repository, demo, tags, featured state.
- Timeline: education, professional experience, awards, talks, service, dates, organization, location, description, highlights, link, and courses.
- Teaching experience: course, institution, professor, dates, description, highlights, technologies.
- Research experience: topic, lab, institution, supervisor, dates, description, outcomes, technologies.
- Skills: named categories and ordered skills.
- Contact: message form, multiple emails, external profiles, location, availability note.

### 3.4 Current admin inventory

| Admin area | Current capabilities | Professional gaps |
|---|---|---|
| Login | Email/password login; optional TOTP verification; validation; rate-limited API/security architecture | Field errors are not programmatically associated; 2FA setup/recovery and password management are not visible; no return-to-requested-page flow. |
| Dashboard | Counts for publications, projects, new messages, timeline, tags, skills, TA, and RA; links to management sections | Cards say “Create, edit & delete” but do not expose their create action; counts mix draft/published records; no recent edits, content health, failed links, or publishing shortcuts. |
| Publications | List, create, edit, preview public page, draft/published status, featured flag, soft delete | Author input is saved as one author object instead of separate people; editing forces `contributions` to an empty array; no tag assignment, sort order, citation count, OG image, structured contribution editor, or safe revision comparison. |
| Projects | List, create, edit, public preview, draft/published status, featured flag, soft delete | Admin forms expose Problem and Approach but omit Architecture, Challenges & Decisions, Results, Retrospective, tags, sort order, and OG image even though the public page/schema use them. |
| Timeline | Grouped list; create/edit/delete; visibility; education course tab | No list-level visibility/status signal; no highlights or sort-order editor; `publication_milestone` can be created but is not represented by the public About page's type configuration. The proposed resolution is to render it under About → Recognition. |
| Courses | Course management under education timeline records; course resources, files, and links | Buried under Timeline with weak discoverability; needs clearer relationship, ordering feedback, upload validation, and destructive-action protection. |
| Research experience | List, create, edit, delete; draft/published status; outcomes and technologies | Admin and route use “researching assistance”; list omits status and public preview; no sort-order control, linked publication/project artifacts, or archive/restore. |
| Teaching experience | List, create, edit, delete; draft/published status; highlights and technologies | List omits status and public preview; no sort-order control, repeated-course grouping, resource relationships, or archive/restore. |
| Tags | Create, edit, delete | Publications/projects cannot assign tags from their forms; edit affordance appears only on hover; deletion gives no usage count or impact warning. |
| Skills | Create/rename/delete categories; add/delete skills; proficiency stored | Cannot edit a skill name/proficiency after creation or reorder categories/skills; delete controls are hover-only; category deletion can remove many skills with only a native confirmation. |
| Homepage settings | Edit homepage title and description | Credential badge, availability line, hero actions, profile URLs, supporting claim, section intros/order, and closing CTA are hardcoded. A seeded `hero_thesis` setting is not used by the public homepage. |
| Contact settings | Edit intro, emails, external links, location/note | Link icon metadata is not safely preserved by the typed editor; updates are multi-request and can partially succeed; no preview or URL/email validation. |
| Other settings | Edit arbitrary settings as raw JSON/text | Internal keys and storage format are exposed; invalid-but-parseable values can break public assumptions; important content has no domain labels, help, preview, or schema validation. |
| Profile photo | URL, alt text, preview, remove | Requires third-party hosting despite an upload API existing elsewhere; no file upload, crop, file validation, focal point, or automatic dimensions. Contains an unused local variable. |
| Messages | List; view; mail link; mark read/archive/spam; delete | No search, status filter, reply-state tracking, bulk actions, retention controls, or recoverable trash. IP addresses receive unnecessary visual prominence. Errors can fail silently. |
| Security | Recent sessions and audit log | Cannot revoke a session, identify the current session, manage 2FA/recovery, change password, filter/export logs, or inspect change details. Empty states are absent. |
| Developer mail | View development email records | Appears in the primary admin navigation; it should be environment-gated and grouped under System/Developer Tools. |
| Admin shell | Fixed sidebar; “View Site”; logout; content area | Fourteen flat items recreate the same IA problem as the public header; fixed `w-56` sidebar has no mobile pattern; active state needs `aria-current`; icon-only row actions need accessible names. |

### 3.5 Confirmed admin coverage and integrity risks

These are not optional polish items; they affect whether the admin can be trusted as the source of truth.

1. **Admin page authorization gap:** `src/middleware.ts::middleware` checks only whether a `session_token` cookie exists, while `src/app/(admin)/[adminPath]/layout.tsx::AdminSectionLayout` does not call `getSession()`. Server pages such as `AdminPublicationsPage` and `AdminMessagesPage` query private data beneath that layout. Because `getSession()` is not reached before those pages render, a forged non-empty cookie may bypass the page-level gate even though mutation APIs perform their own session checks.
2. **2FA completion gap:** `POST /api/auth/login` calls `createSession()`, which creates the database session and authenticated cookie before TOTP succeeds. `POST /api/auth/verify-2fa` then verifies that already-valid session, while `getSession()` has no pending/factor-verified state. The decisive security assumption in the implementation plan is therefore: any session accepted by `getSession()` is fully authenticated and must never be created before the required second factor.
3. **Publication edit data loss:** both create and edit convert the full comma-separated author string into one `{ name }` object. Editing also submits `contributions: []`, which can erase existing structured contributions.
4. **Incomplete project editor:** `architecture`, `challenges`, `results`, and `retrospective` exist in the schema and public page but are absent from admin submission data.
5. **Unassignable taxonomy:** APIs accept `tagIds`, but publication/project admin forms do not expose them.
6. **Uneditable ordering:** lists read `sortOrder`, but most admin forms do not let the owner change it.
7. **Hardcoded public content:** About biography, research agenda, page introductions, CV identity/profile, header/footer copy, social/profile links, hero utility links, and several trust claims require code changes.
8. **Partial multi-setting saves:** Contact saves four independent requests concurrently; one can fail after others succeed, leaving a mixed public state.
9. **Orphaned/inconsistent settings:** `hero_thesis` is seeded and editable through raw settings but is not consumed by the current homepage.
10. **Invisible timeline type:** the admin supports `publication_milestone`, while the public About timeline only maps education, experience, award, talk, and service. Preserve this type and render it under About → Recognition → Publication milestones; exclude it from CV by default to avoid duplicating the Publications section.
11. **Unsafe generic editing:** “Other settings” accepts raw JSON or arbitrary strings without a key-specific schema.
12. **Destructive native confirmations:** records are deleted through browser `confirm()` dialogs; several flows have silent or minimal error recovery and no restore path.

## 4. Recommended information architecture

### 4.1 Primary navigation

Use these desktop items, in this order:

1. **Research** — `/research`
2. **Projects** — `/projects`
3. **Experience** — menu trigger, not a new route in the first implementation phase
4. **About** — `/about`
5. **Contact** — `/contact`
6. **CV** — visually distinct action to `/cv`

The Experience menu contains:

- **Research Experience** — `/research-assistance`
- **Teaching Experience** — `/teaching`
- **Education & Career** — `/about#timeline`
- **Awards, Talks & Service** — `/about#recognition`

This approach is preferred over immediately creating `/experience` because it fixes the navigation problem without duplicating or migrating content. A future `/experience` hub can be introduced only if the body of experience content grows enough to justify it.

### 4.2 Why RA and TA belong under Experience

RA and TA are roles, not primary content types. Publications and projects are evidence artifacts that visitors browse directly. RA and TA describe contexts in which work happened. Treating all four as equal header items flattens the hierarchy.

Recommended terminology:

| Current label | Recommended navigation label | Recommended page title |
|---|---|---|
| RA | Research Experience | Research Assistantships |
| Researching Assistance | Research Experience | Research Assistantships |
| TA | Teaching Experience | Teaching Assistantships |
| Teaching Assistance | Teaching Experience | Teaching Assistantships |

“Research Experience” is the best menu label because it is immediately understood by admissions committees, researchers, and recruiters. “Research Assistantships” is the most precise page heading. The same distinction applies to Teaching Experience/Teaching Assistantships.

### 4.3 Mobile navigation

Use a full-width menu panel directly below the header. Its structure should be:

```text
Research
Projects
Experience
  Research Experience
  Teaching Experience
  Education & Career
  Awards, Talks & Service
About
Contact
[View CV]
```

Requirements:

- The Experience group is expanded by default on mobile; hiding two important destinations behind a second tap is unnecessary.
- The menu trigger exposes `aria-expanded` and `aria-controls`.
- Escape closes the menu.
- Focus moves into the opened menu and returns to the trigger after closing.
- Route changes close the menu.
- Background scrolling is prevented while the menu panel is open.
- The current page is expressed with `aria-current="page"`, not color alone.

### 4.4 Footer navigation

Use the footer as a complete sitemap, grouped into three columns:

| Work & Experience | Background | Connect |
|---|---|---|
| Research | Research Experience | Contact |
| Projects | Teaching Experience | Email |
|  | About | GitHub |
|  | Education & Career | LinkedIn |
|  | Awards, Talks & Service | Google Scholar |
|  | CV / PDF |  |

This retains every destination while allowing the header to remain focused.

## 5. Page-by-page composition

### 5.1 Homepage

The homepage should act as a curated index. Recommended order:

1. **Hero**
   - Name/role or direct identity statement.
   - Two-sentence research thesis.
   - Primary action: View Research.
   - Secondary actions: View CV, Google Scholar, GitHub, Email.
   - One concise availability line.
2. **Featured Research**
   - Up to three publications with `featured = true`, ordered by `sortOrder ASC`, then `publishedAt DESC`.
   - Each card shows title, venue/year, one contribution sentence, and direct PDF/code/detail actions.
3. **Selected Experience**
   - The most recent published research assistantship by `startDate DESC`, then `sortOrder ASC`.
   - The most recent published teaching assistantship by `startDate DESC`, then `sortOrder ASC`.
   - Link to both full experience pages.
4. **Featured Projects**
   - Up to three projects with `featured = true`, ordered by `sortOrder ASC`, then `year DESC`.
5. **Expertise**
   - Preserve all skill categories, but keep the presentation compact and evidence-oriented.
   - Where possible, link a skill theme to a supporting publication or project rather than presenting isolated keywords.
6. **Short About preview**
   - Profile image, two-sentence biography, and link to About.
7. **Contact call to action**
   - A quiet final prompt for research collaboration, PhD conversations, or engineering work.

Specific homepage fixes:

- Change “Download CV” to **View CV** when linking to `/cv`, or link directly to `/cv.pdf` if download is intended.
- Replace the generic Google Scholar URL with the actual author profile.
- Verify unsupported venue and status claims. Correct or qualify inaccurate copy; unpublish it only with the owner's explicit approval. Claims should be linked to evidence where practical.
- Avoid making visitors wait for the typewriter animation to understand the main value proposition. Render the full statement in the DOM and treat typing as optional enhancement.
- Keep only one visually dominant action in the hero. Four equally weighted buttons create decision noise.

### 5.2 Research

Recommended order:

1. Research agenda.
2. Research themes or methods as two to four concise tags/links.
3. Selected publication controls: All / Selected and optional topic filters.
4. Publications grouped by year.
5. Final links to research experience, Scholar, and contact.

Publication card requirements:

- Title remains the primary clickable target.
- Show authors with Parsa visually emphasized.
- Keep venue and year together.
- Show a one-sentence TL;DR, not a long abstract, in lists.
- Provide visible text actions: Details, PDF, Code, Cite.
- Avoid nested links inside a card-wide link.

Publication detail requirements:

- Preserve every existing section.
- Surface DOI and project URL when available.
- Make BibTeX copy functional and confirm success without relying on color.
- Add an on-page contents list only when a detail page contains at least three long-form content sections.
- Use a stable citation block and machine-readable scholarly metadata.

### 5.3 Projects

Recommended order:

1. Short engineering positioning statement.
2. Filters with an explicit “All projects” state.
3. Results summary such as “6 projects” or “2 projects tagged Security.”
4. Project grid.
5. Contact/GitHub call to action.

Project cards should expose title, problem/summary, role, year, stack, and explicit Details/Repository/Demo actions. Do not make stack chips compete visually with the title.

Project detail pages should retain Problem, Approach, Architecture, Challenges & Decisions, Results, and Retrospective. Add visual evidence only when real assets exist: architecture diagram, benchmark chart, screenshot, repository, demo, or paper. Never add decorative placeholders.

### 5.4 Experience: research assistantships

Keep `/research-assistance` and its current data. Recommended page structure:

1. Page title: **Research Assistantships**.
2. One-sentence framing tied to the research agenda.
3. Reverse-chronological roles.
4. Each role: topic, lab/institution, supervisor, dates, concise responsibility, methods/technologies, and outcomes.
5. Outcome links when applicable: resulting paper, preprint, code, poster, or project.
6. Final action: View Publications or Contact.

The outcome is more important than the technology list. Order each card as **role/context → question/responsibility → outcome → methods**.

### 5.5 Experience: teaching assistantships

Keep `/teaching` and its current data. Recommended page structure:

1. Page title: **Teaching Assistantships**.
2. Short teaching/mentoring statement.
3. Reverse-chronological courses.
4. Each course: course name, institution, instructor, term, responsibilities, scale where meaningful, contributions/highlights, and resources.
5. Optional grouping by course when the same course appears across several terms.
6. Final action: View Background or Contact.

“Technologies” should not be the dominant metadata for teaching. Prefer responsibilities such as curriculum support, labs, grading, office hours, mentoring, exercise design, and project supervision.

### 5.6 About

About should answer “Who is Parsa, what is he working toward, and how did he get here?” Recommended order:

1. Profile photo and short biography.
2. Current focus and PhD direction.
3. Timeline with clear sub-navigation.
4. Education and professional experience.
5. Recognition: awards, talks, and service.
6. Course archive/resources as progressive disclosure inside Education.
7. Skills as the final supporting section.

The existing content remains, but the page should not show all dense course details by default. Use accessible disclosure components per degree or course group. This is progressive disclosure, not removal.

Use stable anchor IDs:

- `#timeline`
- `#education`
- `#experience`
- `#recognition`
- `#courses`
- `#skills`

The existing category shortcuts should behave like a table of contents, indicate the current section while scrolling through `aria-current="location"`, and not resemble filter controls if they only jump to anchors.

### 5.7 CV

The CV is the most important utility page and must represent the complete professional profile. Recommended order:

1. Identity and contact links.
2. Research interests / short profile.
3. Education.
4. Publications.
5. Research experience.
6. Teaching experience.
7. Selected engineering experience/projects.
8. Awards and honors.
9. Talks and service.
10. Skills.

Requirements:

- Preserve the HTML version and PDF action.
- Add Scholar, GitHub, LinkedIn, and email as visible text links.
- Use `/cv.pdf` as the stable PDF URL.
- Build one database-backed CV view model and generate both the HTML CV and PDF from it.
- Add print styles so the HTML CV is usable even if the PDF is unavailable.
- Do not let the sticky site header dominate printed output.

### 5.8 Contact

Keep the form, direct contact methods, profiles, and location. Use the form first on desktop; show direct methods before the form below 768 px so a mobile visitor can contact or verify profiles quickly.

Requirements:

- Associate each validation message with its field using `aria-describedby`.
- Use `aria-invalid` on invalid fields.
- Announce submission success and server failure with an appropriate live region.
- Keep entered values after server failure.
- State expected response time only if it can be honored.
- Ensure external-link icons are supplementary and not the only signal.

### 5.9 Error and empty states

Existing empty states are useful but should not read like unfinished portfolio content in production.

- If a public category has no entries, provide a relevant next destination rather than only “Check back soon.”
- A filtered empty state must include a one-click “Clear filter” action.
- Detail-page 404s should link back to the relevant index and to Home.
- Failed data loads should be distinguishable from genuinely empty content; the current broad `.catch(() => [])` pattern hides the difference.

## 6. Global UI and interaction recommendations

### 6.1 Hierarchy

- Use one page title, one short introduction, and one visually dominant primary action per page. Secondary and utility actions remain available with lower emphasis.
- Reduce repeated badge + gradient heading + paragraph treatments. They make every page opening feel equally promotional and reduce distinction.
- Reserve cyan for primary actions, active navigation, and links. Indigo, emerald, and amber can retain semantic/category roles but should not create competing action hierarchies.
- Use cards for bounded items, not every block. Biography and long-form research text should read as editorial content rather than a dashboard.
- Set long-form text to roughly 65–72 characters per line.

### 6.2 Copy and terminology

Replace these strings while retaining their meaning:

| Current | Recommended |
|---|---|
| Publications (header) | Research |
| RA | Research Experience |
| Researching Assistance | Research Assistantships |
| TA | Teaching Experience |
| Teaching Assistance | Teaching Assistantships |
| Download CV linking to `/cv` | View CV |
| Send a Message | Send a message |
| No publications yet. Check back soon. | Research updates will appear here. In the meantime, view my research experience or Scholar profile. |

Copy rules:

- Prefer concrete outcomes over adjectives such as “top-tier,” “advanced,” or “real impact.”
- Use consistent first person across bio and page introductions.
- Expand abbreviations on first use.
- Keep titles in sentence case unless the established design system intentionally uses title case.
- Verify all claims, dates, venue names, profile URLs, PDF links, and email addresses before launch.

### 6.3 Cards and metadata

- Use a consistent metadata order: category/role, title, organization/venue, date, summary, outcomes, actions.
- Keep action labels visible; do not rely on icons alone.
- Make hover effects supplementary. The same information and affordance must remain available on touch and keyboard.
- Avoid subtle borders as the only card boundary when adjacent surfaces have near-identical colors.

### 6.4 Motion

The source includes reduced-motion handling, which is a strength. Retain it and also:

- Keep entrance motion below roughly 300–400 ms for common content.
- Avoid stagger delays that make later cards feel unavailable.
- Make typewriter text immediately available to screen readers and reduced-motion users.
- Pause decorative particles when the page is not visible.
- Verify that scroll-reveal content never remains transparent if JavaScript fails.

## 7. Accessibility findings and requirements

### 7.1 Confirmed source-level strengths

- A global `:focus-visible` outline exists.
- A `prefers-reduced-motion` fallback exists for the declared animation utilities.
- Page structure uses semantic elements such as header, nav, main, section, article, footer, form, headings, lists, and labels.
- The mobile menu has an accessible name.
- The contact form uses explicit labels.
- Profile photo supports alternative text.

### 7.2 Source-level risks

1. **Tertiary text contrast:** `Ash` (`#5C6675`) is approximately 3.33:1 on `Void`, 3.09:1 on `Slate 900`, and 2.77:1 on `Slate 800`. It fails the 4.5:1 target for normal-size text. It is currently used for many 10–12 px labels and timestamps.
2. **Border contrast:** `Slate 700` is only approximately 1.3–1.6:1 against common backgrounds. Important control and card boundaries need a 3:1 non-text contrast check.
3. **Indigo contrast:** `#7C6CFF` falls to approximately 4.18:1 on `Slate 800`, below 4.5:1 for normal text. Do not use it for small text on that surface without adjustment.
4. **Form errors:** Errors are visually present but not programmatically associated with inputs, and submission status is not explicitly announced.
5. **Mobile menu state:** The trigger lacks `aria-expanded`/`aria-controls`; focus management and Escape behavior are not evident in source.
6. **Active filters and navigation:** Active states rely heavily on color and border styling. Add `aria-current` or selected-state semantics.
7. **Very small text:** Multiple 10 px and 11 px labels are used. Increase important metadata to at least 12–14 px and verify zoom/reflow at 200% and 400%.
8. **Touch targets:** Some chips and compact links use short vertical padding. Verify a 44×44 CSS pixel target or adequate target spacing.
9. **Icon semantics:** Decorative icons should be hidden from assistive technology; meaningful icon-only controls require explicit names.
10. **Gradient text:** Confirm fallback text color and forced-colors behavior because clipped gradient text can disappear in high-contrast modes.

### 7.3 Required verification

- Keyboard-only pass on every public route.
- VoiceOver/Safari and NVDA/Firefox spot checks.
- 200% browser zoom and 320 CSS pixel reflow.
- Forced-colors/high-contrast mode.
- Touch target and menu behavior on a real mobile viewport.
- Automated axe scan as a baseline, followed by manual review.
- Contrast checks against actual rendered backgrounds, including translucent/glass surfaces.

## 8. Preservation matrix

This matrix makes the “remove nothing” rule testable.

| Existing material | Primary destination after change | Secondary exposure |
|---|---|---|
| Hero identity and research thesis | Home | About, CV profile |
| Featured publications | Home | Research index |
| All publications | Research | CV |
| Publication details | Existing detail routes | Research cards |
| Featured projects | Home | Projects index |
| All projects | Projects | CV selected projects |
| Project case-study sections | Existing detail routes | Project cards |
| Research assistantships | Existing `/research-assistance` | Experience menu, Home preview, CV |
| Teaching assistantships | Existing `/teaching` | Experience menu, Home preview, CV |
| Biography and photo | About | Home preview |
| Education/career timeline | About | Experience menu anchor, CV |
| Awards | About recognition | CV |
| Talks | About recognition | CV |
| Service | About recognition | CV |
| Course records and resources | About education/course disclosure | Teaching links where relevant |
| Skills | About and Home | CV |
| Contact form and methods | Contact | Home CTA, footer |
| Social profiles | Contact and footer | Hero, CV |

### 8.1 Admin capability preservation

| Current capability | Destination after admin reorganization |
|---|---|
| Dashboard counts and shortcuts | Dashboard, expanded with lifecycle/content-health information |
| Publication CRUD/preview/feature/status | Content → Research → Publications |
| Project CRUD/preview/feature/status | Content → Projects |
| Timeline CRUD/visibility | Content → Experience → Timeline & courses |
| Course files and links | Education row → Manage courses/resources; also discoverable from Timeline & courses |
| Research-experience CRUD/status | Content → Experience → Research Experience |
| Teaching-experience CRUD/status | Content → Experience → Teaching Experience |
| Tag CRUD | Content → Skills & Tags; tag assignment also appears in publication/project editors |
| Skill category/skill management | Content → Skills & Tags |
| Homepage title/description | Content → Homepage, expanded into a typed homepage editor |
| Contact intro/emails/links/location | Canonical identity/methods in Content → Profile & Contact; page-specific copy in Content → Contact page |
| Raw site settings | System → Emergency settings, owner-only, re-authenticated, schema-constrained, and audited; typed values move to professional editors |
| Profile photo URL/alt/preview/remove | Content → Profile & Contact and Media, expanded with direct upload |
| Message view/status/delete | Inbox → Messages, expanded with filters and recoverable trash |
| Sessions and audit log | System → Security and Activity log, expanded with actions |
| Development mail viewer | System → Developer tools; visible only outside production |
| View Site and Logout | Persistent admin navigation footer/header |

No model, field, route, content category, or admin capability is intentionally removed by this proposal. Capabilities may move, receive safer terminology, or become restricted to the correct environment, but remain available to the authorized owner.

## 9. Professional admin and content-management specification

### 9.1 Ownership boundary

The admin manages **content and editorial state**. Code manages **layout, components, visual tokens, responsive behavior, security policy, and validation rules**.

Admin-editable editorial content:

- Identity, biography, research statements, availability, contact details, profile links, CV PDF, and profile image.
- Page titles, introductions, calls to action, trust claims, and footer copy.
- Publications, projects, timeline, courses, research/teaching experience, skills, tags, and their ordering/visibility.
- Relationships among publications, projects, experience, tags, and homepage selections.
- Draft/published/archived state, preview, SEO title/description, and share image.

Code-owned interface and product behavior:

- Which top-level sections exist and their approved information architecture.
- Component structure, responsive breakpoints, design tokens, accessible semantics, and interaction patterns.
- Authentication, authorization, rate limits, audit rules, allowed field types, and output encoding.
- Public rendering logic and structured-data templates.
- Navigation labels, field labels, button text, validation/error text, statuses, accessibility instructions, and other interface copy. These may be localized in code, but they are not ordinary CMS fields.

The admin must not expose arbitrary HTML, CSS, JavaScript, raw database JSON, navigation routes, or design tokens as ordinary content fields.

Canonical ownership rules prevent one save surface from silently overwriting another:

- **Profile** is the only owner of full name, professional headline, institution/degree, location, primary and secondary email methods, short/long bio, current focus, availability, CV file reference, profile photo, and canonical external profile/social links.
- Header, footer, homepage identity, About, Contact, and CV consume Profile values; they do not maintain duplicate copies.
- **PageContent** owns page-specific editorial copy and SEO values. For example, the research- and teaching-experience introductions belong to their PageContent records, not to individual experience records.
- Structured libraries own their records and relationships: publications, projects, timeline/courses, research/teaching experience, skills, tags, and media.
- If legacy settings duplicate a canonical value, migration chooses the canonical Profile/PageContent value, records the decision, keeps the legacy value in a migration snapshot, and removes the duplicate from normal edit forms.

### 9.2 Recommended admin navigation

Replace the fourteen-item flat sidebar with grouped navigation:

```text
Dashboard

Content
  Homepage
  Profile & Contact
  About page
  Research
    Publications
    Research page
  Projects
    Projects page
  Experience
    Research experience
    Teaching experience
    Timeline & courses
  Skills & Tags
  CV page
  Contact page

Inbox
  Messages

Media
  Media library

System
  Emergency settings
  Security
  Activity log
  Developer tools (development only)

View site
Sign out
```

Desktop uses a collapsible sidebar. Below 1024 px, use a top admin bar and modal navigation drawer. The current page receives `aria-current="page"`; group expansion is keyboard-operable and persistent during the session.

Use professional labels everywhere in admin as well as public navigation: **Research Experience** and **Teaching Experience**, never “RA,” “TA,” “Researching Assistance,” or “Teaching Assistance” as primary labels.

Developer Mail remains available only in non-production Developer tools. Emergency settings remains available in production to the owner because the current raw-settings capability must be preserved, but requires recent re-authentication, shows typed editors for known keys, renders unknown keys read-only, records an audit diff, and never permits arbitrary HTML/script values.

### 9.3 Standard content library pattern

Every library uses the same base: page title, result count, visible primary action, search, relevant filters/sort, labeled rows, empty/error states, and pagination after 50 results. Actions and filters are domain-specific rather than misleadingly identical:

| Library | Required filters | Required row actions |
|---|---|---|
| Publications | Status, year, featured, tag | Edit, Preview/View live, Duplicate, Archive/Restore |
| Projects | Status, year, featured, tag | Edit, Preview/View live, Duplicate, Archive/Restore |
| Research/Teaching Experience | Status, type, year | Edit, Preview/View live, Archive/Restore |
| Timeline/Courses | Type, status, year | Edit, Preview/View live, Manage courses where applicable, Archive/Restore |
| Skills | Category, proficiency | Edit, reorder, archive/restore; no duplicate or public preview |
| Tags | Active/archived, usage | Edit, view usage, reassign, archive/restore; no duplicate or public preview |
| Media | Type, lifecycle, usage | Preview/details, replace, view usage, archive/restore |
| Messages | Status and date | Open, reply, mark read/unread, archive, spam, trash/restore |
| Sessions/activity | Current/active/expired or date/action/result | View details; revoke only where applicable |

Do not hide essential controls until hover. Hover may enhance a row, but actions must remain keyboard- and touch-discoverable. Search covers the primary title/name plus domain-relevant identifiers; sort options are only offered when their effect is unambiguous.

Do not hide essential edit/delete controls until hover. Hover may enhance the row, but controls must remain keyboard- and touch-discoverable.

### 9.4 Standard editor pattern

Every content editor should use this structure:

1. Breadcrumb/back link and content type.
2. Title and persistent status badge.
3. Main form grouped into understandable sections, not one long undifferentiated form.
4. Right-side publishing panel on desktop; bottom action bar on mobile.
5. Actions: **Save draft**, **Preview**, **Publish/Update**, and an overflow menu for Archive.
6. Field-level error beside the field, summary at the top, and focus on the first error.
7. “Saved” state with timestamp; unsaved-change indicator and navigation warning.
8. Word/character guidance only where public layouts or metadata impose a real limit.
9. Inline help using public terminology and examples, not database field names.
10. Successful save keeps the editor open; publishing offers **View live page**.

Slug behavior:

- Generate from title only on initial creation.
- Allow manual editing before first publish.
- Warn that changing a published slug changes its URL.
- Store redirects from old published slugs rather than breaking external links.
- Enforce a database uniqueness constraint. A collision returns HTTP 409 and the editor suggests an available alternative without discarding other input.

Date behavior:

- End date must not precede start date.
- “Present” is represented by no end date and labeled explicitly.
- Year-only content uses a year control, not a full date field.

Save integrity:

- Add an integer `version` to editable records. Updates include the version read by the editor; a mismatch returns HTTP 409 with **Reload current**, **Compare changes**, and **Copy my draft** recovery actions.
- Save a record, its repeaters, and relationship rows in one database transaction. A failure rolls back the whole edit.
- Add composite uniqueness for relationship pairs such as publication–tag and project–tag so retries cannot create duplicates.
- Cascade deletion only to records exclusively owned by the parent, such as join rows and revision snapshots. Restrict deletion of shared tags, media, and related records until references are reassigned or removed explicitly.

### 9.5 Editorial lifecycle

For editorial records, the persisted `status` is **Draft**, **Published**, or **Archived**. **Preview is an action**, not a status:

- **Save draft:** authenticated admin only; excluded from public queries, sitemap, feeds, and structured data.
- **Preview:** renders the saved draft through the exact public component under authenticated or signed, time-limited authorization.
- **Publish:** atomically promotes the saved draft, records `publishedAt`, and makes it public.
- **Unpublish:** Published → Draft; public output disappears while the editable draft remains.
- **Archive:** Draft or Published → Archived; removes public output and normal-library placement.
- **Restore archived:** Archived → Draft.
- **Move to Trash:** sets `deletedAt`, records the prior status, removes the item from public and normal admin lists, and preserves relationships for recovery.
- **Restore from Trash:** Trash → Draft.
- **Permanent delete:** owner-initiated only after 30 days in Trash, requires typing the item title, and is blocked while unresolved shared references remain. No automatic permanent deletion is introduced.

Existing soft-deleted projects/publications migrate into Trash with their current `deletedAt` and relationships preserved. No record is discarded during lifecycle migration.

Lifecycle variants are explicit:

- Profile and PageContent store `draftData`, `publishedData`, `version`, `status`, and `publishedAt`; publishing atomically copies the validated draft snapshot and public pages read only `publishedData`.
- Courses inherit the parent education timeline record's editorial lifecycle; course/resource edits are versioned and previewed with that parent.
- Skills use a versioned collection-level draft/publish operation so a reorder cannot leak partially.
- Tags use Active/Archived taxonomy state and appear publicly only through published assignments; they do not have Preview.
- Media uses Uploaded, Ready, In use, Archived, and Trash rather than editorial Published.
- Messages use New, Read, Archived, Spam, and Trash rather than editorial lifecycle states.

Timeline visibility should be migrated from a separate Boolean to the same lifecycle, or the admin must clearly map `visible = false` to Draft/Archived semantics. Avoid two competing publication systems.

### 9.6 Revision, audit, and recovery

- Record who changed what, when, content type, record ID, action, and changed field names.
- Keep at least the latest 20 revisions for page copy, publications, projects, and experience records.
- Provide a readable before/after comparison and restore action.
- Audit publish, unpublish, archive, restore, permanent delete, login, failed login, 2FA changes, session revocation, and security-setting changes.
- Never store passwords, tokens, TOTP secrets, message bodies, or unnecessary personal data in audit metadata.
- Replace native `confirm()` with an accessible confirmation dialog that names the record and explains whether the action is reversible.
- CV generation is publish-coupled: build HTML and PDF from the same validated published view model, write a versioned PDF, then atomically switch the stable `/cv.pdf` reference only after generation succeeds. A failure retains the previous HTML/PDF, leaves the draft unpublished, and shows a recoverable admin error. Draft Preview may render both formats without changing the stable URL; embed the same content-version identifier in HTML metadata and PDF metadata.

### 9.7 Public-to-admin ownership map

| Public content | Required admin home | Required fields/controls |
|---|---|---|
| Global identity and contact methods | Profile & Contact | Full name, professional headline, institution/degree, location, primary/secondary emails, short/long bio, current focus, availability, CV PDF, photo/alt/focal point, canonical profile links. |
| Header/footer | Profile & Contact + PageContent `global/footer` | Identity/profile links are consumed from Profile; footer biography/tagline and built-with line come from PageContent; navigation labels/routes remain code-owned. |
| Homepage hero | Homepage | Credential line, multi-line title, research thesis, primary/secondary actions, availability, supporting claim, section visibility, selected/featured rules, closing CTA. |
| Homepage featured research/projects | Publications/Projects | Featured flag, editorial sort order, completeness indicator, preview of card content. |
| Homepage selected experience | Research/Teaching Experience | Deterministic selection only: most recent Published record by `startDate DESC`, then `sortOrder ASC`; no separate manual selection state. |
| Research page | Research page | Page title, research agenda, theme labels/order, closing CTA, SEO title/description/share image. |
| Publications | Publications | All schema fields, separate ordered authors with “This is me,” ordered contributions, tags, sort order, citation count, DOI/arXiv/PDF/code/project links, featured, SEO/share image, lifecycle. |
| Projects page | Projects settings | Page title, introduction, available filter labels, closing CTA, SEO/share fields. |
| Project case studies | Projects | All current schema fields including Architecture, Challenges, Results, Retrospective, tags, sort order, evidence/media, lifecycle, SEO/share image. |
| Research experience page | PageContent `research-experience` + Research Experience | Page introduction/CTA/SEO belong to PageContent; role fields, ordered outcomes, relationships, sort order, and lifecycle belong to records. |
| Teaching page | PageContent `teaching` + Teaching Experience | Page introduction/CTA/SEO belong to PageContent; course-role fields, ordered responsibilities/highlights, resources, grouping key, sort order, and lifecycle belong to records. |
| About page | Profile + PageContent `about` + Timeline | Biography/current focus are consumed from Profile; page framing/SEO from PageContent; timeline, recognition, courses, and skills from their structured libraries. |
| CV | CV | Profile summary, included sections, section order from a safe predefined list, selected project rules, PDF generation/status, download filename, SEO fields. Content records remain edited in their own libraries. |
| Contact page | Profile & Contact + PageContent `contact` | Email methods, profiles, location, and availability come from Profile; intro, form availability, success copy, and SEO come from PageContent. Each domain saves transactionally. |
| Empty/error copy | Page settings | Approved content-specific empty messages and recovery links; technical errors remain code-owned. |

### 9.8 Typed content models

Do not continue growing a raw “Other settings” editor. Use typed schemas and typed forms.

Recommended content domains:

- **Profile:** the canonical identity/contact record: identity, bio, institution, location, availability, primary/secondary emails, CV PDF, profile image, and social/profile links.
- **PageContent:** one record per approved page key (`global/footer`, `home`, `research`, `projects`, `research-experience`, `teaching`, `about`, `cv`, `contact`) containing only that page's editorial copy and SEO values.
- **EmergencySettings:** owner-only typed values for operational recovery. Known keys use schemas; unknown legacy keys are read-only until migrated. Route structure and interface copy remain code-owned.
- Existing structured models remain canonical for publications, projects, timeline/courses, teaching/research experience, skills, tags, messages, sessions, and logs.

Every domain must have a Zod schema shared by admin input and API validation. Public rendering must use explicit defaults so a missing optional field cannot blank or break a page.

### 9.9 Content-type requirements

#### Publications

- Use repeatable author rows with name, “This is me,” and drag/keyboard ordering.
- Use repeatable contribution rows; never submit an empty array unless the owner removed all contributions.
- Allow tag assignment with searchable multi-select.
- Validate DOI, arXiv ID, BibTeX, and URLs without requiring optional fields.
- Show a completeness checklist before publish: title, authors, venue, year, one artifact link, TL;DR or abstract, and citation block when applicable.

#### Projects

- Expose every public section: Summary, Problem, Approach, Architecture, Challenges & Decisions, Results, Retrospective.
- Allow tags, stack, role, year, repository/demo, evidence/media, featured state, and sort order.
- Provide a case-study outline preview matching the public section order.

#### Research and teaching experience

- Use ordered list editors for outcomes/highlights rather than newline parsing.
- Support relationships to publications, projects, course resources, and external artifacts.
- Show status and View/Preview on list rows.
- Support explicit editorial order while preserving date sorting as the default.

#### Timeline and courses

- Preserve `publication_milestone` and render it on About under Recognition → Publication milestones. Do not include it in CV by default because publication records already populate the CV Publications section.
- Expose highlights and ordering.
- Make Courses a visible child action on Education rows.
- Validate file type/size and link URL; show upload progress and recoverable errors.

#### Skills and tags

- Edit names, proficiency, category, and order in place.
- Provide keyboard-accessible reorder buttons as an alternative to drag-and-drop.
- Before deleting a tag/category, show usage count and affected records.
- Prevent or resolve deletion while referenced unless the owner confirms a defined reassignment/removal plan.

### 9.10 Media management

Create one media library backed by the existing upload/storage path rather than requiring arbitrary third-party URLs. Keep course resources as a related attachment service because the current course uploader accepts broader file types than the public image/PDF media library.

Requirements:

- Upload JPEG, PNG, WebP, or PDF under explicit size limits.
- Validate actual MIME type, not only extension.
- Store width, height, byte size, alt text, caption, focal point, created time, and usage references.
- Provide crop/preview for profile and social-share image ratios without overwriting the original.
- Prevent deletion while an asset is in use; list all references.
- Generate optimized public image sizes and preserve the original privately when needed.
- Never expose storage credentials or unrestricted object paths in the browser.
- Before migration, inventory every existing course attachment and retain every record. Existing files outside the new allow-list remain available through forced-download attachment headers and are flagged for owner review; they are not silently deleted.
- For new course resources, allow a configured safe set covering PDF, common images, plain text/source files, and ZIP archives up to the existing 50 MB limit. MIME-sniff uploads, block HTML/SVG and executable formats, serve non-media as `Content-Disposition: attachment`, and show the allowed types before selection.

### 9.11 Inbox and message privacy

- Default filters: New, Read, Archived, Spam, All.
- Search name, email, subject, and message text.
- Provide Reply by email, Mark read, Archive, Spam, and Move to Trash.
- Record replied status locally without storing outbound email contents unless intentionally required.
- Hide IP by default under “Technical details”; retain IP for 30 days unless a documented abuse investigation requires a legal/security hold, then erase it independently of the message body.
- Trash is recoverable for 30 days; permanent deletion remains manual and owner-confirmed.
- Bulk actions require selection summary and confirmation.

### 9.12 Security management

- Validate the full server-side session in the shared admin layout before rendering any admin page; middleware cookie presence is only an optimization, never authorization.
- Use a short-lived, purpose-limited pending 2FA challenge that is not accepted by `getSession()` and does not set the authenticated session cookie until TOTP succeeds.
- Mark the current session and allow revoking every other session or all other sessions.
- Provide password change with current-password confirmation.
- Provide 2FA setup, verification, recovery-code regeneration, and disable flow with re-authentication.
- Show audit filters by date, action, content type, and result.
- Rate-limit and audit sensitive actions.
- Require password and, for a 2FA-enabled account, TOTP re-authentication within the previous 10 minutes for password/2FA changes, session revocation, permanent deletion, and security-setting changes.
- Keep the obscured route as defense-in-depth only; authentication and authorization remain the security boundary.

### 9.13 Admin accessibility and responsiveness

- All fields have visible labels, descriptions, errors, and required-state semantics.
- Save/publish/status feedback uses live regions and never color alone.
- Tables reflow to labeled cards or horizontal regions without losing actions below 768 px.
- Modal/drawer/dialog focus is trapped correctly and restored on close.
- Row menus, reorder controls, file upload, tag selectors, tabs, and confirmation dialogs work by keyboard.
- Touch targets meet 44×44 CSS pixels or have sufficient target spacing.
- Admin supports 200% zoom and 320 CSS pixel reflow for emergency mobile edits.
- Loading, empty, error, success, forbidden, expired-session, and conflict states have recovery actions.

### 9.14 Admin journey health

| Step | Owner task | Current health | Required outcome |
|---|---|---|---|
| 1 | Sign in and complete 2FA | Functional but incomplete | Accessible errors, return-to-requested-page, 2FA recovery/setup management, and expired-session recovery. |
| 2 | Understand dashboard priorities | Needs improvement | Lifecycle counts, new messages, recent changes, content warnings, and direct create/edit actions. |
| 3 | Find a content type | Poor at mobile/scale | Grouped responsive navigation and searchable/filterable libraries. |
| 4 | Create or edit content | Inconsistent; data-risk present | Shared editor, complete fields, typed validation, structured repeaters, and untouched-data preservation. |
| 5 | Save draft and preview | Missing as a coherent flow | Save draft, authenticated public-component preview, visible save state, and unsaved-change protection. |
| 6 | Publish or update | Basic status fields only | Completeness checks, explicit publish action, timestamp/audit entry, and View live page confirmation. |
| 7 | Archive, restore, or delete | Unsafe/inconsistent | Recoverable archive/trash, dependency warnings, restore, revision history, and strongly confirmed permanent deletion. |
| 8 | Manage media | Fragmented/external URL dependent | Validated upload, media library, metadata/alt text, usage tracking, selection, and safe deletion. |
| 9 | Process contact messages | Basic | Filters/search, reply state, archive/spam/trash, privacy control, and reliable feedback. |
| 10 | Manage account security | Read-only | Session revocation, password and 2FA/recovery management, recent re-authentication, and filterable audit history. |

Visual health for these steps remains unverified until the browser-based admin capture in UX-42 can be performed.

## 10. Implementation backlog

### Priority definitions

- **P0:** Fix before public promotion or PhD application use.
- **P1:** High-impact structural improvement.
- **P2:** Polish or enhancement after structure is stable.

### Phase 0 — content correctness and trust

#### UX-01 — Correct labels and misleading actions (P0)

**Work:** Replace RA/TA terminology, change “Download CV” when it links to HTML, and align header/footer labels.  
**Likely files:** `src/components/layout/nav.tsx`, `src/components/layout/footer.tsx`, public RA/TA pages, homepage.  
**Acceptance:** No public navigation depends on unexplained two-letter abbreviations; every download label downloads a file; every view label opens a page.

#### UX-02 — Verify all public claims and links (P0)

**Work:** Check Scholar profile, GitHub, LinkedIn, emails, CV/PDF, venue claims, degree/status, dates, “open to” statement, paper links, repositories, and demos.  
**Acceptance:** Every visible credential claim has accurate source data and every external link reaches the intended profile/artifact.

#### UX-03 — Distinguish load failure from empty content (P0)

**Work:** Replace broad silent fallbacks with explicit logging and a safe user-facing failure state while preserving true empty states.  
**Likely files:** public page data loaders and `src/lib/db/queries.ts`.  
**Acceptance:** A database/query failure cannot be presented as “no publications/projects/skills.”

### Phase 1 — navigation and information architecture

#### UX-04 — Implement the grouped desktop navigation (P1)

**Work:** Use Research, Projects, Experience, About, Contact, and CV. Add an accessible Experience menu containing research experience, teaching experience, and background anchors.  
**Likely file:** `src/components/layout/nav.tsx`.  
**Acceptance:** Six maximum top-level targets including CV; all existing public destinations remain reachable; current location is announced programmatically.

#### UX-05 — Rebuild the mobile menu behavior (P1)

**Work:** Add the expanded Experience group, state semantics, Escape handling, focus entry/return, route-close behavior, and scroll locking where appropriate.  
**Acceptance:** The trigger exposes `aria-expanded` and `aria-controls`; focus moves to the first menu control on open; Tab/Shift+Tab remain within the open modal menu; Escape and route selection close it; focus returns to the trigger; background scrolling is locked; axe reports zero serious/critical issues for open and closed states.

#### UX-06 — Expand the footer sitemap (P1)

**Work:** Add Work, Background, and Connect groups and include every preserved destination.  
**Likely file:** `src/components/layout/footer.tsx`.  
**Acceptance:** Research experience, teaching experience, About, Contact, CV, Research, Projects, and primary profiles are reachable from the footer.

#### UX-07 — Add stable About anchors (P1)

**Work:** Add timeline, education, experience, recognition, courses, and skills anchors; ensure sticky-header offsets do not cover headings; update the table-of-contents state while sections pass the reading position.  
**Likely file:** `src/app/(public)/about/page.tsx`.  
**Acceptance:** Every Experience menu deep link lands with the target heading visible and focusable; the active table-of-contents link exposes `aria-current="location"`.

### Phase 2 — homepage and section placement

#### UX-08 — Rebalance the homepage hero (P1)

**Work:** Establish one primary action, relabel CV correctly, keep full research copy immediately readable, and reduce equal visual weight across utility links.  
**Acceptance:** At 1440×900 and 390×844, name/role, complete two-sentence research direction, one primary Research action, and the CV action appear before the first content section; no essential sentence depends on animation completion.

#### UX-09 — Add Selected Experience to Home (P1)

**Work:** Fetch and display one research and one teaching experience item using a shared compact card/presentation.  
**Likely files:** homepage, database query module, new or shared content component.  
**Acceptance:** Home shows at most one published item from each experience type using `startDate DESC`, then `sortOrder ASC`; each preview links to its full destination; an absent type does not leave an empty card or heading.

#### UX-10 — Add the About preview and closing contact CTA (P2)

**Work:** Add a short profile preview and a final contact action after expertise.  
**Acceptance:** At 1440×900 and 390×844 the homepage sections appear in this order: Hero, Featured Research, Selected Experience, Featured Projects, Expertise, About preview, Contact CTA; the About preview links to `/about` and the final CTA links to `/contact`; no section is duplicated or empty-labeled.

### Phase 3 — experience pages and About

#### UX-11 — Restructure Research Assistantships (P1)

**Work:** Reorder each entry around context, responsibility/question, outcomes, then methods. Add artifact links when supported.  
**Likely files:** research-assistance page, schema/API/admin only if explicit artifact relationships are added.  
**Acceptance:** Every rendered role orders content as context, responsibility/question, outcome, then methods; when an outcome exists it appears before technology chips; entries with no outcome omit that block cleanly.

#### UX-12 — Restructure Teaching Assistantships (P1)

**Work:** Emphasize responsibilities and teaching contributions; group repeated courses if applicable.  
**Acceptance:** Each entry renders course/institution/instructor/term first, then responsibilities, then ordered teaching highlights, then optional resources and technologies; entries without highlights/resources omit those blocks without empty headings; repeated courses can be grouped without hiding any term.

#### UX-13 — Add progressive disclosure to the About timeline (P1)

**Work:** Keep all timeline and course content but collapse dense course/resource details under accessible disclosures. Add clear section navigation.  
**Acceptance:** At initial load all biographies, milestone summaries, and category headings are visible; course exercise/project/discussion/file/link details are collapsed but keyboard-reachable; activating each disclosure reveals the original content without data loss.

#### UX-14 — Normalize experience presentation components (P2)

**Work:** Extract reusable metadata, date range, outcome list, and action patterns without forcing research and teaching into identical content shapes.  
**Acceptance:** Research and teaching pages use the same tested date-range, institution metadata, ordered-outcome, artifact-link, and empty-block primitives; research retains “Outcomes” and supervisor/lab labels, teaching retains “Teaching highlights” and instructor/course labels; component tests cover missing end date, missing optional lists, and external links.

### Phase 4 — CV, research, and projects

#### UX-15 — Complete the HTML CV (P1)

**Work:** Add research profile, publications, research assistantships, teaching assistantships, selected projects/engineering experience, service, and external contact links.  
**Likely file:** `src/app/(public)/cv/page.tsx` plus query functions.  
**Acceptance:** The HTML CV contains every major professional category represented on the public site.

#### UX-16 — Add print and PDF consistency checks (P1)

**Work:** Create one CV view model consumed by the HTML and PDF renderers, implement the publish-coupled atomic generation contract in §9.6, then add print styles and automated checks for required sections and record counts.  
**Acceptance:** HTML prints without site navigation or clipped content; successful publish gives HTML and PDF the same content-version ID and record counts; `/cv.pdf` changes only after successful PDF generation; a forced PDF failure preserves the previous public HTML/PDF and leaves the new draft unpublished.

#### UX-17 — Improve publication actions (P1)

**Work:** Implement BibTeX copy feedback; surface DOI/project URL; make card actions explicit; prevent ambiguous or nested interactive targets; emit `ScholarlyArticle` metadata from the same publication record.  
**Likely files:** publication card and detail page.  
**Acceptance:** Every available scholarly artifact has a visible, keyboard-operable action; copy confirmation is announced; structured-data validation returns no errors for a representative publication.

#### UX-18 — Improve project filtering and result state (P2)

**Work:** Add result count, selected semantics, clear-filter action, and focus/scroll preservation after navigation.  
**Likely files:** projects page and tag-filter component.  
**Acceptance:** The selected filter exposes `aria-current="true"` or `aria-pressed="true"`; visible text reports “N projects”; a visible **Clear filter** returns to All; browser Back restores the selected tag, result count, and scroll position; zero results show a recovery action.

#### UX-19 — Strengthen project evidence (P2)

**Work:** Support real architecture images, screenshots, metrics, or linked artifacts when available; preserve the current six narrative sections.  
**Acceptance:** Only media with a stored URL, dimensions, and required alt text or an explicit decorative flag renders; missing media produces no placeholder frame or empty caption; all six narrative sections remain available; metrics identify their unit/context and linked artifacts have descriptive labels.

### Phase 5 — accessibility and design-system hardening

#### UX-20 — Correct text and component contrast (P0)

**Work:** Replace Ash for normal-size text, adjust Indigo where used on raised surfaces, define stronger border/control tokens, and add usable forced-colors fallbacks for gradient text and essential boundaries.  
**Likely file:** `src/styles/globals.css` and affected components.  
**Acceptance:** Normal text meets 4.5:1, large text meets 3:1, essential control boundaries/states meet 3:1 against adjacent colors, and every gradient heading remains readable in forced-colors mode.

#### UX-21 — Make contact feedback programmatic (P0)

**Work:** Connect errors with fields; set invalid state; add status announcements; focus the first invalid field; retain values after server errors.  
**Likely file:** `src/components/content/contact-form.tsx`.  
**Acceptance:** Invalid fields set `aria-invalid` and reference their error with `aria-describedby`; submit focuses the first invalid field; the error summary and server result use an appropriate live region; keyboard-only submission works; values survive server failure; success and failure remain distinguishable in forced colors.

#### UX-22 — Normalize type size and touch targets (P1)

**Work:** Audit 10–12 px labels and compact chips; establish a minimum metadata size and 44×44 target or adequate spacing rule.  
**Acceptance:** All primary controls pass target-size checks and important text remains readable at 200% zoom.

#### UX-23 — Harden motion and no-JavaScript behavior (P1)

**Work:** Preserve reduced-motion handling, make hero text immediately available, ensure scroll-reveal content is visible without successful client hydration, and pause decorative particles when the document is hidden or reduced motion is requested.  
**Acceptance:** No essential content is delayed, hidden, or lost when motion is reduced or client JavaScript fails; particle animation stops in both required states.

#### UX-24 — Complete manual accessibility verification (P1)

**Work:** Run keyboard, screen-reader, zoom/reflow, forced-colors, contrast, touch, and axe checks on all fixed public routes and every published dynamic detail route in the test fixture.  
**Acceptance:** Results are saved to `docs/accessibility/public-site-audit.md`; automated coverage lists `/`, `/research`, `/projects`, `/research-assistance`, `/teaching`, `/about`, `/cv`, `/contact`, 404, and every fixture publication/project detail; manual screen-reader coverage includes all fixed routes, one detail per dynamic family, Contact invalid/server-error/success, empty states, and load failure; zero critical/serious axe issues remain and every manual finding has an owner, priority, and retest result.

### Phase 6 — responsive and visual QA

#### UX-25 — Capture the complete public journey (P1)

**Work:** Once a browser surface is available, capture Home, each index route, mobile navigation, filtered projects, form validation/success, and representative publication/project details at desktop and mobile widths.  
**Acceptance:** The capture index contains desktop and mobile images for every fixed public route, the open Experience menu, open mobile menu, one publication detail, one project detail, filtered and zero-result projects, About course disclosure, Contact invalid/server-error/success, empty/load-failure, and 404; every image records viewport, route, state, date, and finding status.

#### UX-26 — Visual-regression and breakpoint review (P2)

**Work:** Add representative screenshot tests or a documented repeatable capture set for narrow mobile, tablet/header breakpoint, laptop, and wide desktop.  
**Acceptance:** The repeatable suite runs at 320×800, 390×844, 768×1024, 1024×768, and 1440×900; no route has document-level horizontal overflow, clipped actions, overlapping text, hidden focus, covered anchor headings, or header/menu collision; approved baselines and diff thresholds are documented.

### Admin workstream — professional content ownership

#### UX-27 — Repair admin data-integrity defects (P0)

**Work:** Parse publication authors into separate ordered objects; preserve `isMe` and contributions during edit; expose and persist project Architecture, Challenges, Results, and Retrospective; render `publication_milestone` under About Recognition; preserve contact-link icon metadata.  
**Likely files:** publication/project editors, contact editor, About timeline configuration, API validation tests.  
**Acceptance:** Editing any existing record without changing a field produces no data diff for that field; regression tests prove authors/contributions and all six project case-study sections survive a round trip; a `publication_milestone` is visible under About → Recognition and is not duplicated in CV by default.

#### UX-28 — Define typed Profile and PageContent domains (P0)

**Work:** Add validated content domains for global profile data and approved page copy; map every hardcoded public content value in §9.7; migrate existing settings without losing current values; save each multi-field page/profile domain transactionally; remove the raw editor from normal workflows.  
**Acceptance:** Every editorial field in §9.7 has exactly one canonical owner and admin field; Profile consumers cannot edit duplicate identity/contact values; interface copy remains code-owned; public pages use typed values with tested defaults; a failed multi-field save rolls back completely; Emergency settings is production owner-only/re-authenticated/audited and unknown legacy keys are read-only; Developer Mail remains development-only.

#### UX-29 — Build the responsive grouped admin shell (P1)

**Work:** Implement the Content/Inbox/Media/System navigation from §9.2, professional experience labels, collapsible desktop sidebar, mobile drawer, current-page semantics, and environment-gated developer tools.  
**Acceptance:** All current admin routes remain reachable; at 390×844 no fixed sidebar reduces the editor viewport; keyboard users can open/close groups and the mobile drawer with focus restored correctly.

#### UX-30 — Create the shared admin editor framework (P1)

**Work:** Standardize breadcrumbs, title/status, grouped fields, error summary, field errors, dirty state, save timestamp, unsaved-change warning, publish panel, and responsive action bar.  
**Acceptance:** Publications, projects, and one experience editor use the shared pattern; invalid submit focuses the first error; leaving with unsaved changes prompts once; save and publish status are announced.

#### UX-31 — Standardize content library lists (P1)

**Work:** Implement the exact filters and action matrix in §9.3 plus visible create actions, search, sorting, result count, empty/error states, and pagination.  
**Acceptance:** Every library in §9.3 exposes only its specified filters/actions; actions remain visible on touch and keyboard; result count updates with filters; empty/error states have recovery; page 2 appears with 51 fixture records and returning from an editor preserves page/filter/search state.

#### UX-32 — Implement authenticated draft preview and publishing (P1)

**Work:** Create preview tokens/session authorization, render draft data through public components, add Save draft/Preview/Publish actions, record timestamps, and exclude drafts from public discovery.  
**Acceptance:** An authenticated owner can preview an unpublished publication/project/page; an anonymous request cannot; sitemap, feeds, public queries, and structured data exclude drafts.

#### UX-33 — Add archive, trash, restore, and revision history (P1)

**Work:** Replace ordinary hard deletion with archive/trash; add dependency checks, typed permanent-delete confirmation, revision snapshots/diffs, and restore.  
**Acceptance:** Unpublish, archive, restore-archived, trash, and restore-trash follow §9.5; migrated soft-deleted projects/publications remain in Trash with timestamps/relationships intact; permanent deletion is manual, impossible before 30 days or with unresolved shared references, and the latest 20 revisions are viewable for required content types.

#### UX-34 — Complete the publication editor (P0)

**Work:** Add repeatable authors/contributions, tags, sort order, citation count, SEO/share image, URL/identifier validation, completeness checklist, slug protection, and lifecycle controls.  
**Acceptance:** Every Publication schema/public-detail field has an editor or documented computed source; a publish attempt identifies incomplete required evidence; editing never flattens structured authors.

#### UX-35 — Complete the project case-study editor (P0)

**Work:** Add all six narrative sections, tags, stack, ordering, evidence/media, SEO/share fields, preview outline, slug protection, and lifecycle controls.  
**Acceptance:** Every Project schema/public-detail field has an editor or documented computed source; saved preview and live page show the same section order and data.

#### UX-36 — Complete experience, timeline, and course editors (P1)

**Work:** Add ordered outcomes/highlights, relationships, explicit ordering, status/preview actions, timeline type consistency, course discovery, and validated resources/uploads.  
**Acceptance:** Research/teaching list rows show lifecycle and preview; every editorial public field is editable through its canonical owner; `publication_milestone` renders under About Recognition; existing course attachment records survive migration; new attachment types/size are shown before upload, blocked types fail safely, and upload failures are recoverable.

#### UX-37 — Complete skills and taxonomy management (P1)

**Work:** Allow skill name/proficiency/category edits, category/skill ordering, tag assignment from publication/project editors, usage counts, and safe delete/reassignment.  
**Acceptance:** Reordering works by keyboard and pointer; deleting a used tag/category cannot proceed without an explicit relationship resolution; public order matches admin order.

#### UX-38 — Build the media library and direct profile upload (P1)

**Work:** Use the existing storage/upload path for validated images/PDFs, metadata, alt text, focal point, usage tracking, optimized variants, and profile/SEO selection; migrate course attachments through the separate safe attachment policy in §9.10.  
**Acceptance:** The owner can upload/select a profile image without third-party hosting; actual MIME and size are checked; an in-use asset cannot be deleted; alt text is required for content images; an inventory test proves every pre-migration course attachment record still resolves and blocked new formats cannot execute inline.

#### UX-39 — Make the dashboard editorially useful (P2)

**Work:** Show draft/published/archived counts, incomplete content, new messages, recent changes, broken/missing artifact links, and direct create/edit actions.  
**Acceptance:** Each dashboard card's primary action is available without entering the section; counts are labeled by lifecycle; the latest five edits and outstanding content warnings are visible.

#### UX-40 — Upgrade the message inbox and privacy controls (P1)

**Work:** Add search/status filters, reply tracking, archive/spam/trash, bulk actions, technical-detail disclosure, retention configuration, and recoverable API errors.  
**Acceptance:** New/read/archived/spam/trash views are distinct; IP is hidden by default and erased after 30 days absent a documented hold; message actions announce success/failure; trashed messages remain restorable for 30 days and permanent deletion is manual and confirmed.

#### UX-41 — Add actionable security management (P1)

**Work:** Add current-session labeling, session revocation, password change, full 2FA/recovery flow, recent re-authentication, audit filters, and protected action logging.  
**Acceptance:** The owner can revoke other sessions but not accidentally revoke the current one without explicit confirmation; each sensitive action accepts re-authentication performed within 10 minutes and rejects it at 11 minutes; 2FA-enabled accounts require password plus TOTP; audit events contain actor/action/result but no password, token, TOTP secret, or recovery code.

#### UX-42 — Complete admin accessibility and responsive QA (P1)

**Work:** Capture and test the complete owner journey at 390×844 and 1440×900, plus 320 CSS-pixel reflow, keyboard, screen reader, 200% zoom, and forced colors.  
**Acceptance:** `docs/accessibility/admin-audit/` covers login/password-only account, login/2FA-enabled account, dashboard/navigation, Homepage, Profile & Contact, every PageContent editor, each library/action family in §9.3, publication, project, both experience editors, timeline/course resources, skills/tags/reorder, CV publish/PDF failure, media upload, inbox states, Emergency settings, sessions/activity, destructive/conflict/expired-session/403/error states, and development-only mail when enabled; zero critical/serious axe issues remain and each manual finding has owner, priority, step/screenshot, and retest result.

#### UX-43 — Add public-to-admin ownership coverage tests (P0)

**Work:** Create a field-level matrix with columns: public route/component, visible field, canonical domain/record, admin form/control, schema/API field, draft expectation, published expectation, round-trip fixture, and code-owned reason where applicable. Automate update/render/lifecycle/round-trip checks from it.  
**Acceptance:** Every visible editorial field on every fixed public route and publication/project detail fixture has one passing matrix row; every code-owned string has a documented interface-copy reason; CI fails on missing ownership, duplicate canonical owners, draft leakage, failed publish inclusion, or any untouched-field diff.

#### UX-44 — Close admin authentication and 2FA boundary gaps (P0)

**Work:** Require `getSession()` in the shared admin layout before rendering children; keep API authorization checks; replace pre-2FA session creation with a separate hashed, five-minute, single-use challenge with a five-attempt limit; set the authenticated cookie only after successful TOTP; invalidate challenges on limit/expiry/use; validate that `Origin` matches the configured site origin on every cookie-authenticated POST/PUT/PATCH/DELETE request and reject missing/foreign origins in production.  
**Acceptance:** A missing, forged, expired, or pre-2FA token cannot render any admin page or mutate data; the authenticated cookie is absent until the second factor succeeds; foreign/missing production origins are rejected; integration tests cover direct admin URLs, every protected API family, replay, five-minute expiry, five-failure invalidation, origin rejection, successful login for a password-only account, and successful login for a 2FA-enabled account.

#### UX-45 — Enforce transactional, concurrency, and reference integrity (P0)

**Work:** Implement the version/409 conflict contract, unique slugs and relationship pairs, transactional parent/repeater/relation saves, and restrict/cascade rules from §9.4.  
**Acceptance:** Two editors saving the same version cause one success and one recoverable 409 without data loss; duplicate slugs/relationships are rejected deterministically; a forced child-row failure rolls back the parent edit; owned children cascade only on permanent deletion; shared tags/media/relationships block deletion until explicitly resolved.

## 11. Suggested implementation order

Implement in this sequence to avoid polishing the wrong structure:

1. Close the admin authorization and 2FA boundary gaps: UX-44.
2. Repair admin round-trip, concurrency, transaction, and reference integrity: UX-27, UX-34, UX-35, and UX-45.
3. Define typed Profile/PageContent ownership and coverage tests: UX-28 and UX-43.
4. Verify public claims/links and correct professional terminology: UX-01 and UX-02.
5. Fix P0 contrast and public/admin form accessibility: UX-20, UX-21, and the critical parts of UX-42.
6. Build the grouped responsive admin shell and shared editor foundation: UX-29 and UX-30.
7. Add draft preview, publishing, archive/restore, and revision safety: UX-32 and UX-33.
8. Complete structured admin editors, lists, taxonomy, and media: UX-31 and UX-36 through UX-38.
9. Implement the public header, mobile menu, footer, and About anchors: UX-04 through UX-07.
10. Recompose Home, experience pages, About, CV, research, and projects: UX-08 through UX-19.
11. Upgrade Inbox, Security, and dashboard: UX-39 through UX-41.
12. Complete public and admin accessibility reviews: UX-24 and UX-42.
13. Complete screenshot-based responsive and visual QA: UX-25 and UX-26.

Do not begin with decorative styling changes. Data integrity and content ownership come first; otherwise a polished admin can still erase data or leave important public copy code-only.

## 12. Definition of done

The redesign is complete when all of the following are true:

- Every current public route and content category remains available.
- Every existing admin capability remains available inside the new grouped navigation.
- Every admin page validates a real unexpired session before rendering, and 2FA does not create an authenticated session until verification succeeds.
- Every public editorial value listed in §9.7 has exactly one typed, validated admin owner; every interface string has a documented code-owned reason.
- Editing and saving without changes preserves all structured data exactly.
- Publications preserve ordered authors, `isMe`, contributions, tags, identifiers, and artifacts.
- Projects expose and preserve all six current case-study sections.
- Editorial records use Draft/Published/Archived status consistently; Preview is an action; Unpublish, Trash, Restore, and owner-initiated Permanent Delete follow §9.5.
- Drafts are never publicly discoverable; authenticated previews use the same public components.
- Destructive actions are recoverable until explicit permanent deletion, and referenced records/assets cannot be deleted silently.
- Admin lists provide search/filter/status/actions; editors provide field errors, dirty state, save status, preview, and publishing actions.
- Every admin flow enumerated in UX-42 reflows at 320 CSS pixels and passes the specified keyboard and screen-reader checks.
- Security provides session revocation, password change, 2FA/recovery management, recent re-authentication, and audited sensitive actions.
- Messages support status filters, privacy-conscious technical details, recoverable trash, and visible success/error states.
- The primary header contains Research, Projects, Experience, About, Contact, and CV only.
- RA and TA are presented with full professional labels under Experience.
- Homepage includes Research, Experience, Projects, Expertise, About preview, and Contact CTA in the agreed hierarchy.
- About retains biography, timeline, courses/resources, recognition, and skills with manageable progressive disclosure.
- HTML CV contains publications, research experience, teaching, projects/experience, awards, talks/service, skills, and contact links.
- Footer exposes every primary destination.
- All links and credential claims are verified.
- No normal-size text uses a failing contrast combination.
- Header/menu, filters, form, disclosures, and copy actions work with keyboard and assistive technology.
- Public pages reflow without horizontal scrolling at 320 CSS pixels and remain usable at 200% zoom.
- Reduced-motion users receive all content without delayed or hidden information.
- Desktop and mobile screenshots have been inspected for every important public flow.
- Empty, error, success, and 404 states provide a clear recovery action.

## 13. Decisions and non-goals

### Decisions

- The site remains research-first.
- Projects remain a first-class destination.
- RA and TA remain independent public pages but move under Experience in navigation.
- About remains the canonical biography and background page.
- CV remains a persistent high-priority action.
- Existing dark visual identity is refined, not replaced.
- Public content is admin-managed; layout, components, accessibility behavior, security policy, and design tokens remain code-owned.
- The admin uses typed domain forms instead of exposing raw storage structures.
- Draft preview and recoverable publishing are required before content-management polish is considered complete.

### Non-goals

- Removing current content, models, or public routes.
- Removing current admin capabilities or access to existing content records.
- Creating a blog, “Now” page, or new content program in this pass.
- Replacing the design system or visual identity from scratch.
- Turning the admin into a visual page builder or allowing arbitrary HTML/CSS/JavaScript editing.
- Adding decorative media without real evidence or purpose.
- Claiming complete WCAG conformance based only on source review or automated checks.

## 14. Final recommendation

Approve the content-ownership boundary and navigation/page-responsibility changes before visual refinement. The first implementation item must be UX-44 because admin authorization and 2FA completion are security boundaries. The next slice is UX-27, UX-28, UX-34, UX-35, UX-43, and UX-45: stop round-trip/lost-update data loss, expose all public project/publication fields, define canonical typed ownership for editorial content, and prove every editable value survives from admin to public rendering. Follow that with the public/admin P0 accessibility work and grouped navigation. This sequence makes the system trustworthy before it becomes visually polished.
