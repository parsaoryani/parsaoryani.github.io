# Blockchain Research Visual Identity — Redesign Proposal

**Status:** Design proposal. Nothing in this document has been implemented. A previous, far more conservative version of this proposal was partially implemented and has been fully rolled back; this document replaces it entirely and was written from zero against the current codebase.

**Written against the codebase on 2026-08-20**, at commit `a46a095`, working tree clean.

**Why the previous proposal was discarded.** It treated blockchain identity as *decoration applied on top of a generic layout*: 24px glyphs in card headers, a 12%-opacity node background, a semantic color table. Implemented in full, it changed nothing a visitor would notice — the site still read as a competent but generic dark developer portfolio. The error was not insufficient polish; it was the wrong level of intervention. **Decoration cannot create identity. Structure can.** This proposal therefore works at the level of composition, page architecture, and information design, and treats small glyphs as a supporting detail rather than the strategy.

---

## 1. Current Site Audit

Verified by reading the actual files at `a46a095`.

### 1.1 Design tokens and primitives

| Concern | Location | Current state |
|---|---|---|
| Color tokens | `src/styles/globals.css` `@theme` | `void` `#0A0E14`, `slate-900/800/700`, text scale `fog`/`mist`/`ash`, accents `cyan` `#38E1C4`, `cyan-deep`, `indigo` `#9B8AFF`, `emerald` `#3FB950`, `amber` `#D29922`, `coral` `#F85149`. `coral` is additionally bound to `--danger`. `amber` is effectively unused in the public site. |
| Typography | `src/app/layout.tsx` | Inter (body/headings), JetBrains Mono (`--font-mono`: labels, badges, dates, nav, CTAs). Source Serif is loaded but unused. |
| Backgrounds | `globals.css` utilities | `.bg-grid` (60px cyan-tinted lines, 3% alpha), `.bg-grid-fine` (30px, 2%), `.bg-glow` + indigo/emerald variants (top-anchored radial), `.bg-glow-card` (mouse-tracked radial), `.glass` / `.glass-sm`. |
| Card system | `src/components/ui/card.tsx` | `rounded-xl`, `border-slate-700/50`, `bg-slate-900/80`, `backdrop-blur-sm`, `hover:-translate-y-0.5`, optional `glow` in cyan/indigo/emerald. No amber/coral glow variant. |
| Section rhythm | `src/components/layout/container.tsx` | `Section` defaults to `py-20 md:py-28`. **The homepage overrides every section to `pt-14 pb-14 md:pt-20 md:pb-20`** — a deliberate ~30% tightening from an earlier pass. `Container` is `max-w-6xl px-6`. |
| Section headers | `src/components/ui/section-header.tsx` | Badge + `text-gradient` `h2` + description + a `h-0.5 w-16` gradient accent bar. `spacing?: "default" \| "compact"` (`mb-12` / `mb-8`). |
| Motion infrastructure | `scroll-reveal.tsx`, `floating-particles.tsx`, `mouse-glow.tsx`, `typewriter.tsx`, `viewport-video.tsx` | `ScrollReveal` = `IntersectionObserver` fade/translate, 4 directions, `once` by default. `FloatingParticles` = client-only randomized dots (generated inside `requestAnimationFrame` to avoid a previously-fixed hydration mismatch), paused on `visibilitychange`. `ViewportVideo` = `useSyncExternalStore` reduced-motion detection + IO-gated playback. `globals.css` has a comprehensive `prefers-reduced-motion: reduce` block that disables every `animate-*` and `scroll-reveal*` class. |

**Assessment:** the token layer and motion infrastructure are genuinely good and need no replacement. Everything this proposal requires can be built on them. The problem is exclusively at the composition layer.

### 1.2 Page-by-page

**Homepage** — `src/app/(public)/page.tsx`

- **Hero**: `min-h-[90vh]`, `pb-44 md:pb-36`. Background = `.bg-grid` at 40% + `.bg-glow` + `FloatingParticles count={18}` + two large blurred radial divs. Content in a single left-aligned `max-w-4xl` column: Sharif badge → 2-line `h1` (from the `home_title` setting, alternating `text-gradient` / `text-gradient-accent`) → typewriter description → 4 CTAs (View CV, Email me, GitHub, LinkedIn) → availability line. A separate `absolute bottom-8 inset-x-0` block holds "Scroll to explore" + `ArrowDown` (`.animate-scroll-nudge`) + 5 jump links.
- **Research Interests** (`#research-interests`): 3 hardcoded cards — Primary Focus / Current Focus / Related Areas — each a lucide icon (`Target`/`Compass`/`Network`) + label + one sentence.
- **Current Research** (`#current-research`): DB-driven from the `research_directions` setting. Currently 2 entries. Each renders title + paragraph + tag pills + optional link.
- **Technical Foundations** (no `id`): renders `<TechnicalFoundations />`.
- **About Preview** (`#about-preview`) and **Contact CTA** (`#contact-cta`): simple text + buttons.

**Technical Foundations** — `src/components/content/technical-foundations.tsx`. Two tiers, both plain card grids. *Core Research Foundations* (4 cards, `sm:grid-cols-2`): Blockchain Systems & Scalability; Protocol & Blockchain Security; Cryptographic Mechanisms; Formal & Security Analysis. *Engineering & Computational Toolkit* (3 smaller muted cards): Blockchain Engineering; Programming & Infrastructure; AI & ML Systems. Each card is a mono uppercase heading plus `name` / `examples` pairs. **The same component is reused on `/about` under a "Skills" heading.**

**Projects** — list at `src/app/(public)/projects/page.tsx` (tag filter + `md:grid-cols-2 lg:grid-cols-3` of `ProjectCard`). `ProjectCard` = a generic `FolderGit2` icon chip, year, role badge, `line-clamp-2` title, `line-clamp-3` summary, up to 6 tech badges with a `+N` overflow, and a Repo/Demo/Case Study footer row. Detail pages (`[slug]/page.tsx`) render numbered prose sections from the Prisma fields **Problem, Approach, Architecture, Challenges, Results, Retrospective**.

