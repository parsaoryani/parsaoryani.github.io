import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Code2, ExternalLink, Quote, ArrowUpRight, BookOpen } from "lucide-react"
import type { Publication, PublicationTag, Tag } from "@prisma/client"
import { cn } from "@/lib/utils/cn"
import { memo } from "react"

interface PublicationCardProps {
  publication: Publication & { tags: (PublicationTag & { tag: Tag })[] }
  showAbstract?: boolean
}

const venueLabels: Record<string, string> = {
  conference: "Conference",
  journal: "Journal",
  workshop: "Workshop",
  preprint: "Preprint",
  poster: "Poster",
  talk: "Talk",
  thesis: "Thesis",
}

export const PublicationCard = memo(function PublicationCard({ publication, showAbstract }: PublicationCardProps) {
  const authors = publication.authors as Array<{ name: string; isMe?: boolean }>

  return (
    <Link href={`/research/${publication.slug}`} className="block group">
      <Card glow className="h-full">
        <CardContent className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan/5 border border-cyan/10 text-cyan">
              <BookOpen size={11} />
              <span className="font-mono text-[10px] font-medium uppercase tracking-wider">
                {venueLabels[publication.venueType] || publication.venueType}
              </span>
            </div>
            <span className="font-mono text-xs text-ash">{publication.year}</span>
          </div>

          <h3 className="text-base font-semibold leading-snug mb-2 group-hover:text-cyan transition-colors duration-300">
            {publication.title}
          </h3>

          <p className="text-sm text-mist mb-3 flex-1">
            {authors.map((a, i) => (
              <span key={i}>
                {i > 0 && ", "}
                <span className={cn(a.isMe ? "font-medium text-fog" : "")}>
                  {a.name}
                </span>
              </span>
            ))}
          </p>

          <p className="font-mono text-xs text-ash mb-4">
            {publication.venue}
          </p>

          {showAbstract && publication.tldr && (
            <p className="text-sm text-mist mb-4 line-clamp-2 leading-relaxed">
              {publication.tldr}
            </p>
          )}

          <div className="flex flex-wrap gap-1.5 mb-4">
            {publication.tags.map((pt) => (
              <Badge key={pt.tagId} variant="secondary" className="text-[10px] px-2 py-0.5">
                {pt.tag.label}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-700/50 mt-auto">
            {publication.pdfUrl && (
              <span className="flex items-center gap-1 text-xs text-mist group-hover:text-cyan transition-colors">
                <FileText size={12} /> PDF
              </span>
            )}
            {publication.arxivId && (
              <span className="flex items-center gap-1 text-xs text-mist group-hover:text-cyan transition-colors">
                <ExternalLink size={12} /> arXiv
              </span>
            )}
            {publication.codeUrl && (
              <span className="flex items-center gap-1 text-xs text-mist group-hover:text-cyan transition-colors">
                <Code2 size={12} /> Code
              </span>
            )}
            {publication.bibtex && (
              <span className="flex items-center gap-1 text-xs text-mist group-hover:text-cyan transition-colors">
                <Quote size={12} /> Cite
              </span>
            )}
            <span className="ml-auto text-xs text-ash group-hover:text-cyan transition-colors flex items-center gap-0.5">
              Read <ArrowUpRight size={10} />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
})
