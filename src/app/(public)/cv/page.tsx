import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getTimelineEvents, getSkillCategories, getAllPublications, getAllResearchExperience, getAllTeachingExperience } from "@/lib/public-data"
import { safeQuery, QueryErrorFallback } from "@/lib/public-data/query-result"
import { Download, ArrowUpRight, GraduationCap, Briefcase, Award, HeartHandshake, Sparkles, Code2, UserCheck, Mail } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import type { PublicTimelineEvent, PublicSkillCategory, PublicPublication, PublicResearchAssistant, PublicTeachingAssistant } from "@/lib/public-data"

export const metadata: Metadata = {
  title: "CV",
  description: "Curriculum Vitae of Parsa Oryani.",
}

function formatDate(date: Date, endDate?: Date | null) {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short" }
  const start = date.toLocaleDateString("en-US", options)
  if (!endDate) return `${start} to Present`
  return `${start} to ${endDate.toLocaleDateString("en-US", options)}`
}

export default async function CVPage() {
  const [eventsResult, skillCategoriesResult, publicationsResult, researchResult, teachingResult] = await Promise.all([
    safeQuery(getTimelineEvents(), "timeline events"),
    safeQuery(getSkillCategories(), "skill categories"),
    safeQuery(getAllPublications(), "publications"),
    safeQuery(getAllResearchExperience(), "research experience"),
    safeQuery(getAllTeachingExperience(), "teaching experience"),
  ])
  const events = eventsResult.data ?? []
  const skillCategories = skillCategoriesResult.data ?? []
  const publications = publicationsResult.data ?? []
  const researchExperience = researchResult.data ?? []
  const teachingExperience = teachingResult.data ?? []

  const hasLoadError = eventsResult.error || skillCategoriesResult.error || publicationsResult.error || researchResult.error || teachingResult.error

  return (
    <Section className="pt-32">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-14 p-8 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-800/30 backdrop-blur-sm hover:border-cyan/20 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-500">
            <div>
              <Badge variant="default" size="lg" className="mb-4">
                <Sparkles size={12} className="mr-1.5" /> Curriculum Vitae
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gradient">Parsa Oryani</h1>
              <p className="text-mist">M.Sc. Computer Engineering &middot; Secure Computing &mdash; Security of LLM Agents &amp; Multi-Agent Systems</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-ash font-mono">
                <span>parsa.oryani82@sharif.edu</span>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span>Sharif University of Technology</span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-ash font-mono">
                <Link href="https://github.com/parsaoryani" target="_blank" className="hover:text-cyan transition-colors flex items-center gap-1">
                  <Code2 size={12} /> GitHub
                </Link>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <Link href="https://www.linkedin.com/in/parsa-oryani/" target="_blank" className="hover:text-cyan transition-colors flex items-center gap-1">
                  <UserCheck size={12} /> LinkedIn
                </Link>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <Link href="mailto:parsa.oryani82@sharif.edu" className="hover:text-cyan transition-colors flex items-center gap-1">
                  <Mail size={12} /> Email
                </Link>
              </div>
            </div>
            <Link href="/cv.pdf" target="_blank">
              <Button variant="default" size="lg" className="font-mono text-xs gap-2 shadow-lg shadow-cyan/20">
                <Download size={16} /> Download PDF <ArrowUpRight size={12} />
              </Button>
            </Link>
          </div>

          {hasLoadError && (
            <QueryErrorFallback error="Some CV sections could not be loaded. The page may be incomplete." className="mb-8" />
          )}

          <div className="space-y-12">
            {/* Education */}
            <section>
              <h2 className="text-lg font-semibold font-mono text-cyan uppercase tracking-wider mb-6 flex items-center gap-3">
                <GraduationCap size={16} /> Education
              </h2>
              {events.filter((e: PublicTimelineEvent) => e.type === "education").map((event: PublicTimelineEvent) => (
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
                      {event.highlights.map((h, i) => (
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
              {events.filter((e: PublicTimelineEvent) => e.type === "experience").map((event: PublicTimelineEvent) => (
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
                      {event.highlights.map((h, i) => (
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
                {skillCategories.map((cat: PublicSkillCategory) => (
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
              {events.filter((e: PublicTimelineEvent) => e.type === "award").map((event: PublicTimelineEvent) => (
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

          {/* Publications */}
            {publications.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold font-mono text-cyan uppercase tracking-wider mb-6 flex items-center gap-3">
                  <Sparkles size={16} /> Publications
                </h2>
                {publications.map((pub: PublicPublication) => (
                  <div key={pub.id} className="relative pl-6 pb-4 last:pb-0 border-l border-slate-700/50">
                    <div className="absolute left-[-4.5px] top-1 w-2 h-2 rounded-full bg-cyan" />
                    <h3 className="font-semibold">{pub.title}</h3>
                    <p className="text-sm text-mist">{pub.venue} ({pub.year})</p>
                    <p className="text-xs text-ash mt-1 font-mono">{pub.authors.map((a) => a.name).join(", ")}</p>
                    {pub.tldr && <p className="text-sm text-mist/70 mt-1 line-clamp-2">{pub.tldr}</p>}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {pub.pdfUrl && (
                        <Link href={pub.pdfUrl} target="_blank" className="text-xs font-mono text-cyan hover:underline">PDF</Link>
                      )}
                      {pub.codeUrl && (
                        <Link href={pub.codeUrl} target="_blank" className="text-xs font-mono text-cyan hover:underline">Code</Link>
                      )}
                      {pub.arxivId && (
                        <Link href={`https://arxiv.org/abs/${pub.arxivId}`} target="_blank" className="text-xs font-mono text-cyan hover:underline">arXiv</Link>
                      )}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Research Experience */}
            {researchExperience.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold font-mono text-emerald uppercase tracking-wider mb-6 flex items-center gap-3">
                  <Sparkles size={16} /> Research Experience
                </h2>
                {researchExperience.map((exp: PublicResearchAssistant) => (
                  <div key={exp.id} className="relative pl-6 pb-4 last:pb-0 border-l border-slate-700/50">
                    <div className="absolute left-[-4.5px] top-1 w-2 h-2 rounded-full bg-emerald" />
                    <h3 className="font-semibold">{exp.topic}</h3>
                    <p className="text-sm text-mist">{exp.lab}, {exp.university}</p>
                    <p className="font-mono text-xs text-ash">{formatDate(exp.startDate, exp.endDate)}</p>
                    {exp.outcomes && <p className="text-sm text-mist/70 mt-1">{String(exp.outcomes)}</p>}
                    {exp.technologies && <p className="text-xs text-ash mt-1">Technologies: {exp.technologies}</p>}
                  </div>
                ))}
              </section>
            )}

            {/* Teaching Experience */}
            {teachingExperience.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold font-mono text-amber uppercase tracking-wider mb-6 flex items-center gap-3">
                  <Sparkles size={16} /> Teaching Experience
                </h2>
                {teachingExperience.map((exp: PublicTeachingAssistant) => (
                  <div key={exp.id} className="relative pl-6 pb-4 last:pb-0 border-l border-slate-700/50">
                    <div className="absolute left-[-4.5px] top-1 w-2 h-2 rounded-full bg-amber" />
                    <h3 className="font-semibold">{exp.course}</h3>
                    <p className="text-sm text-mist">{exp.university}, {exp.professor}</p>
                    <p className="font-mono text-xs text-ash">{formatDate(exp.startDate, exp.endDate)}</p>
                    {exp.highlights && <p className="text-sm text-mist/70 mt-1">{String(exp.highlights)}</p>}
                    {exp.technologies && <p className="text-xs text-ash mt-1">Technologies: {exp.technologies}</p>}
                  </div>
                ))}
              </section>
            )}

            {/* Service */}
            {events.filter((e: PublicTimelineEvent) => e.type === "service").length > 0 && (
              <section>
                <h2 className="text-lg font-semibold font-mono text-mist uppercase tracking-wider mb-6 flex items-center gap-3">
                  <HeartHandshake size={16} /> Service
                </h2>
                {events.filter((e: PublicTimelineEvent) => e.type === "service").map((event: PublicTimelineEvent) => (
                  <div key={event.id} className="relative pl-6 pb-4 last:pb-0 border-l border-slate-700/50">
                    <div className="absolute left-[-4.5px] top-1 w-2 h-2 rounded-full bg-slate-600" />
                    <h3 className="font-semibold text-sm">{event.title}</h3>
                    <p className="text-sm text-mist">{event.organization}{event.location && `, ${event.location}`}</p>
                    <span className="font-mono text-xs text-ash">{formatDate(event.startDate, event.endDate)}</span>
                    {event.description && <p className="text-sm text-mist/70 mt-1">{event.description}</p>}
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
