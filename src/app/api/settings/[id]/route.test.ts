import { describe, expect, it, vi, beforeEach } from "vitest"

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers({ "x-forwarded-for": "1.2.3.4" })),
}))

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

vi.mock("@/lib/auth/auth", () => ({
  getSession: vi.fn(),
}))

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    siteSetting: { update: vi.fn() },
    auditLog: { create: vi.fn() },
  },
}))

import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/auth/auth"
import { prisma } from "@/lib/db/prisma"
import { PUT } from "./route"

const setting = { id: "s1", key: "home_title", value: "old" }

function makeRequest(value: unknown): Request {
  return new Request("http://localhost/api/settings/s1", {
    method: "PUT",
    body: JSON.stringify({ value }),
  })
}

beforeEach(() => {
  vi.mocked(prisma.siteSetting.update).mockResolvedValue(setting as never)
  vi.mocked(prisma.auditLog.create).mockResolvedValue({ id: "log1" } as never)
  vi.mocked(revalidatePath).mockClear()
})

describe("PUT /api/settings/[id]", () => {
  it("returns 401 when there is no session", async () => {
    vi.mocked(getSession).mockResolvedValue(null)
    const res = await PUT(makeRequest("new value"), { params: Promise.resolve({ id: "s1" }) })
    expect(res.status).toBe(401)
    expect(await res.json()).toEqual({ error: "Unauthorized" })
    expect(prisma.siteSetting.update).not.toHaveBeenCalled()
  })

  it("updates the setting and writes an audit log", async () => {
    vi.mocked(getSession).mockResolvedValue({ user: { id: "u1" } } as never)
    const res = await PUT(makeRequest("new value"), { params: Promise.resolve({ id: "s1" }) })

    expect(prisma.siteSetting.update).toHaveBeenCalledWith({
      where: { id: "s1" },
      data: { value: "new value" },
    })
    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: {
        userId: "u1",
        action: "setting.update",
        ip: "1.2.3.4",
        metadata: { id: "s1", key: "home_title" },
      },
    })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual(setting)
  })

  it("revalidates the home page after a successful update", async () => {
    vi.mocked(getSession).mockResolvedValue({ user: { id: "u1" } } as never)
    await PUT(makeRequest("new value"), { params: Promise.resolve({ id: "s1" }) })
    expect(revalidatePath).toHaveBeenCalledWith("/")
  })

  it("returns 500 when the update fails", async () => {
    vi.mocked(getSession).mockResolvedValue({ user: { id: "u1" } } as never)
    vi.mocked(prisma.siteSetting.update).mockRejectedValue(new Error("db down"))
    const res = await PUT(makeRequest("new value"), { params: Promise.resolve({ id: "s1" }) })
    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ error: "Failed to update setting" })
  })

  it("still returns 500 when only the audit log fails", async () => {
    vi.mocked(getSession).mockResolvedValue({ user: { id: "u1" } } as never)
    vi.mocked(prisma.auditLog.create).mockRejectedValue(new Error("audit down"))
    const res = await PUT(makeRequest("new value"), { params: Promise.resolve({ id: "s1" }) })
    expect(res.status).toBe(500)
  })
})