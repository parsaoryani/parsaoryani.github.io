import { prisma } from "@/lib/db/prisma"
import { AgendaForm } from "./agenda-form"
import { ResearchProposalsList } from "@/components/admin/research-proposals-list"

export default async function ResearchPortfolioAdminPage({ params }: { params: Promise<{ adminPath: string }> }) {
  const { adminPath } = await params
  const [agenda, proposals] = await Promise.all([
    prisma.researchAgenda.findUnique({ where: { id: "primary" } }),
    prisma.researchProposal.findMany({ where: { deletedAt: null }, orderBy: [{ featured: "desc" }, { sortOrder: "asc" }] }),
  ])
  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl font-bold">Research Portfolio</h1><p className="mt-2 text-sm text-[var(--text-secondary)]">Manage the public research agenda and sanitized proposal summaries.</p></div>
      <AgendaForm initial={agenda ? { ...agenda, themes: Array.isArray(agenda.themes) ? agenda.themes.filter((item): item is string => typeof item === "string") : [] } : null} />
      <ResearchProposalsList proposals={proposals} base={`/${adminPath}`} />
    </div>
  )
}
