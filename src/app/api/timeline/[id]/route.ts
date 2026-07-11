import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getSession } from "@/lib/auth/auth"
import { headers } from "next/headers"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const event = await prisma.timelineEvent.findUnique({ where: { id } })
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(event)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || "unknown"
    const { id } = await params
    const body = await request.json()
    const existing = await prisma.timelineEvent.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const event = await prisma.timelineEvent.update({
      where: { id },
      data: {
        type: body.type,
        title: body.title,
        organization: body.organization,
        location: body.location || null,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        description: body.description || null,
        highlights: body.highlights || null,
        url: body.url || null,
        visible: body.visible ?? true,
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "timeline.update",
        ip,
        metadata: { id, title: body.title },
      },
    })

    return NextResponse.json(event)
  } catch {
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || "unknown"
    const { id } = await params
    await prisma.timelineEvent.delete({ where: { id } })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "timeline.delete",
        ip,
        metadata: { id },
      },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}
