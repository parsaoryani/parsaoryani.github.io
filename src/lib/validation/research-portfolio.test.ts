import { describe, expect, it } from "vitest"
import {
  researchAgendaSchema,
  researchProposalSchema,
  proposalKindLabels,
  proposalStageLabels,
} from "./research-portfolio"

describe("research portfolio validation", () => {
  it("accepts a publishable agenda", () => {
    const result = researchAgendaSchema.parse({
      headline: "Secure and Trustworthy Agentic AI",
      summary: "A focused agenda for building safer tool-using agents.",
      themes: ["Agent security", "Authorization"],
      description: "Longer framing.",
      documentUrl: "https://example.com/agenda.pdf",
      status: "published",
      version: 1,
    })

    expect(result.themes).toEqual(["Agent security", "Authorization"])
  })

  it("accepts every public proposal kind and stage", () => {
    expect(Object.keys(proposalKindLabels)).toEqual([
      "thesis_proposal",
      "research_proposal",
      "concept_note",
    ])
    expect(Object.keys(proposalStageLabels)).toEqual([
      "in_preparation",
      "active",
      "archived",
    ])
  })

  it("normalizes empty optional proposal fields", () => {
    const result = researchProposalSchema.parse({
      slug: "secure-agent-memory",
      title: "Secure Agent Memory",
      kind: "research_proposal",
      stage: "in_preparation",
      year: 2026,
      versionLabel: "v0.1",
      summary: "A proposal about protecting persistent agent memory.",
      themes: ["Agent security"],
      motivation: "",
      pdfUrl: "",
      status: "draft",
      featured: false,
      sortOrder: 0,
      version: 1,
    })

    expect(result.motivation).toBeNull()
    expect(result.pdfUrl).toBeNull()
  })

  it("rejects malformed proposal records", () => {
    const result = researchProposalSchema.safeParse({
      slug: "Bad Slug",
      title: "",
      kind: "paper",
      stage: "unknown",
      year: 0,
      versionLabel: "",
      summary: "",
      themes: [],
      pdfUrl: "not-a-url",
      status: "published",
      featured: false,
      sortOrder: 0,
      version: 1,
    })

    expect(result.success).toBe(false)
  })
})
