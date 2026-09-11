import { ScrollReveal } from "@/components/ui/scroll-reveal"

const coreResearchFoundations = [
  {
    category: "Agent Security & Runtime Enforcement",
    areas: [
      { name: "Information-Flow Control", examples: "Taint Tracking · Declassification · Isolation" },
      { name: "Authorization & Least Privilege", examples: "Capabilities · Delegation · Consent" },
      { name: "Runtime Enforcement", examples: "Policy Guards · Shielding · User Approval" },
    ],
  },
  {
    category: "Agent Architecture & Trust",
    areas: [
      { name: "Provenance", examples: "Data Lineage · Event Dependencies · Risk Accumulation" },
      { name: "Trust & Authority", examples: "Source Verification · Version Pinning · Delegation Chains" },
      { name: "Tool, Skill & Memory Interactions", examples: "Tool Isolation · Memory Scoping · Update Safety" },
    ],
  },
  {
    category: "Formal & Security Analysis",
    areas: [
      { name: "Security Models & Invariants", examples: "Threat Models · Adversary Models · Security Invariants" },
      { name: "Static & Dynamic Analysis", examples: "Taint / Data-Flow · SMT · Model Checking · Fuzzing" },
      { name: "Protocol & Systems Security", examples: "Safety · Liveness · Recovery from Unsafe Effects" },
    ],
  },
  {
    category: "Blockchain & Cryptographic Foundations",
    areas: [
      { name: "Consensus & Scalability", examples: "Safety / Liveness · Layer-1 & Layer-2" },
      { name: "Applied Cryptography", examples: "Commitments · Merkle Structures · ZK Proof Concepts" },
      { name: "Cross-Chain & Mempool Security", examples: "Interoperability · State Verification · Transaction-Pool DoS" },
    ],
  },
]

const engineeringToolkit = [
  {
    category: "Agent & ML Engineering",
    areas: [
      { name: "LLM Agent Systems", examples: "Multi-Agent Orchestration · Tool/MCP Integration" },
      { name: "Knowledge & Memory", examples: "RAG · Prompting · Agent State" },
      { name: "Applied ML", examples: "PyTorch · Transformers · Model Evaluation" },
    ],
  },
  {
    category: "Systems & Security Engineering",
    areas: [
      { name: "Languages & Runtimes", examples: "Python · Rust · TypeScript · C++" },
      { name: "Analysis & Verification", examples: "Static Analysis · CodeQL · Z3" },
      { name: "Infrastructure", examples: "PostgreSQL · Docker · Linux · Git" },
    ],
  },
  {
    category: "Blockchain Engineering",
    areas: [
      { name: "Ethereum", examples: "EVM · Solidity · JSON-RPC" },
      { name: "Private Chain Infrastructure", examples: "Hyperledger Besu · QBFT" },
      { name: "Experiment Tooling", examples: "FastAPI · Prometheus · Grafana" },
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
