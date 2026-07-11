import Link from "next/link"
import { FileText, FolderGit2, TimelineIcon, Tags, MessageSquare, Mail, Settings } from "lucide-react"

interface DashboardCardsProps {
  counts: {
    publications: number
    projects: number
    timeline: number
    tags: number
    skills: number
    messages: number
  }
  basePath: string
}

const sections = [
  { key: "publications", label: "Publications", icon: FileText, color: "text-cyan", desc: "Manage research papers" },
  { key: "projects", label: "Projects", icon: FolderGit2, color: "text-indigo", desc: "Manage portfolio projects" },
  { key: "timeline", label: "Timeline", icon: TimelineIcon, color: "text-emerald", desc: "Career & education entries" },
  { key: "tags", label: "Tags", icon: Tags, color: "text-amber", desc: "Categorize content" },
  { key: "skills", label: "Skills", icon: MessageSquare, color: "text-rose", desc: "Skills & proficiency" },
  { key: "messages", label: "Messages", icon: Mail, color: "text-violet", desc: "Contact form submissions" },
] as const

export function DashboardCards({ counts, basePath }: DashboardCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sections.map((section) => (
        <Link
          key={section.key}
          href={`${basePath}/${section.key}`}
          className="group rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 hover:border-slate-600 transition-all"
        >
          <div className="flex items-start justify-between mb-3">
            <section.icon size={22} className={section.color} />
            <span className="text-2xl font-bold font-mono">{counts[section.key as keyof typeof counts]}</span>
          </div>
          <h3 className="text-sm font-medium mb-0.5">{section.label}</h3>
          <p className="text-xs text-[var(--text-secondary)]">{section.desc}</p>
        </Link>
      ))}
    </div>
  )
}
