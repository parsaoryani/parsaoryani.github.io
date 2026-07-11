import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/auth"
import { prisma } from "@/lib/db/prisma"
import Link from "next/link"
import {
  FileText,
  FolderGit2,
  Timeline,
  Tags,
  Mail,
  Settings,
  MessageSquare,
  Shield,
  GraduationCap,
  FlaskConical,
  Camera,
} from "lucide-react"

export default async function AdminDashboardPage() {
  const session = await getSession()
  if (!session) redirect("/")

  const [pubCount, projCount, msgCount, eventCount, tagCount, skillCount, taCount, raCount] = await Promise.all([
    prisma.publication.count({ where: { deletedAt: null } }),
    prisma.project.count({ where: { deletedAt: null } }),
    prisma.contactMessage.count({ where: { status: "new" } }),
    prisma.timelineEvent.count(),
    prisma.tag.count(),
    prisma.skill.count(),
    prisma.teachingAssistant.count(),
    prisma.researchingAssistant.count(),
  ])

  const sections = [
    { href: "publications", label: "Publications", count: pubCount, icon: FileText, color: "from-cyan to-indigo", newLink: "publications/new" },
    { href: "projects", label: "Projects", count: projCount, icon: FolderGit2, color: "from-indigo to-cyan", newLink: "projects/new" },
    { href: "teaching-assistance", label: "TA", count: taCount, icon: GraduationCap, color: "from-emerald to-cyan", newLink: "teaching-assistance/new" },
    { href: "researching-assistance", label: "RA", count: raCount, icon: FlaskConical, color: "from-cyan to-indigo", newLink: "researching-assistance/new" },
    { href: "photo", label: "Profile Photo", icon: Camera, color: "from-cyan to-emerald" },
    { href: "timeline", label: "Timeline Events", count: eventCount, icon: Timeline, color: "from-emerald to-cyan", newLink: "timeline/new" },
    { href: "tags", label: "Tags", count: tagCount, icon: Tags, color: "from-amber to-coral", newLink: "tags/new" },
    { href: "skills", label: "Skills", count: skillCount, icon: MessageSquare, color: "from-cyan to-emerald", newLink: "skills" },
    { href: "messages", label: "Messages", count: msgCount, icon: Mail, color: "from-indigo to-purple", badge: `${msgCount} new` },
    { href: "settings", label: "Settings", icon: Settings, color: "from-slate to-mist" },
    { href: "security", label: "Security", icon: Shield, color: "from-ash to-slate" },
  ]

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Welcome back, {session.user.email}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--accent)]/30 transition-all hover:shadow-[0_0_25px_-10px_rgba(56,225,196,0.1)]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-lg bg-gradient-to-br ${section.color} text-void`}>
                <section.icon size={18} />
              </div>
              {section.badge && (
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-coral/10 text-coral border border-coral/20">
                  {section.badge}
                </span>
              )}
              {"count" in section && section.count !== undefined && (
                <span className="text-lg font-bold font-mono text-[var(--accent)]">
                  {section.count}
                </span>
              )}
            </div>
            <h2 className="text-sm font-semibold mb-1">{section.label}</h2>
            <p className="text-xs text-[var(--text-tertiary)] font-mono group-hover:text-[var(--text-secondary)] transition-colors">
              {"newLink" in section ? "Create, edit & delete" : "View & manage"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
