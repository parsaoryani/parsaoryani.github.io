import { createHash, randomUUID } from "node:crypto"
import { cp, mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises"
import path from "node:path"
import { prisma } from "@/lib/db/prisma"
import { parseResearchDirections } from "@/lib/home/hero"
import { defaultPublicSettings } from "@/lib/public-data/contract"
import { parseShowResearch } from "@/lib/site/visibility"
import { parseHiddenSections } from "@/lib/timeline/sections"
import {
  publicSettingKeys,
  staticAssetManifestSchema,
  staticSettingsSchema,
  staticSiteDataSchema,
  type StaticAssetManifest,
  type StaticSiteData,
} from "@/content/site-data.schema"

export interface StaticExportResult {
  siteData: StaticSiteData
  assetManifest: StaticAssetManifest
  counts: Record<string, number>
  changedFiles: string[]
  stagedFiles?: {
    stagingDir: string
    siteData: string
    assetManifest: string
  }
}

interface ExportOptions {
  repoRoot?: string
  promote?: boolean
}

const generatedJsonPaths = {
  siteData: path.join("src", "content", "generated", "site-data.json"),
  assetManifest: path.join("src", "content", "generated", "asset-manifest.json"),
}

const pageOwnerIds = ["home", "about", "contact", "cv", "experience", "research", "projects"]
const maxAssetBytes = 50 * 1024 * 1024

const iso = (date: Date | null) => (date ? date.toISOString() : null)
const stringArrayOrNull = (value: unknown): string[] | null =>
  Array.isArray(value) && value.every((item) => typeof item === "string") ? value : null

function assertExportGate() {
  if (process.env.NODE_ENV !== "development" || process.env.ALLOW_LOCAL_STATIC_EXPORT !== "1") {
    throw new Error("Static export requires NODE_ENV=development and ALLOW_LOCAL_STATIC_EXPORT=1")
  }
}

function normalizeSettings(raw: Record<string, unknown>) {
  const profilePhoto =
    raw.profile_photo && typeof raw.profile_photo === "object" && typeof (raw.profile_photo as { url?: unknown }).url === "string"
      ? {
          url: (raw.profile_photo as { url: string }).url,
          alt: typeof (raw.profile_photo as { alt?: unknown }).alt === "string" ? (raw.profile_photo as { alt: string }).alt : null,
        }
      : null

  return staticSettingsSchema.parse({
    ...defaultPublicSettings,
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
    contact_emails: Array.isArray(raw.contact_emails) ? raw.contact_emails : [],
    contact_links: Array.isArray(raw.contact_links)
      ? raw.contact_links.map((link) =>
          link && typeof link === "object"
            ? { ...link, icon: typeof (link as { icon?: unknown }).icon === "string" ? (link as { icon: string }).icon : null }
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

async function loadSettings() {
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: [...publicSettingKeys] } },
    select: { key: true, value: true },
  })
  const raw = settings.reduce<Record<string, unknown>>((acc, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {})
  return normalizeSettings(raw)
}

const tagSelect = {
  id: true,
  slug: true,
  label: true,
  description: true,
  color: true,
} as const

function publicFilePath(repoRoot: string, publicPath: string) {
  if (!publicPath.startsWith("/") || publicPath.startsWith("//") || publicPath.includes("\0")) {
    throw new Error(`Invalid public asset path: ${publicPath}`)
  }
  const resolved = path.resolve(repoRoot, "public", publicPath.slice(1))
  const publicRoot = path.resolve(repoRoot, "public")
  if (resolved !== publicRoot && !resolved.startsWith(`${publicRoot}${path.sep}`)) {
    throw new Error(`Asset escapes public directory: ${publicPath}`)
  }
  return resolved
}

async function hashPublicAsset(repoRoot: string, sourceKey: string, publicPath: string): Promise<StaticAssetManifest["assets"][number]> {
  const file = publicFilePath(repoRoot, publicPath)
  const stats = await stat(file)
  if (!stats.isFile()) throw new Error(`${sourceKey}: ${publicPath} is not a file`)
  if (stats.size >= maxAssetBytes) throw new Error(`${sourceKey}: ${publicPath} is ${stats.size} bytes; limit is ${maxAssetBytes - 1}`)
  const data = await readFile(file)
  return {
    sourceKey,
    publicPath,
    sha256: createHash("sha256").update(data).digest("hex"),
    bytes: stats.size,
    mimeType: mimeForPath(publicPath),
  }
}

function mimeForPath(filePath: string) {
  const ext = path.extname(filePath).toLowerCase()
  switch (ext) {
    case ".png":
      return "image/png"
    case ".jpg":
    case ".jpeg":
      return "image/jpeg"
    case ".gif":
      return "image/gif"
    case ".webp":
      return "image/webp"
    case ".mp4":
      return "video/mp4"
    case ".mov":
      return "video/quicktime"
    case ".pdf":
      return "application/pdf"
    case ".txt":
      return "text/plain"
    case ".md":
      return "text/markdown"
    case ".ipynb":
      return "application/json"
    case ".zip":
      return "application/zip"
    case ".csv":
      return "text/csv"
    default:
      return "application/octet-stream"
  }
}

function isExternalUrl(value: string) {
  return /^https?:\/\//i.test(value)
}

async function mirrorUploadAsset(repoRoot: string, sourceKey: string, sourcePath: string) {
  const uploadRoot = path.resolve(repoRoot, process.env.UPLOAD_DIR ?? "uploads")
  const input = path.resolve(uploadRoot, sourcePath.replace(/^\/uploads\//, ""))
  if (!input.startsWith(`${uploadRoot}${path.sep}`)) throw new Error(`${sourceKey}: upload path escapes UPLOAD_DIR`)
  const data = await readFile(/*turbopackIgnore: true*/ input)
  if (data.byteLength >= maxAssetBytes) throw new Error(`${sourceKey}: upload is ${data.byteLength} bytes; limit is ${maxAssetBytes - 1}`)
  const sha256 = createHash("sha256").update(data).digest("hex")
  const ext = path.extname(sourcePath).toLowerCase() || ".bin"
  const publicPath = `/generated/media/${sha256.slice(0, 2)}/${sha256}${ext}`
  const target = publicFilePath(repoRoot, publicPath)
  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(target, data)
  return {
    publicPath,
    manifest: {
      sourceKey,
      publicPath,
      sha256,
      bytes: data.byteLength,
      mimeType: mimeForPath(publicPath),
    },
  }
}

async function resolveAsset(repoRoot: string, sourceKey: string, value: string | null | undefined, options: { externalAllowed?: boolean } = {}) {
  if (!value) return { value, manifest: null }
  if (value.startsWith("/uploads/")) {
    const mirrored = await mirrorUploadAsset(repoRoot, sourceKey, value)
    return { value: mirrored.publicPath, manifest: mirrored.manifest }
  }
  if (value.startsWith("/") && !value.startsWith("//")) {
    return { value, manifest: await hashPublicAsset(repoRoot, sourceKey, value) }
  }
  if (isExternalUrl(value) && options.externalAllowed) return { value, manifest: null }
  if (isExternalUrl(value)) {
    throw new Error(`${sourceKey}: external asset URLs must be mirrored locally before export: ${value}`)
  }
  return { value, manifest: null }
}

async function collectAssets(repoRoot: string, siteData: StaticSiteData) {
  const manifestAssets: StaticAssetManifest["assets"] = []
  const seen = new Set<string>()

  const add = async (sourceKey: string, value: string | null | undefined, setter: (next: string | null) => void, options?: { externalAllowed?: boolean }) => {
    const resolved = await resolveAsset(repoRoot, sourceKey, value, options)
    setter(resolved.value ?? null)
    if (resolved.manifest && !seen.has(resolved.manifest.sourceKey)) {
      seen.add(resolved.manifest.sourceKey)
      manifestAssets.push(resolved.manifest)
    }
  }

  await add("SiteSetting:profile_photo.url", siteData.settings.profile_photo?.url, (next) => {
    if (siteData.settings.profile_photo) siteData.settings.profile_photo.url = next ?? siteData.settings.profile_photo.url
  })

  for (const publication of siteData.publications) {
    await add(`Publication:${publication.id}:pdfUrl`, publication.pdfUrl, (next) => {
      publication.pdfUrl = next
    })
    await add(`Publication:${publication.id}:ogImageUrl`, publication.ogImageUrl, (next) => {
      publication.ogImageUrl = next
    })
  }

  for (const project of siteData.projects) {
    await add(`Project:${project.id}:ogImageUrl`, project.ogImageUrl, (next) => {
      project.ogImageUrl = next
    })
  }

  for (const event of siteData.timelineEvents) {
    for (const course of event.courses) {
      for (const file of course.files) {
        await add(`CourseFile:${file.id}:url`, file.url, (next) => {
          file.url = next ?? file.url
        }, { externalAllowed: true })
      }
    }
  }

  for (const media of siteData.media) {
    await add(`Media:${media.id}:url`, media.url, (next) => {
      media.url = next ?? media.url
    })
  }

  manifestAssets.sort((a, b) => a.sourceKey.localeCompare(b.sourceKey))
  return staticAssetManifestSchema.parse({ schemaVersion: 1, assets: manifestAssets })
}

async function buildSiteData(repoRoot: string) {
  const settings = await loadSettings()
  const hiddenTypes = settings.hidden_timeline_sections

  const publications = await prisma.publication.findMany({
    where: { status: "published", deletedAt: null },
    select: {
      id: true, slug: true, title: true, authors: true, venue: true, venueType: true, year: true,
      publishedAt: true, abstract: true, tldr: true, contributions: true, doi: true, arxivId: true,
      pdfUrl: true, codeUrl: true, projectUrl: true, bibtex: true, citationCount: true, featured: true,
      sortOrder: true, ogImageUrl: true, tags: { select: { tagId: true, tag: { select: tagSelect } } },
    },
    orderBy: [{ year: "desc" }, { sortOrder: "asc" }, { slug: "asc" }],
  })

  const projects = await prisma.project.findMany({
    where: { status: "published", deletedAt: null },
    select: {
      id: true, slug: true, title: true, summary: true, role: true, year: true, problem: true, approach: true,
      architecture: true, challenges: true, results: true, retrospective: true, techStack: true, repoUrl: true,
      demoUrl: true, featured: true, sortOrder: true, ogImageUrl: true,
      tags: { select: { tagId: true, tag: { select: tagSelect } } },
    },
    orderBy: [{ year: "desc" }, { sortOrder: "asc" }, { slug: "asc" }],
  })

  const tagIds = new Set([
    ...publications.flatMap((publication) => publication.tags.map((tag) => tag.tagId)),
    ...projects.flatMap((project) => project.tags.map((tag) => tag.tagId)),
  ])
  const tags = await prisma.tag.findMany({
    where: { id: { in: [...tagIds] } },
    select: tagSelect,
    orderBy: [{ label: "asc" }, { slug: "asc" }],
  })

  const timelineEvents = await prisma.timelineEvent.findMany({
    where: { visible: true, ...(hiddenTypes.length > 0 ? { type: { notIn: hiddenTypes } } : {}) },
    select: {
      id: true, type: true, title: true, organization: true, location: true, startDate: true, endDate: true,
      description: true, highlights: true, url: true, sortOrder: true,
      courses: {
        select: {
          id: true, name: true, grade: true, highlight: true, instructor: true, focus: true, topics: true,
          syllabus: true, exercises: true, projects: true, discussions: true, sortOrder: true,
          files: {
            select: { id: true, name: true, url: true, description: true, kind: true, size: true, mimeType: true, sortOrder: true },
            orderBy: [{ sortOrder: "asc" }, { name: "asc" }, { id: "asc" }],
          },
          links: {
            select: { id: true, type: true, name: true, url: true, sortOrder: true },
            orderBy: [{ sortOrder: "asc" }, { name: "asc" }, { id: "asc" }],
          },
        },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      },
    },
    orderBy: [{ startDate: "desc" }, { sortOrder: "asc" }, { id: "asc" }],
  })

  const skillCategories = await prisma.skillCategory.findMany({
    select: {
      id: true, name: true, sortOrder: true,
      skills: { select: { id: true, name: true, proficiency: true, sortOrder: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }, { id: "asc" }] },
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }, { id: "asc" }],
  })

  const teachingAssistants = await prisma.teachingAssistant.findMany({
    where: { status: "published", deletedAt: null },
    select: {
      id: true, slug: true, course: true, level: true, university: true, professor: true,
      startDate: true, endDate: true, description: true, highlights: true, technologies: true, sortOrder: true,
    },
    orderBy: [{ startDate: "desc" }, { sortOrder: "asc" }, { slug: "asc" }],
  })

  const researchingAssistants = await prisma.researchingAssistant.findMany({
    where: { status: "published", deletedAt: null },
    select: {
      id: true, slug: true, lab: true, university: true, supervisor: true, supervisorUrl: true, collaborator: true,
      topic: true, startDate: true, endDate: true, description: true, outcomes: true, technologies: true, repoUrl: true, sortOrder: true,
    },
    orderBy: [{ startDate: "desc" }, { sortOrder: "asc" }, { slug: "asc" }],
  })

  const media = await prisma.media.findMany({
    where: {
      OR: [
        { ownerType: "page", ownerId: { in: pageOwnerIds } },
        { ownerType: "publication", ownerId: { in: publications.map((publication) => publication.id) } },
        { ownerType: "project", ownerId: { in: projects.map((project) => project.id) } },
      ],
    },
    select: { id: true, ownerType: true, ownerId: true, url: true, kind: true, alt: true, caption: true, sortOrder: true },
    orderBy: [{ ownerType: "asc" }, { ownerId: "asc" }, { sortOrder: "asc" }, { id: "asc" }],
  })

  const siteData = staticSiteDataSchema.parse({
    schemaVersion: 1,
    settings,
    publications: publications.map((publication) => ({
      ...publication,
      publishedAt: publication.publishedAt.toISOString(),
    })),
    projects: projects.map((project) => ({ ...project, techStack: stringArrayOrNull(project.techStack) })),
    tags,
    timelineEvents: timelineEvents.map((event) => ({
      ...event,
      startDate: event.startDate.toISOString(),
      endDate: iso(event.endDate),
      highlights: stringArrayOrNull(event.highlights),
    })),
    skillCategories,
    teachingAssistants: teachingAssistants.map((item) => ({
      ...item,
      startDate: item.startDate.toISOString(),
      endDate: iso(item.endDate),
      highlights: stringArrayOrNull(item.highlights),
    })),
    researchingAssistants: researchingAssistants.map((item) => ({
      ...item,
      startDate: item.startDate.toISOString(),
      endDate: iso(item.endDate),
      outcomes: stringArrayOrNull(item.outcomes),
    })),
    media,
  })

  const assetManifest = await collectAssets(repoRoot, siteData)
  return { siteData: staticSiteDataSchema.parse(siteData), assetManifest }
}

async function writeSnapshot(repoRoot: string, siteData: StaticSiteData, assetManifest: StaticAssetManifest, promote: boolean) {
  const runId = randomUUID()
  const stagingDir = path.join(repoRoot, ".static-export-staging", runId)
  const stagedSiteData = path.join(stagingDir, generatedJsonPaths.siteData)
  const stagedAssetManifest = path.join(stagingDir, generatedJsonPaths.assetManifest)
  await mkdir(path.dirname(stagedSiteData), { recursive: true })
  await writeFile(stagedSiteData, `${JSON.stringify(siteData, null, 2)}\n`)
  await writeFile(stagedAssetManifest, `${JSON.stringify(assetManifest, null, 2)}\n`)

  if (!promote) {
    return { stagingDir, stagedSiteData, stagedAssetManifest, changedFiles: await compareGenerated(repoRoot, stagedSiteData, stagedAssetManifest) }
  }

  const siteTarget = path.join(/*turbopackIgnore: true*/ repoRoot, generatedJsonPaths.siteData)
  const assetTarget = path.join(/*turbopackIgnore: true*/ repoRoot, generatedJsonPaths.assetManifest)
  const siteBackup = path.join(stagingDir, "site-data.json.backup")
  const assetBackup = path.join(stagingDir, "asset-manifest.json.backup")

  try {
    await mkdir(path.dirname(siteTarget), { recursive: true })
    await cp(siteTarget, siteBackup).catch(() => undefined)
    await cp(assetTarget, assetBackup).catch(() => undefined)
    const changedFiles = await compareGenerated(repoRoot, stagedSiteData, stagedAssetManifest)
    await rename(stagedSiteData, siteTarget)
    await rename(stagedAssetManifest, assetTarget)
    await rm(stagingDir, { recursive: true, force: true })
    return { changedFiles }
  } catch (error) {
    await cp(siteBackup, siteTarget).catch(() => undefined)
    await cp(assetBackup, assetTarget).catch(() => undefined)
    await rm(stagingDir, { recursive: true, force: true })
    throw error
  }
}

async function compareGenerated(repoRoot: string, siteFile: string, assetFile: string) {
  const changed: string[] = []
  const pairs = [
    [generatedJsonPaths.siteData, siteFile],
    [generatedJsonPaths.assetManifest, assetFile],
  ] as const
  for (const [relative, candidate] of pairs) {
    const currentPath = path.join(/*turbopackIgnore: true*/ repoRoot, relative)
    const [current, next] = await Promise.all([
      readFile(/*turbopackIgnore: true*/ currentPath).catch(() => null),
      readFile(candidate),
    ])
    if (!current || !current.equals(next)) changed.push(relative)
  }
  return changed
}

export async function runStaticExport(options: ExportOptions = {}): Promise<StaticExportResult> {
  assertExportGate()
  const repoRoot = options.repoRoot ?? process.cwd()
  const { siteData, assetManifest } = await buildSiteData(repoRoot)
  const written = await writeSnapshot(repoRoot, siteData, assetManifest, options.promote ?? true)
  const stagedFiles =
    "stagedSiteData" in written && written.stagingDir && written.stagedSiteData && written.stagedAssetManifest
      ? { stagingDir: written.stagingDir, siteData: written.stagedSiteData, assetManifest: written.stagedAssetManifest }
      : undefined

  return {
    siteData,
    assetManifest,
    counts: {
      publications: siteData.publications.length,
      projects: siteData.projects.length,
      tags: siteData.tags.length,
      timelineEvents: siteData.timelineEvents.length,
      skillCategories: siteData.skillCategories.length,
      teachingAssistants: siteData.teachingAssistants.length,
      researchingAssistants: siteData.researchingAssistants.length,
      media: siteData.media.length,
      assets: assetManifest.assets.length,
    },
    changedFiles: written.changedFiles,
    stagedFiles,
  }
}
