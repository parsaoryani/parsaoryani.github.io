# Complete Personal Website Audit

**Owner:** Parsa Oryani

**Audit date:** 2026-09-11

**Status:** Critical public remediation implemented locally; retained as the audit record

**Scope:** Public website, responsive behavior, content and positioning, project claims, CV HTML/PDF consistency, accessibility, SEO, and carried-forward admin/CMS risks

**Implementation state:** The critical public-site pass was completed locally on 2026-09-11. No deployment was performed.

## 1. Purpose

This document consolidates the website's known issues into one implementation-ready audit. It combines:

- direct browser observation of every current public route on desktop;
- representative mobile and dark-mode checks;
- rendered-text and metadata inspection;
- visual inspection of the downloadable CV PDF;
- route, redirect, lint, and type-check verification;
- still-relevant findings from the earlier public/admin review.

This document supersedes the issue lists in `PERSONAL_SITE_UX_IA_REVIEW.md` for prioritization. The older review remains useful for its detailed proposed CMS architecture, but remediation should be tracked from this file.

### Remediation outcome

The completed local pass fixes the broken mobile navigation, makes the current Agent Security identity immediate, rewrites About as one coherent transition story, replaces the empty Research state with an explicitly in-progress thesis record, bounds high-risk project claims, aligns the HTML/Markdown/PDF CVs, removes the disputed comparative grade claim, uses one primary email, and adds canonical metadata plus safe external-link behavior.

The absence of completed Agent Security projects or publications is not treated as a defect in this pass. Per the site owner's direction, the Research page now states the current questions, method, threat model, status, and limitations without inventing results; real research and implementation artifacts can be added as they become available. The carried-forward admin authentication findings remain separate from this public-site remediation and still require a dedicated security review.

## 2. Evidence status

Every issue has one of these evidence labels:

| Label | Meaning |
|---|---|
| **Confirmed — visual** | Reproduced in the browser during the 2026-09-11 audit. |
| **Confirmed — content** | Present in current rendered copy or the current CV PDF. |
| **Confirmed — source** | Verified in current source code or generated metadata. |
| **Credibility risk** | The wording is questionable or stronger than the displayed evidence; the underlying repository must be checked before calling it false. |
| **Carry-forward** | Identified in the 2026-08-08 source/admin review and not re-tested in the current browser audit. Revalidate before implementation. |

## 3. Severity model

| Priority | Meaning |
|---|---|
| **P0 — Critical** | Damages trust, breaks a primary experience, risks security/data loss, or should block sending the site to professors, labs, or recruiters. |
| **P1 — High** | Materially weakens positioning, credibility, accessibility, or maintainability. |
| **P2 — Medium** | Noticeable inconsistency or friction that should be fixed after P0/P1 work. |
| **P3 — Low** | Polish or future hardening. |

## 4. Executive verdict

The site has a strong visual foundation: consistent typography, restrained color, clear cards, coherent page openings, useful navigation, and credible academic presentation. Its main weakness is not aesthetics. It is the gap between the **current identity being claimed** and the **evidence currently presented**.

The home page and CV position Parsa as working specifically on security of LLM agents and multi-agent systems, including information-flow control, authorization, provenance, and runtime enforcement. The visible evidence is still dominated by blockchain:

- all three published project case studies are blockchain projects;
- one of two home-page research directions is blockchain interoperability;
- much of the skills presentation is blockchain and cryptography;
- the Research page contains no paper, preprint, technical note, poster, prototype, thesis page, or other research artifact.

The intended professional narrative should become:

```text
Cryptography and blockchain foundations
→ secure distributed systems and protocol reasoning
→ trust, provenance, authorization, and delegated authority
→ current research on tool-using AI agents
→ concrete thesis artifacts and results
```

Until that chain is visible, a skeptical reader may interpret the Agent Security positioning as a label change rather than a traceable research transition.

## 5. Highest-impact findings

### P0-1 — Mobile navigation is visually broken

**Evidence:** Confirmed — visual

**Affected surface:** Global mobile header/menu

When opened, the mobile menu overlays the hero without a sufficiently opaque surface. Navigation labels collide with the underlying heading and description, while the active item renders as a large bar through page content.

**Required fix:**

- Give the menu a fully legible surface and correct stacking context.
- Prevent background content from competing visually with the menu.
- Lock background scrolling while open.
- Verify current-item styling at 320, 375, 390, and 430 CSS pixels.
- Verify focus entry, Escape-to-close, focus return, and route-change close behavior.

### P0-2 — Research positioning lacks supporting evidence

**Evidence:** Confirmed — content and visual

**Affected surfaces:** Home, Research, Projects, CV

The strongest positioning claim on the site is also the least evidenced. The Research page ends with “Research updates will appear here,” and the Projects page has no Agent Security project.

**Required fix:** Publish at least one substantive current-research artifact before treating the positioning as complete. Acceptable artifacts include:

- an M.Sc. thesis page with problem, threat model, research questions, approach, current status, advisor, and limitations;
- a technical note or survey with a stable URL;
- a prototype or repository related to tool, skill, memory, provenance, or authorization security;
- a poster, talk, replication note, experiment report, or work-in-progress entry clearly labeled with its status.

### P0-3 — CV web and PDF are inconsistent

**Evidence:** Confirmed — content and visual

