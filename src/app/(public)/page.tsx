import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/container"
import { PublicationCard } from "@/components/content/publication-card"
import { ProjectCard } from "@/components/content/project-card"
import { SkillCluster } from "@/components/content/skill-cluster"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SectionHeader } from "@/components/ui/section-header"
import { FloatingParticles } from "@/components/ui/floating-particles"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { TypewriterText } from "@/components/ui/typewriter"
import { getFeaturedPublications, getFeaturedProjects, getSkillCategories, getLatestResearchExperience, getLatestTeachingExperience } from "@/lib/db/queries"
import { safeQuery, QueryErrorFallback } from "@/lib/db/query-result"
import { prisma } from "@/lib/db/prisma"
import { parseHomeDescription, parseHomeTitle } from "@/lib/home/hero"
import Link from "next/link"
import { Fragment } from "react"
import { ArrowUpRight, FileText, Code2, Mail, GraduationCap, ChevronRight, Sparkles } from "lucide-react"
import type { Publication, ResearchingAssistant, TeachingAssistant, Project, PublicationTag, Tag, ProjectTag } from "@prisma/client"

type PublicationWithTags = Publication & { tags: (PublicationTag & { tag: Tag })[] }
type ProjectWithTags = Project & { tags: (ProjectTag & { tag: Tag })[] }

export const revalidate = 3600