**Experience** — `src/app/(public)/experience/page.tsx`, anchors `#education`, `#research-assistance`, `#teaching-assistance`, `#experience`. Contains real, verifiable CV content including a supervisor link and a named collaborator.

**About** — `src/app/(public)/about/page.tsx`. Narrative bio + portrait (`/about/now.jpg`), then "Along the way": graduation photo → transition paragraph → `ViewportVideo` clip. Ends with a `#skills` block reusing `TechnicalFoundations`.

**Nav** — `src/components/layout/nav.tsx`: fixed, transparent → `.glass` after 20px scroll, gradient wordmark, pill links, gradient CV button. **Footer** — `src/components/layout/footer.tsx`: `.bg-grid` at 30%, 3 columns, tagline `Security · Cryptography · Blockchain · Distributed Systems`.

### 1.3 Actual content available (this constrains every honest design decision)

Read directly from the database.

**Research directions** (`research_directions` setting) — exactly two:
1. *Secure and Scalable Cross-Chain & Layer-2 Interoperability* — "security, scalability, atomicity, and verification challenges in cross-chain and cross-rollup protocols." Tags: Blockchain Security, Cross-Chain, Layer 2, Distributed Systems.
2. *Ethereum Mempool Security and Asymmetric DoS* — "denial-of-service attacks against Ethereum transaction pools through controlled and reproducible experiments." Tags: Ethereum, Security, Mempool, DoS, Systems. Links to `/projects/brcc-lab`.

**Projects** — exactly three, all real:
1. **ZK-Mixer: Regulated Anonymous Payments** (2026) — Zerocash POUR protocol, regulatory-compliant disclosure, tiered auditor access. Stack includes zk-SNARK, Merkle Tree, Python/FastAPI.
2. **Ethereum CLI (Sepolia Testnet)** (2025) — encrypted wallet management, balance queries, transfers, history export. JSON-RPC, Etherscan API, eth-account.
3. **BRCC: Besu Research Control Center** (2025) — local control plane for reproducible mempool/DoS experiments on a **4-validator Hyperledger Besu QBFT network**, with Prometheus/Grafana.

**This is the single most important finding in the audit.** The content is already unusually diagram-shaped:

| Content | Natural diagram |
|---|---|
| Cross-chain / cross-rollup interop | source rollup → message + proof → verification → destination rollup, settling to L1 |
| Mempool security / asymmetric DoS | tx arrival → mempool → P2P propagation → validator → block, with an adversarial flood path |
| ZK-Mixer | commitment → Merkle tree → proof → verifier → withdrawal |
| BRCC | tx generator → node mempool → 4 QBFT validators → block |
| Ethereum CLI | encrypted wallet → JSON-RPC → Sepolia |

Every one of these is a *truthful* schematic of work that actually exists. No invention is required to make this site look like a blockchain researcher's site. The previous proposal's timidity was not forced by the content — the content was always strong enough.

### 1.4 Why the site currently reads as generic

1. **Every section is the same object.** Hero, Research Interests, Current Research, Technical Foundations, About Preview — all are "heading + grid of bordered rounded cards." There is no structural variation to signal what kind of information is being presented.
2. **The only visual content is text.** Nothing on the site is a diagram. A visitor scanning without reading sees rectangles.
3. **The hero's visual weight is spent on ambience.** `FloatingParticles`, two blurred radial glows, and a grid produce mood, not meaning. They would be equally at home on a fintech landing page.
4. **The research topics — the most distinctive thing about the site — are rendered in the most generic component available** (a tag-pill card).
5. **Icon vocabulary is off-domain.** `FolderGit2`, `Target`, `Compass`, `Network` are stock lucide glyphs that say "software" and "generic tech," not "protocols."

---

## 2. New Visual Identity Goal

Within 3–5 seconds of loading the homepage, a visitor must conclude: *this person works on blockchain protocols, their security, and their scalability.* They should reach that conclusion from the **shape of the page**, before reading a full sentence.

Six principles, each written to be falsifiable at review time:

1. **Structure carries the identity, decoration supports it.** If removing every small glyph would make the site look generic again, the design has failed.
2. **Every diagram depicts something real.** Each schematic must be traceable to a specific research direction or project that already exists in the database. No invented systems, no invented results.
3. **Diagrams are content, not background.** They are legible, labeled, and sized to be read — not 12%-opacity texture.
4. **One coherent drawing language.** Every diagram at every scale shares stroke weight, node vocabulary, boundary style, arrowheads, label typography, and state colors. A visitor should recognize the hero schematic and a project thumbnail as the same system.
5. **Restraint is a feature, not timidity.** Thin strokes, generous negative space, mono labels, dark ground. The reference is a well-set systems paper or an architecture diagram in a good technical book — not a product landing page.
6. **Sections that should stay human, stay human.** About and Experience get no protocol diagrams. Their credibility comes from being plain.

**Explicitly not the target:** exchange/trading UI, token marketing, NFT gallery aesthetics, neon-on-black "Web3" styling, coin logos, animated price tickers, glassmorphic hype cards, fake live chain data.

---

## 3. Personalized Blockchain Research Identity

The design must express *this* researcher, not blockchain-in-general. Priority is set by what the site can actually substantiate.

**Tier 1 — the two active research directions. These get the most visual investment.**

- **Cross-chain / cross-rollup interoperability.** Source chain, destination chain, message passing, state verification, bridge trust assumptions, atomic cross-rollup execution, settlement to L1.
- **Mempool security / asymmetric DoS.** Transaction arrival, transaction pool, P2P propagation, validator selection, block inclusion, resource exhaustion under adversarial load.

