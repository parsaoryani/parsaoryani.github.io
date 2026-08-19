export const HOME_SETTING_KEYS = ["home_title", "home_description"] as const

export const RESEARCH_DIRECTIONS_SETTING_KEY = "research_directions"

export const DEFAULT_TITLE_LINES = ["Secure and Scalable", "Decentralized Systems"]
export const DEFAULT_DESCRIPTION =
  "M.Sc. student in Computer Engineering at Sharif University of Technology, interested in the security and scalability of decentralized systems. My current research focuses on blockchain security, cross-chain and Layer-2 interoperability, with broader interests in applied cryptography, zero-knowledge proofs, formal methods, and distributed systems."

export interface ResearchDirection {
  title: string
  description: string
  tags: string[]
}

export function parseResearchDirections(value: unknown): ResearchDirection[] {
  if (!Array.isArray(value)) return []
  return value.filter(
    (v): v is ResearchDirection =>
      typeof v === "object" && v !== null && typeof (v as ResearchDirection).title === "string"
  )
}

export function parseHomeTitle(value: unknown): string[] {
  if (typeof value !== "string") return DEFAULT_TITLE_LINES
  const lines = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
  return lines.length > 0 ? lines : DEFAULT_TITLE_LINES
}

export function parseHomeDescription(value: unknown): string {
  if (typeof value !== "string") return DEFAULT_DESCRIPTION
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : DEFAULT_DESCRIPTION
}