**Affected surfaces:** `/cv`, `/cv.pdf`

The two CVs disagree on experience, identity details, and positioning. The PDF omits the Design and Analysis of Algorithms teaching assistantship, contains two email addresses and a location while the web CV does not, and adds “privacy” and “fine-tuning” language that is not consistently used elsewhere.

**Required fix:** Generate both outputs from one canonical CV view model. Do not publish either version when generation or validation of the other fails.

### P0-4 — Several technical claims require fact-checking

**Evidence:** Credibility risk

**Affected surfaces:** All project case studies, especially ZK-Mixer

Terms and metrics are sometimes presented more strongly than the visible evidence supports. The highest-risk examples are:

- “Bulletproof-style zk-SNARK proofs”;
- “complete POUR protocol” and “full Zerocash-style mixer”;
- approximately 328 proofs/second and approximately 3 ms/proof without hardware or benchmark conditions;
- “all” 18 threat vectors mitigated;
- “proved the privacy-compliance trade-off is reconcilable”;
- “private keys safe”;
- “tests at 99%”;
- “full experiment reproducibility metadata” while only one workload is implemented;
- BRCC pages described as complete while multiple planned workloads remain unimplemented.

**Required fix:** Verify every claim against its repository, commit, test command, threat model, and benchmark record. Replace categorical language with bounded, reproducible statements.

### P0-5 — A current factual inconsistency exists in About

**Evidence:** Confirmed — content

**Affected surfaces:** About, Amirkabir coursework

About states that the highest grade was earned in both graduate-level cryptography courses. The coursework page records “Highest Grade in Class” only for Special Topics in Cryptography.

**Required fix:** Confirm the historical fact. Either document the distinction on both course entries or change About to refer only to strong performance without making an unsupported comparative claim.

### P0-6 — Carried-forward admin authentication risks

**Evidence:** Carry-forward; requires immediate revalidation

**Affected surfaces:** Admin authentication and page authorization

The earlier source audit identified two possible security-boundary failures:

1. Admin page authorization appeared to check only for the presence of a session cookie before rendering private server pages.
2. A valid authenticated session appeared to be created before required TOTP verification completed.

**Required fix:** Re-test these paths before any visual/admin redesign. A session accepted by private loaders must represent a fully authenticated user, and every private server page must validate the session rather than merely checking cookie presence.

## 6. Current route inventory and health

| # | Route/surface | Health | Main issue |
|---:|---|---|---|
| 1 | `/` | Needs major revision | Repetition, evidence gap, excessive prominence of references, slow essential-message reveal. |
| 2 | `/about` | Needs major revision | Long and duplicated story; incomplete transition rationale; factual inconsistency. |
| 3 | `/experience` | Mixed | Intro promises absent categories; activities are labeled as outcomes. |
| 4 | `/research` | Poor | Empty flagship page with a Publications badge but no publications or research artifacts. |
| 5 | `/projects` | Visually good, strategically weak | All visible projects are blockchain projects. |
| 6 | `/projects/zk-mixer` | Requires technical review | Highest concentration of unsupported or ambiguous technical claims. |
| 7 | `/projects/ethereum-cli` | Generally good | Overbroad security language and confusing coverage reporting. |
| 8 | `/projects/brcc-lab` | Strongest case study | Implemented and planned scope are not separated clearly enough. |
| 9 | `/teaching` | Healthy compatibility route | Redirects correctly; should not be presented as an independent canonical page. |
| 10 | `/research-assistance` | Healthy compatibility route | Redirects correctly; destination content needs actual outcomes. |
| 11 | `/education/sharif-university-of-technology` | Useful but dense | Missing grade/status explanation and excessive topic detail. |
| 12 | `/education/amirkabir-university-of-technology-tehran-polytechnic` | Mostly good | Naming and highest-grade inconsistency. |
| 13 | `/cv` and `/cv.pdf` | Needs major revision | Inconsistent sources, empty sections, dense PDF, missing project evidence. |
| 14 | `/contact` | Healthy | Generic copy, two competing emails, and unnecessary spam exposure. |

All tested primary routes returned HTTP 200. The two compatibility routes returned the expected permanent redirect to their Experience anchors.

## 7. Complete public-content issue register

### Content and positioning

