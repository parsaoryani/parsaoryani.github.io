/**
 * Syncs exercises/focus/projects text and per-HW CourseFile rows for the
 * five Sharif M.Sc. courses to any environment. Complements
 * sharif-course-syllabi.ts (syllabus/topics/instructor) and
 * link-coursework-to-github.ts (repoints existing file URLs) — this script
 * is what actually creates the CourseFile rows in a fresh environment.
 *
 *   DATABASE_URL="<url>" npx tsx scripts/data/sync-masters-coursework.ts
 *
 * Idempotent: skips creating a CourseFile if one with the same name already
 * exists under that course.
 */
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

interface FileEntry {
  name: string
  url: string
  description: string
  kind: string
}

interface CourseUpdate {
  name: string
  focus: string
  exercises: string
  projects: string
  files: FileEntry[]
}

const courses: CourseUpdate[] = [
  {
    name: "Applied Cryptography",
    focus: "Formal security definitions, reduction-based proofs, and practical protocol design across classical and modern cryptography",
    exercises: "",
    projects: "ZK-Mixer: Zero-knowledge mixer implementation demonstrating advanced cryptographic protocol design",
    files: [],
  },
  {
    name: "Secure Software Systems",
    focus: "Software security theory with practical exploitation, static/dynamic analysis, automated testing, and AI-assisted vulnerability detection",
    exercises: "HW1: Memory corruption & exploitation (format string, ROP, CVE analysis, remote pwn). HW2: Fuzzing (Atheris) + static analysis (AST + Z3). HW3: LLM-based vulnerability detection (context strategies, 3-stage pipeline, patch generation, model comparison). See files for details.",
    projects: "Agentic Vulnerability Detection: Iterative LLM agent with CodeQL integration, SARIF parsing, confidence scoring, tools for regex/grep extraction, dangerous pattern detection, caller identification; analyzed nginx (10K+ LOC); 10-page report on architecture, execution traces, comparative analysis, real-world findings",
    files: [
      { name: "HW1: Memory Corruption & Exploitation", url: "https://github.com/parsaoryani/courses/blob/main/masters/secure-software-systems/HW/ce815-041-hw1.pdf", description: "Format string, ROP, CVE exploitation, remote pwn challenges", kind: "pdf" },
      { name: "HW2: Fuzzing & Static Analysis", url: "https://github.com/parsaoryani/courses/blob/main/masters/secure-software-systems/HW/ce815-041-hw2.pdf", description: "Atheris fuzzing, SAT static analyzer with Z3", kind: "pdf" },
      { name: "HW3: LLM-Based Vulnerability Detection", url: "https://github.com/parsaoryani/courses/blob/main/masters/secure-software-systems/HW/ce815-041-hw3.pdf", description: "Context strategies, 3-stage pipeline, patch generation, model comparison", kind: "pdf" },
      { name: "Project: Agentic Vulnerability Detection", url: "https://github.com/parsaoryani/courses/blob/main/masters/secure-software-systems/ce815-041-project.pdf", description: "Iterative LLM agent with CodeQL integration, nginx analysis", kind: "pdf" },
    ],
  },
  {
    name: "Formal Methods in Information Security",
    focus: "Formal modeling of security policies and verification of secure systems using logical and structural reasoning",
    exercises: "HW1: Access control models & policy specification. HW2: Logic-based reasoning & information flow control. HW3: Formal protocol verification. All in English & Persian. See files for details.",
    projects: "Formal Verification of ZK-Rollup Security Mechanisms: Applied formal methods to verify security properties of ZK-Rollup protocols",
    files: [
      { name: "HW1: Access Control Models (English)", url: "https://github.com/parsaoryani/courses/blob/main/masters/formal-methods-in-information-security/HW/FMS_HW1_EN.pdf", description: "Access control models and policy specification", kind: "pdf" },
      { name: "HW1: Access Control Models (Persian)", url: "https://github.com/parsaoryani/courses/blob/main/masters/formal-methods-in-information-security/HW/FMS_HW1_FA.pdf", description: "Access control models and policy specification (Persian)", kind: "pdf" },
      { name: "HW2: Logic & Information Flow (English)", url: "https://github.com/parsaoryani/courses/blob/main/masters/formal-methods-in-information-security/HW/FMS_HW2_EN.pdf", description: "Security policies, logic-based reasoning, information flow", kind: "pdf" },
      { name: "HW2: Logic & Information Flow (Persian)", url: "https://github.com/parsaoryani/courses/blob/main/masters/formal-methods-in-information-security/HW/FMS_HW2_FA.pdf", description: "Security policies, logic-based reasoning, information flow (Persian)", kind: "pdf" },
      { name: "HW3: Protocol Verification (English)", url: "https://github.com/parsaoryani/courses/blob/main/masters/formal-methods-in-information-security/HW/FMS_HW3_EN.pdf", description: "Formal protocol verification and analysis", kind: "pdf" },
      { name: "HW3: Protocol Verification (Persian)", url: "https://github.com/parsaoryani/courses/blob/main/masters/formal-methods-in-information-security/HW/FMS_HW3_FA.pdf", description: "Formal protocol verification and analysis (Persian)", kind: "pdf" },
    ],
  },
  {
    name: "Foundations and Applications of Blockchain",
    focus: "Core distributed systems and cryptographic ideas applied to real blockchain protocols, consensus design, scalability, and practical application-level analysis",
    exercises: "HW1: Blockchain foundations (mempool, Merkle trees, P2P, mining, Bitcoin Script). HW2: Consensus & selfish mining (protocol divergence, difficulty, mempool, safety/liveness, simulator). HW3: Network efficiency & smart contracts (propagation, reentrancy, NFT sale). See files for details.",
    projects: "opML: Optimistic Machine Learning on Blockchain — Optimistic execution of ML inference on-chain with fraud proofs. ZKsync Protocol: Analysis and implementation of ZK-Rollup scaling solution with zero-knowledge proofs.",
    files: [
      { name: "HW1: Blockchain Foundations (English)", url: "https://github.com/parsaoryani/courses/blob/main/masters/foundations-and-applications-of-blockchain/HW/hw1/HW1_Blockchain_EN.pdf", description: "Mempool, Merkle trees, P2P network, mining difficulty, Bitcoin Script", kind: "pdf" },
      { name: "HW1: Blockchain Foundations (Persian)", url: "https://github.com/parsaoryani/courses/blob/main/masters/foundations-and-applications-of-blockchain/HW/hw1/HW1_Blockchain_FA.pdf", description: "Mempool, Merkle trees, P2P network, mining difficulty, Bitcoin Script (Persian)", kind: "pdf" },
      { name: "HW2: Consensus, Mempools, Selfish Mining (English)", url: "https://github.com/parsaoryani/courses/blob/main/masters/foundations-and-applications-of-blockchain/HW/hw2/HW2_Blockchain_EN.pdf", description: "Protocol divergence, difficulty, mempool, safety/liveness, selfish mining", kind: "pdf" },
      { name: "HW2: Consensus, Mempools, Selfish Mining (Persian)", url: "https://github.com/parsaoryani/courses/blob/main/masters/foundations-and-applications-of-blockchain/HW/hw2/HW2_Blockchain_FA.pdf", description: "Protocol divergence, difficulty, mempool, safety/liveness, selfish mining (Persian)", kind: "pdf" },
      { name: "HW2 Practical: Selfish Mining Simulator", url: "https://github.com/parsaoryani/courses/tree/main/masters/foundations-and-applications-of-blockchain/HW/hw2/Practical", description: "Selfish mining simulator with difficulty retargeting experiments", kind: "pdf" },
      { name: "HW3: Network Efficiency & Smart Contracts (English)", url: "https://github.com/parsaoryani/courses/blob/main/masters/foundations-and-applications-of-blockchain/HW/hw3/HW3_Blockchain_EN.pdf", description: "Network propagation, reentrancy, NFT sale contract security", kind: "pdf" },
      { name: "HW3: Network Efficiency & Smart Contracts (Persian)", url: "https://github.com/parsaoryani/courses/blob/main/masters/foundations-and-applications-of-blockchain/HW/hw3/HW3_Blockchain_FA.pdf", description: "Network propagation, reentrancy, NFT sale contract security (Persian)", kind: "pdf" },
    ],
  },
  {
    name: "Deep Learning",
    focus: "Foundational theory and applied practical work in model development, evaluation, and analysis across deep learning paradigms from classical MLPs to modern transformers, generative models, and foundation-model style training",
    exercises: "5 HWs × 3 parts each: HW1 (PyTorch basics, NumPy NN from scratch, optimization), HW2 (CNNs, vision, RNNs/LSTMs), HW3 (Transformers, LLMs, state-space), HW4 (VAEs, GANs, diffusion), HW5 (Self-supervised, CLIP, DALL-E, GNNs, interpretability). See files for details.",
    projects: "All assignments are structured as multi-part practical exercises (P1–P3 each) combining implementation, experiments, and conceptual analysis; no separate final project — the 5 homeworks collectively cover the full deep learning pipeline from classical networks to frontier generative models.",
    files: [
      { name: "HW1 P1: PyTorch Basics", url: "https://github.com/parsaoryani/courses/tree/main/masters/deep-learning/HW/hw1/P1_HW1", description: "Tensor creation, indexing, slicing, constructors, dtypes, operations", kind: "ipynb" },
      { name: "HW1 P2: NN from Scratch (NumPy)", url: "https://github.com/parsaoryani/courses/tree/main/masters/deep-learning/HW/hw1/P2_HW1", description: "Affine/ReLU/Sigmoid forward-backward, FullyConnectedNet, Solver, gradient checking", kind: "ipynb" },
      { name: "HW1 P3: Optimization Methods", url: "https://github.com/parsaoryani/courses/tree/main/masters/deep-learning/HW/hw1/P3_HW1", description: "GD, Momentum, RMSProp, Adam, second-order methods, visualization", kind: "ipynb" },
      { name: "HW2 P1: Emoji Classification", url: "https://github.com/parsaoryani/courses/tree/main/masters/deep-learning/HW/hw2/P1-HW2", description: "CNN for emoji classification", kind: "ipynb" },
      { name: "HW2 P2: CAPTCHA Segmentation", url: "https://github.com/parsaoryani/courses/tree/main/masters/deep-learning/HW/hw2/P2-HW2", description: "CNN for CAPTCHA segmentation", kind: "ipynb" },
      { name: "HW2 P3: RNN Implementation", url: "https://github.com/parsaoryani/courses/tree/main/masters/deep-learning/HW/hw2/P3-HW2", description: "Custom LSTM/RNN implementation", kind: "ipynb" },
      { name: "HW3 P1", url: "https://github.com/parsaoryani/courses/blob/main/masters/deep-learning/HW/hw3/P1-HW3.ipynb", description: "Transformer/attention exercises", kind: "ipynb" },
      { name: "HW3 P2: Inference Techniques", url: "https://github.com/parsaoryani/courses/tree/main/masters/deep-learning/HW/hw3/P2-HW3", description: "LLM inference: CoT, self-consistency, few-shot, self-refinement", kind: "ipynb" },
      { name: "HW3 P3", url: "https://github.com/parsaoryani/courses/blob/main/masters/deep-learning/HW/hw3/P3-HW3.ipynb", description: "State-space models", kind: "ipynb" },
      { name: "HW4 P1: README", url: "https://github.com/parsaoryani/courses/blob/main/masters/deep-learning/HW/hw4/P1_HW4/README.txt", description: "VAE/GAN exercises", kind: "txt" },
      { name: "HW4 P2: Diffusion Models", url: "https://github.com/parsaoryani/courses/blob/main/masters/deep-learning/HW/hw4/P2_HW4.ipynb", description: "Diffusion models", kind: "ipynb" },
      { name: "HW4 P3: Advanced Generative", url: "https://github.com/parsaoryani/courses/blob/main/masters/deep-learning/HW/hw4/P3_HW4.ipynb", description: "Advanced generative models", kind: "ipynb" },
      { name: "HW5 P1: Self-Supervised Learning", url: "https://github.com/parsaoryani/courses/blob/main/masters/deep-learning/HW/hw5/P1_HW5.ipynb", description: "Self-supervised/contrastive learning", kind: "ipynb" },
      { name: "HW5 P2: CLIP/Multimodal", url: "https://github.com/parsaoryani/courses/blob/main/masters/deep-learning/HW/hw5/P2_HW5.ipynb", description: "CLIP/multimodal alignment", kind: "ipynb" },
      { name: "HW5 P3: DALL-E/GNNs/Interpretability", url: "https://github.com/parsaoryani/courses/blob/main/masters/deep-learning/HW/hw5/P3_HW5.ipynb", description: "DALL-E/GNNs/interpretability", kind: "ipynb" },
    ],
  },
]

