import "server-only"

import { prisma } from "@/lib/db/prisma"
import {
  getAllProjects as getAllProjectsFromDb,
  getAllPublications as getAllPublicationsFromDb,
  getAllResearchExperience as getAllResearchExperienceFromDb,
  getAllTags as getAllTagsFromDb,
  getAllTeachingExperience as getAllTeachingExperienceFromDb,
  getFeaturedProjects as getFeaturedProjectsFromDb,
  getFeaturedPublications as getFeaturedPublicationsFromDb,
  getLatestResearchExperience as getLatestResearchExperienceFromDb,
  getLatestTeachingExperience as getLatestTeachingExperienceFromDb,
  getProjectBySlug as getProjectBySlugFromDb,
  getPublicationBySlug as getPublicationBySlugFromDb,
  getSkillCategories as getSkillCategoriesFromDb,
  getTimelineEvents as getTimelineEventsFromDb,
} from "@/lib/db/queries"
import { parseResearchDirections } from "@/lib/home/hero"
import { parseShowResearch } from "@/lib/site/visibility"
import { parseHiddenSections } from "@/lib/timeline/sections"
import { slugify } from "@/lib/utils/slugify"
import { publicSettingKeys, staticSettingsSchema } from "@/content/site-data.schema"
import {
  defaultPublicSettings,
  type PublicDataProvider,
  type PublicProject,
  type PublicPublication,
  type PublicResearchAssistant,
  type PublicSettingKey,
  type PublicSettingMap,
  type PublicSkillCategory,
  type PublicTag,
  type PublicTeachingAssistant,
  type PublicTimelineEvent,
} from "./contract"

const publicSettingKeySet = new Set<string>(publicSettingKeys)

const stringArrayOrNull = (value: unknown): string[] | null =>
  Array.isArray(value) && value.every((item) => typeof item === "string") ? value : null

const publicationContributions = (value: unknown): PublicPublication["contributions"] =>
  Array.isArray(value) &&
  value.every(
    (item) =>
      typeof item === "string" ||
      (item !== null && typeof item === "object" && typeof (item as { text?: unknown }).text === "string")
  )
    ? (value as PublicPublication["contributions"])
    : null

const publicationAuthors = (value: unknown): PublicPublication["authors"] =>
  Array.isArray(value)
    ? value.filter(
        (item): item is { name: string; isMe?: boolean } =>
          item !== null &&
          typeof item === "object" &&
          typeof (item as { name?: unknown }).name === "string" &&
          (typeof (item as { isMe?: unknown }).isMe === "boolean" || typeof (item as { isMe?: unknown }).isMe === "undefined")
      )
    : []

function mapTag(tag: { id: string; slug: string; label: string; description: string | null; color: string | null }): PublicTag {
  return {
    id: tag.id,
    slug: tag.slug,
    label: tag.label,
    description: tag.description,
    color: tag.color,
  }
}

function mapPublication(publication: Awaited<ReturnType<typeof getAllPublicationsFromDb>>[number]): PublicPublication {
  return {
    id: publication.id,
    slug: publication.slug,
    title: publication.title,
    authors: publicationAuthors(publication.authors),
    venue: publication.venue,
    venueType: publication.venueType,
    year: publication.year,
    publishedAt: publication.publishedAt,
    abstract: publication.abstract,
    tldr: publication.tldr,
    contributions: publicationContributions(publication.contributions),
    doi: publication.doi,
    arxivId: publication.arxivId,
    pdfUrl: publication.pdfUrl,
    codeUrl: publication.codeUrl,
    projectUrl: publication.projectUrl,
    bibtex: publication.bibtex,
    citationCount: publication.citationCount,
    featured: publication.featured,
    sortOrder: publication.sortOrder,
    ogImageUrl: publication.ogImageUrl,
    tags: publication.tags.map((tag) => ({ tagId: tag.tagId, tag: mapTag(tag.tag) })),
  }
}

function mapProject(project: Awaited<ReturnType<typeof getAllProjectsFromDb>>[number]): PublicProject {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    role: project.role,
    year: project.year,
    problem: project.problem,
    approach: project.approach,
    architecture: project.architecture,
    challenges: project.challenges,
    results: project.results,
    retrospective: project.retrospective,
    techStack: stringArrayOrNull(project.techStack),
    repoUrl: project.repoUrl,
    demoUrl: project.demoUrl,
    featured: project.featured,
    sortOrder: project.sortOrder,
    ogImageUrl: project.ogImageUrl,
    tags: project.tags.map((tag) => ({ tagId: tag.tagId, tag: mapTag(tag.tag) })),
  }
}

