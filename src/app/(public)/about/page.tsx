import { Container, Section } from "@/components/layout/container"
import { Badge } from "@/components/ui/badge"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { ABOUT_STORY_SECTIONS, SHORT_TRANSITION } from "@/content/research-profile"
import { getSiteSetting } from "@/lib/public-data"
import { canonicalPath } from "@/lib/site/metadata"
import { ArrowUpRight, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "About",
  description: "My path from cryptography and blockchain systems to the security of tool-using AI agents.",
  alternates: canonicalPath("/about"),
}

export default async function AboutPage() {
  const photo = (await getSiteSetting("profile_photo")) ?? { url: "/about/now.jpg", alt: "Parsa Oryani" }

  return (
    <Section className="pt-32">
      <Container>
        <ScrollReveal>
          <Badge variant="default" size="lg" className="mb-5">
            <Sparkles size={12} className="mr-1.5" /> About
          </Badge>
          <h1 className="mb-5 text-4xl font-bold md:text-5xl">
            <span className="text-gradient">From secure protocols to secure agents</span>
          </h1>
          <p className="mb-12 max-w-3xl text-lg leading-relaxed text-mist">{SHORT_TRANSITION}</p>
        </ScrollReveal>

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
          <ScrollReveal>
            <div className="space-y-8 border-l border-slate-800/80 pl-5 sm:pl-7">
              {ABOUT_STORY_SECTIONS.map((section) => (
                <section key={section.title} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[27px] top-1.5 h-2 w-2 rounded-full bg-cyan shadow-[0_0_18px_rgba(56,225,196,0.55)] sm:-left-[35px]"
                  />
                  <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-cyan">{section.title}</h2>
                  <div className="space-y-3 leading-relaxed text-mist">
                    {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-5 font-mono text-sm">
              <Link href="/research" className="inline-flex items-center gap-1.5 text-cyan hover:text-cyan-deep">
                View current research <ArrowUpRight size={12} />
              </Link>
              <Link href="/experience" className="inline-flex items-center gap-1.5 text-mist hover:text-cyan">
                Experience &amp; education <ArrowUpRight size={12} />
              </Link>
            </div>
          </ScrollReveal>

          {photo?.url && (
            <ScrollReveal direction="right" delay={100} className="lg:sticky lg:top-28">
              <figure className="mx-auto max-w-sm lg:max-w-none">
                <div className="relative overflow-hidden rounded-xl border border-cyan/15 shadow-[0_0_50px_-12px_rgba(56,225,196,0.3)]">
                  <Image
                    src={photo.url}
                    alt={photo.alt || "Parsa Oryani"}
                    width={400}
                    height={489}
                    className="h-auto w-full object-cover"
                    priority
                  />
                </div>
                <figcaption className="mt-4 border-l border-cyan/30 pl-4">
                  <p className="text-sm font-medium text-fog">Parsa Oryani</p>
                  <p className="mt-1 font-mono text-xs text-ash">Secure Computing, Sharif University of Technology</p>
                </figcaption>
              </figure>
            </ScrollReveal>
          )}
        </div>
      </Container>
    </Section>
  )
}
