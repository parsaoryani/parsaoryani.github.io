"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  FolderGit2,
  Timeline,
  Tags,
  Mail,
  Phone,
  Settings,
  MessageSquare,
  Shield,
  LogOut,
  ExternalLink,
  GraduationCap,
  FlaskConical,
  Camera,
  Bug,
} from "lucide-react"

const navItems = [
  { href: "", label: "Dashboard", icon: LayoutDashboard },
  { href: "publications", label: "Publications", icon: FileText },
  { href: "projects", label: "Projects", icon: FolderGit2 },
  { href: "timeline", label: "Timeline", icon: Timeline },
  { href: "tags", label: "Tags", icon: Tags },
  { href: "skills", label: "Skills", icon: MessageSquare },
  { href: "teaching-assistance", label: "TA", icon: GraduationCap },
  { href: "researching-assistance", label: "RA", icon: FlaskConical },
  { href: "messages", label: "Messages", icon: Mail },
  { href: "contact", label: "Contact", icon: Phone },
  { href: "photo", label: "Profile Photo", icon: Camera },
  { href: "settings", label: "Settings", icon: Settings },
  { href: "mail-dev", label: "Mail Dev", icon: Bug },
  { href: "security", label: "Security", icon: Shield },
]

export function AdminSidebar({ adminPath }: { adminPath: string }) {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)
  const adminIdx = segments.findIndex((s) => s === adminPath)
  const base = `/${segments.slice(0, adminIdx + 1).join("/")}`
  const currentSection = segments[adminIdx + 1] || ""

  const isActive = (href: string) => {
    if (!href) return currentSection === ""
    return currentSection.startsWith(href)
  }

  return (
    <aside className="w-56 shrink-0 border-r border-[var(--border)] bg-[var(--bg-elevated)] min-h-screen flex flex-col">
      <div className="p-4 border-b border-[var(--border)]">
        <Link href={base} className="text-sm font-bold text-[var(--accent)] font-mono tracking-wider">
          Admin Panel
        </Link>
      </div>
      <nav className="flex-1 p-2 space-y-0.5">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={`${base}/${item.href}`}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
              isActive(item.href)
                ? "bg-cyan/10 text-cyan font-medium"
                : "text-[var(--text-secondary)] hover:bg-slate-800/50 hover:text-fog"
            }`}
          >
            <item.icon size={16} />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-3 space-y-1 border-t border-[var(--border)]">
        <Link href="/" target="_blank" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-fog hover:bg-slate-800/50 transition-all w-full">
          <ExternalLink size={16} />
          View Site
        </Link>
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--danger)] hover:bg-slate-800/50 transition-all w-full"
          >
            <LogOut size={16} />
            Logout
          </button>
        </form>
      </div>
    </aside>
  )
}
