"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils/cn"
import { Button } from "@/components/ui/button"
import { Menu, X, ArrowUpRight, ChevronDown } from "lucide-react"

const mainNavLinks = [
  { href: "/research", label: "Research" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

// Experience dropdown is inserted after Research via JSX ordering below

const experienceLinks = [
  { href: "/research-assistance", label: "Research Experience" },
  { href: "/teaching", label: "Teaching Experience" },
  { href: "/about#timeline", label: "Education & Career" },
  { href: "/about#recognition", label: "Awards, Talks & Service" },
]

export function Nav() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [experienceOpen, setExperienceOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const experienceRef = useRef<HTMLDivElement>(null)
  const experienceTriggerRef = useRef<HTMLButtonElement>(null)

  const isActive = (href: string) => {
    if (!href) return false
    if (href.startsWith("#")) return false
    return pathname === href || pathname.startsWith(href + "/")
  }

  const isExperienceActive = () => {
    return experienceLinks.some((link) => isActive(link.href))
  }

  const closeAllMenus = useCallback(() => {
    setMobileOpen(false)
    setExperienceOpen(false)
  }, [])

  const handleExperienceTriggerClick = () => {
    setExperienceOpen((prev) => !prev)
  }

  const handleExperienceKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleExperienceTriggerClick()
    } else if (e.key === "Escape") {
      setExperienceOpen(false)
      experienceTriggerRef.current?.focus()
    }
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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        experienceRef.current &&
        !experienceRef.current.contains(event.target as Node) &&
        experienceTriggerRef.current &&
        !experienceTriggerRef.current.contains(event.target as Node)
      ) {
        setExperienceOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeAllMenus()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [closeAllMenus])

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

        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {/* Research */}
          <Link
            href="/research"
            className={cn(
              "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300",
              isActive("/research")
                ? "text-cyan bg-cyan/5"
                : "text-mist hover:text-fog hover:bg-slate-800/50"
            )}
            aria-current={isActive("/research") ? "page" : undefined}
          >
            {isActive("/research") && (
              <span className="absolute inset-0 rounded-full border border-cyan/20 shadow-[0_0_15px_-5px_rgba(56,225,196,0.3)]" />
            )}
            <span className="relative z-10">Research</span>
          </Link>

          {/* Experience dropdown */}
          <div ref={experienceRef} className="relative">

            <button
              ref={experienceTriggerRef}
              type="button"
              onClick={handleExperienceTriggerClick}
              onKeyDown={handleExperienceKeyDown}
              aria-expanded={experienceOpen}
              aria-haspopup="menu"
              aria-label="Experience menu"
              className={cn(
                "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 flex items-center gap-1.5",
                experienceOpen || isExperienceActive()
                  ? "text-cyan bg-cyan/5"
                  : "text-mist hover:text-fog hover:bg-slate-800/50"
              )}
            >
              {isExperienceActive() && (
                <span className="absolute inset-0 rounded-full border border-cyan/20 shadow-[0_0_15px_-5px_rgba(56,225,196,0.3)]" />
              )}
              <span className="relative z-10">Experience</span>
              <ChevronDown
                size={14}
                className={cn(
                  "transition-transform duration-200",
                  experienceOpen && "rotate-180"
                )}
                aria-hidden="true"
              />
            </button>

            {experienceOpen && (
              <div
                role="menu"
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 glass border border-slate-700/50 rounded-xl py-2 shadow-lg animate-in slide-in-from-top-2 duration-200"
              >
                {experienceLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    role="menuitem"
                    onClick={closeAllMenus}
                    className={cn(
                      "block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
                      isActive(link.href)
                        ? "text-cyan bg-cyan/5"
                        : "text-mist hover:text-fog hover:bg-slate-800/50"
                    )}
                    aria-current={isActive(link.href) ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Projects, About, Contact */}
          {mainNavLinks.filter(l => l.href !== "/research").map((link) => (
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

          <div className="ml-3 pl-3 border-l border-slate-700">
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

        <button
          className="md:hidden text-fog p-2 hover:bg-slate-800 rounded-lg transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div
          id="mobile-menu"
          className="md:hidden glass border-t border-slate-700/50 animate-in slide-in-from-top-2"
          role="navigation"
          aria-label="Mobile menu"
        >
          <nav className="flex flex-col p-4 gap-1">
            {/* Research */}
            <Link
              href="/research"
              onClick={handleMobileLinkClick}
              className={cn(
                "px-4 py-3 rounded-xl text-sm font-medium transition-all",
                isActive("/research")
                  ? "text-cyan bg-cyan/5 border border-cyan/20"
                  : "text-mist hover:text-fog hover:bg-slate-800/50"
              )}
              aria-current={isActive("/research") ? "page" : undefined}
            >
              Research
            </Link>

            {/* Experience (expanded by default) */}
            <button
              type="button"
              onClick={handleExperienceTriggerClick}
              onKeyDown={handleExperienceKeyDown}
              aria-expanded={experienceOpen}
              aria-haspopup="menu"
              className={cn(
                "w-full px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between",
                experienceOpen || isExperienceActive()
                  ? "text-cyan bg-cyan/5"
                  : "text-mist hover:text-fog hover:bg-slate-800/50"
              )}
            >
              Experience
              <ChevronDown
                size={14}
                className={cn(
                  "transition-transform duration-200",
                  experienceOpen && "rotate-180"
                )}
                aria-hidden="true"
              />
            </button>

            {experienceOpen && (
              <div role="menu" className="pl-4 space-y-1 animate-in slide-in-from-top-2">
                {experienceLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    role="menuitem"
                    onClick={handleMobileLinkClick}
                    className={cn(
                      "block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
                      isActive(link.href)
                        ? "text-cyan bg-cyan/5"
                        : "text-mist hover:text-fog hover:bg-slate-800/50"
                    )}
                    aria-current={isActive(link.href) ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            <div className="border-t border-slate-700/50 my-2" />

            {/* Projects, About, Contact */}
            {mainNavLinks.filter(l => l.href !== "/research").map((link) => (
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