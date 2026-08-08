import { prisma } from "@/lib/db/prisma"
import { safeQuery, QueryErrorFallback } from "@/lib/db/query-result"
import { Container, Section } from "@/components/layout/container"
import { Badge } from "@/components/ui/badge"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { FlaskConical, Calendar, User, Building2, Sparkles, ChevronRight, Beaker } from "lucide-react"
import type { Metadata } from "next"

export const revalidate = 3600

export const metadata: Metadata = { title: "Research Assistantships", description: "Research experience and research assistantships." }

export default async function ResearchAssistantshipsPage() {
  const result = await safeQuery(
    prisma.researchingAssistant.findMany({
      where: { status: "published" },
      orderBy: [{ startDate: "desc" }, { sortOrder: "asc" }],
    }),
    "research experience",
  )
  const items = result.data ?? []

  return (
    <Section className="pt-32">
      <Container>
        <div className="max-w-4xl">
          <ScrollReveal>
            <Badge variant="default" size="lg" className="mb-5"><FlaskConical size={12} className="mr-1.5" /> Research Experience</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4"><span className="text-gradient">Research Assistantships</span></h1>
            <p className="text-lg text-mist mb-12 max-w-2xl">Research projects and laboratories where I have contributed as a research assistant.</p>
          </ScrollReveal>

          {result.error && <QueryErrorFallback error={result.error} className="mb-8" />}

          <div className="space-y-6">
            {items.map((item, i) => (
              <ScrollReveal key={item.id} direction="up" delay={i * 80}>
                <div className="p-6 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-800/30 backdrop-blur-sm hover:border-cyan/20 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-500">
                  {/* Context: topic, lab, supervisor, dates */}
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo/10 to-cyan/10 border border-indigo/10 shrink-0 mt-1">
                      <Beaker size={22} className="text-indigo" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold mb-1">{item.topic}</h2>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-mist mb-3">
                        <span className="flex items-center gap-1"><Building2 size={13} /> {item.lab} — {item.university}</span>
                        <span className="flex items-center gap-1"><User size={13} /> Supervisor: {item.supervisor}</span>
                        <span className="flex items-center gap-1"><Calendar size={13} /> {new Date(item.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })} – {item.endDate ? new Date(item.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Present"}</span>
                      </div>

                      {/* Responsibility / description */}
                      {item.description && <p className="text-sm text-mist mb-3">{item.description}</p>}

                      {/* Outcomes (above methods) */}
                      {item.outcomes && (item.outcomes as string[]).length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-emerald uppercase tracking-wider mb-2">Outcomes</p>
                          <ul className="space-y-1">
                            {(item.outcomes as string[]).map((o, j) => (
                              <li key={j} className="flex items-start gap-2 text-sm text-mist"><ChevronRight size={14} className="text-emerald shrink-0 mt-0.5" />{o}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Methods / technologies (below outcomes) */}
                      {item.technologies && (
                        <div>
                          <p className="text-xs font-semibold text-ash uppercase tracking-wider mb-2">Methods &amp; Technologies</p>
                          <div className="flex flex-wrap gap-1.5">
                            {item.technologies.split(",").map((t) => (
                              <span key={t.trim()} className="text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-ash font-mono">{t.trim()}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
            {items.length === 0 && !result.error && (
              <div className="text-center py-16">
                <FlaskConical size={40} className="mx-auto text-slate-700 mb-4" />
                <p className="text-mist font-mono text-sm">Research experience will appear here. In the meantime, view my publications or Scholar profile.</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}