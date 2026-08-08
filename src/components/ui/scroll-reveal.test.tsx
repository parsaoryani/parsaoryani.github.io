import { describe, expect, it, beforeEach } from "vitest"
import { render, waitFor } from "@testing-library/react"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

function observers() {
  return (globalThis as unknown as { __intersectionObservers: unknown[] }).__intersectionObservers
}

beforeEach(() => {
  ;(globalThis as unknown as { __intersectionObservers: unknown[] }).__intersectionObservers = []
})

function triggerIntersect() {
  const list = observers()
  if (list.length > 0) {
    const observer = list[list.length - 1] as { trigger: () => void }
    observer.trigger()
  }
}

describe("ScrollReveal", () => {
  it("renders children", () => {
    const { getByText } = render(<ScrollReveal>Hello</ScrollReveal>)
    expect(getByText("Hello")).toBeInTheDocument()
  })

  it("starts hidden with the reveal class", () => {
    const { container } = render(<ScrollReveal direction="up">X</ScrollReveal>)
    expect(container.firstChild as HTMLElement).toHaveClass("scroll-reveal")
  })

  it("gains the is-visible class when it intersects the viewport", async () => {
    const { container } = render(<ScrollReveal direction="up">X</ScrollReveal>)
    triggerIntersect()
    await waitFor(() => {
      expect(container.firstChild as HTMLElement).toHaveClass("is-visible")
    })
  })

  it("does not reveal when never intersecting", () => {
    const { container } = render(<ScrollReveal>X</ScrollReveal>)
    expect(container.firstChild as HTMLElement).not.toHaveClass("is-visible")
  })

  it("applies the requested direction class", () => {
    const { container } = render(<ScrollReveal direction="left">X</ScrollReveal>)
    expect(container.firstChild as HTMLElement).toHaveClass("scroll-reveal-left")
    const { container: right } = render(<ScrollReveal direction="scale">X</ScrollReveal>)
    expect(right.firstChild as HTMLElement).toHaveClass("scroll-reveal-scale")
  })

  it("forwards an id so anchor links work", () => {
    const { container } = render(<ScrollReveal id="tl-experience">X</ScrollReveal>)
    expect(container.querySelector("#tl-experience")).not.toBeNull()
  })
})