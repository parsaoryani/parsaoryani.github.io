import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/container"
import { PublicationCard } from "@/components/content/publication-card"
import { ProjectCard } from "@/components/content/project-card"
import { SkillCluster } from "@/components/content/skill-cluster"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getFeaturedPublications, getFeaturedProjects, getSkillCategories } from "@/lib/db/queries"
import Link from "next/link"
import { ArrowUpRight, FileText, Code2, Mail, GraduationCap, ChevronRight, Sparkles } from "lucide-react"

export default async function HomePage() {
  const [publications, projects, skillCategories] = await Promise.all([
    getFeaturedPublications().catch(() => []),
    getFeaturedProjects().catch(() => []),
    getSkillCategories().catch(() => []),
  ])

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute inset-0 bg-glow" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan/5 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo/5 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

        <Container className="relative z-10 pt-24">
          <div className="max-w-4xl">
            <div className="animate-in">
              <Badge variant="outline" className="mb-6 text-xs px-4 py-1.5 border-cyan/20 text-cyan bg-cyan/5">
                <Sparkles size={12} className="mr-1.5" />
                M.Sc. Computer Engineering — Sharif University of Technology
              </Badge>
            </div>

            <h1 className="animate-in animate-in-delay-1 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-6">
              <span className="text-gradient">Researching the</span>
              <br />
              <span className="text-gradient-accent">Security</span>{" "}
              <span className="text-gradient">of</span>
              <br />
              <span className="text-gradient-accent">Decentralized</span>{" "}
              <span className="text-gradient">&amp; AI Systems</span>
            </h1>

            <p className="animate-in animate-in-delay-2 text-lg md:text-xl text-mist leading-relaxed max-w-2xl mb-10">
              PhD applicant and researcher at the intersection of blockchain security,
              deep learning robustness, and agentic AI safety. Building verifiably secure
              decentralized systems through formal methods and cryptographic guarantees.
            </p>

            <div className="animate-in animate-in-delay-3 flex flex-wrap items-center gap-3">
              {[
                { href: "https://scholar.google.com", label: "Google Scholar", icon: GraduationCap, variant: "secondary" as const },
                { href: "https://github.com/parsaoryani", label: "GitHub", icon: Code2, variant: "secondary" as const },
                { href: "/cv", label: "Download CV", icon: FileText, variant: "default" as const },
                { href: "mailto:parsa.oryani82@sharif.edu", label: "Email", icon: Mail, variant: "outline" as const },
              ].map((link) => (
                <Link key={link.label} href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined}>
                  <Button variant={link.variant} size="default" className="font-mono text-xs gap-2">
                    <link.icon size={14} />
                    {link.label}
                    {link.href.startsWith("http") && <ArrowUpRight size={12} />}
                  </Button>
                </Link>
              ))}
            </div>

            <div className="animate-in animate-in-delay-4 mt-16 flex items-center gap-6 text-xs text-ash font-mono">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
                Open to PhD positions
              </span>
              <span className="hidden sm:flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
                Publications in S&P, NeurIPS, CCS
              </span>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
            <ChevronRight size={20} className="text-ash rotate-90" />
          </div>
        </Container>
      </section>

      {/* Featured Research */}
      {publications.length > 0 && (
        <Section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-void via-cyan/[0.01] to-void pointer-events-none" />
          <Container className="relative">
            <div className="flex items-end justify-between mb-12">
              <div>
                <Badge variant="default" className="mb-4 text-xs px-3 py-1">Featured Research</Badge>
                <h2 className="text-3xl md:text-4xl font-bold">
                  <span className="text-gradient">Latest Publications</span>
                </h2>
                <p className="text-mist mt-2 text-sm">Selected papers from top-tier venues</p>
              </div>
              <Link
                href="/research"
                className="hidden md:flex items-center gap-1.5 text-sm text-cyan hover:text-cyan-deep transition-colors font-mono group"
              >
                View all research
                <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {publications.map((pub, i) => (
                <div key={pub.id} className="animate-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <PublicationCard publication={pub} />
                </div>
              ))}
            </div>
            <div className="mt-8 text-center md:hidden">
              <Link href="/research">
                <Button variant="outline" size="sm" className="font-mono text-xs gap-1.5">
                  View all research <ArrowUpRight size={10} />
                </Button>
              </Link>
            </div>
          </Container>
        </Section>
      )}

      {/* Featured Projects */}
      {projects.length > 0 && (
        <Section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-void via-indigo/[0.01] to-void pointer-events-none" />
          <Container className="relative">
            <div className="flex items-end justify-between mb-12">
              <div>
                <Badge variant="secondary" className="mb-4 text-xs px-3 py-1">Engineering</Badge>
                <h2 className="text-3xl md:text-4xl font-bold">
                  <span className="text-gradient">Featured Projects</span>
                </h2>
                <p className="text-mist mt-2 text-sm">System design case studies with real impact</p>
              </div>
              <Link
                href="/projects"
                className="hidden md:flex items-center gap-1.5 text-sm text-indigo hover:text-indigo/80 transition-colors font-mono group"
              >
                View all projects
                <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, i) => (
                <div key={project.id} className="animate-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
            <div className="mt-8 text-center md:hidden">
              <Link href="/projects">
                <Button variant="outline" size="sm" className="font-mono text-xs gap-1.5">
                  View all projects <ArrowUpRight size={10} />
                </Button>
              </Link>
            </div>
          </Container>
        </Section>
      )}

      {/* Skills */}
      {skillCategories.length > 0 && (
        <Section className="relative">
          <Container>
            <div className="mb-12">
              <Badge variant="default" className="mb-4 text-xs px-3 py-1">Expertise</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="text-gradient">Skills & Technologies</span>
              </h2>
              <p className="text-mist mt-2 text-sm">Deep expertise across blockchain, ML, and security domains</p>
            </div>
            <div className="animate-in">
              <SkillCluster categories={skillCategories} />
            </div>
          </Container>
        </Section>
      )}
    </>
  )
}
