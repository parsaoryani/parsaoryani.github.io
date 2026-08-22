import type { StaticSiteData } from "@/content/site-data.schema"

export type PublicSettingMap = StaticSiteData["settings"]
export type PublicSettingKey = keyof PublicSettingMap

export interface PublicTag {
  id: string
  slug: string
  label: string
  description: string | null
  color: string | null
}

export interface PublicTagAttachment {
  tagId: string
  tag: PublicTag
}

export interface PublicPublication {
  id: string
  slug: string
  title: string
  authors: Array<{ name: string; isMe?: boolean }>
  venue: string
  venueType: "conference" | "journal" | "workshop" | "preprint" | "poster" | "talk" | "thesis"
  year: number
  publishedAt: Date
  abstract: string | null
  tldr: string | null
  contributions: Array<string | { text: string }> | null
  doi: string | null
  arxivId: string | null
  pdfUrl: string | null
  codeUrl: string | null
  projectUrl: string | null
  bibtex: string | null
  citationCount: number | null
  featured: boolean
  sortOrder: number
  ogImageUrl: string | null
  tags: PublicTagAttachment[]
}

export interface PublicProject {
  id: string
  slug: string
  title: string
  summary: string
  role: string | null
  year: number
  problem: string | null
  approach: string | null
  architecture: string | null
  challenges: string | null
  results: string | null
  retrospective: string | null
  techStack: string[] | null
  repoUrl: string | null
  demoUrl: string | null
  featured: boolean
  sortOrder: number
  ogImageUrl: string | null
  tags: PublicTagAttachment[]
}

export interface PublicCourseFile {
  id: string
  name: string
  url: string
  description: string | null
  kind: string
  size: number | null
  mimeType: string | null
  sortOrder: number
}

export interface PublicCourseLink {
  id: string
  type: string
  name: string
  url: string
  sortOrder: number
}

export interface PublicCourse {
  id: string
  name: string
  grade: string | null
  highlight: string | null
  instructor: string | null
  focus: string | null
  topics: string | null
  syllabus: string | null
  exercises: string | null
  projects: string | null
  discussions: string | null
  sortOrder: number
  files: PublicCourseFile[]
  links: PublicCourseLink[]
}

export interface PublicTimelineEvent {
  id: string
  type: "education" | "experience" | "award" | "talk" | "service" | "publication_milestone"
  title: string
  organization: string
  location: string | null
  startDate: Date
  endDate: Date | null
  description: string | null
  highlights: string[] | null
  url: string | null
  sortOrder: number
  courses: PublicCourse[]
}

export interface PublicSkill {
  id: string
  name: string
  proficiency: string | null
  sortOrder: number
}

export interface PublicSkillCategory {
  id: string
  name: string
  sortOrder: number
  skills: PublicSkill[]
}

export interface PublicTeachingAssistant {
  id: string
  slug: string
  course: string
  level: string
  university: string
  professor: string
  startDate: Date
  endDate: Date | null
  description: string | null
  highlights: string[] | null
  technologies: string | null
  sortOrder: number
}

export interface PublicResearchAssistant {
  id: string
  slug: string
  lab: string | null
  university: string
  supervisor: string | null
  supervisorUrl: string | null
  collaborator: string | null
  topic: string
  startDate: Date
  endDate: Date | null
  description: string | null
  outcomes: string[] | null
  technologies: string | null
  repoUrl: string | null
  sortOrder: number
}

export interface PublicMedia {
  id: string
  ownerType: "publication" | "project" | "page"
  ownerId: string
  url: string
  kind: "pdf" | "image" | "figure" | "poster"
  alt: string | null
  caption: string | null
  sortOrder: number
}

export interface PublicDataProvider {
  getFeaturedPublications(): Promise<PublicPublication[]>
  getAllPublications(): Promise<PublicPublication[]>
  getPublicationBySlug(slug: string): Promise<PublicPublication | null>
  getFeaturedProjects(): Promise<PublicProject[]>
  getAllProjects(): Promise<PublicProject[]>
  getProjectBySlug(slug: string): Promise<PublicProject | null>
  getAllTags(): Promise<PublicTag[]>
  getMediaForOwner(ownerType: "publication" | "project" | "page", ownerId: string): Promise<PublicMedia[]>
  getTimelineEvents(): Promise<PublicTimelineEvent[]>
  getEducationEvents(): Promise<PublicTimelineEvent[]>
  getEducationEventBySlug(slug: string): Promise<PublicTimelineEvent | null>
  getSkillCategories(): Promise<PublicSkillCategory[]>
  getLatestResearchExperience(): Promise<PublicResearchAssistant | null>
  getLatestTeachingExperience(): Promise<PublicTeachingAssistant | null>
  getAllResearchExperience(): Promise<PublicResearchAssistant[]>
  getAllTeachingExperience(): Promise<PublicTeachingAssistant[]>
  getSiteSetting<K extends PublicSettingKey>(key: K): Promise<PublicSettingMap[K]>
  getSiteSettings(): Promise<PublicSettingMap>
}

export const defaultPublicSettings: PublicSettingMap = {
  home_title: null,
  home_description: null,
  research_directions: [],
  hidden_timeline_sections: [],
  nav_research_visible: false,
  profile_photo: null,
  contact_description: null,
  contact_emails: [],
  contact_links: [],
  contact_location: null,
}