**Tier 2 — the three real projects.** ZK-Mixer (commitment → Merkle → proof → verifier), BRCC (4-validator QBFT mempool lab), Ethereum CLI (wallet → JSON-RPC → Sepolia).

**Tier 3 — declared foundations** (already listed in Technical Foundations, so fair to depict at low specificity): L1 consensus/sharding/fault tolerance; L2 rollups/payment channels/state channels; smart-contract and bridge security; ZK proofs, commitments, Merkle structures; formal reasoning about safety, liveness, atomicity; engineering in Ethereum/EVM, Solana/Anchor, Hyperledger Besu/QBFT.

**Truthfulness rule.** Tier-1 and Tier-2 diagrams may be specific and labeled because real work backs them. Tier-3 visuals must stay abstract — depicting a rollup's settlement path is fine as an illustration of a *concept listed under Technical Foundations*; presenting it as a system this researcher built is not. No diagram may carry a caption implying an unpublished result.

---

## 4. Signature Visual Language

One drawing system, three scales. Everything below is expressible in inline SVG + CSS.

### 4.1 Drawing grammar

| Element | Specification |
|---|---|
| Stroke weight | `1px` structural edges; `1.5px` emphasis/active paths; `2px` only for a boundary that must dominate. Never heavier. |
| Node — participant | Circle, `r≈4`, filled at 50–60% accent alpha (validator, peer, party). |
| Node — system/component | Rounded rect, `rx≈3`, 1px stroke, near-transparent fill (mempool, verifier, contract). |
| Block | Square-ish rounded rect, `rx≈2.5`. Sealed = solid subtle fill; open/pending = dashed stroke. |
| Edge — structural | 1px, 15–25% alpha, no arrowhead. |
| Edge — directed flow | 1px, 35–50% alpha, small open chevron arrowhead (never a filled triangle). |
| Edge — proof/verification path | 1px dashed (`4 3`), 45% alpha, terminating in a state marker. |
| Trust boundary | Vertical/horizontal dashed rule (`3 3`), `coral` at 35–40%, always labeled in mono when it appears at meso or macro scale. |
| Layer band | Full-width horizontal region with a 1px top rule at 12% alpha and a mono uppercase label in the left margin. |
| Labels | JetBrains Mono, `10–11px`, `uppercase tracking-wider`, `text-ash` for structural labels; `text-mist` when the label is content. Never inside a node — always adjacent. |
| State markers | verified = check + `emerald`; pending = dashed ring + `amber`; failed/adversarial = ✕ or broken edge + `coral`. Shape always accompanies color. |
| Corner radius | Matches the site's existing `rounded-xl` language at container level; diagram internals use small radii (2–3px) so they read as schematic, not as UI. |

### 4.2 Three scales

**MICRO (16–28px)** — inline state and type indicators. A verified/pending marker beside a status line; a 3-node motif marking a card's category; a layer tick in a section label. *Supporting detail only — never the primary carrier of identity.*

**MESO (120–320px wide, 80–160px tall)** — the workhorse. Project architecture strips, research-card schematics, verification flows. Legible, labeled, sits inside an existing card or panel. This is the scale that will appear most often.

**MACRO (full-column or half-viewport)** — the hero topology, the research map, the technical stack. One per section at most, and only in the four sections named in §17.

All three scales use the identical grammar from §4.1. That shared grammar — not any single drawing — is the signature.

### 4.3 Component family

```
src/components/diagrams/
  primitives/          — Node, Block, Edge, ProofPath, TrustBoundary,
                         LayerBand, DiagramLabel, StateMarker
  schematics/          — CrossRollupTopology, MempoolPipeline,
                         ZkProofFlow, ValidatorSet, SettlementStack
  ProtocolDiagram.tsx  — shared frame: viewBox, responsive sizing,
                         reduced-motion + in-view gating, a11y wiring
```

Schematics compose primitives; pages compose schematics. No page ever draws raw SVG. This is what keeps the language coherent as the site grows.

---

## 5. Hero Redesign — Options

The hero is the highest-leverage surface on the site and currently the least distinctive. Five options were considered.

**Constraints that hold for every option:** the `h1` must remain fully legible at its current weight; the CTA row must remain unobstructed and tappable; the "Scroll to explore" block plus jump links must remain clear (this region previously had an overlap bug — it must not regress); mobile must not become taller or busier than it is today.

### Option A — Cross-rollup verification topology (editorial split)

Two-column composition. Left: badge, title, description, CTAs, availability. Right: a labeled MACRO schematic of a cross-rollup message being verified and settled.

```
   ROLLUP A                         ROLLUP B
   ┌───────────┐                   ┌───────────┐
   │ ▪ ▪ ▪ ▪   │ ══ message ═══▶   │   ▪ ▪ ▪ ▪ │
   └─────┬─────┘   + proof         └─────┬─────┘
         │            ┊ verify           │
         │         ╭──▼──╮               │
         │         │  ✓  │               │
         │         ╰──┬──╯               │
         └────────────┼──────────────────┘
                   settlement
              ┌────────▼────────┐
              │   L1  ▪▪▪▪▪▪    │  consensus
              └─────────────────┘
```

- **Pros:** it is literally research direction #1. Instantly and specifically blockchain. Reuses at meso scale on the Current Research panel. Highest identity payoff of any option.
- **Cons:** requires restructuring the hero from one column to two; the diagram must be carefully composed to look designed rather than clip-art.
- **Risk:** medium. **Impact:** highest.

### Option B — Layered protocol stack

The hero background becomes a set of labeled horizontal bands (Applications → Interoperability → L2 / Rollups → L1 / Consensus → Cryptographic Foundations), with the title sitting across them.

- **Pros:** strong architectural feel; ties directly to the Technical Foundations redesign; degrades gracefully on mobile.
- **Cons:** competes with text for the same vertical space, so bands must be very low contrast — which pushes back toward the failure mode of the previous proposal. Also duplicates §8's stack, weakening both.
- **Risk:** medium. **Impact:** medium.

