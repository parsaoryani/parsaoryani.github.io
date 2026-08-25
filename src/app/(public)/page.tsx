import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SectionHeader } from "@/components/ui/section-header"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { TypewriterText } from "@/components/ui/typewriter"
import { TechnicalFoundations } from "@/components/content/technical-foundations"
import { getSiteSettings } from "@/lib/public-data"
import Link from "next/link"
import { ArrowUpRight, FileText, Code2, Mail, ChevronRight, Target, Compass, Network, UserCheck } from "lucide-react"

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
  const settings = await getSiteSettings()
  const researchDirections = settings.research_directions

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[64vh] flex items-center overflow-hidden pb-6 md:pb-4">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute inset-0 bg-glow" />

        <Container className="relative z-10 pt-16">
          <div className="max-w-2xl">
            <p className="font-mono text-xs md:text-sm text-mist mb-4">
              M.Sc. Computer Engineering · Sharif University of Technology
            </p>

            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1.05] tracking-tight mb-5">
              <span className="text-gradient-accent">Parsa Oryani</span>
            </h1>

            <p className="text-lg md:text-xl text-mist leading-snug mb-10 min-h-[2.6em]">
              <TypewriterText
                speed={28}
                startDelay={600}
                segments={[
                  { text: "I'm interested in cryptography and distributed systems, with my current focus on blockchain security, cross-chain interoperability, and Layer-2 systems." },
                ]}
              />
            </p>

            <div className="animate-in animate-in-delay-3 flex flex-wrap items-center gap-3">
              <Link href="/cv">
                <Button variant="default" size="lg" className="font-mono text-xs gap-2">
                  <FileText size={14} />
                  View CV
                </Button>
              </Link>
            </div>

            <div className="animate-in animate-in-delay-3 mt-5 flex flex-wrap items-center gap-5 text-xs font-mono text-ash">
              <Link href="mailto:parsa.oryani82@sharif.edu" className="flex items-center gap-1.5 hover:text-cyan transition-colors">
                <Mail size={13} />
                Email
              </Link>
              <Link href="https://github.com/parsaoryani" target="_blank" className="flex items-center gap-1.5 hover:text-cyan transition-colors">
                <Code2 size={13} />
                GitHub
              </Link>
              <Link href="https://www.linkedin.com/in/parsa-oryani/" target="_blank" className="flex items-center gap-1.5 hover:text-cyan transition-colors">
                <UserCheck size={13} />
                LinkedIn
              </Link>
            </div>

            <div className="animate-in animate-in-delay-4 mt-8 flex items-center gap-6 text-xs text-ash font-mono">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
                Open to research collaborations, internships, and future PhD opportunities
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* Research Interests */}
      <Section className="relative pt-14 pb-14 md:pt-20 md:pb-20" id="research-interests">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge={<Badge variant="default">Focus</Badge>}
              title="Research Interests"
              accent="cyan"
              description="What I work on, and how it's prioritized"
              spacing="compact"
            />
          </ScrollReveal>
          <div className="grid gap-6 sm:grid-cols-3">
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
        <Section className="relative pt-14 pb-14 md:pt-20 md:pb-20" id="current-research">
          <div className="absolute inset-0 bg-gradient-to-b from-void via-cyan/[0.01] to-void pointer-events-none" />
          <Container className="relative">
            <ScrollReveal>
              <SectionHeader
                badge={<Badge variant="default">Current Research</Badge>}
                title="Current Research"
                accent="cyan"
                description="Selected research directions and ongoing projects"
                spacing="compact"
              />
            </ScrollReveal>
            <div className="grid gap-6 md:grid-cols-2">
              {researchDirections.map((direction, i) => (
                <ScrollReveal key={direction.title} direction="up" delay={i * 100} className="h-full">
                  <article className="h-full p-6 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-800/30 backdrop-blur-sm hover:border-cyan/20 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-500">
                    <h3 className="text-lg font-semibold leading-snug mb-2">{direction.title}</h3>
                    <p className="text-sm text-mist mb-4 leading-relaxed">{direction.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {direction.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-ash font-mono">{tag}</span>
                      ))}
                    </div>
                    {direction.href && (
                      <Link href={direction.href} className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan hover:text-cyan-deep transition-colors">
                        {direction.linkLabel || "Learn more"} <ArrowUpRight size={12} />
                      </Link>
                    )}
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Technical Foundations */}
      <Section className="relative pt-14 pb-14 md:pt-20 md:pb-20">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge={<Badge variant="default">Research Areas</Badge>}
              title="Technical Foundations"
              accent="cyan"
              description="Methods, systems, and tools that support my research and engineering work."
              spacing="compact"
            />
          </ScrollReveal>

          <TechnicalFoundations />
        </Container>
      </Section>

      {/* About Preview */}
      <Section className="relative pt-14 pb-14 md:pt-20 md:pb-20" id="about-preview">
        <div className="absolute inset-0 bg-gradient-to-b from-void via-cyan/[0.01] to-void pointer-events-none" />
        <Container className="relative">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-8 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-800/30 backdrop-blur-sm hover:border-cyan/20 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-500">
              <div className="flex-1">
                <Badge variant="outline" size="lg" className="mb-3 border-cyan/20 text-cyan bg-cyan/5">Snapshot</Badge>
                <h2 className="font-serif text-2xl font-semibold mb-2">
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
      <Section className="relative pt-14 pb-14 md:pt-20 md:pb-20" id="contact-cta">
        <Container>
          <ScrollReveal>
            <div className="text-center py-8">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
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
