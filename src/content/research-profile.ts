export const PRIMARY_EMAIL = "parsa.oryani82@sharif.edu"

export const PRIMARY_RESEARCH_STATEMENT =
  "I study the security of LLM agents and multi-agent systems, focusing on information flow, authorization, provenance, secure memory and tool use, and runtime enforcement."

export const SHORT_TRANSITION =
  "My current work applies a background in cryptography, distributed systems, and blockchain security to a new systems-security problem: controlling what AI agents may read, remember, call, and change."

export interface AboutStorySection {
  title: string
  body: string[]
}

export const ABOUT_STORY_SECTIONS: AboutStorySection[] = [
  {
    title: "Current direction",
    body: [
      "I am an M.Sc. student in Computer Engineering, specializing in Secure Computing at Sharif University of Technology. My current research focuses on the security of tool-using LLM agents and multi-agent systems.",
    ],
  },
  {
    title: "Foundations",
    body: [
      "Mathematics first shaped how I approach difficult problems. Studying Computer Science at Amirkabir University of Technology then gave me a foundation in algorithms, software development, and computational reasoning.",
      "An early interest in financial systems led me to ask how digital infrastructure establishes trust and moves value safely. Graduate-level cryptography courses turned that practical curiosity into a deeper interest in security research.",
    ],
  },
  {
    title: "Blockchain and secure systems",
    body: [
      "Cryptography, distributed systems, and financial infrastructure naturally brought me to blockchain. My work moved beyond cryptocurrencies toward protocol security, cross-chain and Layer-2 interoperability, mempool denial-of-service, and the engineering of systems that operate across partially trusted components.",
    ],
  },
  {
    title: "Why agent security now",
    body: [
      "My move into agent security was not a departure from those questions. As I tried to develop a sustained blockchain research direction from Iran, the active mentorship, frequent feedback, and research collaborators I could access locally in that area were limited. At Sharif, I found a clearer opportunity to work closely on the security of tool-using AI agents and to build a stronger research feedback loop.",
      "These systems raise familiar systems-security questions in a new setting: where trust comes from, how authority is delegated, what information may flow between components, and how unsafe actions can be prevented or contained.",
    ],
  },
  {
    title: "What carries forward",
    body: [
      "Blockchain remains an important technical foundation rather than my primary current label. Threat modeling, protocol reasoning, provenance, cryptographic verification, and distrust of implicit authority all transfer directly to the security of agents that use tools, memory, external data, and other agents.",
    ],
  },
  {
    title: "Current goal",
    body: [
      "My M.Sc. thesis investigates lifecycle security for tool-using AI agents through provenance, trust, and authority. I am interested in research collaborations, internships, and future PhD opportunities where formal security reasoning and practical system building reinforce each other.",
    ],
  },
]

export const CURRENT_RESEARCH = {
  title: "Lifecycle Security of Tool-Using AI Agents",
  status: "In progress",
  advisor: "Dr. Morteza Amini, Sharif University of Technology",
  summary:
    "My M.Sc. thesis investigates model-independent controls for changes to an agent's sources, tools, skills, and memory, and for the delegation of authority over consequential actions.",
  questions: [
    "How should provenance and trust follow data as it enters, changes, and is retrieved from agent memory?",
    "How can tool and skill updates be authorized without silently expanding an agent's effective privileges?",
    "Which runtime checks can contain unsafe information flows and consequential actions across multiple agents?",
  ],
  threatModel:
    "The working threat model includes untrusted or compromised sources, tools, skills, memory entries, and peer agents that attempt to influence decisions or obtain authority beyond their intended scope.",
  method:
    "The work currently combines systems-security modeling, information-flow and authorization concepts, prototype mechanisms, and adversarial evaluation. The design and evaluation are still evolving.",
  limitations: [
    "The research is ongoing; no completed security guarantee or publication is claimed here.",
    "The current scope prioritizes model-independent lifecycle controls rather than changes to model training or weights.",
  ],
} as const
