import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getSession } from "@/lib/auth/auth"
import { publicationSchema } from "@/lib/validation/schemas"
import { headers } from "next/headers"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const publication = await prisma.publication.findUnique({
    where: { id },
    include: { tags: { include: { tag: true } } },
  })

  if (!publication || publication.deletedAt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(publication)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await params
    const body = await request.json()
    const parsed = publicationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const { tagIds, ...data } = parsed.data
    const existing = await prisma.publication.findUnique({ where: { id } })
    if (!existing || existing.deletedAt) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    await prisma.publicationTag.deleteMany({ where: { publicationId: id } })

    const publication = await prisma.publication.update({
      where: { id },
      data: {
        ...data,
        authors: data.authors || [],
        contributions: data.contributions || [],
        tags: tagIds?.length
          ? { create: tagIds.map((tagId: string) => ({ tagId })) }
          : undefined,
      },
      include: { tags: { include: { tag: true } } },
    })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "publication.update",
        ip: (await headers()).get("x-forwarded-for") || "unknown",
        metadata: { id, title: data.title },
      },
    })

    return NextResponse.json(publication)
  } catch {
    return NextResponse.json({ error: "Failed to update publication" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await params
    await prisma.publication.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "publication.delete",
        ip: (await headers()).get("x-forwarded-for") || "unknown",
        metadata: { id },
      },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete publication" }, { status: 500 })
  }
}
