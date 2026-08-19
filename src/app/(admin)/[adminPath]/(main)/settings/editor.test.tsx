import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import { SettingsEditor } from "./editor"

const routerRefresh = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: routerRefresh }),
}))

const homeSettings = [
  { id: "s1", key: "home_title", value: "Line one\nLine two" },
  { id: "s2", key: "home_description", value: "Existing description" },
]

const otherSettings = [{ id: "s3", key: "footer_text", value: { text: "hi" } }]

beforeEach(() => {
  routerRefresh.mockClear()
  vi.stubGlobal("fetch", vi.fn())
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("SettingsEditor", () => {
  it("prefills the homepage title and description textareas", () => {
    render(<SettingsEditor settings={[...homeSettings, ...otherSettings]} />)
    expect(screen.getByLabelText(/Title/)).toHaveValue("Line one\nLine two")
    expect(screen.getByLabelText(/Description/)).toHaveValue("Existing description")
  })

  it("saves both homepage fields and refreshes the router", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }))
    render(<SettingsEditor settings={[...homeSettings, ...otherSettings]} />)

    fireEvent.change(screen.getByLabelText(/Title/), { target: { value: "New title" } })
    fireEvent.change(screen.getByLabelText(/Description/), { target: { value: "New description" } })
    fireEvent.click(screen.getByRole("button", { name: /Save homepage/ }))

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2))
    expect(screen.getByText("Saved")).toBeInTheDocument()
    expect(routerRefresh).toHaveBeenCalled()

    const calls = vi.mocked(fetch).mock.calls.map(([url, init]) => ({
      url,
      body: JSON.parse((init?.body as string) ?? "{}"),
    }))
    expect(calls).toEqual([
      { url: "/api/settings/s1", body: { value: "New title" } },
      { url: "/api/settings/s2", body: { value: "New description" } },
    ])
  })

  it("shows an error when saving the homepage fails", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 500 }))
    render(<SettingsEditor settings={[...homeSettings, ...otherSettings]} />)

    fireEvent.click(screen.getByRole("button", { name: /Save homepage/ }))

    await waitFor(() => expect(screen.getByText("Failed to save homepage settings")).toBeInTheDocument())
    expect(routerRefresh).not.toHaveBeenCalled()
  })

  it("warns when the homepage settings are missing from the database", async () => {
    render(<SettingsEditor settings={[]} />)
    fireEvent.click(screen.getByRole("button", { name: /Save homepage/ }))
    await waitFor(() =>
      expect(screen.getByText(/Run the seed script first/)).toBeInTheDocument()
    )
    expect(fetch).not.toHaveBeenCalled()
  })

  it("edits an other-setting and sends its raw value", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response)
    const { container } = render(<SettingsEditor settings={[...homeSettings, ...otherSettings]} />)

    fireEvent.click(screen.getByRole("button", { name: "Edit" }))
    const editBox = container.querySelectorAll("textarea")[2] as HTMLTextAreaElement
    expect(editBox).toBeDefined()
    fireEvent.change(editBox, { target: { value: '{"text": "bye"}' } })
    fireEvent.click(screen.getAllByRole("button", { name: "Save" })[0]!)

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))
    const call = vi.mocked(fetch).mock.calls[0]!
    expect(call[0]).toBe("/api/settings/s3")
    const init = call[1] as RequestInit
    expect(JSON.parse(init.body as string)).toEqual({ value: { text: "bye" } })
    expect(routerRefresh).toHaveBeenCalled()
  })

  it("falls back to sending a string when the edited value is not valid JSON", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response)
    const { container } = render(<SettingsEditor settings={[...homeSettings, ...otherSettings]} />)

    fireEvent.click(screen.getByRole("button", { name: "Edit" }))
    const editBox = container.querySelectorAll("textarea")[2] as HTMLTextAreaElement
    fireEvent.change(editBox, { target: { value: "not json" } })
    fireEvent.click(screen.getAllByRole("button", { name: "Save" })[0]!)

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))
    const call = vi.mocked(fetch).mock.calls[0]!
    const init = call[1] as RequestInit
    expect(JSON.parse(init.body as string)).toEqual({ value: "not json" })
  })
})