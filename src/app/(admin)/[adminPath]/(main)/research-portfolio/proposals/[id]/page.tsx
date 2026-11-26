import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/prisma"
import { ResearchProposalForm, type ProposalFormValue } from "../../proposal-form"

export default async function EditResearchProposalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const proposal = await prisma.researchProposal.findUnique({ where: { id } })
  if (!proposal || proposal.deletedAt) notFound()
  const initial: ProposalFormValue = {
    ...proposal,
    themes: Array.isArray(proposal.themes) ? proposal.themes.filter((item): item is string => typeof item === "string") : [],
  }
  return <div><h1 className="mb-6 text-2xl font-bold">Edit Research Proposal</h1><ResearchProposalForm initial={initial} /></div>
}
