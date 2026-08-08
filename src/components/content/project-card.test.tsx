import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { ProjectCard } from "@/components/content/project-card"

const BASE_DATE = new Date("2025-06-01")

type ProjectProps = Parameters<typeof ProjectCard>[0]

function project(overrides: Partial<ProjectProps["project"]> = {}): ProjectProps["project"] {
  return {
    id: "pr1",
    slug: "zk-bridge-verifier",
    title: "ZK Bridge Verifier",
    summary: "An automated verifier for bridge protocols.",
    role: "Lead Developer",
    status: "published",
    featured: false,
    sortOrder: 0,
    year: 2025,
    techStack: ["Rust", "Z3", "Solidity"],
    problem: null,
    approach: null,
    architecture: null,
    challenges: null,
    results: null,
    retrospective: null,
    repoUrl: null,
    demoUrl: null,
    ogImageUrl: null,
    createdAt: BASE_DATE,
    updatedAt: BASE_DATE,
    deletedAt: null,
    tags: [
      {
        id: "pt1",
        projectId: "pr1",
        tagId: "tg1",
        tag: { id: "tg1", slug: "blockchain", label: "Blockchain", sortOrder: 0 },
      },
    ],
    ...overrides,
  }
}

describe("ProjectCard", () => {
  it("renders title, summary, year, role and tech stack", () => {
    render(<ProjectCard project={project()} />)
    expect(screen.getByText("ZK Bridge Verifier")).toBeInTheDocument()
    expect(screen.getByText("An automated verifier for bridge protocols.")).toBeInTheDocument()
    expect(screen.getByText("2025")).toBeInTheDocument()
    expect(screen.getByText("Lead Developer")).toBeInTheDocument()
    for (const tech of ["Rust", "Z3", "Solidity"]) {
      expect(screen.getByText(tech)).toBeInTheDocument()
    }
  })

  it("renders without a role badge when role is missing", () => {
    const { container } = render(<ProjectCard project={project({ role: null })} />)
    const badge = Array.from(container.querySelectorAll("span")).find((el) => el.textContent === "Lead Developer")
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
    expect(container.querySelector("a[href='/projects/zk-bridge-verifier']")).not.toBeNull()
  })
})