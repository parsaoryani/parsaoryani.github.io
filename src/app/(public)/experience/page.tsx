import { Container, Section } from "@/components/layout/container"
import { Badge } from "@/components/ui/badge"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { getAllResearchExperience, getAllTeachingExperience, getTimelineEvents } from "@/lib/public-data"
import { safeQuery, QueryErrorFallback } from "@/lib/public-data/query-result"
import { slugify } from "@/lib/utils/slugify"
import {
  Sparkles,
  GraduationCap,
  Briefcase,
  Award,
  Mic,
  HeartHandshake,
  Award as AwardIcon,
  FlaskConical,
  Users,
  ArrowUpRight,
  ChevronRight,
  Calendar,
  User,
  Building2,
  FolderGit2,
} from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import type { PublicTimelineEvent } from "@/lib/public-data"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Experience",
  description: "Education, research assistantships, teaching assistantships, work experience, awards, talks, and service.",
}

function formatDate(date: Date, endDate?: Date | null) {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short" }
  const start = date.toLocaleDateString("en-US", options)
  if (!endDate) return `${start} — Present`
  return `${start} — ${endDate.toLocaleDateString("en-US", options)}`
}

type SectionConfig = { icon: typeof GraduationCap; label: string; color: string; dotColor: string; anchor: string }

const typeConfig: Record<string, SectionConfig> = {
  education: { icon: GraduationCap, label: "Education", color: "text-cyan", dotColor: "bg-cyan", anchor: "education" },
  experience: { icon: Briefcase, label: "Experience", color: "text-indigo", dotColor: "bg-indigo", anchor: "experience" },
  award: { icon: Award, label: "Award", color: "text-emerald", dotColor: "bg-emerald", anchor: "awards" },
  talk: { icon: Mic, label: "Talk", color: "text-amber", dotColor: "bg-amber", anchor: "talks" },
  service: { icon: HeartHandshake, label: "Service", color: "text-mist", dotColor: "bg-mist", anchor: "service" },
  publication_milestone: { icon: AwardIcon, label: "Publication Milestone", color: "text-amber", dotColor: "bg-amber", anchor: "publications" },
}

function TimelineEventItem({ event, config, isLast }: { event: PublicTimelineEvent; config: SectionConfig; isLast: boolean }) {
  const Icon = config.icon
  const courseCount = event.courses?.length ?? 0
  return (
    <div className="relative pl-12 pb-10 last:pb-0 group">
      {!isLast && (
        <div className="absolute left-[17px] top-10 bottom-0 w-px bg-gradient-to-b from-slate-700 to-slate-800" />
      )}
      <div className="absolute left-[9px] top-2 w-[17px] h-[17px] rounded-full border-2 border-slate-700 bg-void flex items-center justify-center group-hover:border-current transition-colors">
        <div className={`w-2 h-2 rounded-full ${config.dotColor}`} />
      </div>
      <div className={`text-[10px] font-mono ${config.color} mb-1 flex items-center gap-1.5`}>
        <Icon size={11} />
        {config.label}
        <span className="text-ash ml-2">{formatDate(event.startDate, event.endDate)}</span>
      </div>
      <h3 className="text-base font-semibold text-fog group-hover:text-cyan transition-colors duration-300">{event.title}</h3>
      <p className="text-sm text-mist">
        {event.organization}
        {event.location && <span className="text-ash"> — {event.location}</span>}
      </p>
      {event.description && (
        <p className="text-sm text-mist/70 mt-1">{event.description}</p>
      )}
      {event.highlights && (
        <ul className="mt-2 space-y-1">
          {(event.highlights as string[]).map((h, hi) => (
            <li key={hi} className="flex items-start gap-2 text-sm text-mist">
              <span className={`mt-1.5 w-1 h-1 rounded-full ${config.dotColor}/50 shrink-0`} />
              {h}
            </li>
          ))}
        </ul>
      )}
      {courseCount > 0 && (
        <Link
          href={`/education/${slugify(event.organization)}`}
          className="inline-flex items-center gap-1.5 mt-3 text-xs font-mono text-cyan hover:text-cyan-deep transition-colors"
        >
          View coursework &amp; syllabi ({courseCount}) <ArrowUpRight size={12} />
        </Link>
      )}
    </div>
  )
}

