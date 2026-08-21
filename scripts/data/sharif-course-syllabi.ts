/**
 * Populates syllabus, topics, and instructor for the Sharif M.Sc. coursework.
 *
 * Content is transcribed from the official course syllabi. Run against any
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
  syllabus: string
}

const courses: CourseSyllabus[] = [
  {
    name: "Applied Cryptography",
    instructor: "Dr. Masoumeh Koochak Shooshtari",
    topics:
      "Perfect secrecy & OTP, Pseudorandomness & PRGs, CPA/CCA security, PRFs & block ciphers, MACs & HMAC, Authenticated encryption, Hash functions, AES & differential cryptanalysis, RSA & Diffie-Hellman, Elliptic curves, Digital signatures & PKI, Post-quantum cryptography",
    syllabus:
      "Classical cryptography and cryptanalysis of shift, substitution, and Vigenère ciphers; perfect secrecy, the one-time pad, and its limitations; computational secrecy and indistinguishability; pseudorandom generators and the pseudo-OTP construction; CPA-security with pseudorandom functions and permutations; modes of operation including ECB, CBC, CTR, OFB, and CFB; message authentication codes, CBC-MAC, and HMAC; CCA-security, ciphertext malleability, and padding-oracle attacks; authenticated encryption and AEAD; hash functions, the Merkle-Damgård construction, and attacks on hash functions; the random-oracle model; block-cipher design with substitution-permutation networks and Feistel structures, DES and AES; differential cryptanalysis; computational number theory and public-key cryptography; RSA, Diffie-Hellman, and elliptic-curve cryptography; digital signatures, PKI, and TLS; post-quantum cryptography",
  },
  {
    name: "Secure Software Systems",
    instructor: "Dr. Mehdi Kharrazi",
    topics:
      "Memory-corruption vulnerabilities, Control-flow hijacking & ROP, Control-Flow Integrity, Taint analysis, Symbolic & concolic execution, Fuzzing, ML-based vulnerability detection, Code property graphs, LLMs for security analysis, Automated patch generation",
    syllabus:
      "Classical software vulnerabilities including buffer, integer, and format-string flaws; control-flow hijacking and return-oriented programming; runtime protection, control-flow integrity, and code-pointer integrity; data-flow and taint analysis; static program analysis, symbolic and concolic execution; automated test generation and fuzzing; machine-learning approaches to vulnerability detection; representation learning for source code and code property graphs; graph-based program analysis; LLM-based vulnerability detection and code reasoning; retrieval-augmented generation for security analysis; automated vulnerability explanation and patch generation; reliability and hallucination challenges in LLM-driven security tooling",
  },
  {
    name: "Formal Methods in Information Security",
    instructor: "Dr. Morteza Amini",
    // Topics render as chips split on commas, so no entry may contain a comma.
    topics:
      "Discretionary & mandatory access control, Role-based access control, Bell-LaPadula, Harrison-Ruzzo-Ullman, Lattice-based information flow, Classical & modal logic, Information-flow control, Security protocol verification",
    syllabus:
      "Foundations of formal methods including set theory, relations, partial orders, and classical and modal logics; formal specification of security policies and security models; confidentiality and integrity properties; discretionary, mandatory, role-based, and attribute-based access control; Lampson's protection model; the Harrison-Ruzzo-Ullman model; the Bell-LaPadula model; Denning's lattice model for secure information flow; information-flow control; formal verification of security protocols; proving security properties and identifying protocol design flaws",
  },
  {
    name: "Foundations and Applications of Blockchain",
    instructor: "Dr. Amir Mahdi Sadeghzadeh",
    topics:
      "Cryptographic primitives, Merkle trees, Nakamoto consensus, P2P networks, Bitcoin Script, Safety & liveness, Sharding, Proof of stake, EVM & Solidity, Payment channels, Rollups, ZK data privacy",
    syllabus:
      "Cryptographic primitives and Merkle trees; Nakamoto consensus; peer-to-peer network design; Bitcoin transactions and Script; Bitcoin safety and liveness; Layer-1 scaling of throughput and latency; sharding; proof of stake; Ethereum, the EVM, Solidity, and smart contracts; Layer-2 scaling with side blockchains; payment channels; rollups; data privacy via zero-knowledge proofs",
  },
  {
    // Instructor intentionally omitted: the source syllabus is attributed to a
    // different institution than the timeline this course sits under, so only
    // the institution-neutral technical content is recorded here.
    name: "Deep Learning",
    topics:
      "MLPs & backpropagation, Optimization & generalization, CNNs, RNNs & LSTMs, Attention & Transformers, Large language models, State-space models, VAEs & GANs, Diffusion models, Self-supervised learning, CLIP & foundation models, Graph neural networks",
    syllabus:
      "Multi-layer perceptrons, the universal approximation theorem, and back-propagation; optimization and generalization; training techniques; convolutional neural networks, architectures, and visualization; CNNs for segmentation and object detection; recurrent networks, LSTMs, word embeddings, and language modelling; attention and Transformers including BERT, T5, GPT, and ViT; large language models; recent state-space models; generative models spanning VAEs, GANs, and diffusion models; self-supervised learning with pretext tasks and contrastive learning; text-image foundation models such as CLIP and DALL-E; graph neural networks; understanding and interpreting deep networks",
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
        syllabus: entry.syllabus,
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
