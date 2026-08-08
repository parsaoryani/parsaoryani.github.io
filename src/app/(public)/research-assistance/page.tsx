import { prisma } from "@/lib/db/prisma"
import { Container, Section } from "@/components/layout/container"
import { Badge } from "@/components/ui/badge"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { FlaskConical, Calendar, User, Building2, Sparkles, ChevronRight, Beaker } from "lucide-react"
import type { Metadata } from "next"

export const revalidate = 3600

export const metadata: Metadata = { title: "Research Assistantships", description: "Research experience and research assistantships." }

export default async function ResearchAssistantshipsPage() {
  const items = await prisma.researchingAssistant.findMany({
    where: { status: "published" },
    orderBy: [{ startDate: "desc" }, { sortOrder: "asc" }],
  })

  return (
    <Section className="pt-32">
      <Container>
        <div className="max-w-4xl">
          <ScrollReveal>
            <Badge variant="default" className="mb-5 text-xs px-3 py-1"><FlaskConical size={12} className="mr-1.5" /> Research Experience</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4"><span className="text-gradient">Research Assistantships</span></h1>
            <p className="text-lg text-mist mb-12 max-w-2xl">Research projects and laboratories where I have contributed as a research assistant.</p>
          </ScrollReveal>

          <div className="space-y-6">
            {items.map((item, i) => (
              <ScrollReveal key={item.id} direction="up" delay={i * 80}>
                <div className="p-6 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-800/30 backdrop-blur-sm hover:border-cyan/20 transition-all">
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
                    {item.description && <p className="text-sm text-mist mb-3">{item.description}</p>}
                    {item.technologies && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {item.technologies.split(",").map((t) => (
                          <span key={t.trim()} className="text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-ash font-mono">{t.trim()}</span>
                        ))}
                      </div>
                    )}
                    {item.outcomes && (item.outcomes as string[]).length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-mist uppercase tracking-wider mb-2">Outcomes</p>
                        <ul className="space-y-1">
                          {(item.outcomes as string[]).map((o, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-mist"><ChevronRight size={14} className="text-indigo shrink-0 mt-0.5" />{o}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              </ScrollReveal>
            ))}
            {items.length === 0 && <p className="text-sm text-mist font-mono">No research experience listed yet.</p>}
          </div>
        </div>
      </Container>
    </Section>
  )
}
