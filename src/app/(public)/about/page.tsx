import { Container, Section } from "@/components/layout/container"
import { TechnicalFoundations } from "@/components/content/technical-foundations"
import { ViewportVideo } from "@/components/content/viewport-video"
import { Badge } from "@/components/ui/badge"
import { SectionHeader } from "@/components/ui/section-header"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { prisma } from "@/lib/db/prisma"
import { Sparkles, ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "About",
  description: "A little about me — academic journey, background, and skills.",
}

export default async function AboutPage() {
  const photoSetting = await prisma.siteSetting.findUnique({ where: { key: "profile_photo" } })
  const photo = (photoSetting?.value as { url?: string; alt?: string } | null) ?? { url: "/about/now.jpg", alt: "Parsa Oryani" }

  return (
    <Section className="pt-32">
      <Container>
        {/* Part 1 — Present / Introduction */}
        <div className="grid md:grid-cols-[1fr_360px] lg:grid-cols-[1fr_400px] gap-10 lg:gap-16 items-start mb-24">
          <ScrollReveal>
            <Badge variant="default" size="lg" className="mb-5">
              <Sparkles size={12} className="mr-1.5" /> About
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="text-gradient">A little about me</span>
            </h1>
            <div className="space-y-4 text-mist leading-relaxed mt-6">
              <p>
                I was born and raised in Tehran, Iran. My journey in computer science began with a curiosity
                about how complex systems work — and gradually evolved into a deeper interest in how they can be
                made secure, reliable, and scalable.
              </p>
              <p>
                I studied Computer Science at Amirkabir University of Technology (Tehran Polytechnic), where I
                built a strong foundation in algorithms, software, and computational problem solving. Over time,
                my interests moved increasingly toward security, cryptography, blockchain, and decentralized
                systems.
              </p>
              <p>
                Today, I am pursuing an M.Sc. in Computer Engineering, specializing in Secure Computing, at
                Sharif University of Technology. I am especially drawn to problems where security guarantees,
                protocol design, and real system behavior meet.
              </p>
              <p>
                Alongside research, I enjoy building systems and working close to implementation. That
                combination of research and engineering continues to shape the kinds of problems I want to
                explore.
              </p>
            </div>
            <Link
              href="/experience"
              className="inline-flex items-center gap-1.5 mt-6 text-sm text-cyan hover:text-cyan-deep transition-colors font-mono"
            >
              View my experience &amp; education <ArrowUpRight size={12} />
            </Link>
          </ScrollReveal>

          {photo?.url && (
            <ScrollReveal direction="right" delay={100}>
              <figure>
                <div className="relative rounded-2xl overflow-hidden border border-cyan/15 shadow-[0_0_50px_-12px_rgba(56,225,196,0.3)]">
                  <Image
                    src={photo.url}
                    alt={photo.alt || "Parsa Oryani"}
                    width={400}
                    height={489}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
              </figure>
            </ScrollReveal>
          )}
        </div>

        {/* Part 2 — Journey / Visual Story */}
        <div className="mb-24">
          <ScrollReveal>
            <p className="text-xs font-mono uppercase tracking-widest text-cyan mb-8">Along the way</p>
          </ScrollReveal>

          <ScrollReveal direction="up" className="max-w-sm mx-auto">
            <figure className="group">
              <div className="relative rounded-xl overflow-hidden border border-slate-700/50 aspect-[3/4]">
                <Image
                  src="/about/graduation.jpg"
                  alt="Parsa Oryani at his B.Sc. graduation at Amirkabir University of Technology"
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <figcaption className="mt-3">
                <p className="text-sm text-fog font-medium">B.Sc. Graduation</p>
                <p className="text-xs text-ash font-mono">Amirkabir University of Technology (Tehran Polytechnic)</p>
                <p className="text-xs text-mist/70 mt-1">A milestone, not the finish line.</p>
              </figcaption>
            </figure>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100} className="max-w-2xl mx-auto text-center my-14">
            <p className="text-mist leading-relaxed">
              Graduation marked the end of one important chapter, but also the beginning of a deeper journey
              into research, systems, and security.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200} className="max-w-3xl mx-auto">
            <figure>
              <div className="relative rounded-xl overflow-hidden border border-slate-700/50 aspect-[16/9]">
                <ViewportVideo
                  src="/about/graduation.mp4"
                  poster="/about/graduation-poster.jpg"
                  ariaLabel="Graduates celebrating and throwing their graduation caps"
                  className="absolute inset-0"
                />
              </div>
              <figcaption className="mt-3 text-sm text-fog font-medium">
                Closing one chapter. Starting the next.
              </figcaption>
            </figure>
          </ScrollReveal>
        </div>

        <div id="skills">
          <ScrollReveal direction="up">
            <SectionHeader
              title="Skills"
              accent="cyan"
            />
            <TechnicalFoundations />
          </ScrollReveal>
        </div>
      </Container>
    </Section>
  )
}