export default async function ExperiencePage() {
  const [eventsResult, researchResult, teachingResult] = await Promise.all([
    safeQuery(getTimelineEvents(), "timeline events"),
    safeQuery(getAllResearchExperience(), "research experience"),
    safeQuery(getAllTeachingExperience(), "teaching experience"),
  ])
  const events = eventsResult.data ?? []
  const researchItems = researchResult.data ?? []
  const teachingItems = teachingResult.data ?? []
  const hasError = eventsResult.error || researchResult.error || teachingResult.error

  const pills = [
    { anchor: "education", label: "Education", icon: GraduationCap, color: "text-cyan", count: events.filter((e) => e.type === "education").length },
    { anchor: "research-assistance", label: "Research Assistantships", icon: FlaskConical, color: "text-indigo", count: researchItems.length },
    { anchor: "teaching-assistance", label: "Teaching Assistantships", icon: Users, color: "text-emerald", count: teachingItems.length },
    { anchor: "experience", label: "Experience", icon: Briefcase, color: "text-indigo", count: events.filter((e) => e.type === "experience").length },
    { anchor: "awards", label: "Award", icon: Award, color: "text-emerald", count: events.filter((e) => e.type === "award").length },
    { anchor: "talks", label: "Talk", icon: Mic, color: "text-amber", count: events.filter((e) => e.type === "talk").length },
    { anchor: "service", label: "Service", icon: HeartHandshake, color: "text-mist", count: events.filter((e) => e.type === "service").length },
    { anchor: "publications", label: "Publication Milestone", icon: AwardIcon, color: "text-amber", count: events.filter((e) => e.type === "publication_milestone").length },
  ].filter((p) => p.count > 0)

  return (
    <Section className="pt-32">
      <Container>
        <ScrollReveal>
          <div className="max-w-4xl mb-12">
            <Badge variant="default" size="lg" className="mb-5">
              <Sparkles size={12} className="mr-1.5" /> Experience
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4"><span className="text-gradient">Experience</span></h1>
            <p className="text-lg text-mist max-w-2xl">
              Education, research and teaching assistantships, work experience, and recognition — jump to any section below.
            </p>
          </div>
        </ScrollReveal>

        {hasError && <QueryErrorFallback error="Some content could not be loaded." className="mb-8" />}

        <div className="flex flex-wrap gap-3 mb-14">
          {pills.map((pill) => {
            const Icon = pill.icon
            return (
              <a
                key={pill.anchor}
                href={`#${pill.anchor}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/50 text-xs font-mono hover:border-cyan/50 transition-colors"
              >
                <Icon size={12} className={pill.color} />
                {pill.label}
                <span className="text-ash ml-1">({pill.count})</span>
              </a>
            )
          })}
        </div>

        {/* Education */}
        {events.filter((e) => e.type === "education").length > 0 && (
          <ScrollReveal direction="left" className="mb-16 scroll-mt-24" id="education">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <GraduationCap size={16} className="text-cyan" />
              <span className="text-cyan">Education</span>
            </h2>
            <div className="relative">
              {events.filter((e) => e.type === "education").map((event, i, arr) => (
                <TimelineEventItem key={event.id} event={event} config={typeConfig.education!} isLast={i === arr.length - 1} />
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* Research Assistantships */}
        {researchItems.length > 0 && (
          <div className="mb-16 scroll-mt-24" id="research-assistance">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <FlaskConical size={16} className="text-indigo" />
              <span className="text-indigo">Research Assistantships</span>
            </h2>
            <div className="space-y-6">
              {researchItems.map((item, i) => (
                <ScrollReveal key={item.id} direction="up" delay={i * 60}>
                  <div className="p-6 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-800/30 backdrop-blur-sm hover:border-indigo/20 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-500">
                    <h3 className="text-lg font-semibold mb-1">{item.topic}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-mist mb-1">
                      <span className="flex items-center gap-1"><Building2 size={13} /> {item.lab ? `${item.lab} — ` : ""}{item.university}</span>
                      {item.supervisor && (
                        <span className="flex items-center gap-1">
                          <User size={13} />
                          Supervisor:{" "}
                          {item.supervisorUrl ? (
                            <a href={item.supervisorUrl} target="_blank" rel="noopener noreferrer" className="text-indigo hover:text-indigo/80 transition-colors underline underline-offset-2">
                              {item.supervisor}
                            </a>
                          ) : (
                            item.supervisor
                          )}
                        </span>
                      )}
                      <span className="flex items-center gap-1"><Calendar size={13} /> {formatDate(item.startDate, item.endDate)}</span>
                    </div>
                    {item.collaborator && (
                      <p className="flex items-center gap-1 text-sm text-mist/80 mb-3"><Users size={13} /> {item.collaborator}</p>
                    )}
                    {item.description && <p className="text-sm text-mist mb-3 mt-2">{item.description}</p>}
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
                    {item.repoUrl && (
                      <a href={item.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-3 text-xs font-mono text-indigo hover:text-indigo/80 transition-colors">
                        <FolderGit2 size={12} /> View repository <ArrowUpRight size={10} />
                      </a>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {/* Teaching Assistantships */}
        {teachingItems.length > 0 && (
          <div className="mb-16 scroll-mt-24" id="teaching-assistance">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Users size={16} className="text-emerald" />
              <span className="text-emerald">Teaching Assistantships</span>
            </h2>
            <div className="space-y-6">
              {teachingItems.map((item, i) => (
                <ScrollReveal key={item.id} direction="up" delay={i * 60}>
                  <div className="p-6 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-800/30 backdrop-blur-sm hover:border-emerald/20 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-500">
                    <h3 className="text-lg font-semibold mb-1">{item.course}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-mist mb-3">
                      <span className="flex items-center gap-1"><Building2 size={13} /> {item.university}</span>
                      <span className="flex items-center gap-1"><User size={13} /> {item.professor}</span>
                      <span className="flex items-center gap-1"><Calendar size={13} /> {formatDate(item.startDate, item.endDate)}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-cyan/10 border border-cyan/20 text-cyan font-mono">
                        {item.level === "graduate" ? "Graduate" : "Undergraduate"}
                      </span>
                    </div>
                    {item.description && <p className="text-sm text-mist mb-3">{item.description}</p>}
                    {item.highlights && (item.highlights as string[]).length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-emerald uppercase tracking-wider mb-2">Teaching Highlights</p>
                        <ul className="space-y-1">
                          {(item.highlights as string[]).map((h, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-mist"><ChevronRight size={14} className="text-emerald shrink-0 mt-0.5" />{h}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {item.technologies && (
                      <div>
                        <p className="text-xs font-semibold text-ash uppercase tracking-wider mb-2">Technologies</p>
                        <div className="flex flex-wrap gap-1.5">
                          {item.technologies.split(",").map((t) => (
                            <span key={t.trim()} className="text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-ash font-mono">{t.trim()}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {events.filter((e) => e.type === "experience").length > 0 && (
          <ScrollReveal direction="left" className="mb-16 scroll-mt-24" id="experience">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Briefcase size={16} className="text-indigo" />
              <span className="text-indigo">Experience</span>
            </h2>
            <div className="relative">
              {events.filter((e) => e.type === "experience").map((event, i, arr) => (
                <TimelineEventItem key={event.id} event={event} config={typeConfig.experience!} isLast={i === arr.length - 1} />
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* Recognition: awards, talks, service, publication milestones */}
        {(["award", "talk", "service", "publication_milestone"] as const).map((type) => {
          const config = typeConfig[type]!
          const typeEvents = events.filter((e) => e.type === type)
          if (typeEvents.length === 0) return null
          return (
            <ScrollReveal key={type} direction="left" className="mb-16 scroll-mt-24" id={config.anchor}>
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <config.icon size={16} className={config.color} />
                <span className={config.color}>{config.label}</span>
              </h2>
              <div className="relative">
                {typeEvents.map((event, i) => (
                  <TimelineEventItem key={event.id} event={event} config={config} isLast={i === typeEvents.length - 1} />
                ))}
              </div>
            </ScrollReveal>
          )
        })}

        <div className="mt-4 p-6 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-800/30 text-center">
          <p className="text-sm text-mist mb-4">Want the full picture, including my background and skills?</p>
          <Link href="/about" className="inline-flex items-center gap-1.5 text-sm text-cyan hover:text-cyan-deep transition-colors font-mono">
            Read my full bio <ArrowUpRight size={12} />
          </Link>
        </div>
      </Container>
    </Section>
  )
}