| ID | Priority | Evidence | Surface | Issue | Required action |
|---|---|---|---|---|---|
| CON-01 | P0 | Confirmed — content | Global | Agent Security positioning is stronger than the current public evidence. | Add thesis/current-work artifacts and an Agent Security project or technical note. |
| CON-02 | P1 | Confirmed — content | About | The blockchain-to-agent-security transition explains the new topic but not the actual decision. | Explain intellectual continuity, local mentorship/collaboration constraints, and the opportunity at Sharif. |
| CON-03 | P1 | Confirmed — content | About | “Newer frontier” may sound trend-driven. | Replace novelty framing with a problem-driven transition. |
| CON-04 | P1 | Confirmed — content | About | The biography is duplicated between the timeline story and “Along the way.” | Merge into one narrative and reduce total length by approximately 35–45%. |
| CON-05 | P2 | Confirmed — content | About | Financial-markets/trading history occupies too much space relative to its academic value. | Compress to one short bridge into cryptography and trustworthy financial infrastructure. |
| CON-06 | P0 | Confirmed — content | About/coursework | “Highest grade in both courses” is inconsistent with the coursework record. | Fact-check and make both surfaces agree. |
| CON-07 | P1 | Confirmed — content | About/Research | “Model-independent mechanisms” reads as an achieved result without a displayed artifact. | Use “investigates” or “aims to develop” until validated results exist. |
| CON-08 | P1 | Confirmed — content | Research | The badge says Publications while no publications exist. | Rename the section or add real publication/work-in-progress content. |
| CON-09 | P1 | Confirmed — content | Research | “Research updates will appear here” makes the flagship page look unfinished. | Replace the empty state with structured current work. |
| CON-10 | P1 | Confirmed — content | Research | The thesis lacks research question, threat model, method, status, advisor, timeline, and artifacts. | Add a dedicated thesis/current-research presentation. |
| CON-11 | P2 | Confirmed — content | Research | “Where I continue to work” makes the current blockchain commitment unclear. | State whether it is active research, an ongoing project, or background expertise. |
| CON-12 | P1 | Confirmed — content | Projects | All three case studies are blockchain projects. | Add Agent Security evidence or adjust positioning until it exists. |
| CON-13 | P1 | Confirmed — content | Projects | The claimed bridge to Agent Security is asserted but not demonstrated per project. | Add a short “Transfer to agent security” explanation grounded in each project. |
| CON-14 | P2 | Confirmed — content | Experience | The introduction promises work experience and recognition, but neither category is shown. | Remove absent categories from the copy or publish the missing content. |
| CON-15 | P1 | Confirmed — content | Research experience | Items labeled Outcomes are mostly activities: investigating, studying, applying, conducting. | Replace with artifacts, decisions, results, milestones, or clearly label the list Responsibilities. |
| CON-16 | P2 | Confirmed — content | Research experience | The summary and first bullet repeat each other. | Keep one concise responsibility statement and use the list for distinct evidence. |
| CON-17 | P1 | Confirmed — content | Research experience | “Research Assistant” may overstate the relationship if no formal appointment exists. | Verify the formal status; otherwise use M.Sc. Researcher or Thesis Research. |
| CON-18 | P2 | Confirmed — content | Teaching | Teaching Highlights often repeat the description. | Add distinctive scope, artifacts, scale, workshops, or outcomes; otherwise remove the duplicate list. |
| CON-19 | P2 | Confirmed — content | Home | Five professors under “References” can imply formal endorsement beyond the listed relationships. | Keep the current advisor prominent; rename or move the rest to mentors/instructors in Experience. |
| CON-20 | P2 | Confirmed — content | Home | Blockchain interoperability and the current thesis receive similar visual weight. | Make the thesis primary and label blockchain work as prior/continuing foundation. |
| CON-21 | P2 | Confirmed — content | Contact | “I am always open” is generic. | Name the desired conversations: thesis-related discussion, collaboration, internship, or PhD opportunity. |
| CON-22 | P2 | Confirmed — content | Contact | Two public email addresses add choice and spam exposure. | Publish one primary email; keep the second only where necessary. |
| CON-23 | P2 | Confirmed — content | Coursework | Course naming is inconsistent: “Dr. Ali” versus “Dr. Mohammad Ali.” | Use one verified professional name everywhere. |
| CON-24 | P2 | Confirmed — content | Coursework | Courses with and without grades are mixed without explaining in-progress status. | Add term/status and label unfinished courses explicitly. |
| CON-25 | P3 | Confirmed — content | Coursework | Ten course records and full topic lists obscure the most relevant material. | Label as selected coursework and collapse secondary detail. |
| CON-26 | P2 | Confirmed — content | Global | The same positioning sentence is repeated in the hero, interests, research, snapshot, contact CTA, and footer. | Assign each section a distinct communication job and remove repetition. |

## 8. Complete project-credibility issue register

These findings are phrased as risks until the underlying repositories are inspected.

| ID | Priority | Project | Risk | Verification/fix |
|---|---|---|---|---|
| PRJ-01 | P0 | ZK-Mixer | “Bulletproof-style zk-SNARK” mixes proof-system terminology that is normally distinct. | Name the exact construction/library and classify it correctly. |
| PRJ-02 | P0 | ZK-Mixer | “Complete POUR protocol” and “full Zerocash-style mixer” may overstate fidelity. | Document which parts are cryptographically faithful, mocked, simplified, or educational. |
| PRJ-03 | P0 | ZK-Mixer | 328 proofs/second and approximately 3 ms/proof lack environment and workload definitions. | Provide hardware, dependency versions, circuit/statement size, sample count, warm-up, and command. |
| PRJ-04 | P1 | ZK-Mixer | “Under 500 ms,” “approximately 5 ms,” and “10–18x targets” lack baselines and distributions. | Report benchmark method, target source, median/p95, and reproducible script. |
| PRJ-05 | P0 | ZK-Mixer | “All 18 threat vectors mitigated” is categorical. | Link the threat model and distinguish mitigated, partially mitigated, accepted, and out-of-scope risks. |
| PRJ-06 | P0 | ZK-Mixer | “Proved the privacy-compliance trade-off is reconcilable” implies a research conclusion. | Use “demonstrated one design approach” unless a formal result supports the claim. |
| PRJ-07 | P1 | ZK-Mixer | “Full” implementation conflicts with 70% coverage and low-coverage security/auth modules. | State prototype scope and known untested areas directly. |
| PRJ-08 | P1 | Ethereum CLI | “Keeps private keys safe” is unbounded. | State concrete controls: encrypted at rest, password-gated export, and restricted network path. |
| PRJ-09 | P1 | Ethereum CLI | “Tests at 99%” is not a useful production-code coverage metric. | Report coverage only for source modules using a named command/tool. |
| PRJ-10 | P1 | Ethereum CLI | A private key is not inherently testnet-only. | Say the application prevents mainnet submission; do not imply the key cannot be used elsewhere. |
| PRJ-11 | P1 | BRCC | “Full experiment reproducibility metadata” is too broad with one implemented workload. | Say which workload and metadata fields are currently supported. |
| PRJ-12 | P1 | BRCC | “Pages are complete” conflicts with planned but unbuilt workloads. | Use “implemented in the current prototype” and add explicit Implemented/Planned sections. |
| PRJ-13 | P2 | All projects | Result claims are disconnected from commit hashes and evidence links. | Link each metric/result to a stable repository revision and reproduction instructions. |
| PRJ-14 | P2 | All projects | Limitations appear late and do not consistently bound summary claims. | Carry the most important limitation into the summary/result section. |

