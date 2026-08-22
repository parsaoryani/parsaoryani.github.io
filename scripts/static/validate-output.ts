import { createHash } from "node:crypto"
import { cp, mkdir, readdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises"
import path from "node:path"
import { parseStaticAssetManifest, parseStaticSiteData } from "@/content/site-data.schema"
import { slugify } from "@/lib/utils/slugify"

const repoRoot = process.cwd()
const workspaceRoot = path.join(repoRoot, ".static-export-workspace")
const workspaceOut = path.join(workspaceRoot, "out")
const rootOut = path.join(repoRoot, "out")
const stagedOut = path.join(workspaceRoot, "validated-out")
const maxAssetBytes = 50 * 1024 * 1024
const maxOutBytes = 900 * 1024 * 1024

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) return walk(full)
      if (entry.isFile()) return [full]
      return []
    })
  )
  return files.flat()
}

async function fileContains(file: string, pattern: string) {
  const text = await readFile(file, "utf8").catch(() => "")
  return text.includes(pattern)
}

function routeToFile(route: string) {
  if (route === "/") return path.join(workspaceOut, "index.html")
  return path.join(workspaceOut, route.replace(/^\//, ""), "index.html")
}

function assetToFile(assetPath: string) {
  return path.join(workspaceOut, assetPath.replace(/^\//, ""))
}

function extractLocalRefs(html: string) {
  const refs = new Set<string>()
  const regex = /\b(?:href|src|poster)=["']([^"']+)["']/g
  let match: RegExpExecArray | null
  while ((match = regex.exec(html))) {
    const raw = match[1]
    if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("tel:")) continue
    if (/^[a-z][a-z0-9+.-]*:/i.test(raw)) continue
    const clean = raw.split("#")[0]!.split("?")[0]!
    if (clean.startsWith("/") && !clean.startsWith("//")) refs.add(clean)
  }
  return refs
}

function normalizeRoute(ref: string) {
  if (ref === "/") return "/"
  return ref.endsWith("/") ? ref.slice(0, -1) : ref
}

async function main() {
  await stat(workspaceOut)
  const [siteDataRaw, assetManifestRaw] = await Promise.all([
    readFile(path.join(workspaceRoot, "src", "content", "generated", "site-data.json"), "utf8"),
    readFile(path.join(workspaceRoot, "src", "content", "generated", "asset-manifest.json"), "utf8"),
  ])
  const siteData = parseStaticSiteData(JSON.parse(siteDataRaw))
  const assetManifest = parseStaticAssetManifest(JSON.parse(assetManifestRaw))

  const expectedRoutes = new Set<string>([
    "/",
    "/about",
    "/contact",
    "/cv",
    "/experience",
    "/projects",
    "/research",
    "/research-assistance",
    "/teaching",
  ])
  for (const project of siteData.projects) expectedRoutes.add(`/projects/${project.slug}`)
  for (const publication of siteData.publications) expectedRoutes.add(`/research/${publication.slug}`)
  for (const event of siteData.timelineEvents.filter((item) => item.type === "education")) {
    expectedRoutes.add(`/education/${slugify(event.organization)}`)
  }

  const routeInventory = {
    routes: [...expectedRoutes].sort(),
    assets: assetManifest.assets.map((asset) => asset.publicPath).sort(),
  }
  await writeFile(path.join(workspaceRoot, "route-inventory.json"), `${JSON.stringify(routeInventory, null, 2)}\n`)

  const files = await walk(workspaceOut)
  const htmlFiles = files.filter((file) => file.endsWith(".html"))
  const problems: string[] = []
  let outBytes = 0

  for (const file of files) {
    const stats = await stat(file)
    outBytes += stats.size
    if (stats.size >= maxAssetBytes) {
      problems.push(`${path.relative(workspaceOut, file)}: file is ${stats.size} bytes; limit is ${maxAssetBytes - 1}`)
    }
  }
  if (outBytes >= maxOutBytes) problems.push(`out/: output is ${outBytes} bytes; limit is ${maxOutBytes - 1}`)

  for (const route of expectedRoutes) {
    if (!(await stat(routeToFile(route)).then((stats) => stats.isFile()).catch(() => false))) {
      problems.push(`${route}: missing generated HTML`)
    }
  }

  const notFoundHtml = path.join(workspaceOut, "404.html")
  if (!(await fileContains(notFoundHtml, `data-static-404="true"`))) problems.push("404.html: missing custom 404 marker")

  for (const file of htmlFiles) {
    const html = await readFile(file, "utf8")
    const relative = path.relative(workspaceOut, file)
    if (html.includes("/personalWebsite")) problems.push(`${relative}: contains /personalWebsite`)
    if (html.includes("/api/contact")) problems.push(`${relative}: contains /api/contact`)
    if (html.includes("<form")) problems.push(`${relative}: contains a form`)
    for (const ref of extractLocalRefs(html)) {
      if (ref.startsWith("/_next/")) {
        if (!(await stat(assetToFile(ref)).then((stats) => stats.isFile()).catch(() => false))) {
          problems.push(`${relative}: missing Next asset ${ref}`)
        }
        continue
      }
      const route = normalizeRoute(ref)
      const exists =
        (await stat(routeToFile(route)).then((stats) => stats.isFile()).catch(() => false)) ||
        (await stat(assetToFile(ref)).then((stats) => stats.isFile()).catch(() => false))
      if (!exists) problems.push(`${relative}: local reference does not resolve: ${ref}`)
    }
  }

  const contactHtml = path.join(workspaceOut, "contact", "index.html")
  if (!(await fileContains(contactHtml, "mailto:"))) problems.push("contact/index.html: missing mailto contact")

  for (const asset of assetManifest.assets) {
    const file = assetToFile(asset.publicPath)
    const data = await readFile(file).catch(() => null)
    if (!data) {
      problems.push(`${asset.publicPath}: missing manifest asset`)
      continue
    }
    const sha256 = createHash("sha256").update(data).digest("hex")
    if (sha256 !== asset.sha256) problems.push(`${asset.publicPath}: hash mismatch`)
    if (data.byteLength !== asset.bytes) problems.push(`${asset.publicPath}: byte count mismatch`)
  }

  const sitemap = await readFile(path.join(workspaceOut, "sitemap.xml"), "utf8").catch(() => "")
  if (!sitemap.includes("https://parsaoryani.github.io/")) problems.push("sitemap.xml: missing GitHub Pages origin")
  for (const route of expectedRoutes) {
    if (route === "/research-assistance" || route === "/teaching") continue
    const withoutSlash = `https://parsaoryani.github.io${route === "/" ? "" : route}`
    const withSlash = `https://parsaoryani.github.io${route === "/" ? "/" : `${route}/`}`
    if (!sitemap.includes(withoutSlash) && !sitemap.includes(withSlash)) problems.push(`sitemap.xml: missing ${route}`)
  }

  const robots = await readFile(path.join(workspaceOut, "robots.txt"), "utf8").catch(() => "")
  if (!robots.includes("https://parsaoryani.github.io/sitemap.xml")) problems.push("robots.txt: missing production sitemap URL")

  if (problems.length > 0) {
    for (const problem of problems) console.error(problem)
    process.exit(1)
  }

  await rm(stagedOut, { recursive: true, force: true })
  await cp(workspaceOut, stagedOut, { recursive: true })
  await rm(rootOut, { recursive: true, force: true })
  await mkdir(path.dirname(rootOut), { recursive: true })
  await rename(stagedOut, rootOut)

  const hash = createHash("sha256")
  for (const file of files.sort()) {
    hash.update(path.relative(workspaceOut, file))
    hash.update(await readFile(file))
  }
  await writeFile(path.join(rootOut, ".static-hash"), `${hash.digest("hex")}\n`)
  console.log(`Validated and promoted static output: ${rootOut}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
