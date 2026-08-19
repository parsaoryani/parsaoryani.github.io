import { Container, Section } from "@/components/layout/container"
import { TechnicalFoundations } from "@/components/content/technical-foundations"
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
  description: "Biography, skills, and background.",
}

export default async function AboutPage() {
  const photoSetting = await prisma.siteSetting.findUnique({ where: { key: "profile_photo" } })
  const photo = photoSetting?.value as { url?: string; alt?: string } | null

  return (
    <Section className="pt-32">
      <Container>
        <ScrollReveal>
          <div className="max-w-4xl mb-16">
            <Badge variant="default" size="lg" className="mb-5">
              <Sparkles size={12} className="mr-1.5" /> Background
            </Badge>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {photo?.url && (
                <div className="shrink-0">
                  <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border-2 border-slate-700/50 bg-slate-800/50 border-glow">
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
                    I am an M.Sc. student in Computer Engineering at Sharif University of Technology, with a
                    focus on secure computing. My main research interests are systems security, applied
                    cryptography, and distributed systems, particularly their application to blockchain and
                    decentralized systems.
                  </p>
                  <p>
                    My current interests focus on the security and scalability of cross-chain and Layer-2
                    protocols, including interoperability, cross-rollup communication and execution, efficient
                    state verification, and blockchain protocol security.
                  </p>
                  <p>
                    I am also interested in zero-knowledge proofs, formal methods, and other cryptographic
                    techniques for building secure decentralized systems. Alongside my research interests, I
                    have practical experience developing blockchain systems and smart contracts on Ethereum
                    and Solana.
                  </p>
                  <p>
                    I am interested in research collaborations, internships, and future PhD opportunities in
                    security, cryptography, blockchain, and distributed systems.
                  </p>
                </div>
                <Link
                  href="/experience"
                  className="inline-flex items-center gap-1.5 mt-6 text-sm text-cyan hover:text-cyan-deep transition-colors font-mono"
                >
                  View my full experience &amp; education timeline <ArrowUpRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>

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
