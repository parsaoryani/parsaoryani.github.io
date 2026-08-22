/**
 * Points every existing CourseFile.url at the public GitHub mirror
 * (github.com/parsaoryani/courses) instead of a local /coursework/ path, so
 * the site links out to GitHub rather than serving downloads itself.
 *
 * Matched by exact CourseFile.name, which is already unique per course.
 * Run against any environment:
 *
 *   DATABASE_URL="<url>" npx tsx scripts/data/link-coursework-to-github.ts
 */
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const REPO = "https://github.com/parsaoryani/courses"

// Folders link to `tree`, single files link to `blob`.
const files: Record<string, string> = {
  // Secure Software Systems
  "HW1: Memory Corruption & Exploitation": `${REPO}/blob/main/masters/secure-software-systems/HW/ce815-041-hw1.pdf`,
  "HW2: Fuzzing & Static Analysis": `${REPO}/blob/main/masters/secure-software-systems/HW/ce815-041-hw2.pdf`,
  "HW3: LLM-Based Vulnerability Detection": `${REPO}/blob/main/masters/secure-software-systems/HW/ce815-041-hw3.pdf`,
  "Project: Agentic Vulnerability Detection": `${REPO}/blob/main/masters/secure-software-systems/ce815-041-project.pdf`,

  // Formal Methods in Information Security
  "HW1: Access Control Models (English)": `${REPO}/blob/main/masters/formal-methods-in-information-security/HW/FMS_HW1_EN.pdf`,
  "HW1: Access Control Models (Persian)": `${REPO}/blob/main/masters/formal-methods-in-information-security/HW/FMS_HW1_FA.pdf`,
  "HW2: Logic & Information Flow (English)": `${REPO}/blob/main/masters/formal-methods-in-information-security/HW/FMS_HW2_EN.pdf`,
  "HW2: Logic & Information Flow (Persian)": `${REPO}/blob/main/masters/formal-methods-in-information-security/HW/FMS_HW2_FA.pdf`,
  "HW3: Protocol Verification (English)": `${REPO}/blob/main/masters/formal-methods-in-information-security/HW/FMS_HW3_EN.pdf`,
  "HW3: Protocol Verification (Persian)": `${REPO}/blob/main/masters/formal-methods-in-information-security/HW/FMS_HW3_FA.pdf`,

  // Foundations and Applications of Blockchain
  "HW1: Blockchain Foundations (English)": `${REPO}/blob/main/masters/foundations-and-applications-of-blockchain/HW/hw1/HW1_Blockchain_EN.pdf`,
  "HW1: Blockchain Foundations (Persian)": `${REPO}/blob/main/masters/foundations-and-applications-of-blockchain/HW/hw1/HW1_Blockchain_FA.pdf`,
  "HW2: Consensus, Mempools, Selfish Mining (English)": `${REPO}/blob/main/masters/foundations-and-applications-of-blockchain/HW/hw2/HW2_Blockchain_EN.pdf`,
  "HW2: Consensus, Mempools, Selfish Mining (Persian)": `${REPO}/blob/main/masters/foundations-and-applications-of-blockchain/HW/hw2/HW2_Blockchain_FA.pdf`,
  "HW2 Practical: Selfish Mining Simulator": `${REPO}/tree/main/masters/foundations-and-applications-of-blockchain/HW/hw2/Practical`,
  "HW3: Network Efficiency & Smart Contracts (English)": `${REPO}/blob/main/masters/foundations-and-applications-of-blockchain/HW/hw3/HW3_Blockchain_EN.pdf`,
  "HW3: Network Efficiency & Smart Contracts (Persian)": `${REPO}/blob/main/masters/foundations-and-applications-of-blockchain/HW/hw3/HW3_Blockchain_FA.pdf`,

  // Deep Learning
  "HW1 P1: PyTorch Basics": `${REPO}/tree/main/masters/deep-learning/HW/hw1/P1_HW1`,
  "HW1 P2: NN from Scratch (NumPy)": `${REPO}/tree/main/masters/deep-learning/HW/hw1/P2_HW1`,
  "HW1 P3: Optimization Methods": `${REPO}/tree/main/masters/deep-learning/HW/hw1/P3_HW1`,
  "HW2 P1: Emoji Classification": `${REPO}/tree/main/masters/deep-learning/HW/hw2/P1-HW2`,
  "HW2 P2: CAPTCHA Segmentation": `${REPO}/tree/main/masters/deep-learning/HW/hw2/P2-HW2`,
  "HW2 P3: RNN Implementation": `${REPO}/tree/main/masters/deep-learning/HW/hw2/P3-HW2`,
  "HW3 P1": `${REPO}/blob/main/masters/deep-learning/HW/hw3/P1-HW3.ipynb`,
  "HW3 P2: Inference Techniques": `${REPO}/tree/main/masters/deep-learning/HW/hw3/P2-HW3`,
  "HW3 P3": `${REPO}/blob/main/masters/deep-learning/HW/hw3/P3-HW3.ipynb`,
  "HW4 P1: README": `${REPO}/blob/main/masters/deep-learning/HW/hw4/P1_HW4/README.txt`,
  "HW4 P2: Diffusion Models": `${REPO}/blob/main/masters/deep-learning/HW/hw4/P2_HW4.ipynb`,
  "HW4 P3: Advanced Generative": `${REPO}/blob/main/masters/deep-learning/HW/hw4/P3_HW4.ipynb`,
  "HW5 P1: Self-Supervised Learning": `${REPO}/blob/main/masters/deep-learning/HW/hw5/P1_HW5.ipynb`,
  "HW5 P2: CLIP/Multimodal": `${REPO}/blob/main/masters/deep-learning/HW/hw5/P2_HW5.ipynb`,
  "HW5 P3: DALL-E/GNNs/Interpretability": `${REPO}/blob/main/masters/deep-learning/HW/hw5/P3_HW5.ipynb`,
}

async function main() {
  const all = await prisma.courseFile.findMany({ select: { id: true, name: true, url: true } })
  console.log(`CourseFile rows on record: ${all.length}\n`)

  let updated = 0
  for (const row of all) {
    const target = files[row.name]
    if (!target) {
      console.warn(`  SKIP  "${row.name}" — no GitHub mapping`)
      continue
    }
    if (row.url === target) {
      console.log(`  SAME  ${row.name}`)
      continue
    }
    await prisma.courseFile.update({ where: { id: row.id }, data: { url: target } })
    console.log(`  OK    ${row.name} -> ${target}`)
    updated += 1
  }

  console.log(`\nUpdated ${updated}/${all.length} file URLs.`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
