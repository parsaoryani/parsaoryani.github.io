"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils/cn"
import { Button } from "@/components/ui/button"
import { Menu, X, ArrowUpRight, Sun, Moon } from "lucide-react"

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <span className="h-9 w-9" aria-hidden />

  const isDark = resolvedTheme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-9 w-9 items-center justify-center rounded-full text-mist transition-colors hover:bg-slate-800/50 hover:text-fog"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  )
}

const baseNavLinks = [
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

const researchLink = { href: "/research", label: "Research" }

export function Nav({ showResearch }: { showResearch: boolean }) {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [pastHero, setPastHero] = useState(!isHome)

  const navLinks = showResearch ? [researchLink, ...baseNavLinks] : baseNavLinks

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/")
  }

  const handleMobileLinkClick = () => {
    setMobileOpen(false)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!isHome) {
      setPastHero(true)
      return
    }
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.55)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [isHome])

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
          className={cn(
            "group relative font-mono text-lg font-semibold tracking-tight transition-opacity duration-300",
            pastHero ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <span className="bg-gradient-to-r from-cyan to-indigo bg-clip-text text-transparent">
            Parsa Oryani
          </span>
          <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-gradient-to-r from-cyan to-indigo transition-all duration-300 group-hover:w-full" />
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300",
                isActive(link.href)
                  ? "text-cyan bg-cyan/5"
                  : "text-mist hover:text-fog hover:bg-slate-800/50"
              )}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {isActive(link.href) && (
                <span className="absolute inset-0 rounded-full border border-cyan/20 shadow-[0_0_15px_-5px_rgba(56,225,196,0.3)]" />
              )}
              <span className="relative z-10">{link.label}</span>
            </Link>
          ))}

          <div className="ml-3 pl-3 border-l border-slate-700 flex items-center gap-2">
            <ThemeToggle />
            <Link href="/cv" aria-label="View CV">
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

        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <button
            className="text-fog p-2 hover:bg-slate-800 rounded-lg transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          id="mobile-menu"
          className="md:hidden glass border-t border-slate-700/50 animate-in slide-in-from-top-2"
          role="navigation"
          aria-label="Mobile menu"
        >
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleMobileLinkClick}
                className={cn(
                  "px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  isActive(link.href)
                    ? "text-cyan bg-cyan/5 border border-cyan/20"
                    : "text-mist hover:text-fog hover:bg-slate-800/50"
                )}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}

            <Link href="/cv" onClick={handleMobileLinkClick} className="mt-2">
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
