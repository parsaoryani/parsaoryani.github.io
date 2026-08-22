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
  Clock,
  PenLine,
  AlertTriangle,
  UploadCloud,
} from "lucide-react"

export default async function AdminDashboardPage() {
  const session = await getSession()
  if (!session) redirect("/")

  const [
    pubCount, pubDraftCount, pubPublishedCount,
    projCount, projDraftCount, projPublishedCount,
    msgCount, eventCount, tagCount, skillCount,
    taCount, raCount,
    recentEdits,
    incompletePubs,
  ] = await Promise.all([
    prisma.publication.count({ where: { deletedAt: null } }),
    prisma.publication.count({ where: { deletedAt: null, status: "draft" } }),
    prisma.publication.count({ where: { deletedAt: null, status: "published" } }),
    prisma.project.count({ where: { deletedAt: null } }),
    prisma.project.count({ where: { deletedAt: null, status: "draft" } }),
    prisma.project.count({ where: { deletedAt: null, status: "published" } }),
    prisma.contactMessage.count({ where: { status: "new" } }),
    prisma.timelineEvent.count(),
    prisma.tag.count(),
    prisma.skill.count(),
    prisma.teachingAssistant.count(),
    prisma.researchingAssistant.count(),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { action: true, createdAt: true, metadata: true },
    }),
    prisma.publication.findMany({
      where: { deletedAt: null, status: "draft" },
      select: { id: true, title: true },
      take: 3,
    }),
  ])

  const sections = [
    { href: "publications", label: "Publications", count: pubCount, icon: FileText, color: "from-cyan to-indigo", newLink: "publications/new", detail: `${pubDraftCount} draft · ${pubPublishedCount} published` },
    { href: "projects", label: "Projects", count: projCount, icon: FolderGit2, color: "from-indigo to-cyan", newLink: "projects/new", detail: `${projDraftCount} draft · ${projPublishedCount} published` },
    { href: "teaching-assistance", label: "Teaching Experience", count: taCount, icon: GraduationCap, color: "from-emerald to-cyan", newLink: "teaching-assistance/new" },
    { href: "researching-assistance", label: "Research Experience", count: raCount, icon: FlaskConical, color: "from-cyan to-indigo", newLink: "researching-assistance/new" },
    { href: "photo", label: "Profile Photo", icon: Camera, color: "from-cyan to-emerald" },
    { href: "timeline", label: "Timeline & Courses", count: eventCount, icon: Timeline, color: "from-emerald to-cyan", newLink: "timeline/new" },
    { href: "tags", label: "Tags", count: tagCount, icon: Tags, color: "from-amber to-coral", newLink: "tags/new" },
    { href: "skills", label: "Skills", count: skillCount, icon: MessageSquare, color: "from-cyan to-emerald", newLink: "skills" },
    { href: "messages", label: "Messages", count: msgCount, icon: Mail, color: "from-indigo to-purple", badge: `${msgCount} new` },
    { href: "settings", label: "Settings", icon: Settings, color: "from-slate to-mist" },
    { href: "static-publish", label: "Static Publish", icon: UploadCloud, color: "from-cyan to-emerald" },
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

      {/* Content Health */}
      {(incompletePubs.length > 0 || pubDraftCount > 0) && (
        <div className="mb-6 p-4 rounded-xl border border-amber/20 bg-amber/5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-amber" />
            <h2 className="text-sm font-semibold text-amber">Content Warnings</h2>
          </div>
          <ul className="space-y-1 text-xs text-[var(--text-secondary)]">
            {incompletePubs.map((pub) => (
              <li key={pub.id}>
                <Link href={`publications/${pub.id}`} className="hover:text-[var(--accent)] transition-colors">
                  &ldquo;{pub.title}&rdquo; is still a draft
                </Link>
              </li>
            ))}
            {pubDraftCount > incompletePubs.length && (
              <li>{pubDraftCount - incompletePubs.length} more draft publications</li>
            )}
          </ul>
        </div>
      )}

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
            {"detail" in section && section.detail ? (
              <p className="text-xs text-[var(--text-tertiary)] font-mono">{section.detail}</p>
            ) : (
              <p className="text-xs text-[var(--text-tertiary)] font-mono group-hover:text-[var(--text-secondary)] transition-colors">
                {"newLink" in section ? "Create, edit & delete" : "View & manage"}
              </p>
            )}
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      {recentEdits.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Clock size={14} /> Recent Activity
          </h2>
          <div className="space-y-2">
            {recentEdits.map((edit, i) => (
              <div key={i} className="flex items-center gap-3 text-xs text-[var(--text-secondary)] py-2 border-b border-[var(--border)] last:border-0">
                <PenLine size={12} className="text-[var(--text-tertiary)] shrink-0" />
                <span className="font-mono">{edit.action}</span>
                <span className="ml-auto text-[var(--text-tertiary)]">
                  {edit.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
