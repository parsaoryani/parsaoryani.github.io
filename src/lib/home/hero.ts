export const HOME_SETTING_KEYS = ["home_title", "home_description"] as const

export const RESEARCH_DIRECTIONS_SETTING_KEY = "research_directions"

export const DEFAULT_TITLE_LINES = ["Security and Scalability for", "Decentralized Systems"]
export const DEFAULT_DESCRIPTION =
  "I study how decentralized systems can be made more secure, scalable, and trustworthy through rigorous systems research, cryptographic design, and practical evaluation."

export interface ResearchDirection {
  title: string
  description: string
  tags: string[]
  href?: string
  linkLabel?: string
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