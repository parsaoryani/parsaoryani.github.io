export const HOME_SETTING_KEYS = ["home_title", "home_description"] as const

export const DEFAULT_TITLE_LINES = ["Researching the", "Security of", "Decentralized & AI Systems"]
export const DEFAULT_DESCRIPTION =
  "PhD applicant and researcher at the intersection of blockchain security, deep learning robustness, and agentic AI safety. Building verifiably secure decentralized systems through formal methods and cryptographic guarantees."

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