### Option C — Distributed protocol graph

Multiple clusters (networks/rollups) with bridges, validator nodes, and proof paths across the full hero.

- **Pros:** visually rich; unmistakably distributed-systems.
- **Cons:** at hero scale it becomes a decorative constellation — the failure mode the user explicitly rejected. Hard to keep meaningful at low opacity, hard to keep readable at high opacity.
- **Risk:** medium-high. **Impact:** medium.

### Option D — Protocol state machine

`transaction → state → verification → finalized`, rendered as a horizontal state flow beneath or beside the title.

- **Pros:** clean, conceptually elegant, compact, animates naturally.
- **Cons:** generic across all of blockchain — it does not say *this researcher*. Better deployed at meso scale inside Current Research.
- **Risk:** low. **Impact:** low-medium.

### Option E — Technical editorial composition

Large research title on one side, a high-quality custom diagram on the other, with mono metadata rails.

- **Note:** this is a *composition strategy*, not a diagram choice. It is fully compatible with A.

### Ranking and selection

**A > B > D > C.** Option E is adopted as the composition for A.

**Recommended: Option A rendered in Option E's editorial composition.**

Hero becomes a two-column editorial layout (`lg:grid-cols-[1.05fr_0.95fr]`, stacking below `lg`): text column left, `CrossRollupTopology` schematic right, inside a subtle bordered panel with a mono caption rail reading e.g. `CROSS-ROLLUP MESSAGE VERIFICATION · RESEARCH DIRECTION`. The existing background layers are reduced — `FloatingParticles` is removed, `.bg-grid` and one glow are retained — because the schematic now provides the visual interest that ambience was standing in for. Below `lg` the schematic moves beneath the CTAs at reduced complexity, or is dropped entirely if measurement shows the hero growing too tall (§14).

Title, CTAs, availability line, scroll guide, and jump links are all preserved. The diagram occupies a column that is currently empty whitespace, so it costs no vertical height on desktop.

---

## 6. Research Interests Redesign — The Research Map

**Current:** three equal cards (Primary / Current / Related Focus) with stock lucide icons. They read as a generic "what I do" list and waste the strongest question the section could answer.

**Proposed: a single MACRO "research map"** — a connected diagram, not a card row, that answers *what is this person's research world?* in one visual scan.

```
                    SECURITY & SCALABILITY OF
                     DECENTRALIZED SYSTEMS
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   CROSS-CHAIN /          LAYER 2 /            PROTOCOL
   INTEROPERABILITY       ROLLUPS              SECURITY
        │                     │                     │
   state verification    settlement          threat models
   atomic execution      scalability         mempool / DoS
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
              APPLIED CRYPTOGRAPHY · FORMAL METHODS
                    (shared foundations)
```

- Three branches, derived from the existing three entries so no content is invented: the *Primary Focus* line becomes the root, *Current Focus* supplies the branches, *Related Areas* becomes the shared foundation band.
- Nodes carrying real depth (cross-chain, L2, protocol security) are `cyan`; the foundation band is `indigo`; leaves are mono `text-mist`.
- **Hover/focus** highlights one branch root-to-foundation at full opacity and drops the others to ~35%. This is the section's one interaction and it is genuinely informative.
- **Mobile:** collapses to three stacked branch groups sharing one vertical spine, with the foundation band as a labeled footer rule — a vertical outline, not a scaled-down tree.

This section becomes the second-strongest identity surface after the hero, and it is honest: it is a map of stated interests, not a claim of results.

---

## 7. Current Research Redesign — Research Case Studies

**Current:** two cards of title + paragraph + tag pills. This is the site's most important content rendered in its most generic component.

**Proposed:** full-width research panels, one per direction, each pairing a MESO schematic with structured research metadata.

```
┌──────────────────────────────────────────────────────────────┐
│ RESEARCH DIRECTION 01                          [ACTIVE]      │
│                                                              │
│  Secure and Scalable Cross-Chain &     ┌──────────────────┐  │
│  Layer-2 Interoperability              │                  │  │
│                                        │   [schematic]    │  │
│  QUESTION                              │  A ═▶ proof ═▶ B │  │
│  How can state and execution move      │       │          │  │
│  securely across rollups?              │       ▼ L1       │  │
│                                        └──────────────────┘  │
│  FOCUS                                                       │
│  State verification · Atomic execution · Scalability         │
│                                                              │
│  Blockchain Security  Cross-Chain  Layer 2  Distributed Sys  │
└──────────────────────────────────────────────────────────────┘
```

