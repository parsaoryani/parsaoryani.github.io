import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { Nav } from "@/components/layout/nav"

let pathname = "/"

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
}))

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "dark", setTheme: vi.fn() }),
}))

describe("Nav mobile menu", () => {
  beforeEach(() => {
    pathname = "/"
    document.body.style.overflow = ""
  })

  it("opens as an opaque modal navigation surface and moves focus inside", async () => {
    render(<Nav showResearch />)

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }))

    const menu = screen.getByRole("dialog", { name: "Site navigation" })
    expect(menu).toHaveClass("fixed", "bg-void")
    expect(document.body.style.overflow).toBe("hidden")
    await waitFor(() => expect(menu.querySelector("a[href='/research']")).toHaveFocus())
  })

  it("closes on Escape, unlocks scrolling, and returns focus to the trigger", async () => {
    render(<Nav showResearch />)
    const trigger = screen.getByRole("button", { name: "Open menu" })
    fireEvent.click(trigger)

    fireEvent.keyDown(document, { key: "Escape" })

    expect(screen.queryByRole("dialog", { name: "Site navigation" })).not.toBeInTheDocument()
    expect(document.body.style.overflow).toBe("")
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it("closes after a mobile navigation link is selected", () => {
    render(<Nav showResearch />)
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }))

    const menu = screen.getByRole("dialog", { name: "Site navigation" })
    const projectsLink = menu.querySelector("a[href='/projects']")!
    projectsLink.addEventListener("click", (event) => event.preventDefault())
    fireEvent.click(projectsLink)

    expect(screen.queryByRole("dialog", { name: "Site navigation" })).not.toBeInTheDocument()
  })

  it("closes when the current route changes", async () => {
    const view = render(<Nav showResearch />)
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }))

    pathname = "/projects"
    view.rerender(<Nav showResearch />)

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Site navigation" })).not.toBeInTheDocument()
    })
  })
})
