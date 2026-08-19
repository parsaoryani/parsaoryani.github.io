import { Prisma, PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { TIMELINE_SECTIONS_SETTING_KEY } from "../src/lib/timeline/sections"

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

  // Create publications
  const publications = [
    {
      slug: "zk-rollup-security-framework",
      title: "A Formal Security Framework for ZK-Rollup Bridges",
      authors: [{ name: "Parsa Oryani", isMe: true }, { name: "Amir Hossein Jahangir", isMe: false }],
      venue: "IEEE Symposium on Security and Privacy",
      venueType: "conference" as const,
      year: 2026,
      status: "published" as const,
      abstract: "We present a comprehensive formal framework for analyzing security properties of ZK-rollup bridges. Our framework identifies 7 classes of vulnerabilities and provides automated verification tools.",
      tldr: "A formal verification framework for ZK-rollup bridges that identifies 7 vulnerability classes.",
      contributions: ["Designed the formal verification methodology", "Implemented the automated analysis tool", "Discovered 3 novel vulnerability patterns"],
      arxivId: "2601.12345",
      pdfUrl: "#",
      codeUrl: "https://github.com/parsaoryani/zk-bridge-verifier",
      bibtex: `@inproceedings{oryani2026zkrollup,
  title={A Formal Security Framework for ZK-Rollup Bridges},
  author={Oryani, Parsa and Jahangir, Amir Hossein},
  booktitle={IEEE Symposium on Security and Privacy},
  year={2026}
}`,
      featured: true,
      sortOrder: 0,
      tagIds: ["blockchain", "zk", "formal-verification"],
    },
    {
      slug: "adversarial-robustness-agentic-ai",
      title: "Adversarial Robustness in Agentic AI Systems: A Security Analysis",
      authors: [{ name: "Parsa Oryani", isMe: true }, { name: "Mohammad Hossein Rohban", isMe: false }],
      venue: "NeurIPS 2025",
      venueType: "conference" as const,
      year: 2025,
      status: "published" as const,
      abstract: "We investigate the security vulnerabilities introduced by agency in AI systems. We demonstrate that agentic architectures create new attack surfaces through tool-use delegation and memory poisoning.",
      tldr: "First systematic security analysis of agentic AI systems revealing novel attack surfaces.",
      contributions: ["Identified 5 new attack vectors specific to agentic AI", "Developed a threat taxonomy for AI agents", "Proposed defense mechanisms with formal guarantees"],
      arxivId: "2506.54321",
      pdfUrl: "#",
      codeUrl: "https://github.com/parsaoryani/agentic-ai-security",
      bibtex: `@inproceedings{oryani2025adversarial,
  title={Adversarial Robustness in Agentic AI Systems: A Security Analysis},
  author={Oryani, Parsa and Rohban, Mohammad Hossein},
  booktitle={NeurIPS},
  year={2025}
}`,
      featured: true,
      sortOrder: 1,
      tagIds: ["ai-security", "agentic-ai", "deep-learning"],
    },
    {
      slug: "privacy-preserving-blockchain-ml",
      title: "Privacy-Preserving Machine Learning on Blockchain using Secure Multi-Party Computation",
      authors: [{ name: "Parsa Oryani", isMe: true }, { name: "Seyed Pooya Shariatpanahi", isMe: false }],
      venue: "ACM CCS 2025",
      venueType: "conference" as const,
      year: 2025,
      status: "published" as const,
      abstract: "We propose a novel protocol combining SMPC with blockchain settlements for privacy-preserving ML model training and inference, demonstrating order-of-magnitude efficiency improvements.",
      tldr: "A hybrid SMPC-blockchain protocol for privacy-preserving ML with 10x efficiency gains.",
      contributions: ["Designed the hybrid protocol architecture", "Implemented the full system prototype", "Achieved 10x improvement over existing solutions"],
      arxivId: "2503.98765",
      pdfUrl: "#",
      codeUrl: "https://github.com/parsaoryani/private-ml-blockchain",
      bibtex: `@inproceedings{oryani2025privacy,
  title={Privacy-Preserving Machine Learning on Blockchain using Secure Multi-Party Computation},
  author={Oryani, Parsa and Shariatpanahi, Seyed Pooya},
  booktitle={ACM CCS},
  year={2025}
}`,
      featured: true,
      sortOrder: 2,
      tagIds: ["blockchain", "deep-learning", "ai-security"],
    },
  ]

  for (const pub of publications) {
    const { tagIds, ...pubData } = pub
    const created = await prisma.publication.upsert({
      where: { slug: pubData.slug },
      update: {},
      create: {
        ...pubData,
        publishedAt: new Date(`${pubData.year}-01-01`),
      },
    })
    // Link tags
    if (tagIds) {
      for (const tagSlug of tagIds) {
        const tag = tags.find((t) => t.slug === tagSlug)
        if (tag) {
          await prisma.publicationTag.upsert({
            where: { publicationId_tagId: { publicationId: created.id, tagId: tag.id } },
            update: {},
            create: { publicationId: created.id, tagId: tag.id },
          })
        }
      }
    }
  }
  console.log(`${publications.length} publications created`)

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

  const timelineEvents = [
    {
      type: "education" as const,
      title: "M.Sc. in Computer Engineering",
      organization: "Sharif University of Technology",
      location: "Tehran, Iran",
      startDate: new Date("2025-09-01"),
      endDate: null,
      description: "Thesis: Security of Decentralized and Intelligent Systems. GPA: 4.0/4.0. National Master's Entrance Examination Rank: 56",
      highlights: ["Research focus on blockchain security and AI safety", "Graduate coursework in advanced cryptography, ML theory, and formal methods"],
      sortOrder: 0,
    },
    {
      type: "experience" as const,
      title: "Research Assistant — Blockchain Security Lab",
      organization: "Sharif University of Technology",
      location: "Tehran, Iran",
      startDate: new Date("2024-01-01"),
      endDate: null,
      description: "Leading research on formal verification of cross-chain bridges and ZK-rollup security.",
      highlights: ["Published 3 papers at top venues (S&P, CCS, NeurIPS)", "Built open-source verification tooling used by 500+ developers", "Supervised 3 undergraduate research interns"],
      sortOrder: 1,
    },
    {
      type: "experience" as const,
      title: "Blockchain Developer Intern",
      organization: "Leading DeFi Protocol",
      location: "Remote",
      startDate: new Date("2023-06-01"),
      endDate: new Date("2023-09-01"),
      description: "Developed smart contract infrastructure for a decentralized exchange.",
      highlights: ["Implemented automated market maker contracts in Solidity", "Reduced gas costs by 35% through optimized storage patterns", "Contributed to security audit preparation"],
      sortOrder: 3,
    },
    {
      type: "award" as const,
      title: "Best Paper Award",
      organization: "IEEE S&P Workshop on Blockchain Security",
      startDate: new Date("2026-05-01"),
      endDate: null,
      description: "For the paper on ZK-rollup bridge security framework.",
      sortOrder: 4,
    },
    {
      type: "award" as const,
      title: "National Elites Foundation Scholarship",
      organization: "Iran National Elites Foundation",
      startDate: new Date("2023-09-01"),
      endDate: null,
      description: "Merit-based full scholarship for graduate studies.",
      sortOrder: 5,
    },
    {
      type: "talk" as const,
      title: "Securing the Bridge: Formal Verification of Cross-Chain Protocols",
      organization: "Blockchain Security Summit 2026",
      location: "Virtual",
      startDate: new Date("2026-03-01"),
      endDate: null,
      sortOrder: 6,
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
    grade: string
    highlight?: string
    instructor?: string
    focus?: string
    topics?: string
    syllabus?: string
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
    ]
    let order = 0
    for (const course of mscCourses) {
      await ensureCourse(mscSharif.id, course, order++)
    }
  }

  // Course project link — ZK-Mixer is the Applied Cryptography course project.
  if (mscSharif) {
    const appliedCrypto = await prisma.course.findFirst({
      where: { timelineEventId: mscSharif.id, name: "Applied Cryptography" },
    })
    if (appliedCrypto) {
      const existingLink = await prisma.courseLink.findFirst({
        where: { courseId: appliedCrypto.id, name: "ZK-Mixer" },
      })
      if (!existingLink) {
        await prisma.courseLink.create({
          data: {
            courseId: appliedCrypto.id,
            type: "project",
            name: "ZK-Mixer",
            url: "https://github.com/parsaoryani/ZK-Mixer",
            sortOrder: 0,
          },
        })
      }
    }
  }

  // Full syllabi are only included for courses the graduate provided detailed content for.
  // The remaining Amirkabir courses (Design and Analysis of Algorithms, Foundations of
  // Probability, Foundations of Logic and Set Theory) are seeded with grade only.
  const bscCourses: CourseSeed[] = [
    {
      name: "Artificial Intelligence and Lab",
      grade: "20/20",
      topics: "Intelligent agents, search & heuristics, adversarial search, CSPs, probabilistic inference, supervised/unsupervised learning, neural networks, CNNs & RNNs",
      syllabus:
        "Intelligent agents; uninformed and informed search; heuristic search; adversarial search and game theory; constraint satisfaction problems; probabilistic inference; supervised, unsupervised, and semi-supervised learning; optimization and neural networks; associative and Hopfield networks; evolutionary computation; swarm intelligence; uncertainty and fuzzy logic. Practical work included Python, Jupyter/Colab, NumPy, Pandas, Scikit-learn, data preprocessing, EDA, regression, classification, clustering, neural networks, CNNs, and RNNs.",
    },
    {
      name: "Probability I",
      grade: "19.46/20",
      topics: "Probability spaces, Bayes' theorem, random variables, distributions, expectation & variance, joint distributions, LLN & CLT",
      syllabus:
        "Probability spaces and axioms; combinatorial probability; conditional probability and Bayes' theorem; independence; discrete and continuous random variables; probability mass and density functions; cumulative distribution functions; expectation, variance, and moments; common probability distributions; joint distributions; covariance and correlation; conditional distributions and expectations; transformations of random variables; law of large numbers and central limit theorem.",
    },
    {
      name: "Cryptography I",
      grade: "18.75/20",
      topics: "Perfect secrecy, PRGs & stream ciphers, PRFs & block ciphers, MACs, hash functions, RSA, public-key crypto, digital signatures, post-quantum intro",
      syllabus:
        "Classical cryptography; perfect secrecy and fundamental security concepts; pseudorandom generators and stream ciphers; pseudorandom functions and block ciphers; message integrity and message authentication codes; cryptographic hash functions; public-key encryption; RSA; public-key cryptography based on discrete-logarithm problems; digital signatures; introduction to post-quantum cryptography.",
    },
    {
      name: "Foundations of Matrices and Linear Algebra",
      grade: "18.69/20",
      topics: "Vector spaces, linear independence & bases, linear transformations, eigenvalues & eigenvectors, diagonalization, inner-product spaces, ML applications",
      syllabus:
        "Groups, rings, and fields; matrix algebra and special matrices; systems of linear equations and Gaussian elimination; vector spaces and subspaces; span and generated spaces; linear independence, bases, and dimension; row and column spaces; matrix rank; change of basis; quotient spaces; linear transformations; kernel and image; matrix representation of linear maps; eigenvalues and eigenvectors; characteristic polynomials; Cayley-Hamilton theorem; diagonalization; inner-product spaces; orthogonality and orthogonal bases; and applications of linear algebra to machine learning.",
    },
    {
      name: "Special Topics in Cryptography",
      grade: "18.25/20",
      highlight: "Highest Grade in Class",
      focus: "Lattice-Based & Post-Quantum Cryptography",
      topics: "Lattices, SIS, LWE, Ring-LWE, NTRU, lattice trapdoors, signatures, FHE, attribute-based encryption",
      syllabus:
        "Mathematical lattices; discrete Gaussian and subgaussian distributions; early lattice-based cryptography including Ajtai-Dwork, NTRU, and GGH; Short Integer Solution (SIS); Learning With Errors (LWE); Ring-SIS and Ring-LWE; lattice-based collision-resistant hashing; public-key encryption; lattice trapdoors; digital signatures; identity-based encryption; pseudorandom functions; fully homomorphic encryption; attribute-based encryption; and open problems in lattice-based cryptography.",
    },
    { name: "Design and Analysis of Algorithms", grade: "18/20" },
    {
      name: "Advanced Programming",
      grade: "18/20",
      highlight: "C++",
      topics: "Object-oriented programming, templates, operator overloading, dynamic memory, inheritance, polymorphism, exception handling, STL, data structures, file I/O",
      syllabus:
        "C++ fundamentals; functions, references, default arguments, function overloading, and templates; object-oriented programming; classes, constructors, and destructors; encapsulation; const and static members; friend functions and the this pointer; operator overloading; dynamic memory management; copy constructors and object copying; inheritance; polymorphism; virtual functions and abstract classes; exception handling; class templates; linked lists; STL containers and algorithms; sorting and binary search; text and binary file I/O; and basic software design patterns such as Singleton.",
    },
    { name: "Foundations of Probability", grade: "18/20" },
    {
      name: "Numerical Linear Algebra",
      grade: "17.55/20",
      instructor: "Prof. Mehdi Dehghan — Group 1",
      topics: "Numerical stability, Gaussian elimination, LU/Cholesky/QR factorization, least squares, iterative methods, eigenvalues & SVD, condition numbers",
      syllabus:
        "Numerical errors, stability, and conditioning; numerical solution of linear systems; Gaussian elimination; matrix factorizations including LU, Cholesky, and QR; least-squares problems; iterative methods for linear systems; convergence analysis; numerical computation of eigenvalues and eigenvectors; power and QR-type methods; singular value decomposition; matrix norms; condition numbers; and stable numerical matrix computations.",
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
      name: "Blockchain",
      sortOrder: 0,
      skills: [
        { name: "Solidity", proficiency: "expert", sortOrder: 0 },
        { name: "Rust (Solana)", proficiency: "expert", sortOrder: 1 },
        { name: "ZK-Proofs", proficiency: "advanced", sortOrder: 2 },
        { name: "Smart Contract Auditing", proficiency: "expert", sortOrder: 3 },
        { name: "DeFi Protocols", proficiency: "advanced", sortOrder: 4 },
      ],
    },
    {
      name: "ML & Deep Learning",
      sortOrder: 1,
      skills: [
        { name: "PyTorch", proficiency: "expert", sortOrder: 0 },
        { name: "Adversarial ML", proficiency: "expert", sortOrder: 1 },
        { name: "Reinforcement Learning", proficiency: "advanced", sortOrder: 2 },
        { name: "NLP / LLMs", proficiency: "advanced", sortOrder: 3 },
        { name: "Privacy-Preserving ML", proficiency: "expert", sortOrder: 4 },
      ],
    },
    {
      name: "Systems & Security",
      sortOrder: 2,
      skills: [
        { name: "Formal Verification", proficiency: "expert", sortOrder: 0 },
        { name: "Cryptography", proficiency: "advanced", sortOrder: 1 },
        { name: "Security Auditing", proficiency: "advanced", sortOrder: 2 },
        { name: "Distributed Systems", proficiency: "advanced", sortOrder: 3 },
        { name: "Zero-Knowledge Proofs", proficiency: "advanced", sortOrder: 4 },
      ],
    },
    {
      name: "Languages & Tools",
      sortOrder: 3,
      skills: [
        { name: "TypeScript", proficiency: "expert", sortOrder: 0 },
        { name: "Python", proficiency: "expert", sortOrder: 1 },
        { name: "Rust", proficiency: "advanced", sortOrder: 2 },
        { name: "Solidity", proficiency: "expert", sortOrder: 3 },
        { name: "Go", proficiency: "proficient", sortOrder: 4 },
      ],
    },
  ]

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

  // Site settings
  await prisma.siteSetting.upsert({
    where: { key: "hero_thesis" },
    update: {},
    create: {
      key: "hero_thesis",
      value: {
        text: "I research the security of decentralized and intelligent systems, focusing on formal verification of blockchain protocols and adversarial robustness of AI agents.",
      },
    },
  })

  await prisma.siteSetting.upsert({
    where: { key: "home_title" },
    update: {},
    create: {
      key: "home_title",
      value: "Researching the\nSecurity of\nDecentralized & AI Systems",
    },
  })

  await prisma.siteSetting.upsert({
    where: { key: "home_description" },
    update: {},
    create: {
      key: "home_description",
      value:
        "PhD applicant and researcher at the intersection of blockchain security, deep learning robustness, and agentic AI safety. Building verifiably secure decentralized systems through formal methods and cryptographic guarantees.",
    },
  })

  await prisma.siteSetting.upsert({
    where: { key: TIMELINE_SECTIONS_SETTING_KEY },
    update: {},
    create: { key: TIMELINE_SECTIONS_SETTING_KEY, value: [] },
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

  // Researching Assistant entries
  await prisma.researchingAssistant.upsert({
    where: { slug: "zk-rollup-verification-ra" },
    update: {},
    create: {
      slug: "zk-rollup-verification-ra",
      lab: "Security and Privacy Lab",
      university: "Sharif University of Technology",
      supervisor: "Dr. Amir Hossein Jahangir",
      topic: "Formal Verification of ZK-Rollup Bridges",
      startDate: new Date("2024-06-01"),
      endDate: undefined,
      description: "Researching security properties of ZK-rollup bridges using formal verification techniques. Developed an automated tool for vulnerability detection in bridge protocols.",
      outcomes: ["Paper accepted at IEEE S&P 2026", "Open-source tool released on GitHub", "Identified 3 novel vulnerability patterns in existing bridges"],
      technologies: "Rust, Z3 Prover, Solidity, Isabelle/HOL",
      status: "published",
      sortOrder: 0,
    },
  })

  await prisma.researchingAssistant.upsert({
    where: { slug: "agentic-ai-security-ra" },
    update: {},
    create: {
      slug: "agentic-ai-security-ra",
      lab: "Machine Learning Lab",
      university: "Sharif University of Technology",
      supervisor: "Dr. Mohammad Hossein Rohban",
      topic: "Adversarial Robustness in Agentic AI Systems",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-08-15"),
      description: "Investigating security vulnerabilities introduced by agency in AI systems. Demonstrated that agentic architectures create new attack surfaces through tool-use delegation and memory poisoning.",
      outcomes: ["Paper published at NeurIPS 2025", "Developed threat taxonomy for AI agents", "Proposed provable defense mechanisms"],
      technologies: "Python, PyTorch, LangChain, OpenAI API",
      status: "published",
      sortOrder: 1,
    },
  })

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