- **Direction 01 — Cross-chain / L2:** `CrossRollupTopology` at meso scale (the hero schematic's smaller sibling — the repetition is the point).
- **Direction 02 — Mempool security:** `MempoolPipeline` — `tx arrival → mempool → P2P propagation → validator → block`, with the adversarial flood path marked in `coral` and a labeled trust boundary. Retains its existing "View BRCC lab" link.
- **QUESTION** and **FOCUS** are new labeled fields. The *Question* line must be written by the site owner (or derived verbatim from the existing description) — this document does not invent research questions. The *Focus* line can be derived from existing tags.
- Two panels stacked full-width, not a 2-up grid: each gets room for a legible diagram, and two panels do not need a grid.
- **Data note:** `research_directions` is a JSON setting parsed by `src/lib/home/hero.ts`. Adding optional `question` and `focus` fields is a parser + admin-form change, **not** a database migration. If a direction omits them, the panel renders without those rows.

---

## 8. Technical Foundations Redesign — Protocol Stack

**Current:** two plain card grids, reused verbatim on `/about`.

**Key observation from the audit:** the four Core Research Foundations *are already a stack* — they were simply rendered as a grid, which discards that meaning.

```
  L1 / L2 / SCALABILITY   ▏ Sharding · Consensus · Fault Tolerance
                          ▏ Rollups · Payment · State Channels
  ────────────────────────▏──────────────────────────────────────
  PROTOCOL SECURITY       ▏ Mempool · Smart Contract · Bridge
  ────────────────────────▏──────────────────────────────────────
  CRYPTOGRAPHIC           ▏ ZK Proofs · Commitments · Merkle
  MECHANISMS              ▏ Privacy-Preserving Protocols
  ────────────────────────▏──────────────────────────────────────
  FORMAL & SECURITY       ▏ Adversary Models · Safety · Liveness
  ANALYSIS                ▏ Protocol Properties · Guarantees
```

**Proposed:** a layered architecture band per category — a left rail with the layer name in mono uppercase, a hairline rule, and the areas laid out horizontally in the body. Systems sit above security, which sits above cryptography, which sits above formal analysis — i.e. the stack reads as an actual architecture rather than an arbitrary 2×2.

- Each band carries a MICRO motif in its rail (block sequence / trust boundary / Merkle converge / invariant path) — supporting detail, not the mechanism.
- Hovering a band raises its rule to full accent and lifts its rail label. No layout shift.
- **Engineering & Computational Toolkit stays a plain muted grid.** The contrast between "layered research stack" and "flat toolkit grid" is deliberate and does real work: it visually separates research identity from implementation skills.
- **`/about` reuse:** the same component appears under `#skills`. Either accept the stack there (it works — it is still a skills summary), or add a `variant="compact"` prop rendering the current grid on About. Recommend accepting the stack, for consistency.
- **Alternatives considered and rejected:** an interactive systems map (duplicates §6's research map); a technical matrix (too dense, poor mobile); an expandable tree (hides content behind interaction on a section whose job is fast scanning).

---

## 9. Projects Redesign — Architecture-First Presentation

**Current:** every project card opens with the same `FolderGit2` icon. Three genuinely different systems look identical.

**Proposed — card level:** replace the generic icon chip with a **MESO architecture strip** across the top of each card: a compact, labeled schematic of that project's actual data flow.

| Project | Strip |
|---|---|
| ZK-Mixer | `deposit → commitment → Merkle tree → proof → verifier → withdrawal` |
| BRCC | `tx generator → mempool → 4× QBFT validator → block` |
| Ethereum CLI | `encrypted wallet → JSON-RPC → Sepolia` |

Each is drawn from the project's real summary and tech stack. Nothing is invented.

- The strip is a fixed-height band (≈64–72px) at the card's top edge, so **all cards keep equal height** — preserving the `line-clamp` / `MAX_VISIBLE_TECH` discipline already in `ProjectCard`.
- Beneath it, the existing metadata row (year, role badge) continues unchanged.
- A small **classification chip** — `RESEARCH INFRASTRUCTURE`, `CRYPTOGRAPHIC PROTOCOL`, `TOOLING` — replaces nothing but adds a scannable axis. Values must be author-assigned, not inferred.
- **Fallback:** a project with no meaningful architecture keeps a plain accent band rather than a forced diagram. Better a neutral card than a fake schematic.

**Proposed — detail page:** the `architecture` prose section already exists in the Prisma model and is already rendered. Pair it with a **MACRO version of the same schematic**, drawn larger and more fully labeled. The card strip becomes a recognizable thumbnail of the detail-page diagram — the same repetition that makes the hero/Current Research pairing work.

**Implementation note:** schematic selection should be an explicit author decision (a `schematic` key on a small per-slug map in code, or an optional admin field) rather than inferred from tags. With three projects, a code-level map is the lazy correct answer; revisit only if the project count grows substantially.

---

## 10. Global Background / Section Architecture

The goal is a coherent technical grammar, **not more decoration**, and specifically not more vertical space — the homepage's `pt-14 pb-14 md:pt-20 md:pb-20` tightening must be preserved.

- **Section index rail (recommended).** A thin left-margin rail on the homepage carrying mono section indices — `01 RESEARCH MAP`, `02 CURRENT RESEARCH`, `03 FOUNDATIONS`. Zero added height (it lives in existing gutter space), strongly technical-editorial, and doubles as a reading-position cue. Hidden below `lg`.
- **Section boundaries as protocol transitions (recommended, restrained).** Replace the current identical section gaps with a hairline rule plus a small mono label at the section's start. No decorative dividers, no added padding.
- **Background zoning (recommended).** Alternate `.bg-grid` and `.bg-grid-fine` between adjacent sections at very low alpha so sections feel like distinct regions of one system. Costs nothing.
- **Rejected:** animated dividers, full-bleed decorative separators, per-section illustrations, anything that adds height.

---

## 11. Navigation and Footer

**Nav — recommended, minimal.** On the homepage, add a compact section-progress indicator to the nav: small mono index ticks that mark the active section as the visitor scrolls (`IntersectionObserver`, reusing the existing scroll listener). It reads as a protocol-state readout, adds real navigational value, and is not gimmicky. **Rejected:** animated topology in the nav bar, a live "block height," any decorative chrome.

**Footer — recommended, restrained.** Replace the flat tagline `Security · Cryptography · Blockchain · Distributed Systems` with a compact **research stack signature**: the same four layer names from §8 as a single-line horizontal stack with hairline separators. It closes the page with the same structure that opened it. **Rejected:** fake block heights, fake hashes, fake sync status, any simulated chain data.

---

## 12. About and Experience Boundaries

**Both sections stay free of protocol diagrams.** This is a firm rule, not a default.

- **About** is deliberately human — portrait, graduation photo, video, first-person narrative. A protocol schematic here would undercut the section's entire purpose. Its only tie to the site's identity is the shared `TechnicalFoundations` block under `#skills`.
- **Experience** contains credential-grade claims (a named supervisor with a real Scholar link, a named collaborator, real TA history). Decorating verifiable credentials with diagrams risks reading as inflation. Keep it typographic.

**What these pages *do* get:** the shared frame — nav, footer, section-label typography, background zoning, spacing. They belong to the same site through consistent chrome, not through diagrams.

---

## 13. Motion System

Motion must depict something that actually happens in the depicted system. Every animation is one-shot or interaction-driven. **No perpetual ambient motion anywhere.**

| Animation | Trigger | Duration | Repeat | Reduced motion |
|---|---|---|---|---|
| Hero: message traverses A → proof → B → settles to L1 | On mount, once | ~2.2s total, staggered | Once, then rests in final state | Renders final state immediately |
| Research map: branch highlight | Hover / focus | 200ms | — | Instant, no transition |
| Current Research: schematic flow reveal | First scroll into view (`ScrollReveal`, `once`) | ~1.2s | Once | Final state immediately |
| Project card strip: path highlight | Hover / focus | 200ms | — | Instant |
| Nav section indicator | Scroll position | 150ms | — | Instant |
| Technical Foundations: band rule emphasis | Hover / focus | 200ms | — | Instant |

**Rules.** Any looping animation must stop when off-screen (`IntersectionObserver`) — but the design intentionally contains none. Hover-only behaviour must have a non-hover equivalent on touch (§14). Reduced motion is honoured via the existing `useSyncExternalStore` pattern from `viewport-video.tsx` *and* the `globals.css` reduced-motion block. **Prohibited:** continuous node drift, parallax, perpetual particles, looping "transaction" dots, background animation with no referent, WebGL/Canvas.

**Canvas/WebGL:** not justified. Every schematic here is well under a few hundred SVG nodes and static after its one-shot reveal. Introducing a renderer would add dependency and accessibility cost for no benefit.

---

## 14. Responsive Strategy

Mobile gets purpose-built representations, not scaled-down desktop diagrams.

| Component | Desktop | Mobile (`< sm` / `< lg` as noted) |
|---|---|---|
| Hero schematic | Right column, full topology, labeled | Below `lg`: simplified vertical flow (A → proof → B → L1) beneath the CTAs, ~40% fewer elements. Below `sm`: dropped entirely if the hero exceeds its current height. Text always wins. |
| Research map | Three-branch horizontal tree | Vertical spine with three stacked branch groups; foundation band becomes a labeled footer rule |
| Current Research panels | Side-by-side text + schematic | Stacked: heading → schematic → question → focus → tags. Schematic keeps one main path, drops secondary detail |
| Technical Foundations stack | Rail + horizontal band body | Rail label sits above its band; areas wrap to two lines |
| Project card strip | Full architecture strip | Retains one primary path; intermediate nodes collapse |
| Section index rail | Visible in gutter | Hidden |
| Nav section indicator | Visible | Hidden (mobile menu already handles navigation) |

**Touch rule.** Every hover-driven state (research-map branch highlight, card strip highlight, stack band emphasis) must either render its informative state by default on touch devices or be dropped there. No information may be reachable only via `:hover`.

---

## 15. Accessibility and Performance

**Accessibility**

- Decorative schematics carry `aria-hidden="true"`. Where a diagram conveys information not present in adjacent text (the research map is the likely case), it gets `role="img"` and a concise `aria-label`, or an adjacent visually-hidden text equivalent listing the branches.
- **Color is never the sole signal.** Verified/pending/failed always pair color with shape (check / dashed ring / ✕). Trust boundaries are always labeled, not merely coral.
- Interactive diagram elements (research-map branches) must be real focusable controls with visible focus rings, keyboard-operable, and in a sensible tab order. If a branch cannot be made properly keyboard-operable, it ships non-interactive.
- Label contrast: mono labels must clear 4.5:1 against their actual background. `text-ash` (`#7B8794`) on `void` needs checking at 10–11px and may need to move to `text-mist`.
- Hero title contrast must be re-verified against whatever sits behind it after the background layers change.

**Performance**

- Inline SVG + CSS only. **No new dependency.** Reuse `ScrollReveal`, the `useSyncExternalStore` reduced-motion pattern, and existing `@keyframes` infrastructure.
- Budget: MICRO < 20 SVG nodes; MESO < 60; MACRO < 200. Schematics are static after their one-shot reveal, so steady-state cost is zero.
- **No layout shift.** Every diagram gets an explicit `viewBox` and a reserved aspect ratio. The hero diagram occupies a currently-empty column; card strips are fixed-height.
- No decorative raster assets, no runtime data fetching for visuals.
- Diagram components are server-rendered where static; only genuinely interactive ones (`"use client"`) ship JS.

---

## 16. Design System Components

| Component | Scale | Purpose |
|---|---|---|
| `ProtocolDiagram` | frame | Shared viewBox/responsive/a11y/reduced-motion wrapper. Everything renders inside it. |
| `Node`, `Block`, `Edge`, `ProofPath`, `TrustBoundary`, `LayerBand`, `StateMarker`, `DiagramLabel` | primitives | The §4.1 grammar, as code |
| `CrossRollupTopology` | macro + meso | Hero and Current Research 01 |
| `MempoolPipeline` | macro + meso | Current Research 02, BRCC project |
| `ZkProofFlow` | meso | ZK-Mixer card and detail page |
| `ValidatorSet` | meso | BRCC (4× QBFT), L1 depiction inside the hero |
| `SettlementStack` | macro | Technical Foundations layered stack |
| `ResearchMap` | macro | Research Interests section |
| `SectionIndexRail` | chrome | Homepage gutter rail |
| `NavSectionIndicator` | chrome | Nav scroll-position readout |

Each schematic exposes `scale: "meso" | "macro"` and `animate?: boolean` so the same component serves both its card and its full-size placement — which is precisely what makes the motif recognizable across the site.

---

## 17. Priority Plan

**P0 — these define the identity. Without them the redesign has not happened.**

1. **Diagram primitive + frame layer** (§4.3, §16) — prerequisite for everything else.
2. **Hero redesign** (§5, Option A in E's composition) — the single highest-impact change on the site.
3. **Research Map** (§6) — replaces the weakest section with the second-strongest identity surface, and sits immediately below the hero so the top of the page is coherent.
4. **Technical Foundations → protocol stack** (§8) — converts the largest block of research content from a grid into an architecture.

**P1 — substantial reinforcement, clearly worth doing, but the identity survives without them.**

5. **Current Research case-study panels** (§7) — highest content value of the P1 set; requires the small `question`/`focus` parser + admin addition.
6. **Project architecture strips** (§9, card level) — makes three real systems look like three different systems.
7. **Section index rail + background zoning** (§10).

**P2 — polish once the above are live.**

8. Project detail-page macro schematics (§9).
9. Nav section indicator (§11).
10. Footer research-stack signature (§11).
11. Micro state indicators in remaining surfaces (§4.2).

**Not recommended — do not build.**

- Any protocol diagram on About or Experience (§12).
- Fake chain data of any kind: block heights, transaction hashes, sync status, "live" metrics (§2).
- Canvas/WebGL for any component in this document (§13).
- Perpetual ambient background animation, including a revived particle field (§13).
- Coin/token logos, exchange or trading UI patterns, price/candlestick motifs (§2).
- Full-bleed decorative section dividers that add vertical height (§10).
- Tag-inferred automatic project schematics — author-assigned only (§9).

---

## 18. Three Levels of Redesign Intensity

### Level A — Moderate

*Recognizable blockchain identity, layouts largely preserved.*

- **Scope:** primitives layer; meso schematics added to Current Research cards and project cards; a modest hero diagram that does not restructure the hero.
- **Files:** `src/components/diagrams/*` (new), `project-card.tsx`, homepage Current Research block, hero background layer.
- **Complexity:** low-medium. **Effort:** ~1 focused session. **Risk:** low. **Performance:** negligible.
- **Visual impact:** *moderate.* Before/after screenshots would differ noticeably but the page architecture would be unchanged — same hero shape, same card grids.
- **Verdict:** a meaningful improvement over today, but it leaves the two weakest sections (Research Interests, Technical Foundations) generic, and the hero still reads as a standard portfolio hero. **Not sufficient for the stated goal.**

### Level B — Strong

*Significant custom layouts and real protocol visualisation.*

- **Scope:** Level A, plus hero restructured to the editorial split with a macro topology; Research Interests replaced by the Research Map; Technical Foundations converted to the protocol stack; Current Research becomes case-study panels.
- **Files:** all of Level A, plus `src/app/(public)/page.tsx` (hero + two sections), `technical-foundations.tsx`, `src/lib/home/hero.ts` (+ admin form) for `question`/`focus`.
- **Complexity:** medium-high. **Effort:** ~3–4 sessions. **Risk:** medium — concentrated in the hero (contrast, mobile height, scroll-guide clearance).
- **Performance:** still trivial — all static SVG, no dependency.
- **Visual impact:** *high.* The top two screens of the homepage are unrecognisable versus today.
- **Verdict:** achieves the stated goal for the homepage. Leaves projects and site chrome comparatively generic.

### Level C — Signature

*A distinctly architected academic blockchain-research site.*

- **Scope:** Level B, plus project architecture strips and detail-page macro schematics; section index rail and background zoning; nav section indicator; footer research-stack signature; the full three-scale component family applied consistently.
- **Files:** all of Level B, plus `projects/page.tsx`, `projects/[slug]/page.tsx`, `nav.tsx`, `footer.tsx`, `container.tsx` / section-label components.
- **Complexity:** high. **Effort:** ~6–8 sessions, sequenced. **Risk:** medium — mostly accumulated surface area and consistency maintenance, not any single hard problem. Chrome changes (nav/footer) touch every page and need broad regression checking.
- **Performance:** still fine; the discipline that matters is component reuse, not runtime cost.
- **Visual impact:** *highest.* Every page carries the identity; the motif is recognisable across hero, research, foundations, and projects.
- **Verdict:** this is what "the personal site of a blockchain systems researcher" looks like.

### Recommendation: **Level C, sequenced — with Level B as the committed first milestone.**

Reasoning:

1. **The content genuinely supports it.** Two research directions and three projects all have real, truthful schematics. Level C is not padding — it is rendering content that already exists.
2. **The site is small.** One homepage, three projects, four content pages. Level C's surface area is modest in absolute terms; the same scope on a large site would be unrealistic.
3. **The stated preference is Strong-to-Signature**, and Level B alone leaves projects — a third of the site's substance — visibly generic, which would read as an unfinished redesign.
4. **Sequencing removes most of the risk.** P0 (Level B's core) ships and is reviewed before P1/P2 extend it. If the direction proves wrong at the hero, it is caught before nav, footer, and project pages are touched.
5. **The guardrail that keeps Level C credible:** the signature is *concentrated*. Four surfaces carry it — hero, research map, foundations stack, projects. About, Experience, CV, and Contact stay deliberately plain. A site that is intense everywhere is a marketing site; a site that is intense exactly where the research lives is a research site.

---

## 19. Implementation Roadmap

**Phase 1 — Foundations (P0.1)**
`src/components/diagrams/primitives/*`, `ProtocolDiagram` frame, drawing-grammar tokens. No page changes. Verified by rendering a private preview of every primitive.

**Phase 2 — Hero (P0.2)**
`CrossRollupTopology` (macro + meso). Restructure the hero to the editorial split. Remove `FloatingParticles` from the homepage — **retain the component**, it is still exported and unit-tested. Highest-scrutiny phase: contrast, mobile height, scroll-guide clearance.

**Phase 3 — Research Map (P0.3)**
`ResearchMap`; replace the three-card Research Interests block. Branch interaction with real keyboard support.

**Phase 4 — Technical Foundations (P0.4)**
`SettlementStack`; convert the Core tier to layered bands; leave the Engineering tier as a grid. Verify the `/about` `#skills` reuse.

*→ Level B complete. Review before continuing.*

**Phase 5 — Current Research panels (P1.5)**
`MempoolPipeline`; case-study panels; extend `src/lib/home/hero.ts` and the settings admin form with optional `question` / `focus`. No DB migration.

**Phase 6 — Project architecture strips (P1.6)**
`ZkProofFlow`, `ValidatorSet`; per-slug schematic map; card strips at fixed height.

**Phase 7 — Section architecture (P1.7)**
Section index rail, background zoning, section-boundary labels.

**Phase 8 — Chrome and detail pages (P2)**
Nav section indicator, footer research stack, project detail macro schematics, remaining micro indicators.

**Standing constraints for every phase:** no new dependency; no Prisma migration; no change to global color tokens, fonts, or `Section` default spacing; About and Experience untouched; `FloatingParticles` retained in the repository.

---

## 20. Acceptance Criteria

Per phase, all must pass:

- [ ] Desktop screenshot review of the real rendered page (not the component in isolation)
- [ ] Mobile screenshot review at a real narrow viewport (390px), including the mobile-specific representation from §14
- [ ] `prefers-reduced-motion: reduce` verified — every diagram renders in its final state, no motion
- [ ] Touch equivalence verified — no information reachable only via `:hover`
- [ ] Keyboard traversal of every interactive diagram element, with visible focus rings
- [ ] Contrast: hero title and all mono diagram labels measured against their actual backgrounds (≥4.5:1 for text)
- [ ] No layout shift; hero and card heights measured before/after
- [ ] Hero scroll-guide and jump-link region confirmed clear of any diagram element
- [ ] No new dependency in `package.json`; no Prisma migration in the diff
- [ ] Browser console clean — no new errors or warnings
- [ ] `npm run lint && npm run typecheck && npm test && npm run build` all pass
- [ ] `git diff --stat` reviewed to confirm no unrelated file was touched

**Per-phase visual bar:** a before/after screenshot pair must be *obviously* different at a glance. If a reviewer has to hunt for the change, the phase has reproduced the failure of the previous proposal and should be reworked rather than accepted.

---

## Final Recommended Direction

**1. What does the hero look like?**
A two-column technical-editorial composition. Left: the existing badge, title, description, CTAs, and availability line, unchanged in content. Right: a labeled cross-rollup verification schematic — Rollup A sends a message with a proof, a verifier confirms it, Rollup B accepts, and the result settles to an L1 validator set — with a mono caption rail identifying it as a research direction. Ambient particles are gone; the grid and a single glow remain. On load, one message traverses the path once and the diagram rests.

**2. What makes the site visibly blockchain-specific?**
That its structure is drawn from protocols. The hero is a verification topology, the research section is a map of protocol research areas, the foundations section is a protocol stack, and each project opens with its own architecture. Not one of these is a decoration applied to a generic layout.

**3. What is the signature motif?**
The drawing grammar of §4.1 — thin strokes, circular participants, rounded-rect components, dashed proof paths, coral trust boundaries, mono uppercase labels, shape-plus-color state markers — reused at micro, meso, and macro scale. The recognizability comes from the grammar repeating, not from any single picture.

**4. Research Interests?**
Becomes the Research Map: one connected diagram, three branches (cross-chain/interoperability, L2/rollups, protocol security) descending from a shared root to a shared cryptography-and-formal-methods foundation. Hover or focus isolates a branch. It answers "what is his research world?" in one scan.

**5. Current Research?**
Becomes full-width research case-study panels — a meso schematic beside a structured `QUESTION` / `FOCUS` / tags block. The cross-chain panel reuses the hero's schematic at smaller scale; the mempool panel introduces the pipeline schematic and keeps its link to BRCC.

**6. Technical Foundations?**
Becomes a layered protocol stack — L1/L2 above protocol security, above cryptographic mechanisms, above formal analysis — with each layer a labeled band rather than a grid cell. The Engineering toolkit stays a flat muted grid, and that contrast is deliberate.

**7. Projects?**
Each card leads with a fixed-height architecture strip drawn from that project's real data flow: ZK-Mixer's commitment→Merkle→proof→verifier path, BRCC's tx→mempool→4×QBFT→block pipeline, Ethereum CLI's wallet→JSON-RPC→Sepolia. Detail pages render the same schematic at macro scale alongside the existing `architecture` prose.

**8. What stays intentionally simple?**
About (portrait, graduation photo, video, narrative), Experience (supervisor, collaborator, teaching history), CV, and Contact. These carry credibility by being plain, and they belong to the site through shared chrome rather than shared diagrams.

**9. What should not be built?**
Any diagram on About or Experience; fake block heights, hashes, or live-chain data; Canvas/WebGL; perpetual ambient animation; coin logos or trading-UI motifs; height-adding decorative dividers; tag-inferred project schematics.

**10. First implementation batch**

**Phases 1–3: the diagram primitive layer, the hero redesign, and the Research Map.**

Chosen because these are the first two screens a visitor sees — precisely the "first 3–5 seconds" this redesign exists to fix — and because they are contiguous, so the top of the homepage will not look half-redesigned. The primitive layer is included because both surfaces depend on it and because building it once, correctly, is what keeps every later phase coherent.

A before/after screenshot of the homepage above the fold would be **unmistakably different**: a single-column text hero over drifting particles becomes a two-column editorial composition with a labeled protocol schematic, followed by a research map instead of three generic cards.

Estimated scope: `src/components/diagrams/*` (new), `src/app/(public)/page.tsx` (hero + Research Interests sections). No changes to Prisma, dependencies, global tokens, About, or Experience.
