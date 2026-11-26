import Link from "next/link"
import { ArrowUpRight, FileText, FlaskConical } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button-variants"
import type { PublicResearchProposal } from "@/lib/public-data"
import { proposalKindLabels, proposalStageLabels } from "@/lib/validation/research-portfolio"
import { cn } from "@/lib/utils/cn"

export function ResearchProposalCard({ proposal }: { proposal: PublicResearchProposal }) {
  return (
    <Card glow glowColor="indigo" className="h-full">
      <CardContent className="flex h-full flex-col p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" size="sm">
            <FlaskConical size={11} aria-hidden="true" className="mr-1.5" />
            {proposalKindLabels[proposal.kind]}
          </Badge>
          <Badge variant={proposal.stage === "active" ? "success" : "outline"} size="sm">
            {proposalStageLabels[proposal.stage]}
          </Badge>
          <span className="font-mono text-[11px] text-ash">
            {proposal.year} · {proposal.versionLabel}
          </span>
        </div>

        <h3 className="mb-3 text-xl font-semibold leading-snug text-fog">{proposal.title}</h3>
        <p className="mb-5 flex-1 text-sm leading-relaxed text-mist">{proposal.summary}</p>

        <div className="mb-5 flex flex-wrap gap-1.5">
          {proposal.themes.map((theme) => (
            <Badge key={theme} variant="ghost" size="sm">{theme}</Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 border-t border-slate-700/50 pt-4">
          <Link
            href={`/research/proposals/${proposal.slug}`}
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "gap-1.5")}
            aria-label={`View proposal details: ${proposal.title}`}
          >
            View details <ArrowUpRight size={12} aria-hidden="true" />
          </Link>
          {proposal.pdfUrl && (
            <Link
              href={proposal.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
              aria-label={`Public English PDF: ${proposal.title}`}
            >
              <FileText size={12} aria-hidden="true" /> Public English PDF
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
