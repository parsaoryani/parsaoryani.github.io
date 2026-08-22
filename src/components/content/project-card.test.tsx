import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { ProjectCard } from "@/components/content/project-card"

type ProjectProps = Parameters<typeof ProjectCard>[0]

function project(overrides: Partial<ProjectProps["project"]> = {}): ProjectProps["project"] {
  return {
    id: "pr1",
    slug: "ethereum-cli",
    title: "Ethereum CLI (Sepolia Testnet)",
    summary: "A modular CLI for the Ethereum Sepolia testnet.",
    role: "Solo",
    featured: false,
    sortOrder: 0,
    year: 2025,
    techStack: ["Python", "JSON-RPC", "Etherscan API"],
    problem: null,
    approach: null,
    architecture: null,
    challenges: null,
    results: null,
    retrospective: null,
    repoUrl: null,
    demoUrl: null,
    ogImageUrl: null,
    tags: [
      {
        tagId: "tg1",
        tag: {
          id: "tg1",
          slug: "blockchain",
          label: "Blockchain",
          description: null,
          color: null,
        },
      },
    ],
    ...overrides,
  }
}

describe("ProjectCard", () => {
  it("renders title, summary, year, role and tech stack", () => {
    render(<ProjectCard project={project()} />)
    expect(screen.getByText("Ethereum CLI (Sepolia Testnet)")).toBeInTheDocument()
    expect(screen.getByText("A modular CLI for the Ethereum Sepolia testnet.")).toBeInTheDocument()
    expect(screen.getByText("2025")).toBeInTheDocument()
    expect(screen.getByText("Solo")).toBeInTheDocument()
    for (const tech of ["Python", "JSON-RPC", "Etherscan API"]) {
      expect(screen.getByText(tech)).toBeInTheDocument()
    }
  })

  it("renders without a role badge when role is missing", () => {
    const { container } = render(<ProjectCard project={project({ role: null })} />)
    const badge = Array.from(container.querySelectorAll("span")).find((el) => el.textContent === "Solo")
    expect(badge).toBeUndefined()
  })

it("shows repo and demo links only when present", () => {
    const first = render(
      <ProjectCard project={project({ repoUrl: "https://github.com/example/repo", demoUrl: "https://demo.example.com" })} />
    )
    expect(screen.getByText("Repo")).toBeInTheDocument()
    expect(screen.getByText("Demo")).toBeInTheDocument()
    first.unmount()

    const second = render(<ProjectCard project={project()} />)
    expect(second.queryByText("Repo")).not.toBeInTheDocument()
    expect(second.queryByText("Demo")).not.toBeInTheDocument()
  })

  it("links to the project detail page", () => {
    const { container } = render(<ProjectCard project={project()} />)
    expect(container.querySelector("a[href='/projects/ethereum-cli']")).not.toBeNull()
  })
})
