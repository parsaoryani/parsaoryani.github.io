import { z } from "zod"

const isoDateTimeSchema = z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: "Expected an ISO-compatible date string",
})

const nullableStringSchema = z.string().nullable()
const optionalNullableStringSchema = z.string().nullable().optional()

const rootRelativeAssetPathSchema = z.string().regex(/^\/(?!\/)/, {
  message: "Asset paths must be root-relative",
})

export const publicSettingKeys = [
  "home_title",
  "home_description",
  "research_directions",
  "hidden_timeline_sections",
  "nav_research_visible",
  "profile_photo",
  "contact_description",
  "contact_emails",
  "contact_links",
  "contact_location",
] as const

export const timelineSectionTypeSchema = z.enum([
  "education",
  "experience",
  "award",
  "talk",
  "service",
  "publication_milestone",
])

export const researchDirectionSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    tags: z.array(z.string()),
    href: z.string().optional(),
    linkLabel: z.string().optional(),
  })
  .strict()

export const staticSettingsSchema = z
  .object({
    home_title: nullableStringSchema,
    home_description: nullableStringSchema,
    research_directions: z.array(researchDirectionSchema),
    hidden_timeline_sections: z.array(timelineSectionTypeSchema),
    nav_research_visible: z.boolean(),
    profile_photo: z
      .object({
        url: rootRelativeAssetPathSchema,
        alt: nullableStringSchema,
      })
      .strict()
      .nullable(),
    contact_description: z
      .object({
        text: z.string(),
      })
      .strict()
      .nullable(),
    contact_emails: z.array(
      z
        .object({
          label: z.string(),
          address: z.string().email(),
        })
        .strict()
    ),
    contact_links: z.array(
      z
        .object({
          label: z.string(),
          url: z.string().url(),
          desc: z.string(),
          icon: nullableStringSchema,
        })
        .strict()
    ),
    contact_location: z
      .object({
        city: z.string(),
        note: nullableStringSchema,
      })
      .strict()
      .nullable(),
  })
  .strict()

export const staticTagSchema = z
  .object({
    id: z.string(),
    slug: z.string(),
    label: z.string(),
    description: nullableStringSchema,
    color: nullableStringSchema,
  })
  .strict()

const staticTagAttachmentSchema = z
  .object({
    tagId: z.string(),
    tag: staticTagSchema,
  })
  .strict()

export const staticPublicationSchema = z
  .object({
    id: z.string(),
    slug: z.string(),
    title: z.string(),
    authors: z.array(z.object({ name: z.string(), isMe: z.boolean().optional() }).strict()),
    venue: z.string(),
    venueType: z.enum(["conference", "journal", "workshop", "preprint", "poster", "talk", "thesis"]),
    year: z.number().int(),
    publishedAt: isoDateTimeSchema,
    abstract: optionalNullableStringSchema,
    tldr: optionalNullableStringSchema,
    contributions: z.array(z.union([z.string(), z.object({ text: z.string() }).strict()])).nullable(),
    doi: optionalNullableStringSchema,
    arxivId: optionalNullableStringSchema,
    pdfUrl: optionalNullableStringSchema,
    codeUrl: optionalNullableStringSchema,
    projectUrl: optionalNullableStringSchema,
    bibtex: optionalNullableStringSchema,
    citationCount: z.number().int().nullable(),
    featured: z.boolean(),
    sortOrder: z.number().int(),
    ogImageUrl: optionalNullableStringSchema,
    tags: z.array(staticTagAttachmentSchema),
  })
  .strict()

export const staticProjectSchema = z
  .object({
    id: z.string(),
    slug: z.string(),
    title: z.string(),
    summary: z.string(),
    role: nullableStringSchema,
    year: z.number().int(),
    problem: nullableStringSchema,
    approach: nullableStringSchema,
    architecture: nullableStringSchema,
    challenges: nullableStringSchema,
    results: nullableStringSchema,
    retrospective: nullableStringSchema,
    techStack: z.array(z.string()).nullable(),
    repoUrl: nullableStringSchema,
    demoUrl: nullableStringSchema,
    featured: z.boolean(),
    sortOrder: z.number().int(),
    ogImageUrl: nullableStringSchema,
    tags: z.array(staticTagAttachmentSchema),
  })
  .strict()

export const staticCourseFileSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
    description: nullableStringSchema,
    kind: z.string(),
    size: z.number().int().nullable(),
    mimeType: nullableStringSchema,
    sortOrder: z.number().int(),
  })
  .strict()

export const staticCourseLinkSchema = z
  .object({
    id: z.string(),
    type: z.string(),
    name: z.string(),
    url: z.string(),
    sortOrder: z.number().int(),
  })
  .strict()

