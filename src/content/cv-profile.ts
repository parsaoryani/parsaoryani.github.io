import { PRIMARY_EMAIL, PRIMARY_RESEARCH_STATEMENT } from "@/content/research-profile"

export const CV_PROFILE = {
  name: "Parsa Oryani",
  headline: "M.Sc. Computer Engineering · Secure Computing",
  institution: "Sharif University of Technology",
  email: PRIMARY_EMAIL,
  location: "Tehran, Iran",
  researchStatement: PRIMARY_RESEARCH_STATEMENT,
  website: "https://parsaoryani.github.io/",
  github: "https://github.com/parsaoryani",
  linkedin: "https://www.linkedin.com/in/parsa-oryani/",
} as const

export const CV_SELECTED_PROJECTS = [
  {
    title: "ZK-Mixer: Regulated Anonymous Payments",
    year: 2026,
    href: "/projects/zk-mixer",
    summary: "Research prototype exploring privacy with tiered disclosure for authorized audit scenarios.",
  },
  {
    title: "Ethereum CLI (Sepolia Testnet)",
    year: 2025,
    href: "/projects/ethereum-cli",
    summary: "Prototype CLI with encrypted local key storage, scoped network access, and direct-aware RPC handling.",
  },
  {
    title: "BRCC: Besu Research Control Center",
    year: 2025,
    href: "/projects/brcc-lab",
    summary: "Research control plane for safety-gated, reproducible experiments on a local Besu QBFT network.",
  },
] as const

