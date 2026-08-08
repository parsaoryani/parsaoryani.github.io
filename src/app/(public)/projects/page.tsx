import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/container"
import { ProjectCard } from "@/components/content/project-card"
import { TagFilter } from "@/components/content/tag-filter"
import { Badge } from "@/components/ui/badge"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { getAllProjects, getAllTags } from "@/lib/db/queries"
import type { Metadata } from "next"
import { FolderGit2, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "Projects",
  description: "Engineering case studies in blockchain, deep learning, and AI security.",
}

interface Props {
  searchParams: Promise<{ tag?: string }>
}

export default async function ProjectsPage({ searchParams }: Props) {
  const { tag } = await searchParams
  const [projects, tags] = await Promise.all([
    getAllProjects().catch(() => []),
    getAllTags().catch(() => []),
  ])

  const filteredProjects = tag
    ? projects.filter((p) => p.tags.some((pt) => pt.tag.slug === tag))
    : projects

  return (
    <Section className="pt-32">
      <Container>
        <ScrollReveal>
          <div className="max-w-3xl mb-12">
            <Badge variant="secondary" className="mb-5 text-xs px-3 py-1">
              <Sparkles size={12} className="mr-1.5" /> Case Studies
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient">Projects</span>
            </h1>
            <p className="text-lg text-mist leading-relaxed">
              Engineering case studies that demonstrate system design, technical
              decision-making, and end-to-end execution.
            </p>
          </div>
        </ScrollReveal>

        {tags.length > 0 && <TagFilter tags={tags} activeTag={tag} />}

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
              No projects found{tag ? ` for tag "${tag}"` : ""}.
            </p>
          </div>
        )}
      </Container>
    </Section>
  )
}