## 9. Complete visual, responsive, and interaction issue register

| ID | Priority | Evidence | Surface | Issue | Required action |
|---|---|---|---|---|---|
| UX-01 | P0 | Confirmed — visual | Mobile menu | Menu content overlaps the page and active styling cuts through the hero. | Rebuild the menu surface, positioning, background, and active state. |
| UX-02 | P1 | Confirmed — visual | Home hero | Essential positioning is hidden behind a slow typewriter reveal. | Render the full statement immediately; remove or make animation decorative. |
| UX-03 | P2 | Confirmed — visual | Home | The page is unusually long and repeats similar section patterns. | Reduce sections and strengthen progression from claim to evidence to contact. |
| UX-04 | P2 | Confirmed — visual | Home | Research Interests, Current Research, and Technical Foundations compete instead of forming one hierarchy. | Consolidate into focus, current work, and evidence. |
| UX-05 | P1 | Confirmed — visual | About mobile | The portrait appears before the story, delaying the page's purpose. | Place a short current-focus summary before or beside the portrait. |
| UX-06 | P1 | Confirmed — visual | About mobile | The page reaches approximately 9,390 px and becomes exhausting to scan. | Remove duplicate narrative and collapse supporting detail. |
| UX-07 | P2 | Confirmed — visual | Sticky header | Header can cover text at scrolled/anchor positions. | Apply consistent scroll margin/padding based on header height. |
| UX-08 | P2 | Confirmed — visual | Dark mode | Secondary metadata, social links, and eyebrow text appear too faint. | Measure contrast and raise token values for small text. |
| UX-09 | P2 | Confirmed — visual | Projects mobile | Filters consume most of the first viewport, delaying actual projects. | Compress filters or make them horizontally scrollable after a concise summary. |
| UX-10 | P2 | Confirmed — visual | Coursework | Dense chips and disclosures make pages resemble raw data archives. | Use progressive disclosure and prioritize thesis-relevant courses. |
| UX-11 | P2 | Confirmed — visual | Page openings | Repeated badge + gradient heading + paragraph treatment makes pages feel templated. | Introduce page-specific hierarchy while preserving the design system. |
| UX-12 | P2 | Confirmed — visual | Cards | Large numbers of technology chips compete with the title and result. | Limit visible chips and reveal the remainder on detail pages. |
| UX-13 | P2 | Confirmed — visual | CV web | Empty Experience and Awards & Honors headings render. | Do not render empty sections. |
| UX-14 | P1 | Confirmed — visual | CV PDF | One-page layout is overly dense, especially teaching rows and the toolkit. | Reduce content or permit a well-spaced second page. |
| UX-15 | P2 | Confirmed — visual | Global | Several small labels use 10–12 px mono text. | Increase essential metadata size and test 200%/400% zoom. |
| UX-16 | P2 | Confirmed — visual | Global motion | Scroll-reveal content can appear unavailable while animations run. | Shorten delay and guarantee visible fallback when JS or observers fail. |
| UX-17 | P3 | Confirmed — visual | Contact | Cards are clear but the page has no decisive primary action hierarchy. | Make the preferred email/contact route primary. |
| UX-18 | P3 | Confirmed — visual | Footer | Footer repeats positioning and exposes a large secondary navigation footprint. | Shorten biography/tagline and retain only useful destination groups. |

## 10. Complete accessibility issue register

### Confirmed strengths

- The root document uses `lang="en"`.
- Current inspected routes have one H1.
- Theme and menu buttons have accessible names.
- Profile and professor images expose alternative text.
- Professor links have meaningful accessible names.
- Source includes global focus-visible and reduced-motion handling.

### Issues and verification gaps

