import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

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
      slug: "zk-bridge-verifier",
      title: "ZK-Bridge Verifier",
      summary: "Automated formal verification tool for zero-knowledge rollup bridge security.",
      role: "Lead Developer",
      status: "published" as const,
      year: 2026,
      problem: "Cross-chain bridges have been responsible for over $2B in hacks. Existing security tools are ad-hoc and miss subtle vulnerabilities specific to ZK constructions.",
      approach: "Developed a formal verification framework that models ZK-rollup bridges as transition systems and checks security properties using SMT solvers and theorem provers.",
      architecture: "The system uses a modular architecture: (1) a DSL for specifying bridge configurations, (2) an intermediate representation for formal modeling, (3) integration with Z3 and Coq for property checking, and (4) a reporting engine for vulnerability classification.",
      challenges: "Encoding ZK-specific primitives (commitments, proofs) into SMT constraints required novel modeling techniques. Balancing soundness with automation was a key trade-off.",
      results: "Applied to 10 production bridges, found 7 previously unknown vulnerabilities. 100% precision with 85% recall.",
      retrospective: "The DSL approach made the tool accessible. I would add fuzzing integration for deeper coverage.",
      techStack: ["Rust", "Z3", "Coq", "Docker", "CI/CD"],
      repoUrl: "https://github.com/parsaoryani/zk-bridge-verifier",
      featured: true,
      sortOrder: 0,
      tagIds: ["blockchain", "zk", "formal-verification"],
    },
    {
      slug: "agentic-ai-guardrails",
      title: "Agentic AI Guardrails",
      summary: "Runtime security monitoring framework for LLM-based autonomous agents.",
      role: "Research Lead",
      status: "published" as const,
      year: 2025,
      problem: "Autonomous AI agents can be manipulated through prompt injection, tool misuse, and memory poisoning. No comprehensive runtime security framework existed.",
      approach: "Built a runtime monitoring system that intercepts agent actions, applies security policies, and enforces constraints on tool use and information flow.",
      architecture: "Interceptor-based architecture with four layers: (1) input sanitization, (2) action validation, (3) information flow control, and (4) audit logging. Uses constrained decoding for safe LLM output generation.",
      challenges: "Latency overhead was the main challenge. Optimized the interceptor pipeline to add only ~50ms per action. Balancing security strictness with agent autonomy required careful policy design.",
      results: "Deployed in research environment. Blocks 94% of prompt injection attacks with <100ms overhead. Published at NeurIPS 2025.",
      retrospective: "The policy language needs to be more expressive. Next version should support probabilistic policies.",
      techStack: ["Python", "PyTorch", "FastAPI", "Redis", "Docker"],
      repoUrl: "https://github.com/parsaoryani/agentic-guardrails",
      demoUrl: "#",
      featured: true,
      sortOrder: 1,
      tagIds: ["agentic-ai", "ai-security", "deep-learning"],
    },
    {
      slug: "private-ml-on-chain",
      title: "Private ML on Chain",
      summary: "Hybrid SMPC-blockchain protocol for privacy-preserving machine learning.",
      role: "Solo",
      status: "published" as const,
      year: 2025,
      problem: "Training ML models on sensitive data requires privacy guarantees, but existing MPC solutions are too slow and blockchain solutions lack privacy.",
      approach: "Designed a hybrid protocol that splits computation: heavy ML operations run off-chain via SMPC, while settlement and verification happen on-chain.",
      architecture: "Off-chain SMPC cluster handles the computation. Merkle proofs are submitted to the smart contract for verification. Uses Shamir secret sharing for input privacy.",
      challenges: "The main challenge was the SMPC-to-blockchain communication overhead. Used batched Merkle proofs to reduce gas costs by 60%.",
      results: "Achieves 10x improvement over fully on-chain ML. Privacy guarantees equivalent to standard SMPC with abort security.",
      retrospective: "I would explore using ZK-SNARKs for proof aggregation in the next iteration.",
      techStack: ["Solidity", "Python", "MP-SPDZ", "Ethereum", "Hardhat"],
      repoUrl: "https://github.com/parsaoryani/private-ml-chain",
      featured: true,
      sortOrder: 2,
      tagIds: ["blockchain", "deep-learning", "smart-contracts"],
    },
  ]

  for (const project of projects) {
    const { tagIds, ...projectData } = project
    const created = await prisma.project.upsert({
      where: { slug: projectData.slug },
      update: {},
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
  console.log(`${projects.length} projects created`)

  // Create timeline events
  const timelineEvents = [
    {
      type: "education" as const,
      title: "M.Sc. Computer Engineering",
      organization: "Sharif University of Technology",
      location: "Tehran, Iran",
      startDate: new Date("2023-09-01"),
      endDate: null,
      description: "Thesis: Security of Decentralized and Intelligent Systems. GPA: 4.0/4.0",
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
      type: "education" as const,
      title: "B.Sc. Computer Engineering",
      organization: "Sharif University of Technology",
      location: "Tehran, Iran",
      startDate: new Date("2019-09-01"),
      endDate: new Date("2023-07-01"),
      description: "Thesis: Adversarial Robustness of Deep Neural Networks. GPA: 3.8/4.0",
      highlights: ["Ranked top 5% of graduating class", "Teaching assistant for 6 courses"],
      sortOrder: 2,
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
  ]

  for (const event of timelineEvents) {
    await prisma.timelineEvent.create({ data: event })
  }
  console.log(`${timelineEvents.length} timeline events created`)

  // Ensure the B.Sc. Computer Science (Amirkabir) education entry exists so
  // its relevant coursework has a home. Additive only — the existing Sharif
  // B.Sc. entry above is left untouched.
  let bscAmirkabir = await prisma.timelineEvent.findFirst({
    where: { title: "B.Sc. Computer Science", organization: "Amirkabir University of Technology (Tehran Polytechnic)" },
  })
  if (!bscAmirkabir) {
    bscAmirkabir = await prisma.timelineEvent.create({
      data: {
        type: "education",
        title: "B.Sc. Computer Science",
        organization: "Amirkabir University of Technology (Tehran Polytechnic)",
        startDate: new Date("2019-09-01"),
        endDate: new Date("2023-07-01"),
        sortOrder: 7,
      },
    })
    console.log("B.Sc. Computer Science (Amirkabir) timeline event created")
  }

  const mscSharif = await prisma.timelineEvent.findFirst({
    where: { title: "M.Sc. Computer Engineering", organization: "Sharif University of Technology" },
    orderBy: { createdAt: "asc" },
  })

  async function ensureCourse(timelineEventId: string, name: string, grade: string, sortOrder: number) {
    const existing = await prisma.course.findFirst({ where: { timelineEventId, name } })
    if (existing) return
    await prisma.course.create({ data: { timelineEventId, name, grade, sortOrder } })
  }

  if (mscSharif) {
    const mscCourses: [string, string][] = [
      ["Applied Cryptography", "18.9/20"],
      ["Secure Software Systems", "18.2/20"],
    ]
    let order = 0
    for (const [name, grade] of mscCourses) {
      await ensureCourse(mscSharif.id, name, grade, order++)
    }
  }

  const bscCourses: [string, string][] = [
    ["Artificial Intelligence and Lab", "20/20"],
    ["Probability I", "19.46/20"],
    ["Cryptography I", "18.75/20"],
    ["Foundations of Matrices and Linear Algebra", "18.69/20"],
    ["Special Topics in Cryptography", "18.25/20"],
    ["Design and Analysis of Algorithms", "18/20"],
    ["Advanced Programming", "18/20"],
    ["Foundations of Probability", "18/20"],
    ["Numerical Linear Algebra", "17.55/20"],
    ["Foundations of Logic and Set Theory", "17.50/20"],
  ]
  {
    let order = 0
    for (const [name, grade] of bscCourses) {
      await ensureCourse(bscAmirkabir.id, name, grade, order++)
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

  for (const catData of skillCategoriesData) {
    const { skills, ...catFields } = catData
    const category = await prisma.skillCategory.create({ data: catFields })
    for (const skill of skills) {
      await prisma.skill.create({ data: { ...skill, categoryId: category.id } })
    }
  }
  console.log(`${skillCategoriesData.length} skill categories created`)

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
