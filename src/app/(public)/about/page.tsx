import { Container, Section } from "@/components/layout/container"
import { SkillCluster } from "@/components/content/skill-cluster"
import { Badge } from "@/components/ui/badge"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { prisma } from "@/lib/db/prisma"
import { getTimelineEvents, getSkillCategories } from "@/lib/db/queries"
import { Sparkles, GraduationCap, Briefcase, Award, Mic, HeartHandshake, Camera, BookOpen, Award as AwardIcon, FileText, Star, Link as LinkIcon } from "lucide-react"
import Image from "next/image"
import type { Metadata } from "next"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "About",
  description: "Biography, academic timeline, skills, and background.",
}

function formatDate(date: Date, endDate?: Date | null) {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short" }
  const start = date.toLocaleDateString("en-US", options)
  if (!endDate) return `${start} — Present`
  return `${start} — ${endDate.toLocaleDateString("en-US", options)}`
}

interface CourseFileShape {
  id: string
  name: string
  url: string
}

interface CourseLinkShape {
  id: string
  type: string
  name: string
  url: string
}

interface CourseShape {
  id: string
  name: string
  grade: string | null
  exercises: string | null
  projects: string | null
  discussions: string | null
  files: CourseFileShape[]
  links?: CourseLinkShape[]
}

const typeConfig: Record<string, { icon: typeof GraduationCap; label: string; color: string; anchor: string }> = {
  education: { icon: GraduationCap, label: "Education", color: "text-cyan", anchor: "education" },
  experience: { icon: Briefcase, label: "Experience", color: "text-indigo", anchor: "experience" },
  award: { icon: Award, label: "Award", color: "text-emerald", anchor: "awards" },
  talk: { icon: Mic, label: "Talk", color: "text-amber", anchor: "talks" },
  service: { icon: HeartHandshake, label: "Service", color: "text-mist", anchor: "service" },
  publication_milestone: { icon: AwardIcon, label: "Publication Milestone", color: "text-amber", anchor: "publications" },
}

