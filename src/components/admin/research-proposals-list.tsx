import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils/cn"
import { proposalKindLabels } from "@/lib/validation/research-portfolio"

type Proposal = {
  id: string
  title: string
  kind: keyof typeof proposalKindLabels
  versionLabel: string
  status: "draft" | "published"
  updatedAt: Date
}

export function ResearchProposalsList({ proposals, base }: { proposals: Proposal[]; base: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] p-5">
        <div><h2 className="font-semibold">Selected Proposals</h2><p className="mt-1 text-xs text-[var(--text-secondary)]">Only published records appear publicly.</p></div>
        <Link href={`${base}/research-portfolio/proposals/new`} className={cn(buttonVariants({ size: "sm" }))}>New proposal</Link>
      </div>
      {proposals.length === 0 ? (
        <p className="p-8 text-center text-sm text-[var(--text-secondary)]">No proposals yet.</p>
      ) : (
        <div className="divide-y divide-[var(--border)]">
          {proposals.map((proposal) => (
            <Link key={proposal.id} href={`${base}/research-portfolio/proposals/${proposal.id}`} className="flex items-center justify-between gap-4 p-5 hover:bg-slate-800/30">
              <div><p className="font-medium">{proposal.title}</p><p className="mt-1 text-xs text-[var(--text-secondary)]">{proposalKindLabels[proposal.kind]} · {proposal.versionLabel}</p></div>
              <Badge variant={proposal.status === "published" ? "success" : "outline"}>{proposal.status}</Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
