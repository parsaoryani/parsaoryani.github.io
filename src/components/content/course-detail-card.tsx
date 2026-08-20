import Link from "next/link"
import { FileText, Link as LinkIcon, Presentation, Code2, ArrowUpRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface CourseFileShape {
  id: string
  name: string
  url: string
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

/**
 * What kind of artifact a link points at. The label is derived from the
 * destination rather than assumed, so a deck reads as "Slides" and an internal
 * route reads as "Project page" instead of everything defaulting to
 * "Implementation". `rank` keeps the order stable regardless of DB row order.
 */
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
  // Screen readers hear the project name too — "Slides" alone is ambiguous
  // when a course lists several projects.
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
        <p className="text-sm text-mist/60 mt-1">{course.instructor}</p>
      )}
      {course.topics && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {course.topics.split(",").map((t) => (
            <span key={t.trim()} className="text-xs px-2 py-0.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-mist/80">{t.trim()}</span>
          ))}
        </div>
      )}
      {course.syllabus && (
        <details className="mt-2 group/syllabus">
          <summary className="cursor-pointer text-xs font-mono text-cyan/80 hover:text-cyan inline-flex items-center gap-1">
            View syllabus
            <span className="text-ash transition-transform duration-200 group-open/syllabus:rotate-180">▸</span>
          </summary>
          <p className="text-sm text-mist/80 mt-2 leading-relaxed">{course.syllabus}</p>
        </details>
      )}
      {course.exercises && (
        <p className="text-sm text-mist/80 mt-1"><strong>Exercises:</strong> {course.exercises}</p>
      )}
      {course.projects && (
        <p className="text-sm text-mist/80 mt-1"><strong>Projects:</strong> {course.projects}</p>
      )}
      {course.discussions && (
        <p className="text-sm text-mist/80 mt-1"><strong>Discussions:</strong> {course.discussions}</p>
      )}
      {course.files.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {course.files.map((file) => (
            <a key={file.id} href={file.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono rounded bg-slate-800/50 border border-slate-700/50 text-[var(--accent)] hover:bg-cyan/10 transition-colors">
              <FileText size={10} /> {file.name}
            </a>
          ))}
        </div>
      )}
      {projects.length > 0 && (
        <div className="mt-3.5">
          <p className="text-[11px] font-mono uppercase tracking-wider text-ash mb-2">
            {projects.length > 1 ? "Course projects" : "Course project"}
          </p>
          <ul className="space-y-2.5">
            {projects.map((project) => (
              // Links sit directly beside the title rather than pushed to the far
              // edge, so each artifact stays visually tied to its own project.
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
        </div>
      )}
      {exerciseLinks.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {exerciseLinks.map((link) => (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-mono rounded bg-emerald/10 border border-emerald/20 text-emerald hover:bg-emerald/20 transition-colors">
              <LinkIcon size={10} /> {link.name}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
