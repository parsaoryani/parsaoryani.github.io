import Link from "next/link"
import { cn } from "@/lib/utils/cn"
import type { Tag } from "@prisma/client"

interface TagFilterProps {
  tags: Tag[]
  activeTag?: string
}

export function TagFilter({ tags, activeTag }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-10">
      <Link
        href="/projects"
        className={cn(
          "px-4 py-1.5 rounded-full text-xs font-mono transition-all duration-300",
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
          className={cn(
            "px-4 py-1.5 rounded-full text-xs font-mono transition-all duration-300",
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
