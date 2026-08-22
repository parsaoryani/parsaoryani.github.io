import { MetadataRoute } from "next"
import { getAllProjects, getAllPublications, getEducationEvents } from "@/lib/public-data"
import { slugify } from "@/lib/utils/slugify"

export const dynamic = "force-static"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4321"
  const lastModified = new Date("2026-08-22T00:00:00.000Z")
  const [projects, publications, educationEvents] = await Promise.all([
    getAllProjects(),
    getAllPublications(),
    getEducationEvents(),
  ])

  return [
    { url: siteUrl, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/experience`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/projects`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/research`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/about`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/cv`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    ...projects.map((project) => ({
      url: `${siteUrl}/projects/${project.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...publications.map((publication) => ({
      url: `${siteUrl}/research/${publication.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...educationEvents.map((event) => ({
      url: `${siteUrl}/education/${slugify(event.organization)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ]
}
