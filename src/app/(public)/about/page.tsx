import { Container, Section } from "@/components/layout/container"
import { SkillCluster } from "@/components/content/skill-cluster"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/db/prisma"
import { getTimelineEvents, getSkillCategories } from "@/lib/db/queries"
import { Sparkles, GraduationCap, Briefcase, Award, Mic, HeartHandshake, Camera } from "lucide-react"
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

const typeConfig: Record<string, { icon: typeof GraduationCap; label: string; color: string }> = {
  education: { icon: GraduationCap, label: "Education", color: "text-cyan" },
  experience: { icon: Briefcase, label: "Experience", color: "text-indigo" },
  award: { icon: Award, label: "Award", color: "text-emerald" },
  talk: { icon: Mic, label: "Talk", color: "text-amber" },
  service: { icon: HeartHandshake, label: "Service", color: "text-mist" },
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
                  I am a Master's student in Computer Engineering at Sharif University of Technology,
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

        <div className="mb-20">
          <h2 className="text-2xl font-bold mb-6 text-gradient">Timeline</h2>

          <div className="flex flex-wrap gap-3 mb-10">
            {Object.entries(typeConfig).map(([type, config]) => {
              const Icon = config.icon
              const count = events.filter(e => e.type === type).length
              return (
                <a
                  key={type}
                  href={`#tl-${type}`}
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
              <div key={type} id={`tl-${type}`} className="mb-14">
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
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-10 text-gradient">Skills</h2>
          <SkillCluster categories={skillCategories} />
        </div>
      </Container>
    </Section>
  )
}
