"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils/cn"
import { Button } from "@/components/ui/button"
import { Menu, X, ArrowUpRight } from "lucide-react"

const navLinks = [
  { href: "/research", label: "Publications" },
  { href: "/projects", label: "Projects" },
  { href: "/teaching", label: "TA" },
  { href: "/research-assistance", label: "RA" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "", label: "Admin" },
]

export function Nav({ adminPath }: { adminPath?: string }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const resolvedLinks = navLinks.map((link) =>
    link.label === "Admin" ? { ...link, href: `/${adminPath || "x7k2-console"}` } : link
  )
  const isActive = (href: string) => {
    if (!href) return false
    return pathname === href || pathname.startsWith(href + "/")
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "glass border-b border-slate-700/50 shadow-lg shadow-black/5"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="group relative font-mono text-lg font-semibold tracking-tight"
        >
          <span className="bg-gradient-to-r from-cyan to-indigo bg-clip-text text-transparent">
            Parsa Oryani
          </span>
          <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-gradient-to-r from-cyan to-indigo transition-all duration-300 group-hover:w-full" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {resolvedLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300",
                isActive(link.href)
                  ? "text-cyan bg-cyan/5"
                  : "text-mist hover:text-fog hover:bg-slate-800/50"
              )}
            >
              {isActive(link.href) && (
                <span className="absolute inset-0 rounded-full border border-cyan/20 shadow-[0_0_15px_-5px_rgba(56,225,196,0.3)]" />
              )}
              <span className="relative z-10">{link.label}</span>
            </Link>
          ))}
          <div className="ml-3 pl-3 border-l border-slate-700">
            <Link href="/cv">
              <Button
                variant="default"
                size="sm"
                className="font-mono text-xs tracking-wider uppercase bg-gradient-to-r from-cyan to-indigo hover:from-cyan-deep hover:to-indigo/90 text-void shadow-lg shadow-cyan/20 hover:shadow-cyan/30 transition-all duration-300"
              >
                CV <ArrowUpRight size={12} className="ml-1" />
              </Button>
            </Link>
          </div>
        </nav>

        <button
          className="md:hidden text-fog p-2 hover:bg-slate-800 rounded-lg transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

          {mobileOpen && (
        <div className="md:hidden glass border-t border-slate-700/50 animate-in">
          <nav className="flex flex-col p-4 gap-1">
            {resolvedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  isActive(link.href)
                    ? "text-cyan bg-cyan/5 border border-cyan/20"
                    : "text-mist hover:text-fog hover:bg-slate-800/50"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/cv" onClick={() => setMobileOpen(false)} className="mt-2">
              <Button
                variant="default"
                size="sm"
                className="w-full font-mono text-xs tracking-wider uppercase bg-gradient-to-r from-cyan to-indigo text-void"
              >
                CV <ArrowUpRight size={12} className="ml-1" />
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
