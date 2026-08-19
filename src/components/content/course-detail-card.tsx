import Link from "next/link"
import { FileText, Link as LinkIcon, FolderGit2 } from "lucide-react"

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

function linkChipLabel(link: CourseLinkShape): string {
  if (link.type === "slides") return "Slides"
  if (link.url.includes("docs.google.com/presentation")) return "Slides"
  return "Implementation"
}

function ProjectLinkChip({ link }: { link: CourseLinkShape }) {
  const label = linkChipLabel(link)
  const className = "inline-flex items-center gap-1 px-2 py-1 text-xs font-mono rounded bg-cyan/10 border border-cyan/20 text-cyan hover:bg-cyan/20 transition-colors"
  if (link.url.startsWith("/")) {
    return (
      <Link href={link.url} className={className}>
        <LinkIcon size={10} /> {label}
      </Link>
    )
  }
  return (
    <a href={link.url} target="_blank" rel="noopener noreferrer" className={className}>
      <LinkIcon size={10} /> {label}
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
  )

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
        <div className="mt-3 space-y-2">
          <p className="text-xs font-semibold text-cyan uppercase tracking-wider">Project</p>
          {projects.map((project) => (
            <div key={project.name} className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg border border-slate-700/50 bg-slate-800/40">
              <span className="flex items-center gap-1.5 text-sm text-fog">
                <FolderGit2 size={13} className="text-cyan shrink-0" /> {project.name}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {project.links.map((link) => (
                  <ProjectLinkChip key={link.id} link={link} />
                ))}
              </div>
            </div>
          ))}
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