| ID | Priority | Evidence | Issue | Required action |
|---|---|---|---|---|
| A11Y-01 | P0 | Confirmed — visual | Mobile menu may be unusable visually and may not manage focus correctly. | Test focus entry/return, Escape, route change, scroll lock, and keyboard order. |
| A11Y-02 | P1 | Confirmed — content | Essential hero content is animated rather than immediately available visually. | Display the complete message by default and respect reduced motion. |
| A11Y-03 | P1 | Confirmed — visual/source | Tertiary `Ash` text is approximately 2.77:1–3.33:1 on common dark surfaces. | Raise contrast to at least 4.5:1 for normal text. |
| A11Y-04 | P1 | Confirmed — source | Slate borders are approximately 1.3:1–1.6:1 against common surfaces. | Ensure controls and required boundaries meet 3:1 non-text contrast. |
| A11Y-05 | P1 | Confirmed — source | Indigo small text can fall to approximately 4.18:1. | Adjust color or typography for compliant contrast. |
| A11Y-06 | P2 | Confirmed — source | Active filters/navigation rely heavily on color and border. | Add selected/current semantics and a non-color cue. |
| A11Y-07 | P2 | Confirmed — visual/source | Important labels and timestamps are as small as 10–11 px. | Increase size and verify reflow at 200% and 400%. |
| A11Y-08 | P2 | Carry-forward | Compact chips/links may not provide 44×44 CSS pixel targets or sufficient spacing. | Measure representative controls on touch viewports. |
| A11Y-09 | P2 | Carry-forward | Decorative and meaningful icons may not be consistently hidden/named. | Audit icon semantics and accessible names. |
| A11Y-10 | P2 | Carry-forward | Gradient text may disappear in forced-colors/high-contrast mode. | Add a reliable solid-color fallback. |
| A11Y-11 | P1 | Confirmed — content/source | Downloadable CV PDF is untagged. | Generate a tagged PDF with logical headings, reading order, and link semantics. |
| A11Y-12 | P1 | Confirmed — source | CV arrays are rendered through string conversion rather than semantic lists. | Render real list markup. |
| A11Y-13 | P2 | Confirmed — source | Label/heading combinations can repeat text such as “Current Research.” | Hide decorative labels from assistive technology or make labels distinct. |
| A11Y-14 | P1 | Carry-forward | Form errors may not be associated with fields or announced reliably. | Use `aria-invalid`, `aria-describedby`, and a suitable live region. |
| A11Y-15 | P2 | Verification gap | Keyboard traps, reading order, VoiceOver/NVDA behavior, forced colors, and 320 px reflow were not fully tested. | Run the manual accessibility checklist before release. |

## 11. Complete CV issue register

| ID | Priority | Evidence | Issue | Required action |
|---|---|---|---|---|
| CV-01 | P0 | Confirmed — content | PDF omits the Design and Analysis of Algorithms TA role shown on the site. | Restore or intentionally remove it from both versions. |
| CV-02 | P1 | Confirmed — content | PDF has two emails and Tehran; web CV has one email and no location. | Define one canonical contact profile. |
| CV-03 | P1 | Confirmed — content | PDF adds “security and privacy” while the site mostly says security. | Choose and use one accurate research label. |
| CV-04 | P1 | Confirmed — content | PDF lists fine-tuning without visible supporting evidence elsewhere. | Verify evidence or remove it from the primary toolkit. |
| CV-05 | P1 | Confirmed — visual | Web CV renders empty Experience and Awards & Honors sections. | Conditionally render non-empty sections only. |
| CV-06 | P1 | Confirmed — source | Research and teaching arrays are converted to comma-joined strings. | Render semantic bullets with proper spacing. |
| CV-07 | P1 | Confirmed — content | CV contains no Projects section despite having no Publications section. | Add selected projects as the strongest available evidence. |
| CV-08 | P2 | Confirmed — visual | PDF typography and row spacing are too dense. | Edit down or use two pages. |
| CV-09 | P1 | Confirmed — source | PDF is untagged. | Add accessible document structure. |
| CV-10 | P2 | Confirmed — content | Web title is long and wraps awkwardly. | Use a shorter headline and put detailed focus in the profile paragraph. |
| CV-11 | P1 | Carry-forward | HTML and PDF do not appear to share one data model. | Generate both from a canonical published snapshot with a version identifier. |
| CV-12 | P2 | Carry-forward | Print behavior of the HTML CV is not guaranteed. | Add print styles and exclude sticky navigation. |

## 12. Complete SEO and metadata issue register

| ID | Priority | Evidence | Issue | Required action |
|---|---|---|---|---|
| SEO-01 | P1 | Confirmed — source | Primary pages do not emit canonical links in the inspected local build. | Add canonical URLs for every indexable route. |
| SEO-02 | P1 | Confirmed — content | Experience description mentions awards, talks, service, and work experience that are not displayed. | Make metadata reflect current content. |
| SEO-03 | P2 | Confirmed — content | Research metadata promises publications while the page is empty. | Align title/description with actual current-research content. |
| SEO-04 | P2 | Confirmed — source | Deployment origin depends on environment configuration. | Validate production sitemap, robots, canonical, OG, and JSON-LD origins in CI. |
| SEO-05 | P2 | Confirmed — source | Detail pages have title/description/OG title but canonical handling is incomplete. | Add stable canonical output and test static export. |
| SEO-06 | P2 | Confirmed — source | Compatibility routes must remain noindex and canonical to Experience anchors. | Preserve and test the existing compatibility metadata. |
| SEO-07 | P2 | Carry-forward | Scholarly metadata should expose DOI, arXiv, authors, citation information, and stable links when publications exist. | Add structured scholarly metadata to publication details. |
| SEO-08 | P3 | Carry-forward | Project claims/results are not linked to stable evidence revisions. | Use permalinks to releases/commits and reproducibility documentation. |
| SEO-09 | P3 | Confirmed — source | Repeated site-wide positioning copy reduces page-specific search intent. | Give About, Research, Projects, and Experience distinct descriptions. |

