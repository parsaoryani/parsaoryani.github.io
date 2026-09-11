# Critical Site Remediation Design

**Date:** 2026-09-11

**Status:** Approved for local implementation

## Goal

Resolve the website's confirmed high-impact public technical, narrative, and credibility problems while preserving the existing visual identity and keeping every change local.

## Scope

This pass will address:

- the broken mobile navigation experience;
- delayed essential messaging in the home-page hero;
- the incomplete blockchain-to-agent-security narrative;
- the unfinished appearance of the Research page;
- unclear separation between previous blockchain work and the current research focus;
- unsupported or overly categorical project wording;
- factual inconsistencies across About, coursework, the web CV, `CV.md`, and `cv.pdf`;
- missing selected-project evidence in the CV;
- high-impact public accessibility, external-link safety, and canonical-metadata issues;
- generic contact positioning and competing public email addresses.

This pass will not create fictional research, publications, benchmarks, appointments, or outcomes. It will not redesign the admin CMS, deploy the site, push commits, or change the site's established visual language.

## Content Strategy

The site will present one coherent trajectory:

1. Mathematics, computer science, and financial systems motivated an interest in trustworthy systems.
2. Cryptography and blockchain supplied practical experience with trust, authority, distributed protocols, and adversarial behavior.
3. Sustained local mentorship and collaboration in blockchain research were difficult to access.
4. Graduate study at Sharif created a more actionable research environment around the security of tool-using AI agents.
5. Agent security is the current primary direction; blockchain remains prior work and a technical foundation.

The transition will be framed as a problem-driven continuation, not as a switch caused by fashion or an assertion that AI research is inherently easier.

## Page Design

### Home

Render the complete Agent Security identity immediately as static text. Keep motion decorative and never make the core message depend on JavaScript or timing. Make current research the primary next action, followed by CV and verification links. Reduce duplicated positioning language.

### About

Shorten the biography and use a single chronological narrative. Compress the financial-markets background, remove the unsupported claim of earning the highest grade in both cryptography courses, explain the practical research-environment constraint, and explicitly connect blockchain concepts to provenance, authorization, trust, and delegated authority in AI agents.

### Research

Retain the public page and navigation entry. Replace the publication-like empty state with an honest current-work presentation containing the M.Sc. thesis direction, research questions, threat model, method, current status, advisor context, limitations, and an invitation to collaborate. Label it clearly as work in progress and do not imply completed results.

### Projects

Introduce the collection as selected previous systems-security work. Add a short explanation of how the work transfers to Agent Security. Rewrite categorical claims as bounded prototype descriptions, distinguish implemented from planned scope, and retain repository links as the evidence surface.

### CV

Align identity, dates, roles, contact details, and research focus across the web CV, `CV.md`, and the downloadable PDF. Add selected projects because no publications are currently listed. Remove empty sections and render list-shaped data as semantic lists. Prefer a readable two-page PDF over a dense one-page document.

### Contact

Use the Sharif address as the single primary public email. Describe the specific conversations sought: thesis-related research discussion, collaboration, internships, and future PhD opportunities.

## Technical Design

### Mobile navigation

Use an opaque, viewport-filling mobile menu below the fixed header. While open, lock background scrolling, move keyboard focus into the menu, close on Escape and route changes, return focus to the trigger, and retain a compact active-page treatment. The desktop navigation remains unchanged.

### Accessibility and link safety

Ensure the menu has correct dialog/navigation semantics, visible keyboard focus, and adequate touch targets. Essential hero content must be immediately available. External links opened in a new tab must include `noopener noreferrer`. Empty headings and comma-joined list data in the CV will be removed or converted to semantic markup.

### Metadata

Add explicit canonical metadata to indexable public pages using the existing site-origin configuration. Research metadata will describe current work rather than claim publications. Compatibility routes will remain non-indexable.

### Content ownership

Update both seed/source content and the committed static snapshot wherever a public content change is data-backed. Tests will protect the key public claims and prevent generated/static modes from drifting.

## Testing Strategy

Behavioral changes will follow red-green-refactor:

- component tests for opening, closing, Escape handling, focus return, and route-close behavior of the mobile menu;
- content tests for immediate hero messaging, the Research work-in-progress state, project framing, and critical factual wording;
- metadata tests for canonical URLs and honest page descriptions;
- CV consistency checks for identity, primary email, education dates, research focus, and selected projects.

Final verification will run the full test suite, type checking, linting, production build, static export validation, link checks, and browser checks on representative desktop and mobile widths in both themes.

## Recovery and Delivery

The pre-change checkpoint is commit `b2fde95`. Implementation commits remain local. No remote push or deployment is authorized. The finished site will be left running locally for visual review when practical.

## Definition of Done

- Mobile navigation is readable and keyboard-operable at 320, 375, 390, and 430 CSS pixels.
- The home page states the current identity immediately.
- About explains the transition honestly and without unsupported grade claims.
- Research is useful without implying a publication or completed result.
- Projects are clearly framed as previous work and use bounded claims.
- Web, Markdown, and PDF CV surfaces agree on critical facts and include selected projects.
- One primary contact address is used consistently.
- Canonical metadata and new-tab link safety are present.
- Automated verification and local browser checks pass.
- No push or deployment occurs.
