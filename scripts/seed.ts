import { Prisma, PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { TIMELINE_SECTIONS_SETTING_KEY } from "../src/lib/timeline/sections"
import { NAV_RESEARCH_SETTING_KEY } from "../src/lib/site/visibility"
import { DEFAULT_TITLE_LINES, DEFAULT_DESCRIPTION, RESEARCH_DIRECTIONS_SETTING_KEY } from "../src/lib/home/hero"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create admin user
  const passwordHash = await bcrypt.hash("admin123456", 12)
  const user = await prisma.user.upsert({
    where: { email: "admin@parsaoryani.com" },
    update: {},
    create: {
      email: "admin@parsaoryani.com",
      passwordHash,
      role: "owner",
    },
  })
  console.log("Admin user created:", user.email)

  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({ where: { slug: "blockchain" }, update: {}, create: { slug: "blockchain", label: "Blockchain" } }),
    prisma.tag.upsert({ where: { slug: "zk" }, update: {}, create: { slug: "zk", label: "Zero-Knowledge" } }),
    prisma.tag.upsert({ where: { slug: "deep-learning" }, update: {}, create: { slug: "deep-learning", label: "Deep Learning" } }),
    prisma.tag.upsert({ where: { slug: "agentic-ai" }, update: {}, create: { slug: "agentic-ai", label: "Agentic AI" } }),
    prisma.tag.upsert({ where: { slug: "ai-security" }, update: {}, create: { slug: "ai-security", label: "AI Security" } }),
    prisma.tag.upsert({ where: { slug: "smart-contracts" }, update: {}, create: { slug: "smart-contracts", label: "Smart Contracts" } }),
    prisma.tag.upsert({ where: { slug: "formal-verification" }, update: {}, create: { slug: "formal-verification", label: "Formal Verification" } }),
    prisma.tag.upsert({ where: { slug: "ethereum" }, update: {}, create: { slug: "ethereum", label: "Ethereum" } }),
    prisma.tag.upsert({ where: { slug: "cryptography" }, update: {}, create: { slug: "cryptography", label: "Cryptography" } }),
  ])
  console.log(`${tags.length} tags created`)

  // Publications — previously seeded three fabricated entries; none exist.
  // Remove any stale records so the site shows no fake publications.
  const fakePublicationSlugs = [
    "zk-rollup-security-framework",
    "adversarial-robustness-agentic-ai",
    "privacy-preserving-blockchain-ml",
  ]
  await prisma.publicationTag.deleteMany({
    where: { publication: { slug: { in: fakePublicationSlugs } } },
  })
  const deletedPublications = await prisma.publication.deleteMany({
    where: { slug: { in: fakePublicationSlugs } },
  })
  console.log(`${deletedPublications.count} stale publications removed`)

  await prisma.researchAgenda.upsert({
    where: { id: "primary" },
    update: {},
    create: {
      id: "primary",
      headline: "Secure and Trustworthy Agentic AI",
      summary:
        "I study how tool-using AI agents can be built, updated, and operated securely through provenance, authorization, information-flow control, secure memory, and runtime enforcement.",
      description:
        "My M.Sc. thesis frames agent security across the full lifecycle of sources, tools, skills, memory, and delegated authority, building on foundations in applied cryptography, formal methods, and distributed systems.",
      themes: ["Agent Security", "Provenance", "Authorization", "Secure Memory"],
      status: "published",
    },
  })
  console.log("Research agenda foundation created")

  const thesisProposal = {
    title: "Lifecycle Security of Tool-Using AI Agents Based on Provenance, Trust, and Authority",
    kind: "thesis_proposal" as const,
    stage: "active" as const,
    year: 2026,
    versionLabel: "v1.0",
    summary:
      "A model-independent security mechanism for preserving provenance, scoped trust, and revocable authority across tools, skills, memory, delegation, and externally consequential agent actions.",
    themes: ["Agent Security", "Provenance", "Trust", "Authority", "Runtime Enforcement"],
    motivation:
      "Tool-using AI agents combine untrusted data, mutable tools and skills, persistent memory, and delegated permissions. Safety cannot be established from the model's final response alone: the system must retain where information came from, why it is trusted, who authorized an action, and whether that authority remains valid at execution time.",
    researchQuestion:
      "How can provenance, trust, and authority be represented and enforced consistently across the lifecycle of a tool-using AI agent so that untrusted inputs, mutable capabilities, and persistent memory cannot silently expand the agent's effective authority?",
    approach:
      "The research will define lifecycle objects and security invariants, then implement an enforcement layer outside the model. Framework adapters will mediate source and capability changes, memory admission and retrieval, delegation and revocation, and tool calls. A compact decision receipt will preserve the evidence and current authority behind important actions.",
    expectedContributions:
      "A unified lifecycle model connecting provenance, scoped trust, and revocable authority; a model-independent enforcement architecture; a prototype with reproducible adversarial and benign scenarios; and an empirical analysis of security, utility, false blocking, auditability, and runtime overhead.",
    limitations:
      "Guarantees remain conditional on correct policy, trustworthy enforcement components, and accurate identity and artifact binding. Provenance explains derivation but does not prove semantic truth, and cryptographic integrity does not make a malicious source trustworthy. Host compromise and broken cryptographic roots are outside the initial scope.",
    pdfUrl: "/research/proposals/lifecycle-security-tool-using-ai-agents-v1.0.pdf",
    status: "published" as const,
    featured: true,
    sortOrder: 0,
  }

  await prisma.researchProposal.upsert({
    where: { slug: "lifecycle-security-tool-using-ai-agents" },
    update: thesisProposal,
    create: {
      id: "proposal-lifecycle-security-v1",
      slug: "lifecycle-security-tool-using-ai-agents",
      ...thesisProposal,
    },
  })
  console.log("Public English thesis proposal created")

  const selectedResearchProposals = [
    {
      id: "proposal-causal-policy-repair-v1",
      slug: "causal-diagnosis-minimal-policy-repair",
      title: "Causal Diagnosis and Minimal Repair of Agent Security Policies",
      kind: "research_proposal" as const,
      stage: "active" as const,
      year: 2026,
      versionLabel: "v1.0",
      summary:
        "A bounded diagnosis-and-repair study testing when counterfactual evidence helps synthesize executable policy repairs under explicit safety, utility, and regression constraints.",
      themes: ["Agent Security", "Access Control", "Program Repair", "Causal Diagnosis"],
      motivation:
        "A faulty agent policy may allow an unsafe tool call or block legitimate work, while a broad correction can create new violations. Repair therefore requires more than identifying a suspicious rule: one patch must satisfy the full set of reviewed authorization requirements.",
      researchQuestion:
        "When do local intervention witnesses correspond to one jointly valid repair, and when does causal diagnosis improve repair quality or search cost beyond direct symbolic synthesis and inexpensive structural analysis?",
      approach:
        "The project combines deterministic policy replay, a bounded typed repair grammar, MaxSMT synthesis, counterfactual rule-eligibility interventions, realizability checks, full-space fallback, independent validation, and selected full-agent reruns.",
      expectedContributions:
        "A model of diagnosis-to-edit realizability for ordered agent policies; an auditable bounded repair prototype; and a matched evaluation identifying where causal guidance helps, is neutral, or wastes budget.",
      limitations:
        "Guarantees depend on complete requirements, faithful policy semantics, trusted evidence, and the declared repair grammar. Snapshot replay does not predict every replanning behavior, and the study does not claim general causal discovery or universal safety.",
      pdfUrl: "/research/proposals/causal-policy-repair-v1.0.pdf",
      status: "published" as const,
      featured: true,
      sortOrder: 1,
    },
    {
      id: "proposal-continuous-threat-model-v1",
      slug: "continuous-threat-model-maintenance",
      title: "Continuous Security Threat-Model Maintenance for Tool-Using Agents",
      kind: "research_proposal" as const,
      stage: "active" as const,
      year: 2026,
      versionLabel: "v1.0",
      summary:
        "An evidence-aware dependency model for keeping security assumptions, conclusions, controls, and tests current as agent tools, authority, memory, policies, and models change.",
      themes: ["Agent Security", "Threat Modeling", "Runtime Assurance", "Security Testing"],
      motivation:
        "Agent systems evolve after deployment, but their threat models and old test results can remain unchanged. This creates stale security conclusions whose assumptions or evidence no longer match the current tools, permissions, memory, or enforcement configuration.",
      researchQuestion:
        "Can selective, evidence-aware reassessment capture every relevant threat-model update after an agent-system change while reducing unnecessary checks and representing missing or stale observations explicitly?",
      approach:
        "The project builds a versioned security graph linking observable agent state to assumptions, threats, conclusions, controls, tests, and evidence, then compares incremental change propagation with full reassessment and conservative invalidation baselines.",
      expectedContributions:
        "Agent-specific dependency semantics; a maintenance procedure that distinguishes changed risk from lost knowledge; and an empirical account of freshness, traceability, reassessment cost, and adapter portability.",
      limitations:
        "Changes outside the observation boundary remain invisible, dependency links can be wrong, and some changes require new threat discovery rather than incremental maintenance. The initial scope excludes enterprise-scale inventories and arbitrary multi-agent concurrency.",
      pdfUrl: "/research/proposals/continuous-threat-model-maintenance-v1.0.pdf",
      status: "published" as const,
      featured: true,
      sortOrder: 2,
    },
    {
      id: "proposal-joint-artifact-authorization-v1",
      slug: "joint-authorization-transformed-artifacts",
      title: "Joint Authorization of Transformed Artifacts",
      kind: "research_proposal" as const,
      stage: "active" as const,
      year: 2026,
      versionLabel: "v1.0",
      summary:
        "A restricted authorization calculus for preserving multi-owner obligations across projection, filtering, joins, aggregation, and final release to an exact recipient set.",
      themes: ["Authorization", "Information Flow", "Multi-Principal Systems", "Provenance"],
      motivation:
        "Independent owners may approve different inputs, yet a later transformation or audience change can make the combined output unauthorized while every individual approval record still appears valid.",
      researchQuestion:
        "Which owner obligations survive supported artifact transformations, when is issuer-specific renewal required, and can a checker authorize more useful releases than global renewal without weakening any owner's declared policy?",
      approach:
        "The project uses immutable content-addressed artifacts, issuer-scoped policies, a typed transformation algebra, obligation propagation, exact output and recipient binding, and a release checker that returns a preservation witness, minimal conflict, or scoped renewal request.",
      expectedContributions:
        "A restricted semantics for transformation-sensitive multi-owner obligations; an auditable checker and decision receipt; and evidence about security, useful completion, approval burden, and explanation quality against conservative baselines.",
      limitations:
        "Guarantees depend on correct owner assignment, truthful transformation witnesses, faithful transform semantics, secure artifact binding, and a mediated release gate. Arbitrary summaries, compromised hosts, and global distributed revocation are outside the first version.",
      pdfUrl: "/research/proposals/joint-authorization-transformed-artifacts-v1.0.pdf",
      status: "published" as const,
      featured: true,
      sortOrder: 3,
    },
  ]

  for (const proposal of selectedResearchProposals) {
    const { id, slug, ...content } = proposal
    await prisma.researchProposal.upsert({
      where: { slug },
      update: content,
      create: { id, slug, ...content },
    })
  }
  console.log(`${selectedResearchProposals.length} selected research proposals created`)

  // Create projects
  const projects = [
    {
      slug: "zk-mixer",
      title: "ZK-Mixer: Regulated Anonymous Payments",
      summary: "Zerocash POUR-protocol implementation with regulatory-compliant disclosure — unlinkable deposits and withdrawals with tiered auditor access.",
      role: "Solo",
      status: "published" as const,
      year: 2026,
      problem: "Anonymous payment systems (Zerocash) deliver transaction unlinkability but clash with AML/KYC regulation, while compliant systems trade away privacy. This project implements both: a full Zerocash-style mixer with a conditional-disclosure layer for authorized auditors.",
      approach: "Implemented the complete POUR protocol — 32-level Merkle tree, commitment/nullifier scheme, and Bulletproof-style zk-SNARK proofs — and extended it with Morales et al. reversible unlinkability: three privacy tiers (HIGH/MEDIUM/LOW) letting users selectively enable regulatory oversight without giving up privacy by default.",
      architecture: "Modular Python monolith under src/zkm: core (mixer, zk-proof, Merkle tree, commitments), crypto (coins, nullifiers, zk-SNARK engine, reversible unlinkability), API (FastAPI routes with JWT auth and 10+ REST endpoints), storage (SQLAlchemy with SQLite, indexed for audit trails), and security (Schnorr signatures, bcrypt password hashing). A JavaScript web frontend (frontend/) exposes the mixer as an application.",
      challenges: "zk-SNARK proof generation is the bottleneck at ~328 proofs/sec (~3ms each) — inherent to cryptographic proofs, mitigated by caching and batch verification. Balancing three privacy tiers against audit requirements surfaced 18 threat vectors, all documented with mitigations in the threat model.",
      results: "253 tests passing (147 unit, 25 integration, 24 API, 14 property-based, 8 performance suites) at 70% coverage with 0 mypy errors. Deposits and withdrawals complete under 500ms; Merkle operations average ~5ms; database throughput exceeds targets by 10-18x.",
      retrospective: "The tiered privacy model proved the privacy-compliance trade-off is reconcilable, but production deployment needs PostgreSQL (SQLite is fine at current scale) and the schnorr.py (58%) and auth_routes.py (54%) modules deserve coverage parity with the rest of the codebase.",
      techStack: ["Python", "FastAPI", "zk-SNARK", "Merkle Tree", "SQLAlchemy", "SQLite", "JWT", "JavaScript"],
      repoUrl: "https://github.com/parsaoryani/ZK-Mixer",
      featured: true,
      sortOrder: 0,
      tagIds: ["blockchain", "zk", "cryptography"],
    },
    {
      slug: "ethereum-cli",
      title: "Ethereum CLI (Sepolia Testnet)",
      summary: "A modular command-line interface for the Ethereum Sepolia testnet — encrypted wallet management, balance queries, ETH transfers, and transaction history export.",
      role: "Solo",
      status: "published" as const,
      year: 2025,
      problem: "Interacting with Ethereum from the terminal usually means pulling in web3.py and fighting its API surface. This tool needed to cover the essential Sepolia workflows — wallet management, balances, transfers, and history — in a lightweight, modular CLI that keeps private keys safe.",
      approach: "Built on direct JSON-RPC calls to any standard endpoint (Infura, Alchemy, GetBlock) instead of web3.py, paired with the Etherscan API for efficient transaction-history retrieval. Wallets are stored encrypted on disk, and every sensitive operation is gated behind a user password.",
      architecture: "Four modules plus a thin entry point: wallet.py (generate, import, list, use, show — encrypted storage via the cryptography library), rpc_client.py (JSON-RPC client with retry logic for rate limits and timeouts, checksum-validated addresses), transaction.py (build/sign/send ETH transfers, status lookups, history and JSON export via Etherscan), and main.py (argparse command parsing behind the executable cli script). Network settings live in config/settings.json; secrets are loaded from .env.",
      challenges: "Staying safe without a heavyweight library: private keys are never stored in plaintext and require a password for export, addresses are validated against Ethereum checksum format, transient RPC failures (HTTP 429, timeouts) are retried, and the tool is restricted to Sepolia to prevent accidental use of test keys against mainnet funds.",
      results: "Full wallet lifecycle, balances in both ETH and Wei, signed ETH transfers, transaction status and history, and JSON export. 74% overall test coverage across the three modules (transaction.py at 86%, its tests at 99%).",
      retrospective: "Direct JSON-RPC kept dependencies minimal and made provider switching trivial, but wallet.py (38%) and rpc_client.py (59%) still lag on coverage — the next pass should add wallet error-path and network failure tests to push past 80%. ERC-20 transfers and smart-contract interactions are the natural next features.",
      techStack: ["Python", "JSON-RPC", "Etherscan API", "eth-account", "cryptography", "argparse", "unittest"],
      repoUrl: "https://github.com/parsaoryani/ethereum-cli",
      featured: true,
      sortOrder: 1,
      tagIds: ["blockchain", "ethereum"],
    },
    {
      slug: "brcc-lab",
      title: "BRCC: Besu Research Control Center",
      summary: "A local control plane for running reproducible mempool/DoS experiments on a 4-validator Hyperledger Besu QBFT network — safety-gated network lifecycle, configuration impact analysis, and full experiment reproducibility metadata.",
      role: "Solo",
      status: "published" as const,
      year: 2025,
      problem: "Studying mempool/DoS behavior on Ethereum-family clients needs a private multi-validator network whose configuration changes have a known blast radius, plus enough execution metadata that a result can be explained or repeated later — that tooling didn't exist off the shelf.",
      approach: "The system enforces one rule end to end: Build → Verify → Observe → Baseline → Stress → Compare → Reproduce — nothing destructive or high-load runs until the network is confirmed healthy and monitoring is live. Configuration changes go through a draft/diff/impact/apply workflow that classifies every edit from NO_RESTART up to destructive CHAIN_RESET or NETWORK_REGENERATE, requiring explicit confirmation before anything destructive runs.",
      architecture: "A FastAPI backend (Python, shared ecosystem with the Web3.py experiment tooling) drives Docker Compose to manage 4 Besu QBFT validator containers, with Prometheus for time-series metrics and PostgreSQL for run/config metadata. A React + TypeScript + Vite frontend talks only to the control API over REST/WebSocket — the browser never controls Docker or calls Besu directly, which keeps the privilege boundary, audit trail, and CORS story simple. Validator keys are kept separate from chain data so identity survives a reset.",
      challenges: "Privilege separation between browser, API, and Docker; making destructive operations (chain reset, validator regeneration) require an explicit confirmed impact class instead of a same-click action; and a real metrics gap — cAdvisor can't resolve container names on Docker Desktop/macOS without the docker socket mounted, so CPU/memory default to Besu's own process_*/jvm_* metrics instead, which work everywhere the JVM runs.",
      results: "Overview, Topology, Nodes, Mempool, Consensus, Experiments, Compare, Config, and Logs pages are complete and reflect live backend state (an unavailable metric renders \"Unavailable\", never a fake zero). One experiment workload (steady-rate baseline) is implemented, with reproducibility metadata (Besu image, chain ID, genesis hash, git commit, network generation, txpool type) recorded on every run.",
      retrospective: "The impact-classified apply flow made destructive network changes safe to iterate on quickly. Several workloads are scoped but not yet built — burst, many-senders, future-nonce, replacement-churn, txpool comparison, ingress topology, and recovery-time — recorded so the design intent isn't lost even though they aren't scheduled yet.",
      techStack: ["Python", "FastAPI", "React", "TypeScript", "Vite", "PostgreSQL", "Prometheus", "Grafana", "Docker Compose", "Hyperledger Besu", "QBFT"],
      repoUrl: "https://github.com/parsaoryani/brcc-lab",
      featured: true,
      sortOrder: 2,
      tagIds: ["blockchain", "ethereum"],
    },
  ]

  for (const project of projects) {
    const { tagIds, ...projectData } = project
    const created = await prisma.project.upsert({
      where: { slug: projectData.slug },
      update: projectData,
      create: projectData,
    })
    if (tagIds) {
      for (const tagSlug of tagIds) {
        const tag = tags.find((t) => t.slug === tagSlug)
        if (tag) {
          await prisma.projectTag.upsert({
            where: { projectId_tagId: { projectId: created.id, tagId: tag.id } },
            update: {},
            create: { projectId: created.id, tagId: tag.id },
          })
        }
      }
    }
  }
  // Remove placeholder projects that were never real (their repositories do not
  // exist) so re-seeding converges to verified data only.
  await prisma.project.deleteMany({
    where: { slug: { in: ["zk-bridge-verifier", "agentic-ai-guardrails", "private-ml-on-chain"] } },
  })
  console.log(`${projects.length} projects created`)

  // Timeline events — idempotent. Keyed on (type, organization) so title
  // corrections don't create duplicates; also collapses the duplicate records
  // left behind by earlier non-idempotent seeding.
  async function upsertTimelineEvent(event: Prisma.TimelineEventUncheckedCreateInput) {
    const key = { type: event.type, organization: event.organization }
    const existing = await prisma.timelineEvent.findFirst({
      where: key,
      orderBy: { createdAt: "asc" },
    })
    if (existing) {
      const kept = await prisma.timelineEvent.update({ where: { id: existing.id }, data: event })
      await prisma.timelineEvent.deleteMany({ where: { ...key, id: { not: existing.id } } })
      return kept
    }
    return prisma.timelineEvent.create({ data: event })
  }

  // Remove the placeholder B.Sc. Computer Engineering (Sharif) record — it
  // conflicts with the verified B.Sc. in Computer Science (Amirkabir).
  await prisma.timelineEvent.deleteMany({
    where: { type: "education", organization: "Sharif University of Technology", title: { startsWith: "B.Sc." } },
  })

  // Work experience, awards, and talks were placeholder/unverified content —
  // this site currently only shows verified education.
  await prisma.timelineEvent.deleteMany({ where: { type: { in: ["experience", "award", "talk"] } } })

  const timelineEvents = [
    {
      type: "education" as const,
      title: "M.Sc. in Computer Engineering",
      organization: "Sharif University of Technology",
      location: "Tehran, Iran",
      startDate: new Date("2025-09-01"),
      endDate: null,
      description: "National Master's Entrance Examination Rank: 56",
      sortOrder: 0,
    },
    {
      type: "education" as const,
      title: "B.Sc. in Computer Science",
      organization: "Amirkabir University of Technology (Tehran Polytechnic)",
      location: "Tehran, Iran",
      startDate: new Date("2020-09-01"),
      endDate: new Date("2025-02-01"),
      description: "National University Entrance Examination Rank: 343",
      sortOrder: 7,
    },
  ]

  let bscAmirkabir: Awaited<ReturnType<typeof upsertTimelineEvent>> | null = null
  for (const event of timelineEvents) {
    const kept = await upsertTimelineEvent(event)
    if (kept.type === "education" && kept.organization === "Amirkabir University of Technology (Tehran Polytechnic)") {
      bscAmirkabir = kept
    }
  }
  console.log(`${timelineEvents.length} timeline events seeded`)

  const mscSharif = await prisma.timelineEvent.findFirst({
    where: { type: "education", organization: "Sharif University of Technology" },
    orderBy: { createdAt: "asc" },
  })

  interface CourseSeed {
    name: string
    grade?: string
    highlight?: string
    instructor?: string
    focus?: string
    topics?: string
  }

  async function ensureCourse(timelineEventId: string, course: CourseSeed, sortOrder: number) {
    const { name, ...fields } = course
    const existing = await prisma.course.findFirst({ where: { timelineEventId, name } })
    if (existing) {
      await prisma.course.update({ where: { id: existing.id }, data: fields })
      return
    }
    await prisma.course.create({ data: { timelineEventId, name, ...fields, sortOrder } })
  }

  if (mscSharif) {
    const mscCourses: CourseSeed[] = [
      { name: "Applied Cryptography", grade: "18.9/20" },
      { name: "Secure Software Systems", grade: "18.2/20" },
      // Spring 2026 (started Feb 2026) — grades/details pending
      { name: "Formal Methods in Information Security" },
      { name: "Deep Learning" },
      { name: "Foundations and Applications of Blockchain" },
    ]
    let order = 0
    for (const course of mscCourses) {
      await ensureCourse(mscSharif.id, course, order++)
    }
  }

  // Course links — ZK-Mixer is the Applied Cryptography course project, and
  // its slides are the course presentation. Idempotent by (course, type, name).
  async function ensureCourseLink(
    courseId: string,
    type: string,
    name: string,
    url: string,
    sortOrder: number
  ) {
    const existing = await prisma.courseLink.findFirst({ where: { courseId, type, name } })
    if (existing) {
      await prisma.courseLink.update({ where: { id: existing.id }, data: { url } })
      return
    }
    await prisma.courseLink.create({ data: { courseId, type, name, url, sortOrder } })
  }

  if (mscSharif) {
    const appliedCrypto = await prisma.course.findFirst({
      where: { timelineEventId: mscSharif.id, name: "Applied Cryptography" },
    })
    if (appliedCrypto) {
      // Both links share the "ZK-Mixer" name so the UI groups them under one project.
      await prisma.courseLink.deleteMany({ where: { courseId: appliedCrypto.id, name: "Presentation Slides" } })
      await ensureCourseLink(appliedCrypto.id, "project", "ZK-Mixer", "/projects/zk-mixer", 0)
      await ensureCourseLink(
        appliedCrypto.id,
        "slides",
        "ZK-Mixer",
        "https://docs.google.com/presentation/d/1TOtABEE-BxehewOyfk-qVNsLYb-tzV6QI-S6NThfhIg/edit?usp=sharing",
        1
      )
    }

    const formalMethods = await prisma.course.findFirst({
      where: { timelineEventId: mscSharif.id, name: "Formal Methods in Information Security" },
    })
    if (formalMethods) {
      await prisma.courseLink.deleteMany({ where: { courseId: formalMethods.id, name: "Course Project" } })
      await ensureCourseLink(
        formalMethods.id,
        "project",
        "Formal Verification of ZK-Rollup Security Mechanisms",
        "https://docs.google.com/presentation/d/16WQGKbFC_pK5xJtQ2K8BavE-JxwXGfI43B80bMfxuTs/edit?usp=sharing",
        0
      )
    }

    const blockchainCourse = await prisma.course.findFirst({
      where: { timelineEventId: mscSharif.id, name: "Foundations and Applications of Blockchain" },
    })
    if (blockchainCourse) {
      await ensureCourseLink(
        blockchainCourse.id,
        "project",
        "opML: Optimistic Machine Learning on Blockchain",
        "https://docs.google.com/presentation/d/1JJwBT6vOO8ssTMe1s-mtMt8GoxPlowBC8T3n8T3JiPY/edit?usp=sharing",
        0
      )
      await ensureCourseLink(
        blockchainCourse.id,
        "project",
        "ZKsync Protocol",
        "https://docs.google.com/presentation/d/1KerdC4P7yvEFYT-IbljRlH7pljRMfVQdoDNc0sFb920/edit?usp=sharing",
        1
      )
    }
  }

  const bscCourses: CourseSeed[] = [
    {
      name: "Artificial Intelligence and Lab",
      grade: "20/20",
      topics: "Intelligent agents, search & heuristics, adversarial search, CSPs, probabilistic inference, supervised/unsupervised learning, neural networks, CNNs & RNNs",
    },
    {
      name: "Probability I",
      grade: "19.46/20",
      topics: "Probability spaces, Bayes' theorem, random variables, distributions, expectation & variance, joint distributions, LLN & CLT",
    },
    {
      name: "Cryptography I",
      grade: "18.75/20",
      topics: "Perfect secrecy, PRGs & stream ciphers, PRFs & block ciphers, MACs, hash functions, RSA, public-key crypto, digital signatures, post-quantum intro",
    },
    {
      name: "Foundations of Matrices and Linear Algebra",
      grade: "18.69/20",
      topics: "Vector spaces, linear independence & bases, linear transformations, eigenvalues & eigenvectors, diagonalization, inner-product spaces, ML applications",
    },
    {
      name: "Special Topics in Cryptography",
      grade: "18.25/20",
      highlight: "Highest Grade in Class",
      focus: "Lattice-Based & Post-Quantum Cryptography",
      topics: "Lattices, SIS, LWE, Ring-LWE, NTRU, lattice trapdoors, signatures, FHE, attribute-based encryption",
    },
    { name: "Design and Analysis of Algorithms", grade: "18/20" },
    {
      name: "Advanced Programming",
      grade: "18/20",
      highlight: "C++",
      topics: "Object-oriented programming, templates, operator overloading, dynamic memory, inheritance, polymorphism, exception handling, STL, data structures, file I/O",
    },
    { name: "Foundations of Probability", grade: "18/20" },
    {
      name: "Numerical Linear Algebra",
      grade: "17.55/20",
      instructor: "Prof. Mehdi Dehghan — Group 1",
      topics: "Numerical stability, Gaussian elimination, LU/Cholesky/QR factorization, least squares, iterative methods, eigenvalues & SVD, condition numbers",
    },
    { name: "Foundations of Logic and Set Theory", grade: "17.50/20" },
  ]
  if (bscAmirkabir) {
    let order = 0
    for (const course of bscCourses) {
      await ensureCourse(bscAmirkabir.id, course, order++)
    }
  }
  console.log("Relevant coursework seeded")

  // Create skill categories and skills
  const skillCategoriesData = [
    {
      name: "Decentralized Systems",
      sortOrder: 0,
      skills: [
        { name: "Blockchain", proficiency: "advanced", sortOrder: 0 },
        { name: "Ethereum", proficiency: "advanced", sortOrder: 1 },
        { name: "Solana", proficiency: "advanced", sortOrder: 2 },
        { name: "Layer 2", proficiency: "advanced", sortOrder: 3 },
        { name: "Cross-Chain Protocols", proficiency: "advanced", sortOrder: 4 },
        { name: "DeFi", proficiency: "advanced", sortOrder: 5 },
      ],
    },
    {
      name: "Security & Cryptography",
      sortOrder: 1,
      skills: [
        { name: "Applied Cryptography", proficiency: "advanced", sortOrder: 0 },
        { name: "Zero-Knowledge Proofs", proficiency: "advanced", sortOrder: 1 },
        { name: "Protocol Security", proficiency: "advanced", sortOrder: 2 },
        { name: "Smart Contract Security", proficiency: "advanced", sortOrder: 3 },
        { name: "Formal Methods", proficiency: "advanced", sortOrder: 4 },
      ],
    },
    {
      name: "Distributed Systems",
      sortOrder: 2,
      skills: [
        { name: "Consensus", proficiency: "advanced", sortOrder: 0 },
        { name: "Blockchain Scalability", proficiency: "advanced", sortOrder: 1 },
        { name: "Interoperability", proficiency: "advanced", sortOrder: 2 },
        { name: "Transaction Processing", proficiency: "advanced", sortOrder: 3 },
        { name: "System Evaluation", proficiency: "advanced", sortOrder: 4 },
      ],
    },
    {
      name: "Programming & Tools",
      sortOrder: 3,
      skills: [
        { name: "Python", proficiency: "advanced", sortOrder: 0 },
        { name: "Rust", proficiency: "advanced", sortOrder: 1 },
        { name: "Solidity", proficiency: "advanced", sortOrder: 2 },
        { name: "TypeScript", proficiency: "advanced", sortOrder: 3 },
        { name: "Docker", proficiency: "advanced", sortOrder: 4 },
        { name: "Git", proficiency: "advanced", sortOrder: 5 },
      ],
    },
    {
      name: "Additional Interests",
      sortOrder: 4,
      skills: [
        { name: "Machine Learning", proficiency: "proficient", sortOrder: 0 },
        { name: "Adversarial ML", proficiency: "proficient", sortOrder: 1 },
        { name: "Reinforcement Learning", proficiency: "proficient", sortOrder: 2 },
      ],
    },
  ]

  // Skill categories from earlier seeding are no longer part of the taxonomy —
  // drop them (and their skills, via cascade) so re-seeding converges cleanly.
  await prisma.skillCategory.deleteMany({
    where: { name: { in: ["Blockchain", "ML & Deep Learning", "Systems & Security", "Languages & Tools"] } },
  })

  // Skill categories and skills — idempotent. Repeated non-idempotent seeding
  // left duplicate category copies; collapse them to one per name, then upsert
  // skills so re-running the seed is safe.
  for (const catData of skillCategoriesData) {
    const { skills, ...catFields } = catData
    const existing = await prisma.skillCategory.findFirst({
      where: { name: catFields.name },
      orderBy: { id: "asc" },
    })
    if (existing) {
      await prisma.skillCategory.update({ where: { id: existing.id }, data: catFields })
      await prisma.skillCategory.deleteMany({ where: { name: catFields.name, id: { not: existing.id } } })
      for (const skill of skills) {
        const existingSkill = await prisma.skill.findFirst({ where: { categoryId: existing.id, name: skill.name } })
        if (existingSkill) {
          await prisma.skill.update({ where: { id: existingSkill.id }, data: skill })
        } else {
          await prisma.skill.create({ data: { ...skill, categoryId: existing.id } })
        }
      }
    } else {
      const category = await prisma.skillCategory.create({ data: catFields })
      for (const skill of skills) {
        await prisma.skill.create({ data: { ...skill, categoryId: category.id } })
      }
    }
  }
  console.log(`${skillCategoriesData.length} skill categories seeded`)

  // Site settings — home hero text is corrected in place (`update`) since the
  // previously-seeded copy overstated AI as a co-equal research focus.
  await prisma.siteSetting.upsert({
    where: { key: "hero_thesis" },
    update: {
      value: {
        text: "I am interested in the security and scalability of decentralized systems, focusing on blockchain security, cross-chain and Layer-2 interoperability, applied cryptography, and formal methods.",
      },
    },
    create: {
      key: "hero_thesis",
      value: {
        text: "I am interested in the security and scalability of decentralized systems, focusing on blockchain security, cross-chain and Layer-2 interoperability, applied cryptography, and formal methods.",
      },
    },
  })

  await prisma.siteSetting.upsert({
    where: { key: "profile_photo" },
    update: {},
    create: { key: "profile_photo", value: { url: "/about/now.jpg", alt: "Parsa Oryani" } },
  })

  await prisma.siteSetting.upsert({
    where: { key: "home_title" },
    update: { value: DEFAULT_TITLE_LINES.join("\n") },
    create: { key: "home_title", value: DEFAULT_TITLE_LINES.join("\n") },
  })

  await prisma.siteSetting.upsert({
    where: { key: "home_description" },
    update: { value: DEFAULT_DESCRIPTION },
    create: { key: "home_description", value: DEFAULT_DESCRIPTION },
  })

  await prisma.siteSetting.upsert({
    where: { key: RESEARCH_DIRECTIONS_SETTING_KEY },
    update: {
      value: [
        {
          title: "Lifecycle Security of Tool-Using AI Agents",
          description:
            "M.Sc. thesis: a model-independent mechanism for controlling source, tool, and skill changes; memory entry, transformation, and retrieval; and authority delegation — grounded in provenance, trust, and authority.",
          tags: ["Provenance", "Trust", "Authority", "Tool Security"],
        },
      ],
    },
    create: {
      key: RESEARCH_DIRECTIONS_SETTING_KEY,
      value: [
        {
          title: "Lifecycle Security of Tool-Using AI Agents",
          description:
            "M.Sc. thesis: a model-independent mechanism for controlling source, tool, and skill changes; memory entry, transformation, and retrieval; and authority delegation — grounded in provenance, trust, and authority.",
          tags: ["Provenance", "Trust", "Authority", "Tool Security"],
        },
      ],
    },
  })

  await prisma.siteSetting.upsert({
    where: { key: TIMELINE_SECTIONS_SETTING_KEY },
    update: {},
    create: { key: TIMELINE_SECTIONS_SETTING_KEY, value: [] },
  })

  await prisma.siteSetting.upsert({
    where: { key: NAV_RESEARCH_SETTING_KEY },
    update: {},
    create: { key: NAV_RESEARCH_SETTING_KEY, value: false },
  })

  // Teaching Assistant entries — reverse chronological, real experience only
  const oldFakeTaSlugs = ["advanced-algorithms-ta", "machine-learning-ta"]
  await prisma.teachingAssistant.deleteMany({ where: { slug: { in: oldFakeTaSlugs } } })

  const teachingAssistantEntries = [
    {
      slug: "computer-networks-ta-sharif",
      course: "Computer Networks",
      level: "undergraduate",
      university: "Sharif University of Technology",
      professor: "Dr. Sadeghzadeh",
      startDate: new Date("2026-02-01"),
      endDate: new Date("2026-06-15"),
      description: "Designed and graded theoretical and practical assignments for the undergraduate Computer Networks course.",
      highlights: ["Designed theoretical assignments", "Designed practical assignments", "Graded theoretical and practical assignments"],
      status: "published" as const,
      sortOrder: 0,
    },
    {
      slug: "machine-learning-ta-sharif",
      course: "Machine Learning",
      level: "undergraduate",
      university: "Sharif University of Technology",
      professor: "Dr. Motahari",
      startDate: new Date("2026-02-01"),
      endDate: new Date("2026-06-15"),
      description: "Designed theoretical assignments and evaluated student submissions for the undergraduate Machine Learning course.",
      highlights: ["Designed theoretical assignments", "Graded assignments"],
      status: "published" as const,
      sortOrder: 1,
    },
    {
      slug: "ai-and-lab-ta-aut",
      course: "Artificial Intelligence and Lab",
      level: "undergraduate",
      university: "Amirkabir University of Technology",
      professor: "Dr. Ghatee",
      startDate: new Date("2025-02-01"),
      endDate: new Date("2025-06-15"),
      description: "Designed and graded theoretical and practical assignments for the Artificial Intelligence and Lab course.",
      highlights: ["Designed theoretical assignments", "Designed practical assignments", "Graded theoretical and practical assignments"],
      status: "published" as const,
      sortOrder: 2,
    },
    {
      slug: "linear-algebra-ta-aut",
      course: "Foundations of Matrices and Linear Algebra",
      level: "undergraduate",
      university: "Amirkabir University of Technology",
      professor: "Dr. Najafi",
      startDate: new Date("2023-09-01"),
      endDate: new Date("2024-01-15"),
      description: "Designed and graded assignments and quizzes, and conducted problem-solving and review sessions.",
      highlights: [
        "Designed assignments",
        "Designed quizzes",
        "Graded assignments and quizzes",
        "Conducted problem-solving sessions",
        "Conducted review sessions",
        "Answered students' questions during exercise/review sessions",
      ],
      status: "published" as const,
      sortOrder: 3,
    },
    {
      slug: "advanced-programming-ta-aut",
      course: "Advanced Programming",
      level: "undergraduate",
      university: "Amirkabir University of Technology",
      professor: "Dr. Bejani",
      startDate: new Date("2023-02-01"),
      endDate: new Date("2023-06-15"),
      description: "Designed and graded programming assignments and practical projects, and conducted workshops and problem-solving sessions.",
      highlights: [
        "Designed programming assignments",
        "Designed practical projects",
        "Graded assignments and projects",
        "Conducted workshops",
        "Conducted problem-solving and review sessions",
      ],
      status: "published" as const,
      sortOrder: 4,
    },
  ]

  for (const entry of teachingAssistantEntries) {
    await prisma.teachingAssistant.upsert({
      where: { slug: entry.slug },
      update: entry,
      create: entry,
    })
  }
  console.log(`${teachingAssistantEntries.length} teaching assistant entries seeded`)

  // Researching Assistant entries — replaced the earlier fabricated-outcome
  // entries with factual, unpublished-claim-free research descriptions.
  const oldFakeRaSlugs = ["zk-rollup-verification-ra", "agentic-ai-security-ra"]
  await prisma.researchingAssistant.deleteMany({ where: { slug: { in: oldFakeRaSlugs } } })

  await prisma.researchingAssistant.upsert({
    where: { slug: "blockchain-security-research" },
    update: {
      lab: null,
      university: "Sharif University of Technology",
      supervisor: "Dr. Morteza Amini",
      supervisorUrl: "https://scholar.google.com/citations?user=Rsmx5DYAAAAJ&hl=en",
      collaborator: "Working closely with Ph.D. researcher Amirmohammad Aghapour",
      topic: "Research Assistant — Blockchain Security",
      description:
        "Conducting research on the security and scalability of blockchain and decentralized systems, with a particular focus on protocol-level security, interoperability, and emerging challenges in blockchain infrastructure.",
      outcomes: [
        "Studying security and scalability challenges in blockchain and decentralized protocols",
        "Investigating cross-chain and Layer-2 systems, including interoperability, state verification, and cross-rollup communication",
        "Analyzing protocol-level security assumptions, trust models, and potential attack surfaces",
        "Conducting technical literature reviews and evaluating recent research in blockchain security and scalability",
        "Supporting experimental and implementation-oriented research on blockchain infrastructure and security",
        "Collaborating closely with Ph.D. researcher Amirmohammad Aghapour on ongoing research activities within the group",
      ],
      technologies: "",
    },
    create: {
      slug: "blockchain-security-research",
      lab: null,
      university: "Sharif University of Technology",
      supervisor: "Dr. Morteza Amini",
      supervisorUrl: "https://scholar.google.com/citations?user=Rsmx5DYAAAAJ&hl=en",
      collaborator: "Working closely with Ph.D. researcher Amirmohammad Aghapour",
      topic: "Research Assistant — Blockchain Security",
      startDate: new Date("2025-09-01"),
      endDate: undefined,
      description:
        "Conducting research on the security and scalability of blockchain and decentralized systems, with a particular focus on protocol-level security, interoperability, and emerging challenges in blockchain infrastructure.",
      outcomes: [
        "Studying security and scalability challenges in blockchain and decentralized protocols",
        "Investigating cross-chain and Layer-2 systems, including interoperability, state verification, and cross-rollup communication",
        "Analyzing protocol-level security assumptions, trust models, and potential attack surfaces",
        "Conducting technical literature reviews and evaluating recent research in blockchain security and scalability",
        "Supporting experimental and implementation-oriented research on blockchain infrastructure and security",
        "Collaborating closely with Ph.D. researcher Amirmohammad Aghapour on ongoing research activities within the group",
      ],
      technologies: "",
      status: "published",
      sortOrder: 0,
    },
  })

  // Removed by request — no longer part of Research Assistantships.
  await prisma.researchingAssistant.deleteMany({ where: { slug: "ethereum-mempool-security-research" } })

  console.log("Seed completed successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