## 13. Complete admin, CMS, security, and data-integrity issue register

The following findings were carried forward from the earlier source/admin audit. They must be revalidated against the current implementation before editing, but they remain in this document so no known risk is lost.

### Security and privacy

| ID | Priority | Issue | Required action |
|---|---|---|---|
| ADM-01 | P0 | Possible admin page authorization gap: cookie presence may gate pages without validating the session. | Validate the session in the protected server layout/load boundary. |
| ADM-02 | P0 | Possible 2FA completion gap: an authenticated session may be created before TOTP succeeds. | Introduce a pending/pre-auth state; create the accepted session only after all required factors pass. |
| ADM-03 | P1 | Sessions cannot be clearly identified as current or revoked from the admin. | Add current-session labeling and revoke actions with audit records. |
| ADM-04 | P1 | Password, 2FA setup/recovery, and recovery-code management are incomplete or not visible. | Add explicit secure account-management flows. |
| ADM-05 | P1 | Security/activity logs lack useful filters, detail inspection, and export. | Add actor/action/result/date filters and readable diffs without sensitive payloads. |
| ADM-06 | P1 | Message views give IP addresses unnecessary prominence. | Minimize and protect personal data; define retention and legitimate use. |
| ADM-07 | P1 | Developer mail tooling may appear in primary navigation. | Hide it in production and group it under System/Developer Tools. |

### Data integrity and editorial ownership

| ID | Priority | Issue | Required action |
|---|---|---|---|
| ADM-08 | P0 | Publication create/edit may collapse multiple authors into one string-backed author object. | Use an ordered structured author editor. |
| ADM-09 | P0 | Publication edit may submit `contributions: []` and erase existing data. | Preserve untouched repeaters and save atomically. |
| ADM-10 | P0 | Project editor may omit Architecture, Challenges, Results, and Retrospective even though public pages display them. | Expose every public editorial field in the editor. |
| ADM-11 | P1 | APIs accept tag IDs while project/publication forms do not expose tag assignment. | Add validated tag assignment to both editors. |
| ADM-12 | P1 | Lists use `sortOrder` while most forms do not allow reordering. | Add explicit ordering controls with deterministic fallback sorting. |
| ADM-13 | P1 | About, research agenda, page introductions, CV identity, header/footer copy, and trust claims remain hardcoded. | Introduce typed Profile and PageContent ownership rather than raw settings. |
| ADM-14 | P0 | Contact settings may save through multiple independent requests and partially succeed. | Save related settings in one validated transaction/version. |
| ADM-15 | P1 | `hero_thesis` may be seeded/editable but not consumed publicly. | Remove, migrate, or wire it into the canonical content model. |
| ADM-16 | P1 | `publication_milestone` may be editable but invisible on public timelines. | Render it under Recognition or remove it through an explicit migration decision. |
| ADM-17 | P0 | Generic settings allow raw JSON/arbitrary strings without key-specific validation. | Replace normal access with typed editors; restrict emergency settings and audit changes. |
| ADM-18 | P1 | Duplicated identity/contact values have no single canonical owner. | Make Profile the only owner and consume it everywhere. |
| ADM-19 | P1 | Concurrent editing lacks version conflict detection. | Add record versions and HTTP 409 recovery paths. |
| ADM-20 | P1 | Repeaters and relationship rows may not save transactionally. | Save a record and all owned relations in one database transaction. |
| ADM-21 | P2 | Published slug changes can break external links. | Warn before change and retain redirects from old published slugs. |
| ADM-22 | P2 | Timeline visibility and editorial status may form competing publication systems. | Migrate to one lifecycle or define an explicit mapping. |

### Admin navigation and usability

| ID | Priority | Issue | Required action |
|---|---|---|---|
| ADM-23 | P1 | Fourteen flat navigation items create a dense admin information architecture. | Group under Content, Inbox, Media, and System. |
| ADM-24 | P1 | Fixed desktop sidebar has no verified mobile pattern. | Add a responsive admin header/drawer and test keyboard/touch behavior. |
| ADM-25 | P2 | Dashboard cards describe create/edit/delete but do not expose the create action directly. | Add contextual primary actions. |
| ADM-26 | P2 | Dashboard counts mix lifecycle states and lack content-health signals. | Separate draft/published counts and show incomplete/broken content. |
| ADM-27 | P2 | Research/teaching lists may omit status, preview, and ordering controls. | Adopt a standard library pattern. |
| ADM-28 | P2 | Course management is buried under timeline records. | Add a discoverable child action and relationship context. |
| ADM-29 | P2 | Skills cannot be fully edited or reordered after creation. | Add name/proficiency editing and category/skill ordering. |
| ADM-30 | P1 | Essential edit/delete actions are sometimes hover-only. | Keep actions visible and keyboard/touch discoverable. |
| ADM-31 | P1 | Native `confirm()` dialogs provide weak destructive-action context and no recovery. | Use accessible named dialogs and recoverable Trash. |
| ADM-32 | P1 | Unsaved-change protection and revision history are missing or incomplete. | Add dirty-state warnings, revisions, comparison, and restore. |
| ADM-33 | P2 | Successful save/publish workflows do not consistently expose View live. | Keep the editor open and offer a verified live/preview link. |
| ADM-34 | P2 | Search, filters, pagination, and bulk actions are inconsistent across libraries. | Use a shared library pattern with domain-specific controls. |

