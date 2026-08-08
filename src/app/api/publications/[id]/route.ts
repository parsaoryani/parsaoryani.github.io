import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getSession } from "@/lib/auth/auth"
import { publicationSchema } from "@/lib/validation/schemas"
import { headers } from "next/headers"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const url = new URL(request.url)
  const action = url.searchParams.get("action")

  // Revision history
  if (action === "revisions") {
    const revisions = await prisma.revision.findMany({
      where: { entityType: "publication", entityId: id },
      orderBy: { createdAt: "desc" },
      take: 20,
    })
    return NextResponse.json(revisions)
  }

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

    const { tagIds, version, ...data } = parsed.data
    const existing = await prisma.publication.findUnique({ where: { id } })
    if (!existing || existing.deletedAt) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // Optimistic locking: version must match
    if (existing.version !== version) {
      return NextResponse.json(
        { error: "Conflict: this record was modified by another session. Please refresh and try again." },
        { status: 409 }
      )
    }

    await prisma.$transaction(async (tx) => {
      // Save revision before updating
      await tx.revision.create({
        data: {
          entityType: "publication",
          entityId: id,
          data: existing,
          version: existing.version,
          userId: session.user.id,
        },
      })

      await tx.publicationTag.deleteMany({ where: { publicationId: id } })

      await tx.publication.update({
        where: { id },
        data: {
          ...data,
          authors: data.authors || [],
          contributions: data.contributions || [],
          version: { increment: 1 },
          tags: tagIds?.length
            ? { create: tagIds.map((tagId: string) => ({ tagId })) }
            : undefined,
        },
      })
    })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "publication.update",
        ip: (await headers()).get("x-forwarded-for") || "unknown",
        metadata: { id, title: data.title },
      },
    })

    const updated = await prisma.publication.findUnique({
      where: { id },
      include: { tags: { include: { tag: true } } },
    })

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Failed to update publication" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await params
    const url = new URL(request.url)
    const action = url.searchParams.get("action") || "trash"

    const existing = await prisma.publication.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    if (action === "restore") {
      // Restore from trash
      await prisma.publication.update({
        where: { id },
        data: { deletedAt: null },
      })
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: "publication.restore",
          ip: (await headers()).get("x-forwarded-for") || "unknown",
          metadata: { id },
        },
      })
      return NextResponse.json({ success: true })
    }

    if (action === "unpublish") {
      await prisma.publication.update({
        where: { id },
        data: { status: "draft" },
      })
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: "publication.unpublish",
          ip: (await headers()).get("x-forwarded-for") || "unknown",
          metadata: { id },
        },
      })
      return NextResponse.json({ success: true })
    }

    if (action === "archive") {
      await prisma.publication.update({
        where: { id },
        data: { status: "draft", deletedAt: new Date() },
      })
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: "publication.archive",
          ip: (await headers()).get("x-forwarded-for") || "unknown",
          metadata: { id },
        },
      })
      return NextResponse.json({ success: true })
    }

    // Default: soft delete (trash)
    await prisma.publication.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "publication.trash",
        ip: (await headers()).get("x-forwarded-for") || "unknown",
        metadata: { id },
      },
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to perform action" }, { status: 500 })
  }
}