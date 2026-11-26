import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { AcademicCollaborators } from "@/components/content/academic-collaborators"
import { academicCollaborators } from "@/content/academic-collaborators"

const visibleNames = [
  "Dr. Morteza Amini",
  "Prof. Mehdi Ghatee",
  "Dr. Mohammad Mahdi Bejani",
  "Dr. Mahdieh Soleymani Baghshah",
  "Dr. Nasour Bagheri",
  "Dr. Amir Mahdi Sadeghzadeh",
]

// Kept in the content collection but hidden from the public References section
// for now. Remove `hidden: true` from their entries to re-publish them.
const hiddenNames = ["Dr. Mohammad Ali"]

const visibleCollaborators = academicCollaborators.filter(
  (collaborator) => !collaborator.hidden
)

describe("AcademicCollaborators", () => {
  it("presents the published References directory", () => {
    render(<AcademicCollaborators />)

    expect(screen.getByRole("heading", { name: "References" })).toBeInTheDocument()
    expect(
      screen.getByText(/privilege of working closely with and learning from/i)
    ).toBeInTheDocument()
    expect(screen.getAllByRole("article")).toHaveLength(visibleNames.length)

    for (const name of visibleNames) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument()
    }

    for (const name of hiddenNames) {
      expect(screen.queryByRole("heading", { name })).not.toBeInTheDocument()
    }
  })

  it("keeps hidden profiles and every compact profile in one editable content collection", () => {
    expect(visibleCollaborators.map(({ name }) => name)).toEqual(visibleNames)
    expect(
      academicCollaborators.filter(({ hidden }) => hidden).map(({ name }) => name)
    ).toEqual(hiddenNames)

    for (const collaborator of academicCollaborators) {
      expect(collaborator.title).toBeTruthy()
      expect(collaborator.affiliation).toHaveLength(2)
      expect(collaborator.relationship).toBeTruthy()
      expect(collaborator.scholarUrl).toMatch(/^https:\/\/scholar\.google\./)
      expect(collaborator.email).toMatch(/^[^@]+@[^@]+$/)
      if (collaborator.photoUrl) {
        expect(collaborator.photoUrl).toMatch(/^\/collaborators\/.+-scholar\.jpg$/)
      }

      for (const removedField of ["period", "context", "summary", "interests", "linkedinUrl"]) {
        expect(removedField in collaborator).toBe(false)
      }
    }
  })

  it("renders each person's identity, relationship, Scholar profile, and email together", () => {
    render(<AcademicCollaborators />)

    for (const collaborator of visibleCollaborators) {
      const card = screen.getByRole("article", { name: collaborator.name })

      expect(within(card).getByText(collaborator.title)).toBeInTheDocument()
      expect(within(card).getByText(collaborator.affiliation[0])).toBeInTheDocument()
      expect(within(card).getByText(collaborator.affiliation[1])).toBeInTheDocument()
      expect(within(card).getByText(collaborator.relationship)).toBeInTheDocument()
      expect(within(card).getByRole("link", { name: /scholar/i })).toHaveAttribute(
        "href",
        collaborator.scholarUrl
      )
      expect(within(card).getByRole("link", { name: /email/i })).toHaveAttribute(
        "href",
        `mailto:${collaborator.email}`
      )
    }
  })

  it("removes the previous long-form academic card content", () => {
    render(<AcademicCollaborators />)

    expect(screen.queryByText("Research interests")).not.toBeInTheDocument()
    expect(screen.queryByText("Academic record")).not.toBeInTheDocument()
    expect(screen.queryByText("Source-backed records")).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /linkedin/i })).not.toBeInTheDocument()
  })
})