### Media, inbox, and operational gaps

| ID | Priority | Issue | Required action |
|---|---|---|---|
| ADM-35 | P1 | Profile photo management may require an external URL despite upload capability elsewhere. | Use the media library with validation, crop/focal point, alt text, and usage tracking. |
| ADM-36 | P1 | Uploaded media lacks a complete lifecycle and safe replacement workflow. | Add Ready/In use/Archived/Trash states and prevent deletion while referenced. |
| ADM-37 | P2 | Message inbox lacks search, filters, reply tracking, bulk actions, and recoverable deletion. | Add an inbox workflow with clear state transitions and retention. |
| ADM-38 | P1 | Some admin errors may fail silently or lose user context. | Use field errors, error summaries, persistent input, and recoverable retry. |
| ADM-39 | P2 | Contact/profile changes lack a trustworthy preview. | Preview through the same public rendering components before publish. |
| ADM-40 | P2 | Content libraries do not expose completeness/evidence warnings. | Add content-health checks for missing links, evidence, metadata, or required sections. |

## 14. Recommended public information architecture

Use the current simplified primary navigation:

```text
Home
Research
Projects
Experience
About
Contact
CV
```

Page responsibilities should be strict:

| Page | Primary job |
|---|---|
| Home | State current identity, show strongest evidence, and direct the next action. |
| Research | Explain the active research program and expose current artifacts/publications. |
| Projects | Present implemented systems and bounded, reproducible results. |
| Experience | Present education, research roles, teaching roles, and verified recognition. |
| About | Explain personal/intellectual trajectory without duplicating the CV. |
| CV | Provide a complete, consistent professional record in HTML and PDF. |
| Contact | Make the preferred contact path and desired inquiry types obvious. |

The footer should remain a secondary sitemap, but it should not repeat the full positioning pitch.

## 15. Recommended page changes

### Home

Recommended order:

1. Static identity and research statement.
2. One primary CTA: View current research.
3. Current thesis/research artifact.
4. Selected evidence: at most three projects/publications/notes.
5. Short foundations/transfer statement.
6. Short About preview.
7. Contact CTA.

Remove or reduce:

- the typewriter effect;
- repeated positioning paragraphs;
- the five-person References block on the home page;
- equal visual weighting of current Agent Security work and prior blockchain work;
- long technology inventories without evidence links.

### About

Recommended structure:

1. Current identity and direction.
2. Condensed origin: mathematics, markets, computer science, cryptography.
3. Why blockchain.
4. Why Agent Security now.
5. What transferred from the earlier work.
6. Current goal and collaboration direction.

Do not duplicate this story in a second timeline narrative. Education details belong in Experience and the CV.

### Research

Recommended structure:

1. Research statement.
2. Current thesis.
3. Research questions and threat model.
4. Current method and status.
5. Work in progress, notes, talks, posters, code, and publications.
6. Advisor/collaborator context.
7. Contact/collaboration CTA.

Use explicit status labels: Idea, In progress, Under review, Preprint, Published, or Archived. Do not imply publication when none exists.

### Projects and case studies

Each project should answer:

1. What problem was solved?
2. What exactly was implemented?
3. What was intentionally not implemented?
4. What threat/adversary model applied?
5. What result was measured, on what environment, and how can it be reproduced?
6. What did this project contribute to current Agent Security work?

### Experience

- Promise only categories actually shown.
- Rename activity lists to Responsibilities when there is no outcome.
- Prefer artifacts/results over technology tags.
- Verify formal role titles.
- Remove repeated descriptions and highlights.

### Coursework

- Label the pages Selected Coursework.
- Keep thesis-relevant courses expanded.
- Collapse secondary syllabi/topic lists.
- State In progress where grades are unavailable.
- Use verified instructor names consistently.

### CV

- Build HTML and PDF from one published model.
- Add selected projects while publications are absent.
- Remove empty headings.
- Use semantic lists.
- Allow two pages rather than forcing unreadable density.
- Generate a tagged PDF.

### Contact

- Use one primary email.
- State desired inquiry types.
- Keep GitHub and LinkedIn as secondary verification channels.
- Avoid an expected-response-time claim unless it can be maintained.

## 16. Recommended transition copy

The transition should not say that AI research was easier than blockchain research. It should explain that the locally available research environment, mentorship, and feedback loop were more actionable, while showing that the underlying security questions remained consistent.

Recommended long version:

> My move from blockchain security to agent security was not a departure from the questions that first drew me to secure systems. In both areas, I am interested in how trust is established, how authority is delegated, and how a system can remain safe when independent components interact. During my early graduate studies, I also found that sustained mentorship, feedback, and active research collaboration in blockchain were harder for me to access locally. At Sharif, I had a clearer opportunity to work closely on the security of tool-using AI agents—systems that raise many of the same questions about provenance, authorization, and verification, but in a rapidly evolving setting with immediate real-world impact. Blockchain security remains part of my technical foundation; agent security is now the main direction in which I am developing that foundation.

