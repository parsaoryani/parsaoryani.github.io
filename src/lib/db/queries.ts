import "server-only"
import { prisma } from "./prisma"
import { TIMELINE_SECTIONS_SETTING_KEY, parseHiddenSections } from "@/lib/timeline/sections"

export async function getFeaturedPublications() {
  return prisma.publication.findMany({
    where: { featured: true, status: "published", deletedAt: null },
    include: { tags: { include: { tag: true } } },
    orderBy: { sortOrder: "asc" },
    take: 3,
  })
}

export async function getAllPublications() {
  return prisma.publication.findMany({
    where: { status: "published", deletedAt: null },
    include: { tags: { include: { tag: true } } },
    orderBy: [{ year: "desc" }, { sortOrder: "asc" }],
  })
}

export async function getPublicationBySlug(slug: string) {
  return prisma.publication.findFirst({
    where: { slug, status: "published", deletedAt: null },
    include: { tags: { include: { tag: true } } },
  })
}

export async function getFeaturedProjects() {
  return prisma.project.findMany({
    where: { featured: true, status: "published", deletedAt: null },
    include: { tags: { include: { tag: true } } },
    orderBy: { sortOrder: "asc" },
    take: 3,
  })
}

export async function getAllProjects() {
  return prisma.project.findMany({
    where: { status: "published", deletedAt: null },
    include: { tags: { include: { tag: true } } },
    orderBy: [{ year: "desc" }, { sortOrder: "asc" }],
  })
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findFirst({
    where: { slug, status: "published", deletedAt: null },
    include: { tags: { include: { tag: true } } },
  })
}

export async function getAllTags() {
  return prisma.tag.findMany({
    orderBy: { label: "asc" },
  })
}

export async function getTimelineEvents() {
  const hiddenSetting = await getSiteSetting(TIMELINE_SECTIONS_SETTING_KEY)
  const hiddenTypes = parseHiddenSections(hiddenSetting)

  return prisma.timelineEvent.findMany({
    where: {
      visible: true,
      ...(hiddenTypes.length > 0 ? { type: { notIn: hiddenTypes } } : {}),
    },
    include: {
      courses: {
        where: { timelineEvent: { type: "education" } },
        include: {
          files: { orderBy: { sortOrder: "asc" } },
          links: { orderBy: { sortOrder: "asc" } },
        },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: [{ startDate: "desc" }, { sortOrder: "asc" }],
  })
}

export async function getSkillCategories() {
  return prisma.skillCategory.findMany({
    include: { skills: { orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" },
  })
}

export async function getLatestResearchExperience() {
  return prisma.researchingAssistant.findFirst({
    where: { status: "published" },
    orderBy: [{ startDate: "desc" }, { sortOrder: "asc" }],
  })
}

export async function getLatestTeachingExperience() {
  return prisma.teachingAssistant.findFirst({
    where: { status: "published" },
    orderBy: [{ startDate: "desc" }, { sortOrder: "asc" }],
  })
}

export async function getAllResearchExperience() {
  return prisma.researchingAssistant.findMany({
    where: { status: "published" },
    orderBy: [{ startDate: "desc" }, { sortOrder: "asc" }],
  })
}

export async function getAllTeachingExperience() {
  return prisma.teachingAssistant.findMany({
    where: { status: "published" },
    orderBy: [{ startDate: "desc" }, { sortOrder: "asc" }],
  })
}

export async function getSiteSetting(key: string) {
  const setting = await prisma.siteSetting.findUnique({ where: { key } })
  return setting?.value ?? null
}

export async function getSiteSettings() {
  const settings = await prisma.siteSetting.findMany()
  return settings.reduce<Record<string, unknown>>((acc, s) => {
    acc[s.key] = s.value
    return acc
  }, {})
}