async function main() {
  const sharif = await prisma.timelineEvent.findFirst({
    where: { organization: { contains: "Sharif" }, type: "education" },
    include: { courses: { include: { files: { select: { name: true } } } } },
  })

  if (!sharif) {
    throw new Error("No Sharif education timeline event found — nothing updated.")
  }

  console.log(`Timeline: ${sharif.title} — ${sharif.organization}\n`)

  let filesCreated = 0
  for (const entry of courses) {
    const match = sharif.courses.find((c) => c.name === entry.name)
    if (!match) {
      console.warn(`  SKIP  "${entry.name}" — not found in this timeline`)
      continue
    }

    await prisma.course.update({
      where: { id: match.id },
      data: { focus: entry.focus, exercises: entry.exercises || null, projects: entry.projects },
    })

    const existingNames = new Set(match.files.map((f) => f.name))
    let created = 0
    for (const [i, file] of entry.files.entries()) {
      if (existingNames.has(file.name)) continue
      await prisma.courseFile.create({
        data: {
          courseId: match.id,
          name: file.name,
          url: file.url,
          description: file.description,
          kind: file.kind,
          sortOrder: i,
        },
      })
      created += 1
    }
    filesCreated += created
    console.log(`  OK    ${entry.name} — ${created} file(s) created (${entry.files.length - created} already present)`)
  }

  console.log(`\nTotal new CourseFile rows: ${filesCreated}`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