export default async function AboutPage() {
  const [events, skillCategories, photoSetting] = await Promise.all([
    getTimelineEvents().catch(() => []),
    getSkillCategories().catch(() => []),
    prisma.siteSetting.findUnique({ where: { key: "profile_photo" } }),
  ])

  const photo = photoSetting?.value as { url?: string; alt?: string } | null

  return (
    <Section className="pt-32">
      <Container>
        <ScrollReveal>
          <div className="max-w-4xl mb-16">
          <Badge variant="default" className="mb-5 text-xs px-3 py-1">
            <Sparkles size={12} className="mr-1.5" /> Background
          </Badge>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {photo?.url && (
              <div className="shrink-0">
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border-2 border-slate-700/50 bg-slate-800/50">
                  <Image
                    src={photo.url}
                    alt={photo.alt || "Profile photo"}
                    width={192}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-gradient">About</span>
              </h1>
              <div className="space-y-4 text-mist leading-relaxed">
                <p>
                  I am a Master&apos;s student in Computer Engineering at Sharif University of Technology,
                  where my research focuses on the intersection of blockchain security, deep learning
                  robustness, and agentic AI safety. My work aims to build verifiably secure
                  decentralized systems through formal methods and cryptographic guarantees.
                </p>
                <p>
                  I have extensive experience in blockchain development, having built smart contracts,
                  layer-2 scaling solutions, and DeFi protocols. In deep learning, I work on
                  adversarial robustness, privacy-preserving ML, and AI alignment. My current
                  research explores how cryptographic primitives can ensure safety in autonomous
                  AI systems.
                </p>
                <p>
                  I am seeking PhD positions where I can contribute to the security of next-generation
                  intelligent and decentralized systems.
                </p>
              </div>
            </div>
          </div>
          </div>
        </ScrollReveal>

        <div className="mb-20">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-6 text-gradient">Timeline</h2>
          </ScrollReveal>

          <div className="flex flex-wrap gap-3 mb-10">
            {Object.entries(typeConfig).map(([type, config]) => {
              const Icon = config.icon
              const count = events.filter(e => e.type === type).length
              return (
                <a
                  key={type}
                  href={`#${config.anchor}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/50 text-xs font-mono hover:border-cyan/50 transition-colors"
                >
                  <Icon size={12} className={config.color} />
                  {config.label}
                  <span className="text-ash ml-1">({count})</span>
                </a>
              )
            })}
          </div>

          {Object.entries(typeConfig).map(([type, config]) => {
            const Icon = config.icon
            const typeEvents = events.filter(e => e.type === type)
            if (typeEvents.length === 0) return null

            return (
              <ScrollReveal key={type} direction="left" className="mb-14" id={config.anchor}>
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Icon size={16} className={config.color} />
                  <span className={config.color}>{config.label}</span>
                </h3>
                <div className="relative">
                  {typeEvents.map((event, i) => (
                    <div key={event.id} className="relative pl-12 pb-10 last:pb-0 group">
                      {i < typeEvents.length - 1 && (
                        <div className="absolute left-[17px] top-10 bottom-0 w-px bg-gradient-to-b from-slate-700 to-slate-800" />
                      )}
                      <div className="absolute left-[9px] top-2 w-[17px] h-[17px] rounded-full border-2 border-slate-700 bg-void flex items-center justify-center group-hover:border-cyan/50 transition-colors">
                        <div className="w-2 h-2 rounded-full bg-current" />
                      </div>
                      <div className={`text-[10px] font-mono ${config.color} mb-1 flex items-center gap-1.5`}>
                        <Icon size={11} />
                        {config.label}
                        <span className="text-ash ml-2">{formatDate(event.startDate, event.endDate)}</span>
                      </div>
                      <h3 className="text-base font-semibold text-fog">{event.title}</h3>
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
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-cyan/50 shrink-0" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      )}
                      {event.type === "education" && event.courses && event.courses.length > 0 && (
                        <details className="mt-4 space-y-3 group">
                          <summary className="cursor-pointer text-xs font-semibold font-mono text-cyan uppercase tracking-wider flex items-center gap-1.5">
                            <BookOpen size={11} /> Courses ({event.courses.length})
                            <span className="ml-auto text-ash transition-transform duration-200 group-open:rotate-180">▸</span>
                          </summary>
                          <div className="space-y-3 ml-2 border-l border-slate-700/50 pl-4 mt-3 animate-in slide-in-from-top-2">
                            {event.courses.map((course: CourseShape) => (
                              <div key={course.id} className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-3 hover:border-cyan/20 transition-colors">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h5 className="font-medium text-sm text-fog">{course.name}</h5>
                                      {course.grade && (
                                        <span className="px-2 py-0.5 text-xs font-mono rounded bg-emerald/10 text-emerald border border-emerald/20">{course.grade}</span>
                                      )}
                                    </div>
                                    {course.exercises && (
                                      <p className="text-xs text-mist/80 mt-1"><strong>Exercises:</strong> {course.exercises}</p>
                                    )}
                                    {course.projects && (
                                      <p className="text-xs text-mist/80 mt-1"><strong>Projects:</strong> {course.projects}</p>
                                    )}
                                    {course.discussions && (
                                      <p className="text-xs text-mist/80 mt-1"><strong>Discussions:</strong> {course.discussions}</p>
                                    )}
                                    {course.files && course.files.length > 0 && (
                                      <div className="mt-2 flex flex-wrap gap-1.5">
                                        {course.files.map((file: CourseFileShape) => (
                                          <a key={file.id} href={file.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono rounded bg-slate-800/50 border border-slate-700/50 text-[var(--accent)] hover:bg-cyan/10 transition-colors">
                                            <FileText size={10} /> {file.name}
                                          </a>
                                        ))}
                                      </div>
                                    )}
                                    {course.links && course.links.length > 0 && (
                                      <div className="mt-2 space-y-2">
                                        {course.links.filter((l: CourseLinkShape) => l.type === "exercise").map((link: CourseLinkShape) => (
                                          <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-mono rounded bg-emerald/10 border border-emerald/20 text-emerald hover:bg-emerald/20 transition-colors">
                                            <LinkIcon size={10} /> {link.name}
                                          </a>
                                        ))}
                                        {course.links.filter((l: CourseLinkShape) => l.type === "project").map((link: CourseLinkShape) => (
                                          <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-mono rounded bg-cyan/10 border border-cyan/20 text-cyan hover:bg-cyan/20 transition-colors">
                                            <LinkIcon size={10} /> {link.name}
                                          </a>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            )
          })}
        </div>

        <div>
          <ScrollReveal direction="up">
            <h2 className="text-2xl font-bold mb-10 text-gradient">Skills</h2>
            <SkillCluster categories={skillCategories} />
          </ScrollReveal>
        </div>
      </Container>
    </Section>
  )
}
