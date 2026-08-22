"use client"

import { useMemo, useState } from "react"
import { FolderGit2 } from "lucide-react"
import { ProjectCard } from "@/components/content/project-card"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { cn } from "@/lib/utils/cn"
import type { PublicProject, PublicTag } from "@/lib/public-data"

interface ProjectBrowserProps {
  projects: PublicProject[]
  tags: PublicTag[]
}

function initialTag() {
  if (typeof window === "undefined") return undefined
  return new URLSearchParams(window.location.search).get("tag") || undefined
}

export function ProjectBrowser({ projects, tags }: ProjectBrowserProps) {
  const [activeTag, setActiveTag] = useState<string | undefined>(initialTag)
  const tagLabels = useMemo(() => new Map(tags.map((tag) => [tag.slug, tag.label])), [tags])
  const knownTag = activeTag && tagLabels.has(activeTag) ? activeTag : undefined
  const filteredProjects = knownTag
    ? projects.filter((project) => project.tags.some((pt) => pt.tag.slug === knownTag))
    : projects

  function selectTag(tag?: string) {
    setActiveTag(tag)
    const url = new URL(window.location.href)
    if (tag) {
      url.searchParams.set("tag", tag)
    } else {
      url.searchParams.delete("tag")
    }
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`)
  }

  return (
    <>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filter projects by tag">
          <button
            type="button"
            aria-pressed={!knownTag}
            onClick={() => selectTag()}
            className={cn(
              "px-4 py-2 min-h-[44px] rounded-full text-xs font-mono transition-all duration-300 inline-flex items-center",
              !knownTag
                ? "bg-cyan/10 text-cyan border border-cyan/20 shadow-[0_0_15px_-5px_rgba(56,225,196,0.2)]"
                : "bg-slate-800/50 text-mist border border-slate-700/50 hover:border-slate-600/50 hover:text-fog"
            )}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              aria-pressed={knownTag === tag.slug}
              onClick={() => selectTag(tag.slug)}
              className={cn(
                "px-4 py-2 min-h-[44px] rounded-full text-xs font-mono transition-all duration-300 inline-flex items-center",
                knownTag === tag.slug
                  ? "bg-cyan/10 text-cyan border border-cyan/20 shadow-[0_0_15px_-5px_rgba(56,225,196,0.2)]"
                  : "bg-slate-800/50 text-mist border border-slate-700/50 hover:border-slate-600/50 hover:text-fog"
              )}
            >
              {tag.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-mist font-mono">
          {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}
          {knownTag && (
            <span>
              {" "}tagged &ldquo;{tagLabels.get(knownTag) || knownTag}&rdquo;
              <button type="button" onClick={() => selectTag()} className="ml-2 text-cyan hover:underline">
                Clear filter
              </button>
            </span>
          )}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project, i) => (
          <ScrollReveal key={project.id} direction="up" delay={i * 80} className="h-full">
            <ProjectCard project={project} />
          </ScrollReveal>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-20">
          <FolderGit2 size={40} className="mx-auto text-slate-700 mb-4" />
          <p className="text-mist font-mono text-sm">
            No projects found{knownTag ? ` for tag "${knownTag}"` : ""}.
          </p>
        </div>
      )}
    </>
  )
}
