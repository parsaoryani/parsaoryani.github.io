import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getSession } from "@/lib/auth/auth"
import { headers } from "next/headers"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const events = await prisma.timelineEvent.findMany({
    orderBy: [{ startDate: "desc" }, { sortOrder: "asc" }],
  })
  return NextResponse.json(events)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || "unknown"
    const body = await request.json()
    const maxOrder = await prisma.timelineEvent.aggregate({ _max: { sortOrder: true } })

    const event = await prisma.timelineEvent.create({
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
        sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "timeline.create",
        ip,
        metadata: { id: event.id, title: event.title },
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
