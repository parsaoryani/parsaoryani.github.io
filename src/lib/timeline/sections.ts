export const TIMELINE_SECTIONS_SETTING_KEY = "hidden_timeline_sections"

export const TIMELINE_SECTION_TYPES = [
  "education",
  "experience",
  "award",
  "talk",
  "service",
  "publication_milestone",
] as const

export type TimelineSectionType = (typeof TIMELINE_SECTION_TYPES)[number]

export const TIMELINE_SECTION_LABELS: Record<TimelineSectionType, string> = {
  education: "Education",
  experience: "Experience",
  award: "Awards",
  talk: "Talks",
  service: "Service",
  publication_milestone: "Publication Milestones",
}

export function parseHiddenSections(value: unknown): TimelineSectionType[] {
  if (!Array.isArray(value)) return []
  return value.filter((v): v is TimelineSectionType =>
    (TIMELINE_SECTION_TYPES as readonly string[]).includes(v)
  )
}
