import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ResearchProposalCard } from "./research-proposal-card"
import type { PublicResearchProposal } from "@/lib/public-data"

const proposal: PublicResearchProposal = {
  id: "proposal-1",
  slug: "secure-agent-memory",
  title: "Secure Agent Memory",
  kind: "research_proposal",
  stage: "in_preparation",
  year: 2026,
  versionLabel: "v0.1",
  summary: "A proposal about protecting persistent agent memory.",
  themes: ["Agent security", "Memory"],
  motivation: null,
  researchQuestion: null,
  approach: null,
  expectedContributions: null,
  limitations: null,
  pdfUrl: "/research/proposals/secure-agent-memory-v0.1.pdf",
  featured: true,
  sortOrder: 0,
  updatedAt: new Date("2026-10-28T00:00:00.000Z"),
}

describe("ResearchProposalCard", () => {
  it("presents a proposal as a versioned research plan", () => {
    render(<ResearchProposalCard proposal={proposal} />)

    expect(screen.getByText("Research Proposal")).toBeInTheDocument()
    expect(screen.getByText("In preparation")).toBeInTheDocument()
    expect(screen.getByText(/v0.1/)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /View proposal details/i })).toHaveAttribute(
      "href",
      "/research/proposals/secure-agent-memory"
    )
    expect(screen.getByRole("link", { name: /Sanitized public PDF/i })).toHaveAttribute(
      "href",
      proposal.pdfUrl
    )
  })

  it("omits the PDF action when there is no public document", () => {
    render(<ResearchProposalCard proposal={{ ...proposal, pdfUrl: null }} />)
    expect(screen.queryByRole("link", { name: /Sanitized public PDF/i })).not.toBeInTheDocument()
  })
})