Recommended short bridge:

> My current work applies a background in cryptography, distributed systems, and blockchain security to a new systems-security problem: controlling what AI agents may read, remember, call, and change.

## 17. Remediation plan

### Phase 0 — Trust and security blockers

- [ ] Revalidate and fix admin authorization and 2FA boundaries.
- [ ] Fix publication/project editor data-loss risks.
- [ ] Fix the mobile menu.
- [ ] Remove the typewriter dependency from essential hero content.
- [ ] Fact-check every technical claim, benchmark, grade, role, and date.
- [ ] Synchronize HTML and PDF CV content.

### Phase 1 — Positioning and evidence

- [ ] Publish a complete thesis/current-research page.
- [ ] Add at least one Agent Security artifact or project.
- [ ] Rewrite the blockchain-to-agent-security transition.
- [ ] Rework Research so it is useful without publications.
- [ ] Add evidence links and bounded limitations to project case studies.

### Phase 2 — Information hierarchy

- [ ] Shorten Home and remove repeated positioning.
- [ ] Shorten About by approximately 35–45%.
- [ ] Move or rename the home-page References block.
- [ ] Correct Experience promises and outcome labels.
- [ ] Collapse secondary coursework detail.
- [ ] Add selected projects to CV.

### Phase 3 — Accessibility and metadata

- [ ] Resolve small-text and color-contrast failures.
- [ ] Complete keyboard, screen-reader, zoom, forced-colors, and reflow testing.
- [ ] Add canonical URLs and validate production origins.
- [ ] Generate a tagged CV PDF.
- [ ] Correct form error associations and announcements.

### Phase 4 — Admin/CMS completion

- [ ] Establish canonical Profile and PageContent ownership.
- [ ] Add versioned transactional editing and conflict recovery.
- [ ] Standardize Draft/Published/Archived/Trash lifecycles.
- [ ] Add typed editors, preview, revisions, and audit history.
- [ ] Reorganize admin navigation and complete responsive behavior.
- [ ] Complete media, inbox, security, and content-health workflows.

## 18. Release verification checklist

### Content and credibility

- [ ] Every date, grade, role, professor name, institution, and ranking matches a source.
- [ ] Every benchmark names its environment, workload, sample method, and reproduction command.
- [ ] Every categorical security statement is either proven, scoped, or softened.
- [ ] Current research has at least one visible artifact.
- [ ] Agent Security and blockchain descriptions form one coherent trajectory.
- [ ] HTML CV, PDF CV, About, Experience, and Contact agree.

### Responsive and interaction

- [ ] Mobile menu passes at 320, 375, 390, and 430 CSS pixels.
- [ ] No sticky header covers anchored content.
- [ ] Essential content remains visible with JavaScript disabled or animation unavailable.
- [ ] Light and dark modes have usable small-text contrast.
- [ ] Project filters reveal useful content within the first mobile viewport.

### Accessibility

- [ ] Keyboard-only pass on every public route.
- [ ] VoiceOver/Safari and NVDA/Firefox spot checks.
- [ ] 200% zoom and 320 CSS pixel reflow.
- [ ] Forced-colors/high-contrast check.
- [ ] Automated axe scan followed by manual review.
- [ ] Tagged PDF reading order and link verification.

### SEO and routing

- [ ] Correct canonical on every indexable page.
- [ ] Production sitemap, robots, OG, and JSON-LD use one intended origin.
- [ ] Compatibility routes remain noindex and redirect correctly.
- [ ] Every internal link and downloadable asset resolves.
- [ ] Metadata describes content that actually exists.

### Admin and data integrity

- [ ] Forged/expired/pending sessions cannot access private server pages.
- [ ] Required 2FA completes before an accepted session exists.
- [ ] Publication authors/contributions survive an edit unchanged unless intentionally modified.
- [ ] All project case-study fields survive create/edit/publish round trips.
- [ ] Contact/profile saves are atomic.
- [ ] Version conflicts cannot silently overwrite newer edits.
- [ ] Delete/archive actions are recoverable and audited.

## 19. Audit limitations

- Project repositories were not executed during the public-site audit. Project-claim findings are credibility risks pending repository-level verification.
- The current public deployment, analytics, search-engine indexing, email delivery, and admin UI were not exercised in the 2026-09-11 browser pass.
- Full WCAG conformance cannot be inferred from screenshots or source inspection alone.
- Carried-forward admin findings require fresh reproduction before implementation because the code may have changed since 2026-08-08.

## 20. Definition of done

This audit can be closed only when:

1. Every P0 item is verified fixed or explicitly rejected with a documented reason.
2. The public narrative is coherent from blockchain foundations to current Agent Security work.
3. Current research is supported by at least one substantive public artifact.
4. Project claims have reproducible evidence or appropriately bounded wording.
5. HTML and PDF CVs share one canonical content source and pass content comparison.
6. Public routes pass responsive, accessibility, link, metadata, and visual checks.
7. Carried-forward admin security/data-integrity findings have been re-tested and resolved or retired.
8. Any remaining P2/P3 issue has an owner, status, and rationale.