function mapTimelineEvent(event: Awaited<ReturnType<typeof getTimelineEventsFromDb>>[number]): PublicTimelineEvent {
  return {
    id: event.id,
    type: event.type,
    title: event.title,
    organization: event.organization,
    location: event.location,
    startDate: event.startDate,
    endDate: event.endDate,
    description: event.description,
    highlights: stringArrayOrNull(event.highlights),
    url: event.url,
    sortOrder: event.sortOrder,
    courses: event.courses.map((course) => ({
      id: course.id,
      name: course.name,
      grade: course.grade,
      highlight: course.highlight,
      instructor: course.instructor,
      focus: course.focus,
      topics: course.topics,
      syllabus: course.syllabus,
      exercises: course.exercises,
      projects: course.projects,
      discussions: course.discussions,
      sortOrder: course.sortOrder,
      files: course.files.map((file) => ({
        id: file.id,
        name: file.name,
        url: file.url,
        description: file.description,
        kind: file.kind,
        size: file.size,
        mimeType: file.mimeType,
        sortOrder: file.sortOrder,
      })),
      links: course.links.map((link) => ({
        id: link.id,
        type: link.type,
        name: link.name,
        url: link.url,
        sortOrder: link.sortOrder,
      })),
    })),
  }
}

function mapSkillCategory(category: Awaited<ReturnType<typeof getSkillCategoriesFromDb>>[number]): PublicSkillCategory {
  return {
    id: category.id,
    name: category.name,
    sortOrder: category.sortOrder,
    skills: category.skills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      proficiency: skill.proficiency,
      sortOrder: skill.sortOrder,
    })),
  }
}

function mapResearchAssistant(item: Awaited<ReturnType<typeof getAllResearchExperienceFromDb>>[number]): PublicResearchAssistant {
  return {
    id: item.id,
    slug: item.slug,
    lab: item.lab,
    university: item.university,
    supervisor: item.supervisor,
    supervisorUrl: item.supervisorUrl,
    collaborator: item.collaborator,
    topic: item.topic,
    startDate: item.startDate,
    endDate: item.endDate,
    description: item.description,
    outcomes: stringArrayOrNull(item.outcomes),
    technologies: item.technologies,
    repoUrl: item.repoUrl,
    sortOrder: item.sortOrder,
  }
}

function mapTeachingAssistant(item: Awaited<ReturnType<typeof getAllTeachingExperienceFromDb>>[number]): PublicTeachingAssistant {
  return {
    id: item.id,
    slug: item.slug,
    course: item.course,
    level: item.level,
    university: item.university,
    professor: item.professor,
    startDate: item.startDate,
    endDate: item.endDate,
    description: item.description,
    highlights: stringArrayOrNull(item.highlights),
    technologies: item.technologies,
    sortOrder: item.sortOrder,
  }
}

function normalizeSettings(raw: Record<string, unknown>): PublicSettingMap {
  const profilePhoto =
    raw.profile_photo && typeof raw.profile_photo === "object" && typeof (raw.profile_photo as { url?: unknown }).url === "string"
      ? {
          url: (raw.profile_photo as { url: string }).url,
          alt: typeof (raw.profile_photo as { alt?: unknown }).alt === "string" ? (raw.profile_photo as { alt: string }).alt : null,
        }
      : null

  return staticSettingsSchema.parse({
    home_title: typeof raw.home_title === "string" ? raw.home_title : null,
    home_description: typeof raw.home_description === "string" ? raw.home_description : null,
    research_directions: parseResearchDirections(raw.research_directions),
    hidden_timeline_sections: parseHiddenSections(raw.hidden_timeline_sections),
    nav_research_visible: parseShowResearch(raw.nav_research_visible),
    profile_photo: profilePhoto?.url.startsWith("/") ? profilePhoto : null,
    contact_description:
      raw.contact_description && typeof raw.contact_description === "object" && typeof (raw.contact_description as { text?: unknown }).text === "string"
        ? { text: (raw.contact_description as { text: string }).text }
        : null,
    contact_emails: Array.isArray(raw.contact_emails)
      ? raw.contact_emails.filter(
          (email): email is { label: string; address: string } =>
            email !== null &&
            typeof email === "object" &&
            typeof (email as { label?: unknown }).label === "string" &&
            typeof (email as { address?: unknown }).address === "string"
        )
      : [],
    contact_links: Array.isArray(raw.contact_links)
      ? raw.contact_links
          .filter(
            (link): link is { label: string; url: string; desc: string; icon?: string | null } =>
              link !== null &&
              typeof link === "object" &&
              typeof (link as { label?: unknown }).label === "string" &&
              typeof (link as { url?: unknown }).url === "string" &&
              typeof (link as { desc?: unknown }).desc === "string"
          )
          .map((link) =>
            link && typeof link === "object"
              ? { ...link, icon: typeof link.icon === "string" ? link.icon : null }
              : link
        )
      : [],
    contact_location:
      raw.contact_location && typeof raw.contact_location === "object" && typeof (raw.contact_location as { city?: unknown }).city === "string"
        ? {
            city: (raw.contact_location as { city: string }).city,
            note: typeof (raw.contact_location as { note?: unknown }).note === "string" ? (raw.contact_location as { note: string }).note : null,
          }
        : null,
  })
}

