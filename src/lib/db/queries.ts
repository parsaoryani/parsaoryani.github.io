import "server-only"
import { prisma } from "./prisma"

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
  return prisma.timelineEvent.findMany({
    where: { visible: true },
    include: {
      courses: {
        where: { timelineEvent: { type: "education" } },
        include: { files: { orderBy: { sortOrder: "asc" } } },
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
