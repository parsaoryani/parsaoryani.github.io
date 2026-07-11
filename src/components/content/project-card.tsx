import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FolderGit2, ExternalLink, Code2, ArrowUpRight } from "lucide-react"
import type { Project, ProjectTag, Tag } from "@prisma/client"
import { cn } from "@/lib/utils/cn"
import { memo } from "react"

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

export const ProjectCard = memo(function ProjectCard({ project }: ProjectCardProps) {
  const techStack = project.techStack as string[] | null

  return (
    <Link href={`/projects/${project.slug}`} className="block group">
      <Card glow className="h-full">
        <CardContent className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan/10 to-indigo/10 border border-cyan/10 group-hover:border-cyan/30 transition-colors">
              <FolderGit2 size={15} className="text-cyan" />
            </div>
            <span className="font-mono text-xs text-ash">{project.year}</span>
            {project.role && (
              <Badge variant={roleColors[project.role] || "outline"} className="text-[10px] px-2 py-0.5">
                {project.role}
              </Badge>
            )}
          </div>

          <h3 className="text-base font-semibold leading-snug mb-2 group-hover:text-cyan transition-colors duration-300">
            {project.title}
          </h3>

          <p className="text-sm text-mist mb-4 flex-1 leading-relaxed">
            {project.summary}
          </p>

          {techStack && techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {techStack.map((tech) => (
                <Badge key={tech} variant="ghost" className="text-[10px] px-2 py-0.5">
                  {tech}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 pt-4 border-t border-slate-700/50 mt-auto">
            {project.repoUrl && (
              <span className="flex items-center gap-1 text-xs text-mist group-hover:text-cyan transition-colors">
                <Code2 size={12} /> Repo
              </span>
            )}
            {project.demoUrl && (
              <span className="flex items-center gap-1 text-xs text-mist group-hover:text-cyan transition-colors">
                <ExternalLink size={12} /> Demo
              </span>
            )}
            <span className="ml-auto text-xs text-ash group-hover:text-cyan transition-colors flex items-center gap-0.5">
              Case Study <ArrowUpRight size={10} />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
})
