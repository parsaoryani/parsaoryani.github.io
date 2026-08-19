import Link from "next/link"
import { cn } from "@/lib/utils/cn"
import type { Tag } from "@prisma/client"

interface TagFilterProps {
  tags: Tag[]
  activeTag?: string
}

export function TagFilter({ tags, activeTag }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filter projects by tag">
      <Link
        href="/projects"
        aria-current={!activeTag ? "true" : undefined}
        className={cn(
          "px-4 py-2 min-h-[44px] rounded-full text-xs font-mono transition-all duration-300 inline-flex items-center",
          !activeTag
            ? "bg-cyan/10 text-cyan border border-cyan/20 shadow-[0_0_15px_-5px_rgba(56,225,196,0.2)]"
            : "bg-slate-800/50 text-mist border border-slate-700/50 hover:border-slate-600/50 hover:text-fog"
        )}
      >
        All
      </Link>
      {tags.map((tag) => (
        <Link
          key={tag.id}
          href={`/projects?tag=${tag.slug}`}
          aria-current={activeTag === tag.slug ? "true" : undefined}
          className={cn(
            "px-4 py-2 min-h-[44px] rounded-full text-xs font-mono transition-all duration-300 inline-flex items-center",
            activeTag === tag.slug
              ? "bg-cyan/10 text-cyan border border-cyan/20 shadow-[0_0_15px_-5px_rgba(56,225,196,0.2)]"
              : "bg-slate-800/50 text-mist border border-slate-700/50 hover:border-slate-600/50 hover:text-fog"
          )}
        >
          {tag.label}
        </Link>
      ))}
    </div>
  )
}