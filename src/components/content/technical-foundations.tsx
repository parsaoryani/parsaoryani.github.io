import { ScrollReveal } from "@/components/ui/scroll-reveal"

const coreResearchFoundations = [
  {
    category: "Blockchain Systems & Scalability",
    areas: [
      { name: "Layer 1", examples: "Sharding · Consensus · Fault Tolerance" },
      { name: "Layer 2", examples: "Rollups · Payment Channels · State Channels" },
      { name: "Scalability", examples: "Parallel Execution · Transaction Processing" },
    ],
  },
  {
    category: "Protocol & Blockchain Security",
    areas: [
      { name: "Mempool Security", examples: "Transaction-Pool DoS · Resource Exhaustion" },
      { name: "Smart Contract Security", examples: "EVM Contracts · Protocol Logic" },
      { name: "Bridge & Interoperability Security", examples: "Trust Models · Verification Failures" },
    ],
  },
  {
    category: "Cryptographic Mechanisms",
    areas: [
      { name: "Zero-Knowledge Proofs", examples: "zk-SNARKs · Private Transactions" },
      { name: "Commitment & Authentication Structures", examples: "Merkle Trees · Hash Commitments" },
      { name: "Privacy-Preserving Protocols", examples: "Mixers · Shielded Payments" },
    ],
  },
  {
    category: "Formal & Security Analysis",
    areas: [
      { name: "Security Models", examples: "Adversary Models · Trust Models · Threat Models" },
      { name: "Protocol Security Analysis", examples: "Safety · Liveness · Atomicity" },
      { name: "Formal Reasoning", examples: "Protocol Properties · Security Guarantees" },
    ],
  },
]

const engineeringToolkit = [
  {
    category: "Blockchain Engineering",
    areas: [
      { name: "Ethereum", examples: "EVM · Solidity · JSON-RPC" },
      { name: "Solana", examples: "Rust · Anchor · SPL Tokens" },
      { name: "Private Blockchain Infrastructure", examples: "Hyperledger Besu · QBFT" },
    ],
  },
  {
    category: "Programming & Infrastructure",
    areas: [
      { name: "Programming Languages", examples: "Python · TypeScript · Rust" },
      { name: "Web & Tooling", examples: "React · Next.js · Docker" },
      { name: "Data & Infrastructure", examples: "PostgreSQL · AWS · Linux" },
    ],
  },
  {
    category: "AI & ML Systems",
    areas: [
      { name: "Deep Learning", examples: "Neural Networks · Training" },
      { name: "LLM Systems", examples: "Agents · RAG" },
      { name: "Machine Learning", examples: "Classical ML · Applied Models" },
    ],
  },
]

export function TechnicalFoundations() {
  return (
    <>
      <div className="mb-10">
        <p className="text-xs font-mono uppercase tracking-wider text-fog/80 mb-4 flex items-center gap-3">
          Core Research Foundations
          <span className="h-px flex-1 bg-slate-800" />
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          {coreResearchFoundations.map((group, i) => (
            <ScrollReveal key={group.category} direction="up" delay={i * 60}>
              <div className="h-full p-5 rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-800/30 backdrop-blur-sm hover:border-cyan/20 transition-all duration-300">
                <h3 className="text-xs font-mono uppercase tracking-wider text-cyan mb-3.5">{group.category}</h3>
                <div className="space-y-3">
                  {group.areas.map((area) => (
                    <div key={area.name}>
                      <p className="text-sm font-medium text-fog">{area.name}</p>
                      <p className="text-xs text-mist/70 mt-0.5">{area.examples}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-mono uppercase tracking-wider text-ash mb-4 flex items-center gap-3">
          Engineering & Computational Toolkit
          <span className="h-px flex-1 bg-slate-800" />
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {engineeringToolkit.map((group, i) => (
            <ScrollReveal key={group.category} direction="up" delay={i * 60}>
              <div className="h-full p-4 rounded-xl border border-slate-800/60 bg-slate-900/40 hover:border-slate-700 transition-all duration-300">
                <h3 className="text-[11px] font-mono uppercase tracking-wider text-fog/60 mb-3">{group.category}</h3>
                <div className="space-y-2.5">
                  {group.areas.map((area) => (
                    <div key={area.name}>
                      <p className="text-[13px] font-medium text-mist">{area.name}</p>
                      <p className="text-xs text-mist/50 mt-0.5">{area.examples}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </>
  )
}