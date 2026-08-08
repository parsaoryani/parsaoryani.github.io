import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { render, act } from "@testing-library/react"
import { TypewriterText, type TypewriterSegment } from "@/components/ui/typewriter"

const SEGMENTS: TypewriterSegment[] = [
  { text: "Hello " },
  { text: "world", className: "text-cyan" },
]

const REDUCED_MEDIA: Pick<MediaQueryList, "matches"> & {
  media: string
  addEventListener: (event: string, cb: unknown) => void
  removeEventListener: (event: string, cb: unknown) => void
} = {
  matches: true,
  media: "(prefers-reduced-motion: reduce)",
  addEventListener: () => {},
  removeEventListener: () => {},
} as MQLTypeAlias

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface MQLTypeAlias extends MediaQueryList {}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe("TypewriterText", () => {
  it("renders skeleton spans before typing starts", () => {
    const { container } = render(<TypewriterText segments={SEGMENTS} startDelay={200} />)
    expect(container.querySelector("[aria-live=polite]")).not.toBeNull()
    expect(container.textContent).not.toContain("Hello")
  })

  it("types the full text char by char and keeps the caret at the end", () => {
    const { container } = render(<TypewriterText segments={SEGMENTS} speed={10} startDelay={0} />)

    act(() => {
      vi.advanceTimersByTime(10)
    })
    expect(container.textContent).toContain("H")

    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(container.textContent).toContain("Hello world")

    const caret = container.querySelector(".animate-caret-blink")
    expect(caret).not.toBeNull()
    const typed = container.textContent ?? ""
    expect(typed.endsWith("world")).toBe(true)
  })

  it("applies per-segment className once the segment is typed", () => {
    const { container } = render(<TypewriterText segments={SEGMENTS} speed={5} startDelay={0} />)
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    const colored = container.querySelector(".text-cyan")
    expect(colored).not.toBeNull()
    expect(colored?.textContent).toBe("world")
  })

  it("does not leak later segments before they are reached", () => {
    const { container } = render(<TypewriterText segments={SEGMENTS} speed={10} startDelay={0} />)
    act(() => {
      vi.advanceTimersByTime(60)
    })
    expect(container.textContent).toContain("Hello")
    expect(container.textContent).not.toContain("world")
  })

  it("shows the full text instantly when user prefers reduced motion", () => {
    vi.spyOn(window, "matchMedia").mockImplementation((query) => {
      const base = REDUCED_MEDIA as unknown as MediaQueryList
      return {
        ...base,
        media: query,
        matches: query.includes("prefers-reduced-motion"),
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }
    })

    const { container } = render(<TypewriterText segments={SEGMENTS} speed={10} startDelay={500} />)
    act(() => {
      vi.advanceTimersByTime(0)
    })
    expect(container.textContent).toContain("Hello world")
  })

  it("restarts typing when segments change", () => {
    const { container, rerender } = render(<TypewriterText segments={SEGMENTS} speed={10} startDelay={0} />)
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(container.textContent).toContain("Hello world")

    rerender(<TypewriterText segments={[{ text: "New" }]} speed={10} startDelay={0} />)
    expect(container.textContent).not.toContain("Hello")
    act(() => {
      vi.advanceTimersByTime(40)
    })
    expect(container.textContent).toContain("New")
  })
})