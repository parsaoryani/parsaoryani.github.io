import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/container"
import { PublicationCard } from "@/components/content/publication-card"
import { Badge } from "@/components/ui/badge"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { getAllPublications } from "@/lib/db/queries"
import { safeQuery, QueryErrorFallback } from "@/lib/db/query-result"
import type { Metadata } from "next"
import { BookOpen, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "Research",
  description: "Research agenda and publications in blockchain security, cross-chain interoperability, and applied cryptography.",
}

export default async function ResearchPage() {
  const result = await safeQuery(getAllPublications(), "publications")
  const publications = result.data ?? []

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
            <Badge variant="default" size="lg" className="mb-5">
              <Sparkles size={12} className="mr-1.5" /> Publications
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient">Research</span>
            </h1>
            <p className="text-lg text-mist leading-relaxed">
              My research interests lie at the intersection of systems security, applied cryptography, and
              distributed systems. I am particularly interested in the security and scalability of blockchain
              and Layer-2 protocols, including cross-chain interoperability, cross-rollup communication, state
              verification, and protocol-level security.
            </p>
            <p className="text-lg text-mist leading-relaxed mt-4">
              More broadly, I am interested in cryptographic and formal techniques for building secure
              decentralized systems, including zero-knowledge proofs and formal verification.
            </p>
          </div>
        </ScrollReveal>

        {result.error && (
          <QueryErrorFallback error={result.error} className="mb-8" />
        )}

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
            <p className="text-mist font-mono text-sm">Research updates will appear here. In the meantime, view my research experience.</p>
          </div>
        )}
      </Container>
    </Section>
  )
}
