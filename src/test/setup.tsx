import "@testing-library/jest-dom/vitest"
import { vi } from "vitest"

class IntersectionObserverMock {
  readonly root: Element | null = null
  readonly rootMargin = "0px"
  readonly thresholds: ReadonlyArray<number> = [0]
  private readonly callback: IntersectionObserverCallback
  private readonly elements = new Set<Element>()

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    const registry = (globalThis as { __intersectionObservers?: IntersectionObserverMock[] }).__intersectionObservers
    if (registry) registry.push(this)
  }

  observe(element: Element) {
    this.elements.add(element)
  }

  unobserve(element: Element) {
    this.elements.delete(element)
  }

  disconnect() {
    this.elements.clear()
  }

  takeRecords() {
    return []
  }

  trigger(entry: Partial<IntersectionObserverEntry> = {}) {
    this.callback(
      Array.from(this.elements).map((target) => ({
        isIntersecting: true,
        target,
        isVisible: true,
        intersectionRatio: 1,
        intersectionRect: new DOMRect(),
        boundingClientRect: new DOMRect(),
        rootBounds: null,
        time: 0,
        ...entry,
      })),
      this as unknown as IntersectionObserver
    )
  }
}

vi.stubGlobal("IntersectionObserver", IntersectionObserverMock)
;(globalThis as { __intersectionObservers?: IntersectionObserverMock[] }).__intersectionObservers = []

if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }) as unknown as MediaQueryList
}

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string
    children: React.ReactNode
    [key: string]: unknown
  }) => (
    <a href={typeof href === "string" ? href : "#"} {...props}>
      {children}
    </a>
  ),
}))

vi.mock("next/image", () => ({
  default: (props: { src: string | object; alt?: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={String(
        typeof props.src === "string" ? props.src : ((props.src as { src?: string })?.src ?? "")
      )}
      alt={props.alt ?? ""}
    />
  ),
}))