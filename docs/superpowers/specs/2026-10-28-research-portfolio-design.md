# Research Portfolio Design

## Goal

Turn the public Research page from a publication-only listing into a credible research portfolio for prospective collaborators, research-visit hosts, and PhD supervisors. The page must distinguish research plans from peer-reviewed outputs and make future content updates possible through the existing admin workflow.

## Chosen approach

Add first-class Research Agenda and Research Proposal content instead of disguising proposals as publications or hard-coding a one-off visual shell.

The page will have three independent layers:

1. **Research Agenda** — the featured statement of the research problem, current approach, and future directions.
2. **Selected Proposals** — concise public summaries with an optional sanitized PDF download.
3. **Publications** — the existing publication records, explicitly presented as scholarly outputs.

This preserves academic honesty, gives visitors a fast reading path, and lets the portfolio grow without code changes.

## Public experience

### Research landing page

The `/research` page will lead with a short, collaboration-oriented introduction and a compact availability signal for collaboration, research visits, and PhD opportunities.

The Research Agenda card follows. It contains a headline, summary, research themes, and an optional link to a longer agenda document. Until the final agenda is written, the current research positioning provides a credible initial summary without claiming a completed document.

Selected Proposals appear next when at least one proposal is published. Each card shows:

- title and year;
- honest content label (`Thesis Proposal`, `Research Proposal`, or `Concept Note`);
- a stage label (`In preparation`, `Active`, or `Archived`);
- version label and last-updated date;
- public summary and research themes;
- a details link and, when present, a sanitized-PDF download.

Proposal detail pages contain only public-safe fields: motivation, research question, approach, expected contributions, and limitations. They include a clear note that the item is a research plan rather than a peer-reviewed publication.

The Publications section keeps the existing cards and year grouping. If there are no publications, the page uses a neutral scholarly-outputs empty state rather than presenting the entire Research page as empty.

### Disclosure and safety

Only records marked published are public. A PDF is optional and is described as a sanitized public version. The public model contains no professor, institution, lab, application, or private-notes fields, reducing the chance of accidentally exposing proposal-specific correspondence.

## Content model

### Research Agenda

A single editable agenda record contains:

- headline;
- short summary;
- research themes;
- optional longer description;
- optional document URL;
- published/draft state;
- last-updated timestamp.

### Research Proposal

Each proposal contains:

- slug and title;
- kind and stage;
- year and version label;
- summary;
- optional motivation, research question, approach, expected contributions, and limitations;
- optional sanitized PDF URL;
- theme tags;
- featured flag and sort order;
- draft/published state;
- created and updated timestamps.

Agenda and proposal records remain separate from publications. Proposal versions are represented by a human-readable version label and updated timestamp for now; full version history is deliberately out of scope until there is evidence it is needed.

## Administration

The existing admin panel gains a Research Portfolio area with:

- one agenda editor;
- a proposal list;
- create, edit, publish/unpublish, order, and soft-delete controls for proposals.

Forms validate required fields and URL formats on both client and server boundaries. API routes use the same authentication and audit patterns as existing publication and project routes.

## Static publishing

Published agenda and proposal data are included in the generated public-data snapshot. Static builds consume the snapshot through the same provider contract as publications and projects. Proposal detail routes are generated only for published proposals; the static workspace removes the dynamic proposal route when there are no records.

## Error and empty states

- A failed agenda or proposal query must not hide publications.
- Missing proposal slugs return the existing not-found experience.
- Draft and soft-deleted proposals never appear in public queries or static snapshots.
- The landing page hides an empty Selected Proposals section.
- The agenda falls back to the existing research-positioning copy if no published agenda exists.

## Accessibility and presentation

The implementation reuses the existing design system, spacing, badges, focus treatments, and reveal motion. Labels are text, not color-only signals. Links use descriptive names, and decorative icons are hidden from assistive technology.

## Verification

Automated coverage will verify:

- public queries exclude draft and deleted proposals;
- schema parsing accepts valid agenda/proposal snapshots and rejects malformed data;
- proposal cards expose the correct labels and sanitized-PDF action;
- the Research page keeps proposals and publications visibly distinct;
- API validation rejects incomplete or malformed records;
- type checking, linting, unit tests, production build, and static-export verification pass.

## Out of scope

- Writing or translating the final Research Agenda;
- selecting and sanitizing the real proposal documents;
- private access controls for proposal PDFs;
- full proposal revision history;
- analytics on document downloads.
