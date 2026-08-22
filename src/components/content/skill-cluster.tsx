"use client"

import { MouseGlow } from "@/components/ui/mouse-glow"
import type { PublicSkillCategory } from "@/lib/public-data"
import { memo } from "react"
import { cn } from "@/lib/utils/cn"

interface SkillClusterProps {
  categories: PublicSkillCategory[]
}

const proficiencyColors: Record<string, { badge: string; glow: string; ring: string }> = {
  expert: { badge: "default", glow: "bg-cyan/10", ring: "ring-cyan/30" },
  advanced: { badge: "secondary", glow: "bg-indigo/10", ring: "ring-indigo/30" },
  proficient: { badge: "outline", glow: "bg-emerald/10", ring: "ring-emerald/30" },
  beginner: { badge: "ghost", glow: "bg-amber/10", ring: "ring-amber/30" },
}

export const SkillCluster = memo(function SkillCluster({ categories }: SkillClusterProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div
          key={category.id}
          className="group relative"
        >
          <div className="relative">
            <MouseGlow glowColor="cyan" intensity={0.05}>
              <div className="p-6 rounded-2xl border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm group-hover:border-cyan/30 transition-all duration-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-cyan group-hover:text-cyan-deep transition-colors">
                    {category.name}
                  </h3>
                  <span className="text-[10px] font-mono text-ash bg-slate-800/50 px-2 py-0.5 rounded-full">
                    {category.skills.length} skills
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => {
                    const prof = proficiencyColors[skill.proficiency ?? "beginner"]!
                    return (
                      <button
                        key={skill.id}
                        className={cn(
                          "relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300",
                          `group-hover:ring-2 ${prof.ring}`,
                          prof.badge === "default" && "bg-cyan/10 text-cyan border border-cyan/20 hover:bg-cyan/20 hover:border-cyan/30",
                          prof.badge === "secondary" && "bg-indigo/10 text-indigo border border-indigo/20 hover:bg-indigo/20 hover:border-indigo/30",
                          prof.badge === "outline" && "bg-emerald/10 text-emerald border border-emerald/20 hover:bg-emerald/20 hover:border-emerald/30",
                          prof.badge === "ghost" && "bg-amber/10 text-amber border border-amber/20 hover:bg-amber/20 hover:border-amber/30",
                          "group-hover:shadow-lg group-hover:shadow-cyan/10 group-hover:scale-105"
                        )}
                        style={{ animationDelay: `${skillIndex * 30}ms` }}
                      >
                        <span className={cn("inline-block transition-transform duration-300 group-hover:translate-x-1", prof.glow)}>
                          {skill.name}
                        </span>
                        <span className="inline-block w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: "currentColor" }} />
                      </button>
                    )
                  })}
                </div>
              </div>
            </MouseGlow>
          </div>
        </div>
      ))}
    </div>
  )
})