export const staticCourseSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    grade: nullableStringSchema,
    highlight: nullableStringSchema,
    instructor: nullableStringSchema,
    focus: nullableStringSchema,
    topics: nullableStringSchema,
    syllabus: nullableStringSchema,
    exercises: nullableStringSchema,
    projects: nullableStringSchema,
    discussions: nullableStringSchema,
    sortOrder: z.number().int(),
    files: z.array(staticCourseFileSchema),
    links: z.array(staticCourseLinkSchema),
  })
  .strict()

export const staticTimelineEventSchema = z
  .object({
    id: z.string(),
    type: timelineSectionTypeSchema,
    title: z.string(),
    organization: z.string(),
    location: nullableStringSchema,
    startDate: isoDateTimeSchema,
    endDate: isoDateTimeSchema.nullable(),
    description: nullableStringSchema,
    highlights: z.array(z.string()).nullable(),
    url: nullableStringSchema,
    sortOrder: z.number().int(),
    courses: z.array(staticCourseSchema),
  })
  .strict()

export const staticSkillCategorySchema = z
  .object({
    id: z.string(),
    name: z.string(),
    sortOrder: z.number().int(),
    skills: z.array(
      z
        .object({
          id: z.string(),
          name: z.string(),
          proficiency: nullableStringSchema,
          sortOrder: z.number().int(),
        })
        .strict()
    ),
  })
  .strict()

export const staticTeachingAssistantSchema = z
  .object({
    id: z.string(),
    slug: z.string(),
    course: z.string(),
    level: z.string(),
    university: z.string(),
    professor: z.string(),
    startDate: isoDateTimeSchema,
    endDate: isoDateTimeSchema.nullable(),
    description: nullableStringSchema,
    highlights: z.array(z.string()).nullable(),
    technologies: nullableStringSchema,
    sortOrder: z.number().int(),
  })
  .strict()

export const staticResearchingAssistantSchema = z
  .object({
    id: z.string(),
    slug: z.string(),
    lab: nullableStringSchema,
    university: z.string(),
    supervisor: nullableStringSchema,
    supervisorUrl: nullableStringSchema,
    collaborator: nullableStringSchema,
    topic: z.string(),
    startDate: isoDateTimeSchema,
    endDate: isoDateTimeSchema.nullable(),
    description: nullableStringSchema,
    outcomes: z.array(z.string()).nullable(),
    technologies: nullableStringSchema,
    repoUrl: nullableStringSchema,
    sortOrder: z.number().int(),
  })
  .strict()

export const staticMediaSchema = z
  .object({
    id: z.string(),
    ownerType: z.enum(["publication", "project", "page"]),
    ownerId: z.string(),
    url: rootRelativeAssetPathSchema,
    kind: z.enum(["pdf", "image", "figure", "poster"]),
    alt: nullableStringSchema,
    caption: nullableStringSchema,
    sortOrder: z.number().int(),
  })
  .strict()

export const staticSiteDataSchema = z
  .object({
    schemaVersion: z.literal(1),
    settings: staticSettingsSchema,
    publications: z.array(staticPublicationSchema),
    projects: z.array(staticProjectSchema),
    tags: z.array(staticTagSchema),
    timelineEvents: z.array(staticTimelineEventSchema),
    skillCategories: z.array(staticSkillCategorySchema),
    teachingAssistants: z.array(staticTeachingAssistantSchema),
    researchingAssistants: z.array(staticResearchingAssistantSchema),
    media: z.array(staticMediaSchema),
  })
  .strict()

export const staticAssetManifestSchema = z
  .object({
    schemaVersion: z.literal(1),
    assets: z.array(
      z
        .object({
          sourceKey: z.string(),
          publicPath: rootRelativeAssetPathSchema,
          sha256: z.string().regex(/^[a-f0-9]{64}$/),
          bytes: z.number().int().nonnegative(),
          mimeType: z.string(),
        })
        .strict()
    ),
  })
  .strict()

export type TimelineSectionType = z.infer<typeof timelineSectionTypeSchema>
export type ResearchDirection = z.infer<typeof researchDirectionSchema>
export type StaticSiteData = z.infer<typeof staticSiteDataSchema>
export type StaticAssetManifest = z.infer<typeof staticAssetManifestSchema>
export type StaticPublication = z.infer<typeof staticPublicationSchema>
export type StaticProject = z.infer<typeof staticProjectSchema>
export type StaticTag = z.infer<typeof staticTagSchema>
export type StaticTimelineEvent = z.infer<typeof staticTimelineEventSchema>
export type StaticCourse = z.infer<typeof staticCourseSchema>
export type StaticSkillCategory = z.infer<typeof staticSkillCategorySchema>
export type StaticTeachingAssistant = z.infer<typeof staticTeachingAssistantSchema>
export type StaticResearchingAssistant = z.infer<typeof staticResearchingAssistantSchema>
export type StaticMedia = z.infer<typeof staticMediaSchema>

export function parseStaticSiteData(value: unknown): StaticSiteData {
  return staticSiteDataSchema.parse(value)
}

export function parseStaticAssetManifest(value: unknown): StaticAssetManifest {
  return staticAssetManifestSchema.parse(value)
}
