"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils/cn"
import {
  LayoutDashboard,
  FileText,
  FolderGit2,
  Timeline,
  Tags,
  Wrench,
  Mail,
  Inbox,
  Camera,
  Settings,
  Shield,
  UploadCloud,
  Bug,
  LogOut,
  ExternalLink,
  GraduationCap,
  FlaskConical,
  ChevronRight,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react"

interface AdminNavItem {
  href: string
  label: string
  icon: LucideIcon
  devOnly?: boolean
}

interface AdminNavGroup {
  label: string
  items: AdminNavItem[]
}

const adminNavGroups: AdminNavGroup[] = [
  {
    label: "Dashboard",
    items: [{ href: "", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Content",
    items: [
      { href: "publications", label: "Publications", icon: FileText },
      { href: "projects", label: "Projects", icon: FolderGit2 },
      { href: "researching-assistance", label: "Research Experience", icon: FlaskConical },
      { href: "teaching-assistance", label: "Teaching Experience", icon: GraduationCap },
      { href: "timeline", label: "Timeline", icon: Timeline },
      { href: "tags", label: "Tags", icon: Tags },
      { href: "skills", label: "Skills", icon: Wrench },
      { href: "contact", label: "Contact Page", icon: Mail },
    ],
  },
  {
    label: "Inbox",
    items: [{ href: "messages", label: "Messages", icon: Inbox }],
  },
  {
    label: "Media",
    items: [{ href: "photo", label: "Profile Photo", icon: Camera }],
  },
  {
    label: "System",
    items: [
      { href: "settings", label: "Settings", icon: Settings },
      { href: "static-publish", label: "Static Publish", icon: UploadCloud, devOnly: true },
      { href: "security", label: "Security", icon: Shield },
      { href: "mail-dev", label: "Mail Dev", icon: Bug, devOnly: true },
    ],
  },
]

function NavGroup({
  label,
  items,
  base,
  currentSection,
}: {
  label: string
  items: AdminNavItem[]
  base: string
  currentSection: string
}) {
  const [isOpen, setIsOpen] = useState(true)

  const isActive = (href: string) => {
    if (!href) return currentSection === ""
    return currentSection.startsWith(href)
  }

  const isGroupActive = items.some((item) => isActive(item.href))

  // Hide dev tools in production builds
  const visibleItems = items.filter(
    (item) => !(item.devOnly && process.env.NODE_ENV === "production")
  )

  return (
    <div className="border-b border-[var(--border)]/50">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2.5 text-xs font-mono uppercase tracking-wider transition-colors",
          isGroupActive
            ? "text-[var(--accent)]"
            : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
        )}
        aria-expanded={isOpen}
      >
        <span>{label}</span>
        <ChevronRight
          size={12}
          className={cn("transition-transform duration-200", isOpen && "rotate-90")}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <nav className="px-2 py-1 space-y-0.5" aria-label={label}>
          {visibleItems.map((item) => (
            <Link
              key={item.href}
              href={item.href === "" ? base : `${base}/${item.href}`}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all",
                isActive(item.href)
                  ? "bg-cyan/10 text-cyan font-medium"
                  : "text-[var(--text-secondary)] hover:bg-slate-800/50 hover:text-fog"
              )}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              <item.icon size={14} aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  )
}

export function AdminSidebar({ adminPath }: { adminPath: string }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const segments = pathname.split("/").filter(Boolean)
  const adminIdx = segments.findIndex((s) => s === adminPath)
  const base = `/${segments.slice(0, adminIdx + 1).join("/")}`
  const currentSection = segments[adminIdx + 1] || ""

  // Close the mobile drawer when navigating
  useEffect(() => {
    const timer = window.setTimeout(() => setMobileOpen(false), 0)
    return () => window.clearTimeout(timer)
  }, [pathname])

  return (
    <>
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 lg:static lg:top-auto lg:bottom-auto w-64 shrink-0 border-r border-[var(--border)] bg-[var(--bg-elevated)] min-h-screen lg:min-h-0 flex flex-col z-40 transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <Link href={base} className="text-sm font-bold text-[var(--accent)] font-mono tracking-wider">
            Admin Panel
          </Link>
          <button
            className="lg:hidden text-[var(--text-secondary)] p-2 hover:bg-slate-800/50 rounded-lg"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto" aria-label="Admin navigation">
          {adminNavGroups.map((group) => (
            <NavGroup
              key={group.label}
              label={group.label}
              items={group.items}
              base={base}
              currentSection={currentSection}
            />
          ))}
        </nav>
        <div className="p-3 space-y-1 border-t border-[var(--border)]">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-fog hover:bg-slate-800/50 transition-all w-full"
          >
            <ExternalLink size={16} aria-hidden="true" />
            View Site
          </Link>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--danger)] hover:bg-slate-800/50 transition-all w-full"
            >
              <LogOut size={16} aria-hidden="true" />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed bottom-6 right-6 z-50 p-3 rounded-full bg-[var(--accent)] text-void shadow-lg shadow-cyan/20 hover:shadow-xl transition-shadow"
        onClick={() => setMobileOpen(true)}
        aria-label="Open admin menu"
        aria-expanded={mobileOpen}
        aria-controls="admin-sidebar"
      >
        <Menu size={24} aria-hidden="true" />
      </button>
    </>
  )
}
