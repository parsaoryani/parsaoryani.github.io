import Link from "next/link"
import { Link as LinkIcon, Presentation, Code2, ArrowUpRight, ChevronRight, UserRound } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface CourseFileShape {
  id: string
  name: string
  url: string
  description?: string | null
}

interface CourseLinkShape {
  id: string
  type: string
  name: string
  url: string
}

export interface CourseDetailShape {
  id: string
  name: string
  grade: string | null
  highlight: string | null
  instructor: string | null
  focus: string | null
  topics: string | null
  syllabus: string | null
  exercises: string | null
  projects: string | null
  discussions: string | null
  files: CourseFileShape[]
  links?: CourseLinkShape[]
}

function resolveArtifact(link: CourseLinkShape): { label: string; Icon: LucideIcon; rank: number } {
  const url = link.url
  if (link.type === "slides" || url.includes("docs.google.com/presentation")) {
    return { label: "Slides", Icon: Presentation, rank: 2 }
  }
  if (url.includes("github.com") || url.includes("gitlab.com")) {
    return { label: "Repository", Icon: Code2, rank: 1 }
  }
  if (url.startsWith("/")) {
    return { label: "Project page", Icon: ArrowUpRight, rank: 0 }
  }
  return { label: "Link", Icon: LinkIcon, rank: 3 }
}

const CHIP_CLASS =
  "group/chip inline-flex items-center gap-1.5 rounded-md border border-slate-700/60 bg-slate-800/50 px-2 py-0.5 text-[11px] font-mono text-mist transition-colors hover:border-cyan/40 hover:bg-cyan/10 hover:text-cyan"

function ProjectLinkChip({ link, projectName }: { link: CourseLinkShape; projectName: string }) {
  const { label, Icon } = resolveArtifact(link)
  const icon = <Icon size={11} className="shrink-0 text-cyan/70 transition-colors group-hover/chip:text-cyan" />
  const ariaLabel = `${label}, ${projectName}`

  if (link.url.startsWith("/")) {
    return (
      <Link href={link.url} className={CHIP_CLASS} aria-label={ariaLabel}>
        {icon} {label}
      </Link>
    )
  }
  return (
    <a href={link.url} target="_blank" rel="noopener noreferrer" className={CHIP_CLASS} aria-label={ariaLabel}>
      {icon} {label}
    </a>
  )
}

function CollapsibleSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details className="group/collapsible" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-ash transition-colors hover:text-cyan mb-1">
        <ChevronRight size={12} className="shrink-0 transition-transform duration-200 group-open/collapsible:rotate-90" />
        {title}
      </summary>
      <div className="mt-2 border-l border-slate-700/60 pl-3 space-y-2">
        {children}
      </div>
    </details>
  )
}

/**
 * Groups course.files by their "HW<n>" prefix, in file order within each
 * group, and by HW number ascending. Files with no HW prefix (e.g. a
 * standalone project writeup) each become their own single-item group keyed
 * by their full name.
 */
function groupFilesByHomework(files: CourseFileShape[]): { label: string; files: CourseFileShape[] }[] {
  const groups = new Map<string, CourseFileShape[]>()
  for (const file of files) {
    const match = file.name.match(/^(HW\d+)/)
    const key = match?.[1] ?? file.name
    const group = groups.get(key) ?? []
    group.push(file)
    groups.set(key, group)
  }
  return [...groups.entries()]
    .sort(([a], [b]) => {
      const na = a.match(/^HW(\d+)/)
      const nb = b.match(/^HW(\d+)/)
      if (na && nb) return Number(na[1]) - Number(nb[1])
      if (na) return -1
      if (nb) return 1
      return a.localeCompare(b)
    })
    .map(([label, files]) => ({ label, files }))
}

/**
 * Splits a flat course.exercises summary into one explanation per HW, so it
 * can sit directly above that homework's GitHub links instead of as one
 * undifferentiated paragraph. Handles the two summary styles in use:
 * "HW1: ...  HW2: ..." and "HW1 (...), HW2 (...)". Returns {} if neither
 * pattern matches, in which case the caller falls back to the raw text.
 */
function parseHomeworkExplanations(exercises: string): Record<string, string> {
  const result: Record<string, string> = {}

  const colonMatches = [...exercises.matchAll(/HW(\d+):\s*([^]*?)(?=\s*HW\d+:|\s*(?:All in|See files)|$)/g)]
  if (colonMatches.length > 0) {
    for (const m of colonMatches) result[`HW${m[1]}`] = (m[2] ?? "").trim()
    return result
  }

  const parenMatches = [...exercises.matchAll(/HW(\d+)\s*\(([^)]*)\)/g)]
  if (parenMatches.length > 0) {
    for (const m of parenMatches) result[`HW${m[1]}`] = (m[2] ?? "").trim()
    return result
  }

  return result
}

