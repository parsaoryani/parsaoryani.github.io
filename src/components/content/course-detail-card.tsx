import Link from "next/link"
import { FileText, Link as LinkIcon, Presentation, Code2, ArrowUpRight, ChevronRight, UserRound } from "lucide-react"
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
  const ariaLabel = `${label} — ${projectName}`

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

const COURSE_GITHUB_PATHS: Record<string, string> = {
  "Applied Cryptography": "masters/applied-cryptography",
  "Secure Software Systems": "masters/secure-software-systems",
  "Formal Methods in Information Security": "masters/formal-methods-in-information-security",
  "Foundations and Applications of Blockchain": "masters/foundations-and-applications-of-blockchain",
  "Deep Learning": "masters/deep-learning",
}

function parseExercises(exercises: string, courseName: string): { hw: string; url: string }[] {
  if (!exercises.includes("HW1") && !exercises.includes("HW2") && !exercises.includes("HW3")) return []

  const githubPath = COURSE_GITHUB_PATHS[courseName]
  if (!githubPath) return []

  const hwMatches = exercises.match(/HW\d+/g)
  if (!hwMatches) return []

  const uniqueHws = [...new Set(hwMatches)].sort((a, b) => parseInt(a.replace("HW", "")) - parseInt(b.replace("HW", "")))

  const hws: { hw: string; url: string }[] = []
  for (const hw of uniqueHws) {
    const url = `https://github.com/parsaoryani/courses/tree/main/${githubPath}/HW`
    hws.push({ hw, url })
  }

  return hws
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

  const isDeepLearning = course.name.toLowerCase().includes("deep learning")
  const dlExercises = (isDeepLearning || course.name.includes("Secure Software") || course.name.includes("Blockchain") || course.name.includes("Formal Methods")) && course.exercises 
    ? parseExercises(course.exercises, course.name) 
    : []

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
      
      {/* Exercises - collapsible */}
      {(course.exercises || exerciseLinks.length > 0 || dlExercises.length > 0) && (
        <CollapsibleSection title="Exercises">
          {isDeepLearning && dlExercises.length > 0 ? (
            <div className="space-y-2">
              {dlExercises.map(({ hw, url }) => (
                <a
                  key={hw}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-md border border-emerald/30 bg-emerald/5 text-emerald hover:border-emerald/50 hover:bg-emerald/10 transition-colors group"
                >
                  <Code2 size={13} className="shrink-0" />
                  <span className="text-sm font-medium group-hover:underline">{hw}</span>
                  <ArrowUpRight size={11} className="shrink-0 ml-auto opacity-60 group-hover:opacity-100" />
                </a>
              ))}
            </div>
          ) : (
            <>
              {course.exercises && (
                <p className="text-sm leading-relaxed text-mist/80">{course.exercises}</p>
              )}
              {exerciseLinks.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {exerciseLinks.map((link) => (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-mono rounded bg-emerald/10 border border-emerald/20 text-emerald hover:bg-emerald/20 transition-colors">
                      <LinkIcon size={10} /> {link.name}
                    </a>
                  ))}
                </div>
              )}
            </>
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
      
      {course.files.length > 0 && (
        <CollapsibleSection title={`Files (${course.files.length})`}>
          <div className="grid gap-2 sm:grid-cols-2">
            {course.files.map((file) => (
              <a key={file.id} href={file.url} target="_blank" rel="noopener noreferrer" className="group/file rounded-lg border border-slate-700/50 bg-slate-800/40 px-3 py-2 transition-colors hover:border-cyan/30 hover:bg-cyan/10">
                <span className="inline-flex items-center gap-1 text-xs font-mono text-[var(--accent)] transition-colors group-hover/file:text-cyan">
                  <FileText size={10} /> {file.name}
                </span>
                {file.description && (
                  <span className="mt-1 block text-xs leading-relaxed text-mist/70">
                    {file.description}
                  </span>
                )}
              </a>
            ))}
          </div>
        </CollapsibleSection>
      )}
    </div>
  )
}