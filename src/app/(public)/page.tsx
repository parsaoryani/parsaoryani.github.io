import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/container"
import { SkillCluster } from "@/components/content/skill-cluster"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SectionHeader } from "@/components/ui/section-header"
import { FloatingParticles } from "@/components/ui/floating-particles"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { TypewriterText } from "@/components/ui/typewriter"
import { getSkillCategories } from "@/lib/db/queries"
import { safeQuery, QueryErrorFallback } from "@/lib/db/query-result"
import { prisma } from "@/lib/db/prisma"
import { parseHomeDescription, parseHomeTitle, parseResearchDirections, RESEARCH_DIRECTIONS_SETTING_KEY } from "@/lib/home/hero"
import Link from "next/link"
import { Fragment } from "react"
import { ArrowUpRight, FileText, Code2, Mail, ChevronRight, Sparkles, Target, Compass, Network, UserCheck } from "lucide-react"

export const revalidate = 3600

const researchInterests = [
  {
    label: "Primary Focus",
    description: "Security and scalability of decentralized systems",
    icon: Target,
    color: "text-cyan",
  },
  {
    label: "Current Focus",
    description: "Blockchain security, cross-chain interoperability, Layer-2 systems, cross-rollup communication/execution",
    icon: Compass,
    color: "text-indigo",
  },
  {
    label: "Related Areas",
    description: "Applied cryptography, zero-knowledge proofs, formal methods, distributed systems",
    icon: Network,
    color: "text-emerald",
  },
]

