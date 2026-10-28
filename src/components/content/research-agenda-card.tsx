import Link from "next/link"
import { ArrowUpRight, Compass } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import type { PublicResearchAgenda } from "@/lib/public-data"
import { cn } from "@/lib/utils/cn"

export const fallbackResearchAgenda: PublicResearchAgenda = {
  id: "fallback",
  headline: "Secure and Trustworthy Agentic AI",
  summary:
    "I study how tool-using AI agents can be built, updated, and operated securely through provenance, authorization, information-flow control, secure memory, and runtime enforcement.",
  themes: ["Agent Security", "Provenance", "Authorization", "Secure Memory"],
  description:
    "My M.Sc. thesis frames agent security across the full lifecycle of sources, tools, skills, memory, and delegated authority, building on foundations in applied cryptography, formal methods, and distributed systems.",
  documentUrl: null,
  updatedAt: new Date("2026-10-28T00:00:00.000Z"),
}

export function ResearchAgendaCard({ agenda }: { agenda: PublicResearchAgenda }) {
  return (
    <Card glow glowColor="cyan" className="overflow-hidden">
      <CardContent className="relative p-7 md:p-9">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan/5 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-4xl">
          <Badge variant="default" className="mb-4">
            <Compass size={12} aria-hidden="true" className="mr-1.5" /> Research Agenda
          </Badge>
          <h2 className="mb-4 text-2xl font-semibold text-gradient md:text-3xl">{agenda.headline}</h2>
          <p className="mb-4 text-base leading-relaxed text-fog md:text-lg">{agenda.summary}</p>
          {agenda.description && <p className="mb-6 leading-relaxed text-mist">{agenda.description}</p>}
          <div className="mb-6 flex flex-wrap gap-2">
            {agenda.themes.map((theme) => <Badge key={theme} variant="outline">{theme}</Badge>)}
          </div>
          {agenda.documentUrl && (
            <Link
              href={agenda.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "gap-1.5")}
            >
              Read the full agenda <ArrowUpRight size={12} aria-hidden="true" />
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
