import { Container, Section } from "@/components/layout/container"
import { TechnicalFoundations } from "@/components/content/technical-foundations"
import { ViewportVideo } from "@/components/content/viewport-video"
import { Badge } from "@/components/ui/badge"
import { SectionHeader } from "@/components/ui/section-header"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { getSiteSetting } from "@/lib/public-data"
import { Sparkles, ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "About",
  description: "A little about me — academic journey, background, and skills.",
}

const aboutStorySections = [
  {
    title: "Early Interests",
    body: [
      "My interest in problem solving started with mathematics. Studying mathematics in high school shaped the analytical way I approach complex problems and later influenced my decision to study computer science.",
    ],
  },
  {
    title: "Financial Markets",
    body: [
      "Through my family background, I was introduced to financial markets relatively early. I started with the stock market and later explored cryptocurrencies and foreign exchange, including a period of active trading.",
      "That experience made me curious not only about markets themselves, but also about the systems behind them — how value is transferred, how trust is established, and how digital financial infrastructure can operate securely.",
    ],
  },
  {
    title: "Computer Science",
    body: [
      "I studied Computer Science at Amirkabir University of Technology (Tehran Polytechnic), where I developed a strong foundation in algorithms, software development, and computational problem solving.",
      "Over time, my interests gradually shifted toward security, cryptography, distributed systems, and the foundations of trustworthy computing.",
    ],
  },
  {
    title: "Discovering Cryptography",
    body: [
      "During my undergraduate studies, I took two graduate-level cryptography courses:",
    ],
    list: ["Cryptography I", "Special Topics in Cryptography"],
    after: [
      "These courses became an important turning point in my academic path. I earned the highest grade in both courses, and the experience significantly strengthened my interest in cryptographic protocols and security research.",
    ],
  },
  {
    title: "Why Blockchain",
    body: [
      "My interests in cryptography and financial systems naturally converged in blockchain.",
      "What initially attracted me was the idea that cryptographic mechanisms and distributed protocols could be used to build systems where security, ownership, and value transfer do not depend entirely on a central authority.",
      "That interest gradually evolved from cryptocurrencies themselves toward deeper questions around protocol security, scalability, interoperability, and decentralized infrastructure.",
    ],
  },
  {
    title: "Current Research",
    body: [
      "I am currently pursuing an M.Sc. in Computer Engineering, specializing in Secure Computing, at Sharif University of Technology.",
      "My current research interests center on the security and scalability of decentralized systems, particularly blockchain protocol security, cross-chain and Layer-2 systems, interoperability, and cryptographic mechanisms for secure distributed protocols.",
    ],
  },
  {
    title: "Research & Engineering",
    body: [
      "Alongside research, I enjoy building and experimenting with real systems. My experience in blockchain and software engineering allows me to approach research questions from both theoretical and implementation perspectives.",
      "I am especially interested in problems where security guarantees, protocol design, and real system behavior meet.",
    ],
  },
]

