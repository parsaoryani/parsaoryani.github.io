import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getSession } from "@/lib/auth/auth"
import { projectSchema } from "@/lib/validation/schemas"
import { headers } from "next/headers"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const project = await prisma.project.findUnique({ where: { id } })

  if (!project || project.deletedAt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(project)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await params
    const body = await request.json()
    const parsed = projectSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const { tagIds, version, ...data } = parsed.data
    const existing = await prisma.project.findUnique({ where: { id } })
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
      await tx.projectTag.deleteMany({ where: { projectId: id } })

      await tx.project.update({
        where: { id },
        data: {
          ...data,
          techStack: data.techStack || [],
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
        action: "project.update",
        ip: (await headers()).get("x-forwarded-for") || "unknown",
        metadata: { id, title: data.title },
      },
    })

    const updated = await prisma.project.findUnique({ where: { id } })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await params
    await prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "project.delete",
        ip: (await headers()).get("x-forwarded-for") || "unknown",
        metadata: { id },
      },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}