import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink, FileText, FlaskConical } from "lucide-react"
import { Container, Section } from "@/components/layout/container"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { getAllResearchProposals, getResearchProposalBySlug } from "@/lib/public-data"
import { safeQuery } from "@/lib/public-data/query-result"
import { canonicalPath } from "@/lib/site/metadata"
import { proposalKindLabels, proposalStageLabels } from "@/lib/validation/research-portfolio"
import { cn } from "@/lib/utils/cn"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const proposals = await getAllResearchProposals()
  return proposals.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const proposal = await getResearchProposalBySlug(slug)
  if (!proposal) return { title: "Proposal not found" }
  return {
    title: proposal.title,
    description: proposal.summary,
    alternates: canonicalPath(`/research/proposals/${proposal.slug}`),
  }
}

const sections = [
  ["Motivation", "motivation"],
  ["Research question", "researchQuestion"],
  ["Approach", "approach"],
  ["Expected contributions", "expectedContributions"],
  ["Limitations and open questions", "limitations"],
] as const

export default async function ResearchProposalPage({ params }: Props) {
  const { slug } = await params
  const result = await safeQuery(getResearchProposalBySlug(slug), "research proposal")
  const proposal = result.data
  if (!proposal) notFound()

  return (
    <Section className="pt-32">
      <Container>
        <Link href="/research" className="mb-10 inline-flex items-center gap-1.5 font-mono text-sm text-mist transition-colors hover:text-cyan">
          <ArrowLeft size={14} aria-hidden="true" /> Back to Research
        </Link>

        <article className="max-w-4xl">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              <FlaskConical size={12} aria-hidden="true" className="mr-1.5" />
              {proposalKindLabels[proposal.kind]}
            </Badge>
            <Badge variant={proposal.stage === "active" ? "success" : "outline"}>
              {proposalStageLabels[proposal.stage]}
            </Badge>
            <span className="font-mono text-xs text-ash">{proposal.year} · {proposal.versionLabel}</span>
          </div>

          <h1 className="mb-5 text-3xl font-bold leading-tight text-gradient md:text-5xl">{proposal.title}</h1>
          <p className="mb-6 text-lg leading-relaxed text-mist">{proposal.summary}</p>

          <div className="mb-10 rounded-xl border border-amber/20 bg-amber/[0.04] p-5 text-sm leading-relaxed text-mist">
            This document is a public research plan and work in progress. It is not a peer-reviewed publication.
          </div>

          <div className="mb-10 flex flex-wrap gap-2">
            {proposal.themes.map((theme) => <Badge key={theme} variant="outline">{theme}</Badge>)}
          </div>

          {proposal.pdfUrl && (
            <Link
              href={proposal.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "default" }), "mb-12 gap-2")}
            >
              <FileText size={15} aria-hidden="true" /> Sanitized public PDF
              <ExternalLink size={13} aria-hidden="true" />
            </Link>
          )}

          <div className="space-y-10">
            {sections.map(([label, field]) => proposal[field] && (
              <section key={field}>
                <h2 className="mb-3 text-xl font-semibold text-gradient">{label}</h2>
                <p className="whitespace-pre-line leading-relaxed text-mist">{proposal[field]}</p>
              </section>
            ))}
          </div>
        </article>
      </Container>
    </Section>
  )
}
