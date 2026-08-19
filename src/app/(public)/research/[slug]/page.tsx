import { notFound } from "next/navigation"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/container"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getPublicationBySlug, getAllPublications } from "@/lib/db/queries"
import { safeQuery } from "@/lib/db/query-result"
import Link from "next/link"
import { ArrowLeft, FileText, Code2, ExternalLink, BookOpen } from "lucide-react"
import { BibTeXCopy } from "@/components/content/bibtex-copy"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const publications = await getAllPublications()
    return publications.map((pub) => ({ slug: pub.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const result = await safeQuery(getPublicationBySlug(slug), "publication")
  const pub = result.data
  if (!pub) return {}
  return {
    title: pub.title,
    description: pub.tldr || pub.abstract || "",
  }
}

export default async function PublicationPage({ params }: Props) {
  const { slug } = await params
  const result = await safeQuery(getPublicationBySlug(slug), "publication")
  const pub = result.data
  if (!pub) notFound()

  const authors = pub.authors as Array<{ name: string; isMe?: boolean }>
  const contributions = (pub.contributions as Array<{ text: string }> | string[] | null) ?? []

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    name: pub.title,
    author: authors.map((a) => ({ "@type": "Person", name: a.name })),
    datePublished: String(pub.year),
    publisher: pub.venue,
    description: pub.abstract || pub.tldr || "",
    ...(pub.pdfUrl && { url: pub.pdfUrl }),
    ...(pub.doi && { identifier: `https://doi.org/${pub.doi}` }),
    ...(pub.arxivId && { identifier: `https://arxiv.org/abs/${pub.arxivId}` }),
    ...(pub.citationCount && { interactionStatistic: { "@type": "InteractionCounter", interactionType: "https://schema.org/CiteAction", userInteractionCount: pub.citationCount } }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section className="pt-32">
        <Container>
          <Link
            href="/research"
            className="inline-flex items-center gap-1.5 text-sm text-mist hover:text-cyan transition-colors mb-10 font-mono group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Research
          </Link>

          <article className="max-w-3xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan/5 border border-cyan/10 text-cyan">
                <BookOpen size={12} />
                <span className="font-mono text-[10px] font-medium uppercase tracking-wider">{pub.venueType}</span>
              </div>
              <span className="font-mono text-xs text-ash">{pub.year}</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-5 text-gradient">
              {pub.title}
            </h1>

            <p className="text-base text-mist mb-4">
              {authors.map((a, i) => (
                <span key={i}>
                  {i > 0 && ", "}
                  <span className={a.isMe ? "font-semibold text-fog" : ""}>
                    {a.name}
                  </span>
                </span>
              ))}
            </p>

            <p className="font-mono text-sm text-ash mb-8">
              {pub.venue}
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-10">
              {pub.pdfUrl && (
                <Link href={pub.pdfUrl} target="_blank">
                  <Button variant="default" size="sm" className="font-mono text-xs gap-1.5">
                    <FileText size={14} /> PDF
                  </Button>
                </Link>
              )}
              {pub.arxivId && (
                <Link href={`https://arxiv.org/abs/${pub.arxivId}`} target="_blank">
                  <Button variant="secondary" size="sm" className="font-mono text-xs gap-1.5">
                    <ExternalLink size={14} /> arXiv
                  </Button>
                </Link>
              )}
              {pub.codeUrl && (
                <Link href={pub.codeUrl} target="_blank">
                  <Button variant="secondary" size="sm" className="font-mono text-xs gap-1.5">
                    <Code2 size={14} /> Code
                  </Button>
                </Link>
              )}
              {pub.projectUrl && (
                <Link href={pub.projectUrl} target="_blank">
                  <Button variant="secondary" size="sm" className="font-mono text-xs gap-1.5">
                    <ExternalLink size={14} /> Project
                  </Button>
                </Link>
              )}
              {pub.doi && (
                <Link href={`https://doi.org/${pub.doi}`} target="_blank">
                  <Button variant="secondary" size="sm" className="font-mono text-xs gap-1.5">
                    <ExternalLink size={14} /> DOI
                  </Button>
                </Link>
              )}
              {pub.bibtex && (
                <BibTeXCopy bibtex={pub.bibtex} />
              )}
            </div>

            {pub.citationCount && pub.citationCount > 0 && (
              <p className="text-xs text-ash font-mono mb-6">
                Cited by {pub.citationCount} {pub.citationCount === 1 ? "time" : "times"}
              </p>
            )}

            {pub.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                {pub.tags.map((pt) => (
                  <Badge key={pt.tagId} variant="secondary" className="text-xs">
                    {pt.tag.label}
                  </Badge>
                ))}
              </div>
            )}

            {pub.tldr && (
              <div className="relative p-6 rounded-xl border border-cyan/10 bg-gradient-to-br from-cyan/[0.03] to-indigo/[0.03] mb-10">
                <div className="absolute top-0 left-0 w-20 h-20 bg-cyan/5 rounded-full blur-3xl" />
                <p className="relative text-xs font-mono text-cyan mb-2 uppercase tracking-wider">TL;DR</p>
                <p className="relative text-fog leading-relaxed">{pub.tldr}</p>
              </div>
            )}

            {pub.abstract && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4 text-gradient">Abstract</h2>
                <p className="text-mist leading-relaxed">{pub.abstract}</p>
              </div>
            )}

            {contributions.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4 text-gradient">Contributions</h2>
                <ul className="space-y-2">
                  {contributions.map((c, i) => {
                    const text = typeof c === "string" ? c : c.text
                    return (
                      <li key={i} className="flex items-start gap-3 text-mist">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan shrink-0" />
                        <span>{text}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {pub.bibtex && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4 text-gradient">Citation</h2>
                <pre className="relative p-5 rounded-xl bg-slate-900 border border-slate-700/50 overflow-x-auto text-sm font-mono text-mist leading-relaxed">
                  {pub.bibtex}
                </pre>
              </div>
            )}
          </article>
        </Container>
      </Section>
    </>
  )
}