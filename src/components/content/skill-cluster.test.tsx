import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"
import { SkillCluster } from "@/components/content/skill-cluster"
import type { SkillCategory, Skill } from "@prisma/client"

function category(overrides: Partial<SkillCategory> = {}): SkillCategory & { skills: Skill[] } {
  return {
    id: "cat1",
    name: "Blockchain Security",
    sortOrder: 0,
    ...overrides,
    skills: [
      {
        id: "s1",
        categoryId: "cat1",
        name: "Solidity",
        proficiency: "expert",
        sortOrder: 0,
      },
      {
        id: "s2",
        categoryId: "cat1",
        name: "Rust",
        proficiency: "beginner",
        sortOrder: 1,
      },
      {
        id: "s3",
        categoryId: "cat1",
        name: "Go",
        proficiency: null,
        sortOrder: 2,
      },
    ],
  }
}

describe("SkillCluster", () => {
  it("renders category name and its skills", () => {
    const { getByText } = render(<SkillCluster categories={[category()]} />)
    expect(getByText("Blockchain Security")).toBeInTheDocument()
    expect(getByText("Solidity")).toBeInTheDocument()
    expect(getByText("Rust")).toBeInTheDocument()
    expect(getByText(/3 skills/)).toBeInTheDocument()
  })

  it("applies proficiency-based colors", () => {
    const { container } = render(<SkillCluster categories={[category()]} />)
    const buttons = Array.from(container.querySelectorAll("button"))

    const solidity = buttons.find((b) => b.textContent?.includes("Solidity"))
    const rust = buttons.find((b) => b.textContent?.includes("Rust"))
    const go = buttons.find((b) => b.textContent?.includes("Go"))

    expect(solidity).not.toBeUndefined()
    expect(rust).not.toBeUndefined()
    expect(go).not.toBeUndefined()

    expect(solidity?.className).toContain("bg-cyan/10")
    expect(rust?.className).toContain("bg-amber/10")
    expect(go?.className).toContain("bg-amber/10")
  })

  it("renders multiple categories", () => {
    const second = category()
    second.id = "cat2"
    second.name = "ML Systems"
    const { getByText } = render(<SkillCluster categories={[category(), second]} />)
    expect(getByText("ML Systems")).toBeInTheDocument()
  })
})