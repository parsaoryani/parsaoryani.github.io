import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { CV_PROFILE, CV_SELECTED_PROJECTS } from "@/content/cv-profile"

const markdown = readFileSync("CV.md", "utf8")
const webCv = readFileSync("src/app/(public)/cv/page.tsx", "utf8")

describe("CV critical facts", () => {
  it("defines one canonical identity and primary email", () => {
    expect(CV_PROFILE.name).toBe("Parsa Oryani")
    expect(CV_PROFILE.email).toBe("parsa.oryani82@sharif.edu")
    expect(markdown).toContain(CV_PROFILE.email)
    expect(markdown).not.toContain("parsa.oryani@gmail.com")
  })

  it("keeps education dates and the cryptography distinction precise", () => {
    expect(markdown).toContain("Sep 2025 - Present")
    expect(markdown).toContain("Sep 2020 - Feb 2025")
    expect(markdown).toContain("Special Topics in Cryptography (18.25/20, highest grade in class)")
    expect(markdown).not.toMatch(/highest grade in both/i)
  })

  it("includes every selected project in Markdown and web CV sources", () => {
    expect(CV_SELECTED_PROJECTS).toHaveLength(3)
    for (const project of CV_SELECTED_PROJECTS) {
      expect(markdown).toContain(project.title)
    }
    expect(webCv).toContain("CV_SELECTED_PROJECTS")
  })

  it("includes the complete teaching record", () => {
    expect(markdown).toContain("Design and Analysis of Algorithms")
  })
})
