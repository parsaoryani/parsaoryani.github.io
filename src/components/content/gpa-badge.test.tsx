import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { GpaBadge } from "@/components/content/gpa-badge"

describe("GpaBadge", () => {
  it("renders the original and converted GPA for a degree", () => {
    render(<GpaBadge gpa="17.30/20" gpaConverted="3.63/4.00" />)

    expect(screen.getByText("GPA")).toBeInTheDocument()
    expect(screen.getByText("17.30/20")).toBeInTheDocument()
    expect(screen.getByText(/3\.63\/4\.00/)).toBeInTheDocument()
    expect(screen.getByText("(converted)")).toBeInTheDocument()
  })

  it("renders a single scale when no conversion is recorded", () => {
    const { container } = render(<GpaBadge gpa="18.26/20" />)

    expect(screen.getByText("18.26/20")).toBeInTheDocument()
    expect(container.textContent).not.toContain("converted")
  })

  it("renders nothing when no GPA is recorded", () => {
    const { container } = render(<GpaBadge gpa={null} gpaConverted={null} />)

    expect(container).toBeEmptyDOMElement()
  })

  it("treats blank GPA strings as missing", () => {
    const { container } = render(<GpaBadge gpa="   " gpaConverted={null} />)

    expect(container).toBeEmptyDOMElement()
  })
})
