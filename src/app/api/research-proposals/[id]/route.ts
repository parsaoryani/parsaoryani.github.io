import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth/auth"
import { prisma } from "@/lib/db/prisma"
import { researchProposalSchema } from "@/lib/validation/research-portfolio"

type Context = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: Context) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const proposal = await prisma.researchProposal.findUnique({ where: { id } })
  if (!proposal || proposal.deletedAt) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(proposal)
}

export async function PUT(request: Request, { params }: Context) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await params
    const parsed = researchProposalSchema.safeParse(await request.json())
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    const existing = await prisma.researchProposal.findUnique({ where: { id } })
    if (!existing || existing.deletedAt) return NextResponse.json({ error: "Not found" }, { status: 404 })
    if (existing.version !== parsed.data.version) {
      return NextResponse.json({ error: "Conflict: this record was modified. Refresh and try again." }, { status: 409 })
    }

    const { version: _version, ...data } = parsed.data
    void _version
    await prisma.$transaction(async (tx) => {
      await tx.revision.create({
        data: {
          entityType: "research_proposal",
          entityId: id,
          data: existing,
          version: existing.version,
          userId: session.user.id,
        },
      })
      await tx.researchProposal.update({ where: { id }, data: { ...data, version: { increment: 1 } } })
    })
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "research_proposal.update",
        ip: (await headers()).get("x-forwarded-for") || "unknown",
        metadata: { id, title: data.title },
      },
    })
    revalidatePath("/research")
    revalidatePath(`/research/proposals/${data.slug}`)
    return NextResponse.json(await prisma.researchProposal.findUnique({ where: { id } }))
  } catch {
    return NextResponse.json({ error: "Failed to update research proposal" }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const { id } = await params
    const existing = await prisma.researchProposal.findUnique({ where: { id } })
    if (!existing || existing.deletedAt) return NextResponse.json({ error: "Not found" }, { status: 404 })
    await prisma.researchProposal.update({ where: { id }, data: { deletedAt: new Date() } })
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "research_proposal.delete",
        ip: (await headers()).get("x-forwarded-for") || "unknown",
        metadata: { id, title: existing.title },
      },
    })
    revalidatePath("/research")
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete research proposal" }, { status: 500 })
  }
}
