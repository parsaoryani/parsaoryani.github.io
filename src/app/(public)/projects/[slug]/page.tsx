import { notFound } from "next/navigation"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/container"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getProjectBySlug, getAllProjects } from "@/lib/public-data"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Code2, FolderGit2 } from "lucide-react"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export async function generateStaticParams() {
  try {
    const projects = await getAllProjects()
    return projects.map((project) => ({ slug: project.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug).catch(() => null)
  if (!project) return {}
  return {
    title: project.title,
    description: project.summary,
  }
}

const roleColors: Record<string, "default" | "secondary" | "outline" | "success" | "warning"> = {
  "Solo": "default",
  "Lead": "secondary",
  "Lead Developer": "secondary",
  "Research Lead": "secondary",
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = await getProjectBySlug(slug).catch(() => null)
  if (!project) notFound()

  const techStack = project.techStack

  const sections = [
    { title: "Problem", content: project.problem, key: "problem" },
    { title: "Approach", content: project.approach, key: "approach" },
    { title: "Architecture", content: project.architecture, key: "architecture" },
    { title: "Challenges & Decisions", content: project.challenges, key: "challenges" },
    { title: "Results", content: project.results, key: "results" },
    { title: "Retrospective", content: project.retrospective, key: "retrospective" },
  ].filter((s) => s.content)

  return (
    <Section className="pt-32">
      <Container>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-mist hover:text-cyan transition-colors mb-10 font-mono group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Projects
        </Link>

        <article className="max-w-3xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan/10 to-indigo/10 border border-cyan/10">
              <FolderGit2 size={18} className="text-cyan" />
            </div>
            <span className="font-mono text-xs text-ash">{project.year}</span>
            {project.role && (
              <Badge variant={roleColors[project.role] || "outline"} className="text-[11px]">
                {project.role}
              </Badge>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-5 text-gradient">
            {project.title}
          </h1>

          <p className="text-lg text-mist mb-6 leading-relaxed">
            {project.summary}
          </p>

          {techStack && techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {techStack.map((tech) => (
                <Badge key={tech} variant="ghost" className="text-xs px-3 py-1">
                  {tech}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 mb-12">
            {project.repoUrl && (
              <Link href={project.repoUrl} target="_blank">
                <Button variant="secondary" size="sm" className="font-mono text-xs gap-1.5">
                  <Code2 size={14} /> Repository
                </Button>
              </Link>
            )}
            {project.demoUrl && (
              <Link href={project.demoUrl} target="_blank">
                <Button variant="default" size="sm" className="font-mono text-xs gap-1.5">
                  <ExternalLink size={14} /> Live Demo
                </Button>
              </Link>
            )}
          </div>

          <div className="space-y-10">
            {sections.map((section, i) => (
              <section key={section.key}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-cyan/10 text-cyan font-mono text-xs font-bold">
                    {i + 1}
                  </span>
                  <h2 className="text-xl font-semibold text-gradient">{section.title}</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-slate-700/50 to-transparent" />
                </div>
                <div className="pl-10">
                  <p className="text-mist leading-relaxed whitespace-pre-line">{section.content}</p>
                </div>
              </section>
            ))}
          </div>
        </article>
      </Container>
    </Section>
  )
}
