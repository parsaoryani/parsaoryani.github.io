import { BookOpen } from "lucide-react"
import { PublicationCard } from "./publication-card"
import { ResearchAgendaCard } from "./research-agenda-card"
import { ResearchProposalCard } from "./research-proposal-card"
import type { PublicPublication, PublicResearchAgenda, PublicResearchProposal } from "@/lib/public-data"

export function ResearchPortfolioSections({
  agenda,
  proposals,
  publications,
}: {
  agenda: PublicResearchAgenda
  proposals: PublicResearchProposal[]
  publications: PublicPublication[]
}) {
  const grouped = publications.reduce<Record<number, PublicPublication[]>>((acc, publication) => {
    ;(acc[publication.year] ??= []).push(publication)
    return acc
  }, {})
  const years = Object.keys(grouped).map(Number).sort((a, b) => b - a)

  return (
    <div className="space-y-20">
      <section aria-labelledby="research-agenda-heading">
        <div className="mb-7 flex items-center gap-3">
          <h2 id="research-agenda-heading" className="text-2xl font-semibold text-gradient">Research Agenda</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-cyan/20 to-transparent" />
        </div>
        <ResearchAgendaCard agenda={agenda} />
      </section>

      {proposals.length > 0 && (
        <section aria-labelledby="selected-proposals-heading">
          <div className="mb-3 flex items-center gap-3">
            <h2 id="selected-proposals-heading" className="text-2xl font-semibold text-gradient">Selected Proposals</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-indigo/20 to-transparent" />
          </div>
          <p className="mb-8 max-w-3xl text-sm leading-relaxed text-mist">
            Public summaries of research plans and concept notes. These are works in progress, not peer-reviewed publications.
          </p>
          <div className="grid gap-5 md:grid-cols-2">
            {proposals.map((proposal) => <ResearchProposalCard key={proposal.id} proposal={proposal} />)}
          </div>
        </section>
      )}

      <section aria-labelledby="publications-heading">
        <div className="mb-3 flex items-center gap-3">
          <h2 id="publications-heading" className="text-2xl font-semibold text-gradient">Publications</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-slate-700/50 to-transparent" />
        </div>
        <p className="mb-8 max-w-3xl text-sm leading-relaxed text-mist">
          Peer-reviewed papers, preprints, theses, talks, and other scholarly outputs.
        </p>

        {years.map((year) => (
          <div key={year} className="mb-12 last:mb-0">
            <div className="mb-6 flex items-center gap-3">
              <span className="font-mono text-sm text-ash">Year</span>
              <h3 className="font-mono text-xl font-bold text-gradient-accent">{year}</h3>
              <span className="font-mono text-xs text-ash">{grouped[year]!.length} outputs</span>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {grouped[year]!.map((publication) => (
                <PublicationCard key={publication.id} publication={publication} showAbstract />
              ))}
            </div>
          </div>
        ))}

        {publications.length === 0 && (
          <div className="rounded-xl border border-slate-700/50 bg-slate-900/30 px-6 py-12 text-center">
            <BookOpen size={34} className="mx-auto mb-4 text-slate-700" aria-hidden="true" />
            <p className="font-mono text-sm text-mist">No peer-reviewed publications listed yet.</p>
            <p className="mt-2 text-sm text-ash">Research plans and ongoing work are presented separately above.</p>
          </div>
        )}
      </section>
    </div>
  )
}
