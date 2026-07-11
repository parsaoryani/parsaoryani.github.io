import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getTimelineEvents, getSkillCategories } from "@/lib/db/queries"
import { Download, ArrowUpRight, GraduationCap, Briefcase, Award, Mic, HeartHandshake, Sparkles } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "CV",
  description: "Curriculum Vitae of Parsa Oryani.",
}

function formatDate(date: Date, endDate?: Date | null) {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short" }
  const start = date.toLocaleDateString("en-US", options)
  if (!endDate) return `${start} — Present`
  return `${start} — ${endDate.toLocaleDateString("en-US", options)}`
}

const typeIcons: Record<string, typeof GraduationCap> = {
  education: GraduationCap,
  experience: Briefcase,
  award: Award,
  talk: Mic,
  service: HeartHandshake,
}

export default async function CVPage() {
  const [events, skillCategories] = await Promise.all([
    getTimelineEvents().catch(() => []),
    getSkillCategories().catch(() => []),
  ])

  return (
    <Section className="pt-32">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-14 p-8 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-800/30 backdrop-blur-sm">
            <div>
              <Badge variant="default" className="mb-4 text-xs px-3 py-1">
                <Sparkles size={12} className="mr-1.5" /> Curriculum Vitae
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gradient">Parsa Oryani</h1>
              <p className="text-mist">M.Sc. Computer Engineering &middot; Blockchain &amp; AI Security Researcher</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-ash font-mono">
                <span>parsa.oryani82@sharif.edu</span>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span>Sharif University of Technology</span>
              </div>
            </div>
            <Link href="/cv.pdf" target="_blank">
              <Button variant="default" size="lg" className="font-mono text-xs gap-2 shadow-lg shadow-cyan/20">
                <Download size={16} /> Download PDF <ArrowUpRight size={12} />
              </Button>
            </Link>
          </div>

          <div className="space-y-12">
            {/* Education */}
            <section>
              <h2 className="text-lg font-semibold font-mono text-cyan uppercase tracking-wider mb-6 flex items-center gap-3">
                <GraduationCap size={16} /> Education
              </h2>
              {events.filter((e) => e.type === "education").map((event) => (
                <div key={event.id} className="relative pl-6 pb-6 last:pb-0 border-l border-slate-700/50">
                  <div className="absolute left-[-4.5px] top-1 w-2 h-2 rounded-full bg-cyan" />
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-mist">{event.organization}</p>
                    </div>
                    <span className="font-mono text-xs text-ash shrink-0">
                      {formatDate(event.startDate, event.endDate)}
                    </span>
                  </div>
                  {event.description && <p className="text-sm text-mist/70 mt-1">{event.description}</p>}
                  {event.highlights && (
                    <ul className="mt-2 space-y-0.5">
                      {(event.highlights as string[]).map((h, i) => (
                        <li key={i} className="text-sm text-mist flex items-start gap-2">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-cyan/40 shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>

            {/* Experience */}
            <section>
              <h2 className="text-lg font-semibold font-mono text-indigo uppercase tracking-wider mb-6 flex items-center gap-3">
                <Briefcase size={16} /> Experience
              </h2>
              {events.filter((e) => e.type === "experience").map((event) => (
                <div key={event.id} className="relative pl-6 pb-6 last:pb-0 border-l border-slate-700/50">
                  <div className="absolute left-[-4.5px] top-1 w-2 h-2 rounded-full bg-indigo" />
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-mist">{event.organization}</p>
                    </div>
                    <span className="font-mono text-xs text-ash shrink-0">
                      {formatDate(event.startDate, event.endDate)}
                    </span>
                  </div>
                  {event.description && <p className="text-sm text-mist/70 mt-1">{event.description}</p>}
                  {event.highlights && (
                    <ul className="mt-2 space-y-0.5">
                      {(event.highlights as string[]).map((h, i) => (
                        <li key={i} className="text-sm text-mist flex items-start gap-2">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-indigo/40 shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>

            {/* Skills */}
            <section>
              <h2 className="text-lg font-semibold font-mono text-emerald uppercase tracking-wider mb-6 flex items-center gap-3">
                <Award size={16} /> Skills
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {skillCategories.map((cat) => (
                  <div key={cat.id} className="p-4 rounded-xl border border-slate-700/50 bg-slate-900/50">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-emerald mb-3">{cat.name}</h3>
                    <p className="text-sm text-mist">
                      {cat.skills.map((s) => s.name).join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Awards */}
            <section>
              <h2 className="text-lg font-semibold font-mono text-amber uppercase tracking-wider mb-6 flex items-center gap-3">
                <Award size={16} /> Awards &amp; Honors
              </h2>
              {events.filter((e) => e.type === "award").map((event) => (
                <div key={event.id} className="relative pl-6 pb-4 last:pb-0 border-l border-slate-700/50">
                  <div className="absolute left-[-4.5px] top-1 w-2 h-2 rounded-full bg-amber" />
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                    <div>
                      <h3 className="font-semibold text-sm">{event.title}</h3>
                      <p className="text-sm text-mist">{event.organization}</p>
                    </div>
                    <span className="font-mono text-xs text-ash shrink-0">
                      {event.startDate.toLocaleDateString("en-US", { year: "numeric" })}
                    </span>
                  </div>
                  {event.description && <p className="text-sm text-mist/70 mt-1">{event.description}</p>}
                </div>
              ))}
            </section>

            {/* Talks */}
            {events.filter((e) => e.type === "talk").length > 0 && (
              <section>
                <h2 className="text-lg font-semibold font-mono text-amber uppercase tracking-wider mb-6 flex items-center gap-3">
                  <Mic size={16} /> Talks
                </h2>
                {events.filter((e) => e.type === "talk").map((event) => (
                  <div key={event.id} className="relative pl-6 pb-4 last:pb-0 border-l border-slate-700/50">
                    <div className="absolute left-[-4.5px] top-1 w-2 h-2 rounded-full bg-amber" />
                    <h3 className="font-semibold text-sm">{event.title}</h3>
                    <p className="text-sm text-mist">{event.organization}{event.location && ` — ${event.location}`}</p>
                    <span className="font-mono text-xs text-ash">{formatDate(event.startDate, event.endDate)}</span>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}
