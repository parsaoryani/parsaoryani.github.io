import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/container"
import { ProjectBrowser } from "@/components/content/project-browser"
import { Badge } from "@/components/ui/badge"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { getAllProjects, getAllTags } from "@/lib/public-data"
import { safeQuery, QueryErrorFallback } from "@/lib/public-data/query-result"
import { getAvailableProjectTags } from "@/lib/projects/available-project-tags"
import type { Metadata } from "next"
import { Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected earlier systems-security projects in blockchain, cryptography, and decentralized infrastructure.",
}

export default async function ProjectsPage() {
  const [projectsResult, tagsResult] = await Promise.all([
    safeQuery(getAllProjects(), "projects"),
    safeQuery(getAllTags(), "tags"),
  ])
  const projects = projectsResult.data ?? []
  const tags = tagsResult.data ?? []
  const availableTags = getAvailableProjectTags(projects, tags)

  return (
    <Section className="pt-32">
      <Container>
        <ScrollReveal>
          <div className="max-w-3xl mb-8">
            <Badge variant="secondary" size="lg" className="mb-4">
              <Sparkles size={12} className="mr-1.5" /> Previous systems work
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              <span className="text-gradient">Projects</span>
            </h1>
            <p className="text-lg text-mist leading-relaxed">
              These case studies document earlier work in blockchain, cryptography, and decentralized infrastructure. My current research focus is Agent Security; the projects below show the systems-building and adversarial reasoning that form part of that foundation.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ash">
              Claims are scoped to the linked prototype repositories. Known limitations and planned work are stated in each case study.
            </p>
          </div>
        </ScrollReveal>

        {(projectsResult.error || tagsResult.error) && (
          <QueryErrorFallback error="Some content could not be loaded. The page may be incomplete." className="mb-8" />
        )}

        {!projectsResult.error && <ProjectBrowser projects={projects} tags={availableTags} />}
      </Container>
    </Section>
  )
}
