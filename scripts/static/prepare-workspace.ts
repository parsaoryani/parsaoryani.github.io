import { cp, mkdir, readFile, readdir, rm, symlink, writeFile } from "node:fs/promises"
import path from "node:path"

const repoRoot = process.cwd()
const workspace = path.join(repoRoot, ".static-export-workspace")

async function copyIfPresent(from: string, to: string) {
  try {
    await cp(from, to, { recursive: true, dereference: false })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error
  }
}

async function removeTests(dir: string) {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => [])
  await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        await removeTests(full)
      } else if (/\.test\.(ts|tsx)$/.test(entry.name)) {
        await rm(full, { force: true })
      }
    })
  )
}

async function walkFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => [])
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) return walkFiles(full)
      if (entry.isFile()) return [full]
      return []
    })
  )
  return nested.flat()
}

async function assertStaticWorkspaceSafe() {
  const files = await walkFiles(path.join(workspace, "src"))
  const forbiddenPath = /\/(api|middleware|proxy|db|auth|email|rate-limit)\b|\/\(admin\)\//
  const forbiddenImport = /@\/lib\/db|@\/lib\/auth|@\/lib\/email|@\/lib\/rate-limit|@prisma\/client|server-only|ContactForm|\/api\/contact/
  const problems: string[] = []

  for (const file of files) {
    const relative = path.relative(workspace, file)
    if (forbiddenPath.test(relative)) {
      problems.push(`${relative}: forbidden path in static workspace`)
      continue
    }
    if (/\.(ts|tsx|js|jsx)$/.test(file)) {
      const text = await readFile(file, "utf8")
      if (forbiddenImport.test(text)) problems.push(`${relative}: forbidden import/reference`)
    }
  }

  if (problems.length > 0) {
    throw new Error(`Static workspace safety scan failed:\n${problems.join("\n")}`)
  }
}

async function main() {
  await rm(workspace, { recursive: true, force: true })
  await mkdir(workspace, { recursive: true })

  await writeFile(
    path.join(workspace, "package.json"),
    `${JSON.stringify({ name: "personal-website-static", private: true }, null, 2)}\n`
  )
  await symlink(path.join(repoRoot, "node_modules"), path.join(workspace, "node_modules"), "dir")

  for (const file of ["tsconfig.json", "postcss.config.mjs", "next-env.d.ts"]) {
    await copyIfPresent(path.join(repoRoot, file), path.join(workspace, file))
  }

  await copyIfPresent(path.join(repoRoot, "public"), path.join(workspace, "public"))
  await copyIfPresent(path.join(repoRoot, "src", "styles"), path.join(workspace, "src", "styles"))
  await copyIfPresent(path.join(repoRoot, "src", "content"), path.join(workspace, "src", "content"))
  await copyIfPresent(path.join(repoRoot, "src", "components", "layout"), path.join(workspace, "src", "components", "layout"))
  await copyIfPresent(path.join(repoRoot, "src", "components", "ui"), path.join(workspace, "src", "components", "ui"))
  await copyIfPresent(path.join(repoRoot, "src", "components", "content"), path.join(workspace, "src", "components", "content"))
  await rm(path.join(workspace, "src", "components", "content", "contact-form.tsx"), { force: true })
  await rm(path.join(workspace, "src", "components", "content", "contact-surface", "server.tsx"), { force: true })

  await copyIfPresent(path.join(repoRoot, "src", "lib", "public-data"), path.join(workspace, "src", "lib", "public-data"))
  await rm(path.join(workspace, "src", "lib", "public-data", "server.ts"), { force: true })
  await copyIfPresent(path.join(repoRoot, "src", "lib", "site"), path.join(workspace, "src", "lib", "site"))
  await copyIfPresent(path.join(repoRoot, "src", "lib", "home"), path.join(workspace, "src", "lib", "home"))
  await copyIfPresent(path.join(repoRoot, "src", "lib", "timeline"), path.join(workspace, "src", "lib", "timeline"))
  await copyIfPresent(path.join(repoRoot, "src", "lib", "projects"), path.join(workspace, "src", "lib", "projects"))
  await copyIfPresent(path.join(repoRoot, "src", "lib", "utils"), path.join(workspace, "src", "lib", "utils"))

  await mkdir(path.join(workspace, "src", "app"), { recursive: true })
  for (const file of ["layout.tsx", "not-found.tsx", "robots.ts", "sitemap.ts", "favicon.ico"]) {
    await copyIfPresent(path.join(repoRoot, "src", "app", file), path.join(workspace, "src", "app", file))
  }
  await copyIfPresent(path.join(repoRoot, "src", "app", "(public)"), path.join(workspace, "src", "app", "(public)"))

  const snapshot = JSON.parse(
    await readFile(path.join(repoRoot, "src", "content", "generated", "site-data.json"), "utf8")
  ) as {
    publications?: unknown[]
    projects?: unknown[]
    timelineEvents?: Array<{ type?: string }>
  }

  if (!snapshot.publications?.length) {
    await rm(path.join(workspace, "src", "app", "(public)", "research", "[slug]"), { recursive: true, force: true })
  }
  if (!snapshot.projects?.length) {
    await rm(path.join(workspace, "src", "app", "(public)", "projects", "[slug]"), { recursive: true, force: true })
  }
  if (!snapshot.timelineEvents?.some((event) => event.type === "education")) {
    await rm(path.join(workspace, "src", "app", "(public)", "education", "[slug]"), { recursive: true, force: true })
  }

  await writeFile(
    path.join(workspace, "src", "lib", "public-data", "index.ts"),
    `export * from "./contract"\nexport {\n  getAllProjectsPublic as getAllProjects,\n  getAllPublicationsPublic as getAllPublications,\n  getAllResearchExperiencePublic as getAllResearchExperience,\n  getAllTagsPublic as getAllTags,\n  getAllTeachingExperiencePublic as getAllTeachingExperience,\n  getEducationEventBySlugPublic as getEducationEventBySlug,\n  getEducationEventsPublic as getEducationEvents,\n  getFeaturedProjectsPublic as getFeaturedProjects,\n  getFeaturedPublicationsPublic as getFeaturedPublications,\n  getLatestResearchExperiencePublic as getLatestResearchExperience,\n  getLatestTeachingExperiencePublic as getLatestTeachingExperience,\n  getMediaForOwnerPublic as getMediaForOwner,\n  getProjectBySlugPublic as getProjectBySlug,\n  getPublicationBySlugPublic as getPublicationBySlug,\n  getSiteSettingPublic as getSiteSetting,\n  getSiteSettingsPublic as getSiteSettings,\n  getSkillCategoriesPublic as getSkillCategories,\n  getTimelineEventsPublic as getTimelineEvents,\n  publicDataProvider,\n} from "./static"\n`
  )

  await writeFile(
    path.join(workspace, "src", "components", "content", "contact-surface", "index.tsx"),
    `export { ContactSurface } from "./static"\n`
  )

  await writeFile(
    path.join(workspace, "next.config.ts"),
    `import path from "node:path"\nimport type { NextConfig } from "next"\n\nconst basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""\n\nconst nextConfig: NextConfig = {\n  output: "export",\n  trailingSlash: true,\n  basePath,\n  images: { unoptimized: true },\n  turbopack: { root: path.resolve(process.cwd(), "..") },\n}\n\nexport default nextConfig\n`
  )

  await removeTests(path.join(workspace, "src"))
  await assertStaticWorkspaceSafe()

  console.log(`Prepared static workspace: ${workspace}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
