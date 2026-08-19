import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FolderGit2, ExternalLink, Code2, ArrowUpRight } from "lucide-react"
import type { Project, ProjectTag, Tag } from "@prisma/client"
import { memo } from "react"
import { MouseGlow } from "@/components/ui/mouse-glow"

interface ProjectCardProps {
  project: Project & { tags: (ProjectTag & { tag: Tag })[] }
}

const roleColors: Record<string, "default" | "secondary" | "outline" | "success" | "warning"> = {
  "Solo": "default",
  "Lead": "secondary",
  "Lead Developer": "secondary",
  "Research Lead": "secondary",
  "Research Assistant": "outline",
}

const MAX_VISIBLE_TECH = 6

export const ProjectCard = memo(function ProjectCard({ project }: ProjectCardProps) {
  const techStack = project.techStack as string[] | null
  const visibleTech = techStack?.slice(0, MAX_VISIBLE_TECH) ?? null
  const hiddenTechCount = techStack ? techStack.length - MAX_VISIBLE_TECH : 0

  return (
    <Link href={`/projects/${project.slug}`} className="block group">
      <MouseGlow glowColor="indigo" intensity={0.06}>
        <Card glow glowColor="indigo" className="h-full">
          <CardContent className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan/10 to-indigo/10 border border-cyan/10 group-hover:border-indigo/30 group-hover:from-cyan/20 group-hover:to-indigo/20 transition-all duration-500">
                <FolderGit2 size={15} className="text-cyan group-hover:text-indigo transition-colors duration-500" />
              </div>
              <span className="font-mono text-xs text-ash">{project.year}</span>
              {project.role && (
                <Badge variant={roleColors[project.role] || "outline"} size="sm" className="group-hover:border-current/30 transition-colors">
                  {project.role}
                </Badge>
              )}
            </div>

            <h3 className="text-lg font-semibold leading-snug mb-2 line-clamp-2 group-hover:text-indigo transition-colors duration-300">
              {project.title}
            </h3>

            <p className="text-sm text-mist mb-4 flex-1 leading-relaxed line-clamp-3">
              {project.summary}
            </p>

            {visibleTech && visibleTech.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {visibleTech.map((tech) => (
                  <Badge key={tech} variant="ghost" size="sm" className="group-hover:border-indigo/30 group-hover:bg-indigo/5 transition-colors">
                    {tech}
                  </Badge>
                ))}
                {hiddenTechCount > 0 && (
                  <Badge variant="ghost" size="sm" className="text-ash">+{hiddenTechCount}</Badge>
                )}
              </div>
            )}

            <div className="flex items-center gap-3 pt-4 border-t border-slate-700/50 mt-auto">
              {project.repoUrl && (
                <span className="flex items-center gap-1 text-xs text-mist group-hover:text-indigo transition-colors">
                  <Code2 size={12} /> Repo
                </span>
              )}
              {project.demoUrl && (
                <span className="flex items-center gap-1 text-xs text-mist group-hover:text-indigo transition-colors">
                  <ExternalLink size={12} /> Demo
                </span>
              )}
              <span className="ml-auto text-xs text-ash group-hover:text-indigo transition-colors flex items-center gap-0.5">
                Case Study <ArrowUpRight size={10} />
              </span>
            </div>
          </CardContent>
        </Card>
      </MouseGlow>
    </Link>
  )
})
