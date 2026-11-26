import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth/auth"
import { prisma } from "@/lib/db/prisma"
import { researchAgendaSchema } from "@/lib/validation/research-portfolio"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  return NextResponse.json(await prisma.researchAgenda.findUnique({ where: { id: "primary" } }))
}

export async function PUT(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const parsed = researchAgendaSchema.safeParse(await request.json())
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    const existing = await prisma.researchAgenda.findUnique({ where: { id: "primary" } })
    if (existing && existing.version !== parsed.data.version) {
      return NextResponse.json({ error: "Conflict: this record was modified. Refresh and try again." }, { status: 409 })
    }
    const { version: _version, ...data } = parsed.data
    void _version
    const agenda = await prisma.researchAgenda.upsert({
      where: { id: "primary" },
      create: { id: "primary", ...data },
      update: { ...data, version: { increment: 1 } },
    })
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: existing ? "research_agenda.update" : "research_agenda.create",
        ip: (await headers()).get("x-forwarded-for") || "unknown",
        metadata: { id: agenda.id, headline: agenda.headline },
      },
    })
    revalidatePath("/research")
    return NextResponse.json(agenda)
  } catch {
    return NextResponse.json({ error: "Failed to save research agenda" }, { status: 500 })
  }
}
