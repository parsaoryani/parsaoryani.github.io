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
  description: "Systems and security projects in blockchain, cryptography, and decentralized applications — the systems-security foundation behind my work on agent security.",
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
              <Sparkles size={12} className="mr-1.5" /> Case Studies
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              <span className="text-gradient">Projects</span>
            </h1>
            <p className="text-lg text-mist leading-relaxed">
              Systems and security projects related to blockchain, cryptography, and decentralized applications — the implementation experience behind my current work on agent security.
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
