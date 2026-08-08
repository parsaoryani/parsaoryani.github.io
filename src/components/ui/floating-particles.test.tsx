import { describe, expect, it } from "vitest"
import { render, waitFor } from "@testing-library/react"
import { FloatingParticles } from "@/components/ui/floating-particles"

describe("FloatingParticles", () => {
  it("renders the requested number of particles with animation styles", async () => {
    const { container } = render(<FloatingParticles count={5} color="cyan" size="sm" />)

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveAttribute("aria-hidden", "true")

    await waitFor(() => {
      const particles = wrapper.querySelectorAll("div > div")
      expect(particles).toHaveLength(5)
    })

    const first = wrapper.querySelector("div > div") as HTMLElement
    expect(first.style.left).toMatch(/%$/)
    expect(first.style.top).toMatch(/%$/)
    expect(first.style.animation).toContain("float-slow")
  })

  it("applies the given className to the wrapper", () => {
    const { container } = render(<FloatingParticles className="opacity-60" />)
    expect(container.firstChild as HTMLElement).toHaveClass("opacity-60")
  })

  it("renders zero particles when count is zero", () => {
    const { container } = render(<FloatingParticles count={0} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.children).toHaveLength(0)
  })
})
