import { Badge } from "@/components/ui/badge"
import type { SkillCategory, Skill } from "@prisma/client"
import { memo } from "react"

interface SkillClusterProps {
  categories: (SkillCategory & { skills: Skill[] })[]
}

export const SkillCluster = memo(function SkillCluster({ categories }: SkillClusterProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {categories.map((category) => (
        <div
          key={category.id}
          className="p-6 rounded-xl border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm"
        >
          <h3 className="text-xs font-mono uppercase tracking-widest text-cyan mb-4">
            {category.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {category.skills.map((skill) => (
              <Badge
                key={skill.id}
                variant={skill.proficiency === "expert" ? "default" : "secondary"}
                className="text-xs px-3 py-1"
              >
                {skill.name}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
})
