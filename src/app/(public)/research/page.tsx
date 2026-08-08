import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/container"
import { PublicationCard } from "@/components/content/publication-card"
import { Badge } from "@/components/ui/badge"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { getAllPublications } from "@/lib/db/queries"
import type { Metadata } from "next"
import { BookOpen, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "Research",
  description: "Research agenda and publications in blockchain security, deep learning, and AI safety.",
}

export default async function ResearchPage() {
  const publications: Awaited<ReturnType<typeof getAllPublications>> = await getAllPublications().catch(() => [])

  const groupedByYear = publications.reduce<Record<number, typeof publications>>((acc, pub) => {
    if (!acc[pub.year]) acc[pub.year] = []
    acc[pub.year]!.push(pub)
    return acc
  }, {})

  const years = Object.keys(groupedByYear).map(Number).sort((a, b) => b - a)

  return (
    <Section className="pt-32">
      <Container>
        <ScrollReveal>
          <div className="max-w-3xl mb-16">
          <Badge variant="default" className="mb-5 text-xs px-3 py-1">
            <Sparkles size={12} className="mr-1.5" /> Publications
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Research</span>
          </h1>
          <div className="space-y-4">
            <p className="text-lg text-mist leading-relaxed">
              My research agenda centers on the security and reliability of decentralized
              and intelligent systems. I investigate how cryptographic primitives, formal
              verification, and adversarial machine learning can converge to build systems
              that are both autonomous and trustworthy.
            </p>
          </div>
          </div>
        </ScrollReveal>

        {years.map((year) => (
          <ScrollReveal key={year} direction="up" className="mb-16 last:mb-0">
            <div className="flex items-center gap-3 mb-8">
              <span className="font-mono text-sm text-ash">Year</span>
              <h2 className="font-mono text-2xl font-bold text-gradient-accent">{year}</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-700/50 to-transparent" />
              <span className="font-mono text-xs text-ash">{groupedByYear[year]!.length} papers</span>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {groupedByYear[year]!.map((pub, i) => (
                <ScrollReveal key={pub.id} direction="up" delay={i * 80} className="h-full">
                  <PublicationCard publication={pub} showAbstract />
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>
        ))}

        {publications.length === 0 && (
          <div className="text-center py-20">
            <BookOpen size={40} className="mx-auto text-slate-700 mb-4" />
            <p className="text-mist font-mono text-sm">No publications yet. Check back soon.</p>
          </div>
        )}
      </Container>
    </Section>
  )
}