export default async function HomePage() {
  const [publications, projects, skillCategories, homeTitle, homeDescription, latestResearch, latestTeaching] = await Promise.all([
    safeQuery(getFeaturedPublications(), "featured publications"),
    safeQuery(getFeaturedProjects(), "featured projects"),
    safeQuery(getSkillCategories(), "skill categories"),
    prisma.siteSetting.findUnique({ where: { key: "home_title" } }),
    prisma.siteSetting.findUnique({ where: { key: "home_description" } }),
    safeQuery(getLatestResearchExperience(), "latest research experience"),
    safeQuery(getLatestTeachingExperience(), "latest teaching experience"),
  ])

  const titleLines = parseHomeTitle(homeTitle?.value)
  const description = parseHomeDescription(homeDescription?.value)

  const pubData = publications.data ?? []
  const projData = projects.data ?? []
  const skillData = skillCategories.data ?? []
  const researchData = latestResearch.data
  const teachingData = latestTeaching.data
  const hasLoadError = publications.error || projects.error || skillCategories.error

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

            <p className="text-lg md:text-xl text-mist leading-relaxed max-w-2xl mb-10 min-h-[2em]">
              <TypewriterText
                speed={24}
                startDelay={1000}
                segments={[
                  { text: description },
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
              <Link href="mailto:parsa.oryani82@sharif.edu">
                <Button variant="secondary" size="lg" className="font-mono text-xs gap-2">
                  <Mail size={14} />
                  Email me
                </Button>
              </Link>
              <div className="w-px h-6 bg-slate-700 mx-1 hidden sm:block" />
              <Link href="https://scholar.google.com" target="_blank">
                <Button variant="outline" size="default" className="font-mono text-xs gap-2">
                  <GraduationCap size={14} />
                  Scholar
                  <ArrowUpRight size={12} />
                </Button>
              </Link>
              <Link href="https://github.com/parsaoryani" target="_blank">
                <Button variant="outline" size="default" className="font-mono text-xs gap-2">
                  <Code2 size={14} />
                  GitHub
                  <ArrowUpRight size={12} />
                </Button>
              </Link>
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

      {/* Load Error Banner */}
      {hasLoadError && (
        <Section>
          <Container>
            <QueryErrorFallback error="Some content could not be loaded. The page may be incomplete." />
          </Container>
        </Section>
      )}

      {/* Featured Research */}
      {pubData.length > 0 && (
        <Section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-void via-cyan/[0.01] to-void pointer-events-none" />
          <Container className="relative">
            <ScrollReveal>
              <SectionHeader
                badge={<Badge variant="default">Featured Research</Badge>}
                title="Latest Publications"
                accent="cyan"
                description="Selected papers from top-tier venues"
                action={
                  <Link href="/research" className="hidden md:flex items-center gap-1.5 text-sm text-cyan hover:text-cyan-deep transition-colors font-mono group">
                    View all research
                    <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                }
              />
            </ScrollReveal>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pubData.map((pub: PublicationWithTags, i: number) => (
                <ScrollReveal key={pub.id} direction="up" delay={i * 100} className="h-full">
                  <PublicationCard publication={pub} />
                </ScrollReveal>
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

      {/* Selected Experience */}
      {(researchData || teachingData) && (
        <Section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-void via-emerald/[0.01] to-void pointer-events-none" />
          <Container className="relative">
            <ScrollReveal>
              <SectionHeader
                badge={<Badge variant="success"><Sparkles size={12} className="mr-1.5" /> Experience</Badge>}
                title="Selected Experience"
                accent="emerald"
                description="Recent research and teaching roles"
                action={
                  <Link href="/research-assistance" className="hidden md:flex items-center gap-1.5 text-sm text-emerald hover:text-emerald/80 transition-colors font-mono group">
                    View all experience
                    <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                }
              />
            </ScrollReveal>
            <div className="grid gap-6 md:grid-cols-2">
              {researchData && (
                <ScrollReveal key={researchData.id} direction="up" className="h-full">
                  <article className="h-full p-6 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-800/30 backdrop-blur-sm hover:border-emerald/30 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-500">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-full bg-emerald/5 border border-emerald/10 text-emerald group-hover:bg-emerald/10 group-hover:border-emerald/20 transition-colors">
                        <span className="font-mono text-[10px] font-medium uppercase tracking-wider">Research Experience</span>
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold leading-snug mb-2 group-hover:text-emerald transition-colors duration-300">
                      {researchData.topic}
                    </h3>
                    <p className="text-sm text-mist mb-3 flex-1">
                      {researchData.lab}, {researchData.university}
                    </p>
                    <p className="font-mono text-xs text-ash mb-4">
                      {new Date(researchData.startDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}{" "}
                      {researchData.endDate
                        ? `— ${new Date(researchData.endDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}`
                        : "— Present"}
                    </p>
                    {researchData.outcomes && (
                      <p className="text-sm text-mist/80 mb-4 line-clamp-2 leading-relaxed">
                        {String(researchData.outcomes)}
                      </p>
                    )}
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-700/50">
                      <Link
                        href="/research-assistance"
                        className="flex items-center gap-1 text-xs text-emerald hover:text-emerald-deep transition-colors font-mono"
                      >
                        View all <ArrowUpRight size={10} />
                      </Link>
                    </div>
                  </article>
                </ScrollReveal>
              )}
              {teachingData && (
                <ScrollReveal key={teachingData.id} direction="up" delay={100} className="h-full">
                  <article className="h-full p-6 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-800/30 backdrop-blur-sm hover:border-amber/30 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-500">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-full bg-amber/5 border border-amber/10 text-amber group-hover:bg-amber/10 group-hover:border-amber/20 transition-colors">
                        <span className="font-mono text-[10px] font-medium uppercase tracking-wider">Teaching Experience</span>
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold leading-snug mb-2 group-hover:text-amber transition-colors duration-300">
                      {teachingData.course}
                    </h3>
                    <p className="text-sm text-mist mb-3 flex-1">
                      {teachingData.university}
                    </p>
                    <p className="font-mono text-xs text-ash mb-4">
                      {new Date(teachingData.startDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}{" "}
                      {teachingData.endDate
                        ? `— ${new Date(teachingData.endDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}`
                        : "— Present"}
                    </p>
                    {teachingData.highlights && (
                      <p className="text-sm text-mist/80 mb-4 line-clamp-2 leading-relaxed">
                        {String(teachingData.highlights)}
                      </p>
                    )}
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-700/50">
                      <Link
                        href="/teaching"
                        className="flex items-center gap-1 text-xs text-amber hover:text-amber-deep transition-colors font-mono"
                      >
                        View all <ArrowUpRight size={10} />
                      </Link>
                    </div>
                  </article>
                </ScrollReveal>
              )}
            </div>
            <div className="mt-8 text-center md:hidden">
              <Link href="/research-assistance">
                <Button variant="outline" size="sm" className="font-mono text-xs gap-1.5">
                  View all experience <ArrowUpRight size={10} />
                </Button>
              </Link>
            </div>
          </Container>
        </Section>
      )}

      {/* Featured Projects */}
      {projData.length > 0 && (
        <Section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-void via-indigo/[0.01] to-void pointer-events-none" />
          <Container className="relative">
            <ScrollReveal>
              <SectionHeader
                badge={<Badge variant="secondary">Engineering</Badge>}
                title="Featured Projects"
                accent="indigo"
                description="System design case studies with real impact"
                action={
                  <Link href="/projects" className="hidden md:flex items-center gap-1.5 text-sm text-indigo hover:text-indigo/80 transition-colors font-mono group">
                    View all projects
                    <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                }
              />
            </ScrollReveal>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projData.map((project: ProjectWithTags, i: number) => (
                <ScrollReveal key={project.id} direction="up" delay={i * 100} className="h-full">
                  <ProjectCard project={project} />
                </ScrollReveal>
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
      {skillData.length > 0 && (
        <Section className="relative">
          <Container>
            <ScrollReveal>
              <SectionHeader
                badge={<Badge variant="default">Expertise</Badge>}
                title="Skills & Technologies"
                accent="cyan"
                description="Deep expertise across blockchain, ML, and security domains"
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
                  M.Sc. Computer Engineering at Sharif University of Technology, researching the intersection of security, privacy, and machine learning.
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
                Open to PhD positions, research collaborations, and interesting problems in security and ML.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="mailto:parsa.oryani82@sharif.edu">
                  <Button variant="default" size="lg" className="font-mono text-xs gap-2">
                    <Mail size={14} /> Email me
                  </Button>
                </Link>
                <Link href="https://scholar.google.com" target="_blank">
                  <Button variant="secondary" size="default" className="font-mono text-xs gap-2">
                    <GraduationCap size={14} /> Google Scholar
                  </Button>
                </Link>
                <Link href="https://github.com/parsaoryani" target="_blank">
                  <Button variant="secondary" size="default" className="font-mono text-xs gap-2">
                    <Code2 size={14} /> GitHub
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
