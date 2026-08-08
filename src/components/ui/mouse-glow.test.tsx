import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, fireEvent } from "@testing-library/react"
import { MouseGlow } from "@/components/ui/mouse-glow"

describe("MouseGlow", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("renders children inside a relative container", () => {
    const { getByText } = render(<MouseGlow>Card</MouseGlow>)
    expect(getByText("Card")).toBeInTheDocument()
  })

  it("sets --mouse-x and --mouse-y based on pointer position", () => {
    const { container } = render(<MouseGlow glowColor="cyan">X</MouseGlow>)
    const wrapper = container.firstChild as HTMLElement

    vi.spyOn(wrapper, "getBoundingClientRect").mockReturnValue({
      left: 100,
      top: 50,
      width: 200,
      height: 200,
      right: 300,
      bottom: 250,
      x: 100,
      y: 50,
      toJSON: () => ({}),
    })

    fireEvent.mouseMove(wrapper, { clientX: 200, clientY: 150 })
    expect(wrapper.style.getPropertyValue("--mouse-x")).toBe("50%")
    expect(wrapper.style.getPropertyValue("--mouse-y")).toBe("50%")
  })

  it("resets the glow to center on mouse leave", () => {
    const { container } = render(<MouseGlow>X</MouseGlow>)
    const wrapper = container.firstChild as HTMLElement

    vi.spyOn(wrapper, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      right: 100,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })

    fireEvent.mouseMove(wrapper, { clientX: 0, clientY: 0 })
    fireEvent.mouseLeave(wrapper)
    expect(wrapper.style.getPropertyValue("--mouse-x")).toBe("50%")
    expect(wrapper.style.getPropertyValue("--mouse-y")).toBe("50%")
  })
})