export function CourseDetailCard({ course }: { course: CourseDetailShape }) {
  const exerciseLinks = course.links?.filter((l) => l.type === "exercise") ?? []
  const projectLinks = course.links?.filter((l) => l.type === "project" || l.type === "slides") ?? []
  const projects = Object.values(
    projectLinks.reduce<Record<string, { name: string; links: CourseLinkShape[] }>>((acc, link) => {
      const group = (acc[link.name] ??= { name: link.name, links: [] })
      group.links.push(link)
      return acc
    }, {})
  ).map((project) => ({
    ...project,
    links: [...project.links].sort((a, b) => resolveArtifact(a).rank - resolveArtifact(b).rank),
  }))

  const homeworkGroups = groupFilesByHomework(course.files)
  const hwExplanations = course.exercises ? parseHomeworkExplanations(course.exercises) : {}
  // Only fall back to the raw summary when it couldn't be split per HW.
  // otherwise each group already carries its own explanation below.
  const showRawExercisesText = Boolean(course.exercises) && Object.keys(hwExplanations).length === 0

  return (
    <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-4 hover:border-cyan/20 transition-colors">
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <h3 className="font-medium text-fog">{course.name}</h3>
        {course.grade && (
          <span className="px-2 py-0.5 text-xs font-mono rounded bg-emerald/10 text-emerald border border-emerald/20">
            {course.grade}{course.highlight ? ` · ${course.highlight}` : ""}
          </span>
        )}
      </div>
      {course.focus && (
        <p className="text-sm text-mist/80 mt-1"><strong>Focus:</strong> {course.focus}</p>
      )}
      {course.instructor && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ash">
          <UserRound size={12} className="shrink-0 text-ash/70" />
          {course.instructor}
        </p>
      )}
      {course.topics && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {course.topics.split(",").map((t) => (
            <span key={t.trim()} className="text-xs px-2 py-0.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-mist/80">{t.trim()}</span>
          ))}
        </div>
      )}
      {course.syllabus && (
        <details className="mt-3 group/syllabus">
          <summary className="flex cursor-pointer list-none items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-ash transition-colors hover:text-cyan">
            <ChevronRight size={12} className="shrink-0 transition-transform duration-200 group-open/syllabus:rotate-90" />
            Syllabus
          </summary>
          {(() => {
            const items = course.syllabus!
              .split(";")
              .map((s) => s.trim())
              .filter(Boolean)
            if (items.length < 2) {
              return <p className="mt-2 border-l border-slate-700/60 pl-3 text-[13px] leading-relaxed text-mist/80">{course.syllabus}</p>
            }
            return (
              <ul className="mt-2 space-y-1 border-l border-slate-700/60 pl-3">
                {items.map((item) => (
                  <li key={item} className="text-[13px] leading-relaxed text-mist/80 first-letter:uppercase">{item}</li>
                ))}
              </ul>
            )
          })()}
        </details>
      )}
      
      {/* Exercises - collapsible, one clearly separated block per homework */}
      {(course.exercises || exerciseLinks.length > 0 || homeworkGroups.length > 0) && (
        <CollapsibleSection title="Exercises">
          {showRawExercisesText && (
            <p className="text-sm leading-relaxed text-mist/80">{course.exercises}</p>
          )}
          {homeworkGroups.length > 0 && (
            <ul className={`space-y-4 ${showRawExercisesText ? "mt-3" : ""}`}>
              {homeworkGroups.map(({ label, files }) => (
                <li key={label} className="border-l border-emerald/30 pl-3">
                  <p className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald">{label}</p>
                  {hwExplanations[label] && (
                    <p className="mt-1 text-[13px] leading-relaxed text-mist/80">{hwExplanations[label]}</p>
                  )}
                  <div className="mt-1.5 space-y-1.5">
                    {files.map((file) => (
                      <a
                        key={file.id}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/file flex items-start gap-2 rounded-md border border-slate-700/50 bg-slate-800/40 px-2.5 py-1.5 transition-colors hover:border-emerald/40 hover:bg-emerald/5"
                      >
                        <Code2 size={12} className="mt-0.5 shrink-0 text-emerald/80" />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13px] font-medium text-fog group-hover/file:underline">
                            {file.name.replace(/^HW\d+:?\s*/, "") || file.name}
                          </span>
                          {file.description && (
                            <span className="mt-0.5 block text-xs leading-relaxed text-mist/70">{file.description}</span>
                          )}
                        </span>
                        <ArrowUpRight size={11} className="mt-0.5 shrink-0 text-mist/50 opacity-0 transition-opacity group-hover/file:opacity-100" />
                      </a>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {exerciseLinks.length > 0 && (
            <div className={`flex flex-wrap gap-2 ${showRawExercisesText || homeworkGroups.length > 0 ? "mt-3" : ""}`}>
              {exerciseLinks.map((link) => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-mono rounded bg-emerald/10 border border-emerald/20 text-emerald hover:bg-emerald/20 transition-colors">
                  <LinkIcon size={10} /> {link.name}
                </a>
              ))}
            </div>
          )}
        </CollapsibleSection>
      )}
      
      {/* Projects - collapsible, only show links section (not duplicate text) */}
      {projects.length > 0 && (
        <CollapsibleSection title="Projects">
          <ul className="space-y-2.5">
            {projects.map((project) => (
              <li key={project.name} className="border-l border-cyan/25 pl-3">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                  <span className="text-sm text-fog leading-snug">{project.name}</span>
                  {project.links.map((link) => (
                    <ProjectLinkChip key={link.id} link={link} projectName={project.name} />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </CollapsibleSection>
      )}
      
      {course.discussions && (
        <CollapsibleSection title="Discussions">
          <p className="text-sm leading-relaxed text-mist/80">{course.discussions}</p>
        </CollapsibleSection>
      )}
    </div>
  )
}