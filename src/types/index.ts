import type { Prisma } from "@prisma/client"

// ---------------------------------------------------------------------------
// API Response Types
// ---------------------------------------------------------------------------

export type ApiResponse<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string; status?: number }

// ---------------------------------------------------------------------------
// Prisma Includes — reusable include objects for consistent queries
// ---------------------------------------------------------------------------

export const publicationWithTags = {
  tags: { include: { tag: true } },
} satisfies Prisma.PublicationInclude

export const projectWithTags = {
  tags: { include: { tag: true } },
} satisfies Prisma.ProjectInclude

export const timelineEventWithCourses = {
  courses: {
    include: { files: { orderBy: { sortOrder: "asc" as const } } },
    orderBy: { sortOrder: "asc" as const },
  },
} satisfies Prisma.TimelineEventInclude

export const skillCategoryWithSkills = {
  skills: { orderBy: { sortOrder: "asc" as const } },
} satisfies Prisma.SkillCategoryInclude

// ---------------------------------------------------------------------------
// Prisma Result Types — inferred types from common queries
// ---------------------------------------------------------------------------

export type PublicationWithTags = Prisma.PublicationGetPayload<{
  include: typeof publicationWithTags
}>

export type ProjectWithTags = Prisma.ProjectGetPayload<{
  include: typeof projectWithTags
}>

export type TimelineEventWithCourses = Prisma.TimelineEventGetPayload<{
  include: typeof timelineEventWithCourses
}>

export type SkillCategoryWithSkills = Prisma.SkillCategoryGetPayload<{
  include: typeof skillCategoryWithSkills
}>

// ---------------------------------------------------------------------------
// Form / Editor Types
// ---------------------------------------------------------------------------

export type Author = {
  name: string
  isMe: boolean
  affiliation?: string
}

export type Contribution = {
  text: string
  order: number
}

export type HomeTitle = {
  lines: string[]
}

export type HomeDescription = {
  text: string
}

// ---------------------------------------------------------------------------
// Admin Types
// ---------------------------------------------------------------------------

export type AdminNavItem = {
  label: string
  href: string
  icon: string
}

export type ContentStatus = "draft" | "published" | "archived" | "trash"

export type LifecycleAction =
  | "publish"
  | "archive"
  | "trash"
  | "restore"
  | "draft"

// ---------------------------------------------------------------------------
// Content Card Props
// ---------------------------------------------------------------------------

export type CardGlowColor = "cyan" | "indigo" | "emerald" | "amber" | "mist"
