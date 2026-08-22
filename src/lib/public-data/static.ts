import siteDataJson from "@/content/generated/site-data.json"
import { parseStaticSiteData } from "@/content/site-data.schema"
import { slugify } from "@/lib/utils/slugify"
import type {
  PublicDataProvider,
  PublicProject,
  PublicPublication,
  PublicResearchAssistant,
  PublicSettingKey,
  PublicSettingMap,
  PublicTeachingAssistant,
  PublicTimelineEvent,
} from "./contract"

const siteData = parseStaticSiteData(siteDataJson)

const toDate = (value: string) => new Date(value)
const toNullableDate = (value: string | null) => (value ? new Date(value) : null)

const publications: PublicPublication[] = siteData.publications.map((publication) => ({
  ...publication,
  publishedAt: toDate(publication.publishedAt),
  abstract: publication.abstract ?? null,
  tldr: publication.tldr ?? null,
  doi: publication.doi ?? null,
  arxivId: publication.arxivId ?? null,
  pdfUrl: publication.pdfUrl ?? null,
  codeUrl: publication.codeUrl ?? null,
  projectUrl: publication.projectUrl ?? null,
  bibtex: publication.bibtex ?? null,
  ogImageUrl: publication.ogImageUrl ?? null,
}))

const projects: PublicProject[] = siteData.projects

const timelineEvents: PublicTimelineEvent[] = siteData.timelineEvents.map((event) => ({
  ...event,
  startDate: toDate(event.startDate),
  endDate: toNullableDate(event.endDate),
}))

const researchingAssistants: PublicResearchAssistant[] = siteData.researchingAssistants.map((item) => ({
  ...item,
  startDate: toDate(item.startDate),
  endDate: toNullableDate(item.endDate),
}))

const teachingAssistants: PublicTeachingAssistant[] = siteData.teachingAssistants.map((item) => ({
  ...item,
  startDate: toDate(item.startDate),
  endDate: toNullableDate(item.endDate),
}))

async function getSiteSettings(): Promise<PublicSettingMap> {
  return siteData.settings
}

async function getSiteSetting<K extends PublicSettingKey>(key: K): Promise<PublicSettingMap[K]> {
  return siteData.settings[key]
}

async function getEducationEvents() {
  return timelineEvents.filter((event) => event.type === "education")
}

async function getEducationEventBySlug(slug: string) {
  const events = await getEducationEvents()
  return events.find((event) => slugify(event.organization) === slug) ?? null
}

export const publicDataProvider: PublicDataProvider = {
  async getFeaturedPublications() {
    return publications.filter((publication) => publication.featured).slice(0, 3)
  },
  async getAllPublications() {
    return publications
  },
  async getPublicationBySlug(slug) {
    return publications.find((publication) => publication.slug === slug) ?? null
  },
  async getFeaturedProjects() {
    return projects.filter((project) => project.featured).slice(0, 3)
  },
  async getAllProjects() {
    return projects
  },
  async getProjectBySlug(slug) {
    return projects.find((project) => project.slug === slug) ?? null
  },
  async getAllTags() {
    return siteData.tags
  },
  async getMediaForOwner(ownerType, ownerId) {
    return siteData.media.filter((media) => media.ownerType === ownerType && media.ownerId === ownerId)
  },
  async getTimelineEvents() {
    return timelineEvents
  },
  getEducationEvents,
  getEducationEventBySlug,
  async getSkillCategories() {
    return siteData.skillCategories
  },
  async getLatestResearchExperience() {
    return researchingAssistants[0] ?? null
  },
  async getLatestTeachingExperience() {
    return teachingAssistants[0] ?? null
  },
  async getAllResearchExperience() {
    return researchingAssistants
  },
  async getAllTeachingExperience() {
    return teachingAssistants
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
