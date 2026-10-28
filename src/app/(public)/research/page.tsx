import type { Metadata } from "next"
import { Sparkles } from "lucide-react"
import { Container, Section } from "@/components/layout/container"
import { ResearchPortfolioSections } from "@/components/content/research-portfolio-sections"
import { fallbackResearchAgenda } from "@/components/content/research-agenda-card"
import { Badge } from "@/components/ui/badge"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import {
  getAllPublications,
  getAllResearchProposals,
  getPublishedResearchAgenda,
} from "@/lib/public-data"
import { QueryErrorFallback, safeQuery } from "@/lib/public-data/query-result"
import { canonicalPath } from "@/lib/site/metadata"

export const metadata: Metadata = {
  title: "Research",
  description:
    "Research agenda, selected proposals, and scholarly outputs on secure and trustworthy agentic AI.",
  alternates: canonicalPath("/research"),
}

export default async function ResearchPage() {
  const [agendaResult, proposalsResult, publicationsResult] = await Promise.all([
    safeQuery(getPublishedResearchAgenda(), "research agenda"),
    safeQuery(getAllResearchProposals(), "research proposals"),
    safeQuery(getAllPublications(), "publications"),
  ])

  return (
    <Section className="pt-32">
      <Container>
        <ScrollReveal>
          <div className="mb-16 max-w-4xl">
            <Badge variant="default" size="lg" className="mb-5">
              <Sparkles size={12} aria-hidden="true" className="mr-1.5" /> Research Portfolio
            </Badge>
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              <span className="text-gradient">Research</span>
            </h1>
            <p className="text-lg leading-relaxed text-mist">
              I study the security of LLM-based agentic and multi-agent systems: how tool-using AI agents can be
              built, updated, and operated securely. My work connects provenance, authorization, secure memory,
              information-flow control, and runtime enforcement.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-mist">
              I am open to research collaboration, visiting-research opportunities, and PhD conversations in
              trustworthy AI systems, agent security, and adjacent areas.
            </p>
          </div>
        </ScrollReveal>

        <div className="mb-8 space-y-3">
          {agendaResult.error && <QueryErrorFallback error={agendaResult.error} />}
          {proposalsResult.error && <QueryErrorFallback error={proposalsResult.error} />}
          {publicationsResult.error && <QueryErrorFallback error={publicationsResult.error} />}
        </div>

        <ResearchPortfolioSections
          agenda={agendaResult.data ?? fallbackResearchAgenda}
          proposals={proposalsResult.data ?? []}
          publications={publicationsResult.data ?? []}
        />
      </Container>
    </Section>
  )
}