export default async function HomePage() {
  const [skillCategories, homeTitle, homeDescription, researchDirectionsSetting] = await Promise.all([
    safeQuery(getSkillCategories(), "skill categories"),
    prisma.siteSetting.findUnique({ where: { key: "home_title" } }),
    prisma.siteSetting.findUnique({ where: { key: "home_description" } }),
    prisma.siteSetting.findUnique({ where: { key: RESEARCH_DIRECTIONS_SETTING_KEY } }),
  ])

  const titleLines = parseHomeTitle(homeTitle?.value)
  const description = parseHomeDescription(homeDescription?.value)
  const researchDirections = parseResearchDirections(researchDirectionsSetting?.value)

  const skillData = skillCategories.data ?? []
  const hasLoadError = skillCategories.error

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute inset-0 bg-glow" />
        <FloatingParticles count={18} className="opacity-60" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan/5 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo/5 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

        <Container className="relative z-10 pt-24">
          <div className="max-w-4xl">
            <div className="animate-in">
              <Badge variant="outline" size="lg" className="mb-6 border-cyan/20 text-cyan bg-cyan/5">
                <Sparkles size={12} className="mr-1.5" />
                M.Sc. Computer Engineering — Sharif University of Technology
              </Badge>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight mb-6">
              {titleLines.map((line, i) => (
                <Fragment key={i}>
                  {i > 0 && <br />}
                  <span className={i % 2 === 0 ? "text-gradient" : "text-gradient-accent"}>{line}</span>
                </Fragment>
              ))}
            </h1>

            <p className="text-lg md:text-xl text-mist leading-relaxed max-w-2xl mb-4 min-h-[2em]">
              <TypewriterText
                speed={24}
                startDelay={1000}
                segments={[
                  { text: description },
                ]}
              />
            </p>

            <p className="text-sm font-mono text-cyan/80 mb-10">
              Blockchain Security · Cross-Chain &amp; Layer 2 · Applied Cryptography · Distributed Systems
            </p>

            <div className="animate-in animate-in-delay-3 flex flex-wrap items-center gap-3">
              <Link href="/cv">
                <Button variant="default" size="lg" className="font-mono text-xs gap-2">
                  <FileText size={14} />
                  View CV
                </Button>
              </Link>
              <Link href="mailto:parsa.oryani82@sharif.edu">
                <Button variant="secondary" size="lg" className="font-mono text-xs gap-2">
                  <Mail size={14} />
                  Email me
                </Button>
              </Link>
              <div className="w-px h-6 bg-slate-700 mx-1 hidden sm:block" />
              <Link href="https://github.com/parsaoryani" target="_blank">
                <Button variant="outline" size="default" className="font-mono text-xs gap-2">
                  <Code2 size={14} />
                  GitHub
                  <ArrowUpRight size={12} />
                </Button>
              </Link>
              <Link href="https://www.linkedin.com/in/parsa-oryani/" target="_blank">
                <Button variant="outline" size="default" className="font-mono text-xs gap-2">
                  <UserCheck size={14} />
                  LinkedIn
                  <ArrowUpRight size={12} />
                </Button>
              </Link>
            </div>

            <div className="animate-in animate-in-delay-4 mt-16 flex items-center gap-6 text-xs text-ash font-mono">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
                Open to research collaborations, internships, and future PhD opportunities
              </span>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
            <ChevronRight size={20} className="text-ash rotate-90" />
          </div>
        </Container>
      </section>

      {/* Load Error Banner */}
      {hasLoadError && (
        <Section>
          <Container>
            <QueryErrorFallback error="Some content could not be loaded. The page may be incomplete." />
          </Container>
        </Section>
      )}

      {/* Research Interests */}
      <Section className="relative">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge={<Badge variant="default">Focus</Badge>}
              title="Research Interests"
              accent="cyan"
              description="What I work on, and how it's prioritized"
            />
          </ScrollReveal>
          <div className="grid gap-4 sm:grid-cols-3">
            {researchInterests.map((item, i) => (
              <ScrollReveal key={item.label} direction="up" delay={i * 80}>
                <div className="h-full flex items-start gap-3 p-5 rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-800/30 backdrop-blur-sm hover:border-cyan/20 transition-all duration-300">
                  <item.icon size={18} className={`${item.color} shrink-0 mt-0.5`} />
                  <div>
                    <p className={`text-xs font-mono uppercase tracking-wider mb-1 ${item.color}`}>{item.label}</p>
                    <p className="text-sm text-mist leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Current Research */}
      {researchDirections.length > 0 && (
        <Section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-void via-cyan/[0.01] to-void pointer-events-none" />
          <Container className="relative">
            <ScrollReveal>
              <SectionHeader
                badge={<Badge variant="default">Current Research</Badge>}
                title="Current Research"
                accent="cyan"
                description="Selected research directions and ongoing projects"
              />
            </ScrollReveal>
            <div className="grid gap-6 md:grid-cols-2">
              {researchDirections.map((direction, i) => (
                <ScrollReveal key={direction.title} direction="up" delay={i * 100} className="h-full">
                  <article className="h-full p-6 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-800/30 backdrop-blur-sm hover:border-cyan/20 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-500">
                    <h3 className="text-lg font-semibold leading-snug mb-2">{direction.title}</h3>
                    <p className="text-sm text-mist mb-4 leading-relaxed">{direction.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {direction.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-ash font-mono">{tag}</span>
                      ))}
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Skills */}
      {skillData.length > 0 && (
        <Section className="relative">
          <Container>
            <ScrollReveal>
              <SectionHeader
                badge={<Badge variant="default">Expertise</Badge>}
                title="Skills & Technologies"
                accent="cyan"
                description="Research and technical background across decentralized systems, security, cryptography, and distributed systems"
              />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={150}>
              <SkillCluster categories={skillData} />
            </ScrollReveal>
          </Container>
        </Section>
      )}

      {/* About Preview */}
      <Section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-void via-cyan/[0.01] to-void pointer-events-none" />
        <Container className="relative">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-8 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-800/30 backdrop-blur-sm hover:border-cyan/20 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-500">
              <div className="flex-1">
                <Badge variant="outline" size="lg" className="mb-3 border-cyan/20 text-cyan bg-cyan/5">About</Badge>
                <h2 className="text-2xl font-bold mb-2">
                  <span className="text-gradient">Parsa Oryani</span>
                </h2>
                <p className="text-sm text-mist leading-relaxed max-w-xl">
                  M.Sc. Computer Engineering student at Sharif University of Technology, studying secure and scalable
                  decentralized systems, with a focus on blockchain security, interoperability, and Layer-2 protocols.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/about">
                  <Button variant="secondary" size="default" className="font-mono text-xs gap-2">
                    Learn more <ChevronRight size={14} />
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </Section>

      {/* Contact CTA */}
      <Section className="relative">
        <Container>
          <ScrollReveal>
            <div className="text-center py-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                <span className="text-gradient">Get in Touch</span>
              </h2>
              <p className="text-mist text-sm mb-6 max-w-lg mx-auto">
                Open to research collaborations, internships, and PhD opportunities in systems security, applied
                cryptography, blockchain, and distributed systems.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="mailto:parsa.oryani82@sharif.edu">
                  <Button variant="default" size="lg" className="font-mono text-xs gap-2">
                    <Mail size={14} /> Email me
                  </Button>
                </Link>
                <Link href="https://github.com/parsaoryani" target="_blank">
                  <Button variant="secondary" size="default" className="font-mono text-xs gap-2">
                    <Code2 size={14} /> GitHub
                  </Button>
                </Link>
                <Link href="https://www.linkedin.com/in/parsa-oryani/" target="_blank">
                  <Button variant="secondary" size="default" className="font-mono text-xs gap-2">
                    <UserCheck size={14} /> LinkedIn
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </Section>
    </>
  )
}
