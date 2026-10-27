/**
 * Populates topics and instructor for the Sharif M.Sc. coursework.
 *
 * Topics are distilled from the official course materials. Run against any
 * environment by pointing DATABASE_URL at it:
 *
 *   DATABASE_URL="<url>" npx tsx scripts/data/sharif-course-syllabi.ts
 *
 * Idempotent — re-running overwrites the same three fields with the same values.
 * Courses are matched by name within the Sharif timeline event only, so the
 * Amirkabir coursework is never touched.
 */
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

interface CourseSyllabus {
  name: string
  instructor?: string
  topics: string
}

const courses: CourseSyllabus[] = [
  {
    name: "Applied Cryptography",
    instructor: "Dr. Masoumeh Koochak Shooshtari",
    topics:
      "Perfect secrecy and OTP, Pseudorandomness and PRGs, CPA/CCA security, PRFs and block ciphers, MACs and HMAC, Authenticated encryption, Hash functions, AES and differential cryptanalysis, RSA and Diffie-Hellman, Elliptic curves, Digital signatures and PKI, Post-quantum cryptography",
  },
  {
    name: "Secure Software Systems",
    instructor: "Dr. Mehdi Kharrazi",
    topics:
      "Memory-corruption vulnerabilities, Control-flow hijacking and ROP, Control-Flow Integrity, Taint analysis, Symbolic and concolic execution, Fuzzing, ML-based vulnerability detection, Code property graphs, LLMs for security analysis, Automated patch generation",
  },
  {
    name: "Formal Methods in Information Security",
    instructor: "Dr. Morteza Amini",
    topics:
      "Set theory & relations, Partial orders & lattices, Discretionary access control, HRU safety, Bell-LaPadula, Denning information-flow model, Noninterference, RBAC, Attribute- & context-based access control, Access-control logic, BAN & epistemic logic, Security protocol verification, Purpose-based privacy, Secure service policy composition",
  },
  {
    name: "Foundations and Applications of Blockchain",
    instructor: "Dr. Amir Mahdi Sadeghzadeh",
    topics:
      "Cryptographic primitives, Merkle trees, Nakamoto consensus, P2P networks, Bitcoin Script, Safety and liveness, Sharding, Proof of stake, EVM and Solidity, Payment channels, Rollups, ZK data privacy",
  },
  {
    // Instructor intentionally omitted: the source material is attributed to a
    // different institution than the timeline this course sits under, so only
    // the institution-neutral technical content is recorded here.
    name: "Deep Learning",
    topics:
      "MLPs and backpropagation, Optimization and generalization, CNNs, RNNs and LSTMs, Attention and Transformers, Large language models, State-space models, VAEs and GANs, Diffusion models, Self-supervised learning, CLIP and foundation models, Graph neural networks",
  },
]

async function main() {
  const sharif = await prisma.timelineEvent.findFirst({
    where: { organization: { contains: "Sharif" }, type: "education" },
    include: { courses: { select: { id: true, name: true } } },
  })

  if (!sharif) {
    throw new Error("No Sharif education timeline event found — nothing updated.")
  }

  console.log(`Timeline: ${sharif.title} — ${sharif.organization}`)
  console.log(`Courses on record: ${sharif.courses.length}\n`)

  let updated = 0
  for (const entry of courses) {
    const match = sharif.courses.find((c) => c.name === entry.name)
    if (!match) {
      console.warn(`  SKIP  "${entry.name}" — not found in this timeline`)
      continue
    }
    await prisma.course.update({
      where: { id: match.id },
      data: {
        topics: entry.topics,
        ...(entry.instructor ? { instructor: entry.instructor } : {}),
      },
    })
    console.log(`  OK    ${entry.name}${entry.instructor ? ` (${entry.instructor})` : " (no instructor set)"}`)
    updated += 1
  }

  console.log(`\nUpdated ${updated}/${courses.length} courses.`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
