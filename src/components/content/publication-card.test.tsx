import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { PublicationCard } from "@/components/content/publication-card"

type PubProps = Parameters<typeof PublicationCard>[0]

const BASE_DATE = new Date("2026-01-01")

function publication(overrides: Partial<PubProps["publication"]> = {}): PubProps["publication"] {
  return {
    id: "p1",
    slug: "zk-rollup-security",
    title: "Zenning Rollups: Verifiable Bridges",
    authors: [
      { name: "Parsa Oryani", isMe: true },
      { name: "Jane Doe" },
    ],
    venue: "IEEE Symposium on Security & Privacy",
    venueType: "conference",
    year: 2026,
    status: "published",
    featured: false,
    sortOrder: 0,
    publishedAt: BASE_DATE,
    createdAt: BASE_DATE,
    updatedAt: BASE_DATE,
    abstract: null,
    tldr: "We prove bridge invariants hold under adversarial conditions.",
    contributions: null,
    doi: null,
    arxivId: null,
    pdfUrl: null,
    codeUrl: null,
    projectUrl: null,
    bibtex: null,
    citationCount: null,
    ogImageUrl: null,
    deletedAt: null,
    tags: [
      {
        id: "pt1",
        publicationId: "p1",
        tagId: "tg1",
        tag: { id: "tg1", slug: "security", label: "Security", sortOrder: 0 },
      },
    ],
    ...overrides,
  }
}

describe("PublicationCard", () => {
  it("renders title, venue, year, authors, and tags", () => {
    render(<PublicationCard publication={publication()} />)
    expect(screen.getByText("Zenning Rollups: Verifiable Bridges")).toBeInTheDocument()
    expect(screen.getByText("IEEE Symposium on Security & Privacy")).toBeInTheDocument()
    expect(screen.getByText("2026")).toBeInTheDocument()
    expect(screen.getByText(/Oryani/)).toBeInTheDocument()
    expect(screen.getByText("Jane Doe")).toBeInTheDocument()
    expect(screen.getByText("Security")).toBeInTheDocument()
  })

  it("maps venue types to human labels", () => {
    render(<PublicationCard publication={publication({ venueType: "conference" })} />)
    expect(screen.getByText("Conference")).toBeInTheDocument()
  })

  it("shows the tldr only when showAbstract is set", () => {
    const first = render(<PublicationCard publication={publication()} showAbstract />)
    expect(first.getByText(/prove bridge invariants/)).toBeInTheDocument()
    first.unmount()

    const second = render(<PublicationCard publication={publication()} />)
    expect(second.queryByText(/prove bridge invariants/)).not.toBeInTheDocument()
  })

  it("shows meta links only when present", () => {
    render(
      <PublicationCard
        publication={publication({
          pdfUrl: "https://example.com/paper.pdf",
          arxivId: "2601.12345",
          codeUrl: "https://github.com/example/repo",
          bibtex: "{ @article{oriani2026, title={Zenning Rollups} } }",
        })}
      />
    )
    expect(screen.getByText("PDF")).toBeInTheDocument()
    expect(screen.getByText("arXiv")).toBeInTheDocument()
    expect(screen.getByText("Code")).toBeInTheDocument()
    expect(screen.getByText("Cite")).toBeInTheDocument()
  })

  it("omits meta links when absent", () => {
    render(<PublicationCard publication={publication()} />)
    expect(screen.queryByText("PDF")).not.toBeInTheDocument()
    expect(screen.queryByText("arXiv")).not.toBeInTheDocument()
    expect(screen.queryByText("Code")).not.toBeInTheDocument()
    expect(screen.queryByText("Cite")).not.toBeInTheDocument()
  })

  it("links to the research detail page", () => {
    const { container } = render(<PublicationCard publication={publication()} />)
    const link = container.querySelector("a[href='/research/zk-rollup-security']")
    expect(link).not.toBeNull()
  })
})