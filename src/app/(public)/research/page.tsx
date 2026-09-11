import { PublicationCard } from "@/components/content/publication-card"
import { Container, Section } from "@/components/layout/container"
import { Badge } from "@/components/ui/badge"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { CURRENT_RESEARCH, PRIMARY_EMAIL, PRIMARY_RESEARCH_STATEMENT } from "@/content/research-profile"
import { getAllPublications } from "@/lib/public-data"
import { QueryErrorFallback, safeQuery } from "@/lib/public-data/query-result"
import { canonicalPath } from "@/lib/site/metadata"
import { ArrowUpRight, CheckCircle2, GitBranch, ShieldCheck, Sparkles } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Research",
  description: "Current work on lifecycle security, provenance, authorization, and runtime controls for tool-using AI agents.",
  alternates: canonicalPath("/research"),
}

export default async function ResearchPage() {
  const result = await safeQuery(getAllPublications(), "publications")
  const publications = result.data ?? []

  return (
    <Section className="pt-32">
      <Container>
        <ScrollReveal>
          <div className="mb-14 max-w-3xl">
            <Badge variant="default" size="lg" className="mb-5">
              <Sparkles size={12} className="mr-1.5" /> Current work
            </Badge>
            <h1 className="mb-6 text-4xl font-bold md:text-5xl"><span className="text-gradient">Research</span></h1>
            <p className="text-lg leading-relaxed text-mist">{PRIMARY_RESEARCH_STATEMENT}</p>
          </div>
        </ScrollReveal>

        {result.error && <QueryErrorFallback error={result.error} className="mb-8" />}

        <ScrollReveal direction="up">
          <article className="overflow-hidden rounded-2xl border border-cyan/20 bg-gradient-to-br from-slate-900/90 to-slate-800/30">
            <div className="border-b border-slate-700/50 p-6 md:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Badge variant="outline" className="border-amber/30 text-amber">{CURRENT_RESEARCH.status}</Badge>
                <span className="font-mono text-xs text-ash">M.Sc. thesis direction</span>
              </div>
              <h2 className="text-2xl font-semibold md:text-3xl">{CURRENT_RESEARCH.title}</h2>
              <p className="mt-3 max-w-3xl leading-relaxed text-mist">{CURRENT_RESEARCH.summary}</p>
              <p className="mt-4 font-mono text-xs text-ash">Advisor: {CURRENT_RESEARCH.advisor}</p>
            </div>

            <div className="grid gap-8 p-6 md:grid-cols-2 md:p-8">
              <section>
                <h3 className="mb-4 flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-cyan">
                  <GitBranch size={16} /> Research questions
                </h3>
                <ul className="space-y-3">
                  {CURRENT_RESEARCH.questions.map((question) => (
                    <li key={question} className="flex gap-3 text-sm leading-relaxed text-mist">
                      <CheckCircle2 size={15} className="mt-1 shrink-0 text-cyan" aria-hidden="true" /> {question}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-6">
                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-indigo">
                    <ShieldCheck size={16} /> Working threat model
                  </h3>
                  <p className="text-sm leading-relaxed text-mist">{CURRENT_RESEARCH.threatModel}</p>
                </div>
                <div>
                  <h3 className="mb-3 font-mono text-sm uppercase tracking-wider text-emerald">Current method</h3>
                  <p className="text-sm leading-relaxed text-mist">{CURRENT_RESEARCH.method}</p>
                </div>
              </section>
            </div>

            <div className="border-t border-slate-700/50 bg-slate-800/40 p-6 md:px-8">
              <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-mist">Scope and limitations</h3>
              <ul className="space-y-2 text-sm text-mist">
                {CURRENT_RESEARCH.limitations.map((limitation) => <li key={limitation}>— {limitation}</li>)}
              </ul>
            </div>
          </article>
        </ScrollReveal>

        {publications.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-7 text-2xl font-semibold">Publications</h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {publications.map((publication) => <PublicationCard key={publication.id} publication={publication} showAbstract />)}
            </div>
          </section>
        )}

        <ScrollReveal direction="up">
          <div className="mt-14 rounded-2xl border border-slate-700/50 p-6 md:flex md:items-center md:justify-between md:gap-8">
            <div>
              <h2 className="text-lg font-semibold">Discuss this research</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mist">
                I welcome thesis-related discussion, research collaboration, and feedback on security models for tool-using agents.
              </p>
            </div>
            <Link href={`mailto:${PRIMARY_EMAIL}`} className="mt-5 inline-flex shrink-0 items-center gap-2 font-mono text-sm text-cyan hover:text-cyan-deep md:mt-0">
              Email me <ArrowUpRight size={14} />
            </Link>
          </div>
        </ScrollReveal>
      </Container>
    </Section>
  )
}
