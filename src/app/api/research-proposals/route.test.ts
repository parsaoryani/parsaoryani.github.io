import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers({ "x-forwarded-for": "1.2.3.4" })),
}))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))
vi.mock("@/lib/auth/auth", () => ({ getSession: vi.fn() }))

const tx = {
  revision: { create: vi.fn() },
  researchProposal: { update: vi.fn() },
}

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    researchProposal: {
      aggregate: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    auditLog: { create: vi.fn() },
    $transaction: vi.fn(async (callback) => callback(tx)),
  },
}))

import { getSession } from "@/lib/auth/auth"
import { prisma } from "@/lib/db/prisma"
import { POST } from "./route"
import { PUT } from "./[id]/route"

const payload = {
  slug: "secure-agent-memory",
  title: "Secure Agent Memory",
  kind: "research_proposal",
  stage: "in_preparation",
  year: 2026,
  versionLabel: "v0.1",
  summary: "A proposal about protecting persistent agent memory.",
  themes: ["Agent security"],
  motivation: null,
  researchQuestion: null,
  approach: null,
  expectedContributions: null,
  limitations: null,
  pdfUrl: null,
  status: "draft",
  featured: false,
  sortOrder: 0,
  version: 1,
} as const

function request(body: unknown, method = "POST") {
  return new Request("http://localhost/api/research-proposals", {
    method,
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  vi.mocked(getSession).mockResolvedValue({ user: { id: "u1" } } as never)
  vi.mocked(prisma.researchProposal.aggregate).mockResolvedValue({ _max: { sortOrder: 0 } } as never)
  vi.mocked(prisma.researchProposal.create).mockResolvedValue({ id: "p1", ...payload } as never)
  vi.mocked(prisma.auditLog.create).mockResolvedValue({ id: "a1" } as never)
})

describe("research proposal API", () => {
  it("returns 401 when the user is not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue(null)
    const response = await POST(request(payload))
    expect(response.status).toBe(401)
  })

  it("returns 400 for malformed public content", async () => {
    const response = await POST(request({ ...payload, slug: "Bad Slug", title: "" }))
    expect(response.status).toBe(400)
    expect(prisma.researchProposal.create).not.toHaveBeenCalled()
  })

  it("creates a validated proposal and audit entry", async () => {
    const response = await POST(request(payload))
    expect(response.status).toBe(201)
    expect(prisma.researchProposal.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ slug: payload.slug, themes: payload.themes }),
    })
    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ action: "research_proposal.create", userId: "u1" }),
    })
  })

  it("returns 409 when an update has a stale version", async () => {
    vi.mocked(prisma.researchProposal.findUnique).mockResolvedValue({ id: "p1", ...payload, version: 2 } as never)
    const response = await PUT(request(payload, "PUT"), { params: Promise.resolve({ id: "p1" }) })
    expect(response.status).toBe(409)
  })
})