async function getSiteSettings(): Promise<PublicSettingMap> {
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: [...publicSettingKeys] } },
  })
  const raw = settings.reduce<Record<string, unknown>>((acc, setting) => {
    if (publicSettingKeySet.has(setting.key)) acc[setting.key] = setting.value
    return acc
  }, {})
  return { ...defaultPublicSettings, ...normalizeSettings(raw) }
}

async function getSiteSetting<K extends PublicSettingKey>(key: K): Promise<PublicSettingMap[K]> {
  const settings = await getSiteSettings()
  return settings[key]
}

async function getMediaForOwner(ownerType: "publication" | "project" | "page", ownerId: string) {
  const media = await prisma.media.findMany({
    where: { ownerType, ownerId },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  })
  return media.map((item) => ({
    id: item.id,
    ownerType: item.ownerType,
    ownerId: item.ownerId,
    url: item.url,
    kind: item.kind,
    alt: item.alt,
    caption: item.caption,
    sortOrder: item.sortOrder,
  }))
}

async function getEducationEvents() {
  const events = (await getTimelineEventsFromDb()).map(mapTimelineEvent)
  return events.filter((event) => event.type === "education")
}

async function getEducationEventBySlug(slug: string) {
  const events = await getEducationEvents()
  return events.find((event) => slugify(event.organization) === slug) ?? null
}

export const publicDataProvider: PublicDataProvider = {
  async getFeaturedPublications() {
    return (await getFeaturedPublicationsFromDb()).map(mapPublication)
  },
  async getAllPublications() {
    return (await getAllPublicationsFromDb()).map(mapPublication)
  },
  async getPublicationBySlug(slug) {
    const publication = await getPublicationBySlugFromDb(slug)
    return publication ? mapPublication(publication) : null
  },
  async getFeaturedProjects() {
    return (await getFeaturedProjectsFromDb()).map(mapProject)
  },
  async getAllProjects() {
    return (await getAllProjectsFromDb()).map(mapProject)
  },
  async getProjectBySlug(slug) {
    const project = await getProjectBySlugFromDb(slug)
    return project ? mapProject(project) : null
  },
  async getAllTags() {
    return (await getAllTagsFromDb()).map(mapTag)
  },
  getMediaForOwner,
  async getTimelineEvents() {
    return (await getTimelineEventsFromDb()).map(mapTimelineEvent)
  },
  getEducationEvents,
  getEducationEventBySlug,
  async getSkillCategories() {
    return (await getSkillCategoriesFromDb()).map(mapSkillCategory)
  },
  async getLatestResearchExperience() {
    const item = await getLatestResearchExperienceFromDb()
    return item ? mapResearchAssistant(item) : null
  },
  async getLatestTeachingExperience() {
    const item = await getLatestTeachingExperienceFromDb()
    return item ? mapTeachingAssistant(item) : null
  },
  async getAllResearchExperience() {
    return (await getAllResearchExperienceFromDb()).map(mapResearchAssistant)
  },
  async getAllTeachingExperience() {
    return (await getAllTeachingExperienceFromDb()).map(mapTeachingAssistant)
  },
  getSiteSetting,
  getSiteSettings,
}

export const {
  getFeaturedPublications: getFeaturedPublicationsPublic,
  getAllPublications: getAllPublicationsPublic,
  getPublicationBySlug: getPublicationBySlugPublic,
  getFeaturedProjects: getFeaturedProjectsPublic,
  getAllProjects: getAllProjectsPublic,
  getProjectBySlug: getProjectBySlugPublic,
  getAllTags: getAllTagsPublic,
  getMediaForOwner: getMediaForOwnerPublic,
  getTimelineEvents: getTimelineEventsPublic,
  getEducationEvents: getEducationEventsPublic,
  getEducationEventBySlug: getEducationEventBySlugPublic,
  getSkillCategories: getSkillCategoriesPublic,
  getLatestResearchExperience: getLatestResearchExperiencePublic,
  getLatestTeachingExperience: getLatestTeachingExperiencePublic,
  getAllResearchExperience: getAllResearchExperiencePublic,
  getAllTeachingExperience: getAllTeachingExperiencePublic,
  getSiteSetting: getSiteSettingPublic,
  getSiteSettings: getSiteSettingsPublic,
} = publicDataProvider
