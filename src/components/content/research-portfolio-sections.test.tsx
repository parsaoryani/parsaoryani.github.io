import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ResearchPortfolioSections } from "./research-portfolio-sections"
import { fallbackResearchAgenda } from "./research-agenda-card"
import type { PublicResearchProposal } from "@/lib/public-data"

const proposal: PublicResearchProposal = {
  id: "p1",
  slug: "secure-agent-memory",
  title: "Secure Agent Memory",
  kind: "concept_note",
  stage: "active",
  year: 2026,
  versionLabel: "v0.1",
  summary: "A focused proposal.",
  themes: ["Security"],
  motivation: null,
  researchQuestion: null,
  approach: null,
  expectedContributions: null,
  limitations: null,
  pdfUrl: null,
  featured: true,
  sortOrder: 0,
  updatedAt: new Date("2026-10-28"),
}

describe("ResearchPortfolioSections", () => {
  it("keeps agenda, proposals, and scholarly outputs visibly distinct", () => {
    render(
      <ResearchPortfolioSections
        agenda={fallbackResearchAgenda}
        proposals={[proposal]}
        publications={[]}
      />
    )

    expect(screen.getByRole("heading", { name: "Research Agenda" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Selected Proposals" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Publications" })).toBeInTheDocument()
    expect(screen.getByText(/No peer-reviewed publications listed yet/i)).toBeInTheDocument()
  })

  it("hides the selected proposals region when there are no public proposals", () => {
    render(
      <ResearchPortfolioSections
        agenda={fallbackResearchAgenda}
        proposals={[]}
        publications={[]}
      />
    )
    expect(screen.queryByRole("heading", { name: "Selected Proposals" })).not.toBeInTheDocument()
  })
})