export default async function AboutPage() {
  const photo = (await getSiteSetting("profile_photo")) ?? { url: "/about/now.jpg", alt: "Parsa Oryani" }

  return (
    <Section className="pt-32">
      <Container>
        {/* Part 1 — Background / Research path */}
        <ScrollReveal>
          <Badge variant="default" size="lg" className="mb-5">
            <Sparkles size={12} className="mr-1.5" /> About
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-10">
            <span className="text-gradient">A little about me</span>
          </h1>
        </ScrollReveal>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_430px] gap-10 lg:gap-16 items-start mb-24">
          <ScrollReveal>
            <div className="space-y-7 border-l border-slate-800/80 pl-5 sm:pl-7">
              {aboutStorySections.map((section) => (
                <section key={section.title} className="relative">
                  <span className="absolute -left-[27px] sm:-left-[35px] top-1.5 h-2 w-2 rounded-full bg-cyan shadow-[0_0_18px_rgba(56,225,196,0.55)]" />
                  <h2 className="font-mono text-xs uppercase tracking-widest text-cyan mb-3">
                    {section.title}
                  </h2>
                  <div className="space-y-3 text-mist leading-relaxed">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {section.list && (
                      <ul className="grid gap-2 sm:grid-cols-2">
                        {section.list.map((item) => (
                          <li
                            key={item}
                            className="rounded-lg border border-cyan/15 bg-cyan/[0.04] px-3 py-2 text-sm font-mono text-fog"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    {section.after?.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
            <Link
              href="/experience"
              className="inline-flex items-center gap-1.5 mt-8 text-sm text-cyan hover:text-cyan-deep transition-colors font-mono"
            >
              View my experience &amp; education <ArrowUpRight size={12} />
            </Link>
          </ScrollReveal>

          {photo?.url && (
            <ScrollReveal direction="right" delay={100} className="order-first lg:order-none lg:sticky lg:top-28">
              <figure className="max-w-sm mx-auto lg:max-w-none">
                <div className="relative rounded-xl overflow-hidden border border-cyan/15 shadow-[0_0_50px_-12px_rgba(56,225,196,0.3)]">
                  <Image
                    src={photo.url}
                    alt={photo.alt || "Parsa Oryani"}
                    width={400}
                    height={489}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
                <figcaption className="mt-4 border-l border-cyan/30 pl-4">
                  <p className="text-sm text-fog font-medium">Parsa Oryani</p>
                  <p className="text-xs text-ash font-mono mt-1">
                    Secure Computing, Sharif University of Technology
                  </p>
                </figcaption>
              </figure>
            </ScrollReveal>
          )}
        </div>

        {/* Part 2 — Journey / Visual Story */}
        <div className="mb-24">
          <ScrollReveal>
            <p className="text-xs font-mono uppercase tracking-widest text-cyan mb-8">Along the way</p>
          </ScrollReveal>

          {/* B.Sc. Graduation */}
          <ScrollReveal direction="up" className="max-w-sm mx-auto">
            <figure className="group">
              <div className="relative rounded-xl overflow-hidden border border-slate-700/50 aspect-[3/4]">
                <Image
                  src="/about/graduation.jpg"
                  alt="Parsa Oryani at his B.Sc. graduation at Amirkabir University of Technology"
                  fill
                  loading="lazy"
                  sizes="(min-width: 640px) 384px, calc(100vw - 48px)"
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

          {/* Graduation Video + Quote */}
          <ScrollReveal direction="up" delay={150} className="max-w-3xl mx-auto">
            <div className="space-y-4">
              <figure className="relative rounded-xl overflow-hidden border border-slate-700/50 aspect-[16/9]">
                <ViewportVideo
                  src="/about/graduation.mp4"
                  poster="/about/graduation-poster.jpg"
                  ariaLabel="Graduates celebrating and throwing their graduation caps"
                  className="absolute inset-0"
                />
              </figure>
              <figcaption className="mt-3 text-center text-mist leading-relaxed">
                <p className="text-sm text-fog font-medium">Closing one chapter. Starting the next.</p>
                <p className="text-xs text-mist/70 mt-1">
                  Graduation marked the end of one important chapter, but also the beginning of a deeper journey
                  into research, systems, and security.
                </p>
              </figcaption>
            </div>
          </ScrollReveal>

          {/* THE NEXT STEP: GRADUATE STUDIES */}
          <ScrollReveal direction="up" delay={200} className="max-w-3xl mx-auto">
            <div className="space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-widest text-cyan">THE NEXT STEP: GRADUATE STUDIES</h3>
              <div className="space-y-3 text-mist leading-relaxed">
                <p>
                  After completing my B.Sc. at Amirkabir University of Technology, I decided to pursue deeper
                  research. My goal was to work on blockchain security and decentralized systems — areas where
                  cryptographic rigor meets real-world protocol design.
                </p>
                <p>
                  I prepared for the national M.Sc. Computer Engineering entrance exam for around three months.
                  With approximately 18,000 participants, I achieved rank 16. This led me to pursue an M.Sc. in
                  Secure Computing at Sharif University of Technology.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* ENTERING RESEARCH */}
          <ScrollReveal direction="up" delay={250} className="max-w-3xl mx-auto">
            <div className="space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-widest text-cyan">ENTERING RESEARCH</h3>
              <div className="space-y-3 text-mist leading-relaxed">
                <p>
                  During my M.Sc., my focus became more research-oriented. My current interests span:
                </p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  <li className="rounded-lg border border-cyan/15 bg-cyan/[0.04] px-3 py-2 text-sm font-mono text-fog">
                    Blockchain security
                  </li>
                  <li className="rounded-lg border border-cyan/15 bg-cyan/[0.04] px-3 py-2 text-sm font-mono text-fog">
                    Cryptography
                  </li>
                  <li className="rounded-lg border border-cyan/15 bg-cyan/[0.04] px-3 py-2 text-sm font-mono text-fog">
                    Distributed systems
                  </li>
                  <li className="rounded-lg border border-cyan/15 bg-cyan/[0.04] px-3 py-2 text-sm font-mono text-fog">
                    Cross-chain interoperability
                  </li>
                  <li className="rounded-lg border border-cyan/15 bg-cyan/[0.04] px-3 py-2 text-sm font-mono text-fog">
                    Layer-2 scalability
                  </li>
                </ul>
                <p>
                  I emphasize both theoretical research and practical system implementation — believing that the
                  most impactful work emerges when security guarantees, protocol design, and real system behavior
                  meet.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* CURRENT FOCUS */}
          <ScrollReveal direction="up" delay={300} className="max-w-3xl mx-auto">
            <div className="space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-widest text-cyan">CURRENT FOCUS</h3>
              <div className="space-y-3 text-mist leading-relaxed">
                <p>
                  My current priority is research collaboration with researchers in related fields. I am actively
                  seeking academic collaborations, research projects, and opportunities to contribute to impactful
                  work in blockchain security, cryptography, and decentralized systems.
                </p>
              </div>
            </div>
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
