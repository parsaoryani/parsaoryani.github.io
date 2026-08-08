import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getSession } from "@/lib/auth/auth"
import { headers } from "next/headers"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ courseId: string; linkId: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || "unknown"
    const { courseId, linkId } = await params
    const body = await request.json()

    const existing = await prisma.courseLink.findFirst({ where: { id: linkId, courseId } })
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const link = await prisma.courseLink.update({
      where: { id: linkId },
      data: {
        type: body.type,
        name: body.name,
        url: body.url,
        sortOrder: body.sortOrder ?? existing.sortOrder,
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "course.link.update",
        ip,
        metadata: { linkId, type: link.type, name: link.name, courseId },
      },
    })

    return NextResponse.json(link)
  } catch {
    return NextResponse.json({ error: "Failed to update link" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ courseId: string; linkId: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || "unknown"
    const { courseId, linkId } = await params

    await prisma.courseLink.delete({ where: { id: linkId, courseId } })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "course.link.delete",
        ip,
        metadata: { linkId, courseId },
      },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete link" }, { status: 500 })
  }
}